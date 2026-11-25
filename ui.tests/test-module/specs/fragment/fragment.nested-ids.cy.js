/*******************************************************************************
 * Copyright 2026 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
describe('Form Runtime with nested fragments referenced several times', () => {

    // form -> 2 references to fragment A -> 2 references to fragment B -> ssn: 4 occurrences of the same field
    const formPath = 'content/forms/af/core-components-it/samples/fragment/nested-ids';
    const pagePath = `${formPath}.html`;
    const modelPath = `${formPath}/_jcr_content/guideContainer.model.json`;
    const ssnPath = '/content/forms/af/core-components-it/samples/fragment/nested-fragment-b/jcr:content/guideContainer/textinput';
    const occurrences = 4;
    const auth = {
        username: Cypress.env('crx.username') || 'admin',
        password: Cypress.env('crx.password') || 'admin'
    };
    let formContainer = null;
    let featureEnabled = false;

    const collectModelIds = (node, ids = []) => {
        if (node.id && node.properties && node.properties['fd:path'] === ssnPath) {
            ids.push(node.id);
        }
        if (Array.isArray(node[':itemsOrder'])) {
            node[':itemsOrder'].forEach(name => collectModelIds(node[':items'][name], ids));
        } else if (Array.isArray(node.items)) {
            node.items.forEach(item => collectModelIds(item, ids));
        }
        return ids;
    };

    const getSsnIds = () => Object.keys(formContainer.getAllFields())
        .filter(id => formContainer._model.getElement(id).name === 'ssn');

    before(function () {
        if (!cy.af.isLatestAddon()) {
            this.skip();
            return;
        }
        cy.fetchFeatureToggles().then(response => {
            expect(response.status).to.equal(200);
            featureEnabled = response.body.enabled.includes('FT_FORMS-30065');
        });
    });

    beforeEach(function () {
        if (!featureEnabled) {
            this.skip();
            return;
        }
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
    });

    it('server rendered html and model json have the same unique ids for every occurrence', () => {
        cy.request({ url: modelPath, auth }).then(({ body }) => {
            const modelIds = collectModelIds(body);
            expect(modelIds, 'one model per occurrence').to.have.length(occurrences);
            expect(new Set(modelIds).size, 'model ids are unique').to.equal(occurrences);

            cy.request({ url: `${pagePath}?wcmmode=disabled`, auth }).then(({ body: html }) => {
                // raw server side html, before any client side processing
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const htmlIds = Array.from(doc.querySelectorAll('[data-cmp-is="adaptiveFormTextInput"]')).map(el => el.id);
                expect(htmlIds, 'html ids are the model ids').to.deep.equal(modelIds);
                const form = doc.querySelector('[data-cmp-is="adaptiveFormContainer"]');
                const allIds = Array.from(form.querySelectorAll('[id]')).map(el => el.id);
                expect(new Set(allIds).size, 'no duplicate id in the form').to.equal(allIds.length);
            });
        });
    });

    it('every occurrence is registered as an independent field', () => {
        const ssnIds = getSsnIds();
        expect(ssnIds, 'all occurrences are registered').to.have.length(occurrences);
        ssnIds.forEach(id => {
            cy.get(`#${id}`).should('have.length', 1);
            cy.get(`#${id}`).find('label').should('have.attr', 'for', `${id}-widget`);
            cy.get(`#${id}`).find('input').should('have.attr', 'id', `${id}-widget`);
        });
    });

    it('value and required validation are independent for every occurrence', () => {
        const ssnIds = getSsnIds();
        const [first, ...others] = ssnIds;
        cy.get(`#${first}`).find('input').clear().type('123456789').blur().then(() => {
            expect(formContainer._model.getElement(first).value).to.equal('123-45-6789');
            others.forEach(id => {
                expect(formContainer._model.getElement(id).value, `${id} keeps its own value`).to.not.equal('123-45-6789');
                cy.get(`#${id}`).find('input').should('have.value', '');
            });
            formContainer._model.validate();
            cy.get(`#${first}`).should('have.attr', 'data-cmp-valid', 'true');
            others.forEach(id => {
                cy.get(`#${id}`).should('have.attr', 'data-cmp-valid', 'false');
            });
        });
    });

    it('formats and exports all four SSNs independently', () => {
        const ssnIds = getSsnIds();
        expect(ssnIds).to.have.length(occurrences);
        const values = ['111111111', '222222222', '333333333', '444444444'];
        ssnIds.forEach((id, index) => {
            cy.get(`#${id}`).find('input').clear().type(values[index]).blur();
        });
        cy.then(() => {
            expect(formContainer._model.exportData()).to.deep.equal({
                applicant: {
                    identity: { ssn: '111-11-1111' },
                    previousidentity: { ssn: '222-22-2222' }
                },
                coapplicant: {
                    identity: { ssn: '333-33-3333' },
                    previousidentity: { ssn: '444-44-4444' }
                }
            });
        });
    });

    it('ids are stable across reloads', () => {
        const ssnIds = getSsnIds();
        cy.previewForm(pagePath).then(p => {
            const reloaded = Object.keys(p.getAllFields()).filter(id => p._model.getElement(id).name === 'ssn');
            expect(reloaded).to.deep.equal(ssnIds);
        });
    });
});
