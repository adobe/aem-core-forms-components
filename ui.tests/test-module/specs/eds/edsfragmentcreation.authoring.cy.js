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

describe('EDS Fragment Creation - Authoring', function () {
    if (cy.af.isLtsAddon()) {
        const createFragmentPage = wizardSelectors.createAfFragment;
        const toggleIds = ['FT_FORMS-14833', 'FT_FORMS-12378'];
        const githubUrl = 'https://github.com/adobe-rnd/aem-boilerplate-forms';
        const fragmentName = 'eds-fragment-creation-test-' + Date.now();
        const fragmentPath = '/content/dam/formsanddocuments/' + fragmentName;
        const fragmentPagePath = '/content/forms/af/' + fragmentName;
        const fragmentConfigPath = '/conf/forms/' + fragmentName;

        let togglesEnabled = false;

        before(() => {
            toggleIds.forEach((id) => cy.enableFeatureToggle(id));
            cy.fetchFeatureToggles().then((response) => {
                togglesEnabled = response.status === 200 && toggleIds.every((id) => response.body.enabled.includes(id));
            });
        });

        after(() => {
            toggleIds.forEach((id) => cy.disableFeatureToggle(id));
        });

        after(function () {
            if (!togglesEnabled) {
                return;
            }
            // Delete the created fragment via the Forms & Documents admin UI. This cascades to the
            // fragment page (/content/forms/af) and its EDS config (/conf/forms) as well.
            cy.openPage('/aem/forms.html/content/dam/formsanddocuments', { noLogin: true });
            cy.get('body').then(($body) => {
                const selector = "[data-foundation-collection-item-id='" + fragmentPath + "']";
                if ($body.find(selector).length > 0) {
                    cy.get(selector).trigger('mouseenter').trigger('mouseover');
                    cy.get(`${selector} [title='Select']`).click({ force: true });
                    cy.get('.formsmanager-admin-action-delete').click();
                    cy.get("#fmbase-id-modal-template button[variant='warning']").click();
                }
            });
        });

        it('creates an Adaptive Form Fragment for Edge Delivery Services via the classic create wizard', () => {
            if (!togglesEnabled) {
                cy.log('EDS feature toggles are not enabled');
                return;
            }

            cy.intercept('POST', '**/content/dam/formsanddocuments/').as('createFragment');

            cy.openPage(createFragmentPage.url);

            // Step 1 - Select Template: pick the EDS/Universal-Editor (franklin) fragment template.
            cy.get(createFragmentPage.franklinTemplateCard, { timeout: 30000 }).should('be.visible').click({ force: true });
            cy.get(createFragmentPage.nextButton).click({ force: true });

            // Step 2 - Add Properties: title/name live on the default 'Basic' tab.
            cy.get(createFragmentPage.title).should('be.visible').type(fragmentName);
            cy.get(createFragmentPage.name).clear().type(fragmentName);

            // For the franklin template the "Edge Delivery Services" section renders inline on the
            // properties step; edsConfigType defaults to "createNew", which reveals the GitHub URL field.
            cy.get(createFragmentPage.edsConfigTypeCreateNew).should('be.checked');
            cy.get(createFragmentPage.githubUrl).should('be.visible').clear().type(githubUrl);

            // Submit - the classic wizard does a Sling POST to /content/dam/formsanddocuments/.
            cy.get('.foundation-wizard-control').contains('Create').click({ force: true });

            cy.wait('@createFragment').then((interception) => {
                expect(interception.response.statusCode).to.be.oneOf([200, 201]);
            });

            // Confirm the fragment node and its configurations were actually created.
            const username = Cypress.env('crx.username') || 'admin';
            const password = Cypress.env('crx.password') || 'admin';

            cy.request({
                url: fragmentPath + '.infinity.json',
                auth: { username, password },
                headers: {
                    Accept: 'application/json'
                }
            }).then(({ status, body }) => {
                expect(status).to.equal(200);
                expect(body).to.not.be.empty;

                const metadata = body['jcr:content'] && body['jcr:content']['metadata'];
                expect(metadata).to.not.be.undefined;
                expect(metadata).to.have.property('title', fragmentName);
                expect(metadata).to.have.property('fd:version', '2.1');
            });

            cy.request({
                url: fragmentPagePath + '.infinity.json',
                auth: { username, password },
                headers: {
                    Accept: 'application/json'
                }
            }).then(({ status, body }) => {
                expect(status).to.equal(200);
                expect(body).to.not.be.empty;

                const jcrContent = body['jcr:content'];
                expect(jcrContent).to.not.be.undefined;
                expect(jcrContent).to.have.property('jcr:title', fragmentName);
                expect(jcrContent).to.have.property('cq:template', '/libs/fd/franklin/templates/fragment');
                expect(jcrContent).to.have.property('sling:configRef', '/conf/forms/' + fragmentName + '/');

                const edsFragmentGuideContainer = jcrContent?.root?.section?.form;
                expect(edsFragmentGuideContainer).to.not.be.undefined;
                expect(edsFragmentGuideContainer).to.have.property('fd:version', '2.1');
                expect(edsFragmentGuideContainer).to.have.property('sling:resourceType', 'fd/franklin/components/form/v1/form');
            });

            cy.request({
                url: fragmentConfigPath + '.infinity.json',
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
