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
const wizardSelectors = require('../../libs/commons/wizardSelectors');

describe('EDS Form Creation - Authoring', function () {
    // Guard: the EDS/Universal-Editor template and the create-form GitHub-URL flow only
    // ship with the latest Forms add-on. On release/650 cy.af.isLatestAddon() is true for
    // the 'classic-latest' add-on (and for local runs where forms.far is undefined); the
    // older 'classic' released add-on does not have the franklin template, so skip there.
    if (cy.af.isLatestAddon()) {
        const createAFPage = wizardSelectors.createAf;
        const toggleId = 'FT_FORMS-12378';
        const githubUrl = 'https://github.com/adobe-rnd/aem-boilerplate-forms';
        const formName = 'eds-form-creation-test-' + Date.now();
        const formPath = '/content/dam/formsanddocuments/' + formName;
        const formPagePath = '/content/forms/af/' + formName;    
        const formConfigPath = '/conf/forms/' + formName;

        let toggleEnabled = false;

        before(() => {
            cy.enableFeatureToggle(toggleId);
            cy.fetchFeatureToggles().then((response) => {
                toggleEnabled = response.status === 200 && response.body.enabled.includes(toggleId);
            });
        });

        after(() => {
            cy.disableFeatureToggle(toggleId);
        });

        after(function () {
            if (!toggleEnabled) {
                return;
            }
            // Delete the created form via the Forms & Documents admin UI. This cascades to the
            // form page (/content/forms/af) and its EDS config (/conf/forms) as well.
            cy.openPage('/aem/forms.html/content/dam/formsanddocuments', { noLogin: true });
            cy.get('body').then(($body) => {
                const selector = "[data-foundation-collection-item-id='" + formPath + "']";
                if ($body.find(selector).length > 0) {
                    cy.get(selector).trigger('mouseenter').trigger('mouseover');
                    cy.get(`${selector} [title='Select']`).click({ force: true });
                    cy.get('.formsmanager-admin-action-delete').click();
                    cy.get("#fmbase-id-modal-template button[variant='warning']").click();
                }
            });
        });

        it('creates an Adaptive Form for Edge Delivery Services via the classic create wizard', () => {
            if (!toggleEnabled) {
                cy.log('EDS Feature toggle is not enabled');
                return;
            }

            cy.intercept('POST', '**/content/dam/formsanddocuments/').as('createForm');

            cy.openPage(createAFPage.url);

            // Step 1 - Select Template: pick the EDS/Universal-Editor (franklin) template.
            cy.get(createAFPage.franklinTemplateCard, { timeout: 30000 }).should('be.visible').click({ force: true });
            cy.get(createAFPage.nextButton).click({ force: true });

            // Step 2 - Add Properties: title/name live on the default 'Basic' tab.
            cy.get(createAFPage.title).should('be.visible').type(formName);
            cy.get(createAFPage.name).clear().type(formName);

            // For the franklin template the "Edge Delivery Services" section renders inline on the
            // properties step; edsConfigType defaults to "createNew", which reveals the GitHub URL field.
            cy.get(createAFPage.edsConfigTypeCreateNew).should('be.checked');
            cy.get(createAFPage.githubUrl).should('be.visible').clear().type(githubUrl);

            // Submit - the classic wizard does a Sling POST to /content/dam/formsanddocuments/.
            cy.get('.foundation-wizard-control').contains('Create').click({ force: true });

            cy.wait('@createForm').then((interception) => {
                expect(interception.response.statusCode).to.be.oneOf([200, 201]);
            });

            // Confirm the form node and its configurations was actually created.
            const username = Cypress.env('crx.username') || 'admin';
            const password = Cypress.env('crx.password') || 'admin';

            cy.request({
                url: formPath + '.infinity.json',
                auth: { username, password },
                headers: {
                    Accept: 'application/json'
                }
            }).then(({ status, body }) => {

                expect(status).to.equal(200);
                expect(body).to.not.be.empty;

                const metadata = body['jcr:content'] && body['jcr:content']['metadata'];
                expect(metadata).to.not.be.undefined;
                expect(metadata).to.have.property('title', formName);
                expect(metadata).to.have.property('fd:version', '2.1');


            });

            cy.request({
                url: formPagePath + '.infinity.json',
                auth: { username, password },
                headers: {
                    Accept: 'application/json'
                }
            }).then(({ status, body }) => {

                expect(status).to.equal(200);
                expect(body).to.not.be.empty;

                const jcrContent = body['jcr:content'];
                expect(jcrContent).to.not.be.undefined;
                expect(jcrContent).to.have.property('jcr:title', formName);
                expect(jcrContent).to.have.property('cq:template', '/libs/fd/franklin/templates/page');
                expect(jcrContent).to.have.property('sling:configRef', '/conf/forms/' + formName + '/');

                const edsFormGuideContainer = jcrContent?.root?.section?.form;
                expect(edsFormGuideContainer).to.not.be.undefined;
                expect(edsFormGuideContainer).to.have.property('fd:version', '2.1');
                expect(edsFormGuideContainer).to.have.property('sling:resourceType', 'fd/franklin/components/form/v1/form');
            });

            cy.request({
                url: formConfigPath + '.infinity.json',
                auth: { username, password },
                headers: {
                    Accept: 'application/json'
                }
            }).then(({ status, body }) => {

                expect(status).to.equal(200);
                expect(body).to.not.be.empty;

                const cloudConfig = body?.settings?.cloudconfigs?.['edge-delivery-service-configuration']?.['jcr:content'];
                expect(cloudConfig).to.not.be.undefined;
                expect(cloudConfig).to.have.property('owner', 'adobe-rnd');
                expect(cloudConfig).to.have.property('repo', 'aem-boilerplate-forms');
            });
        });
    }
});
