/*******************************************************************************
 * Copyright 2024 Adobe
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
const afConstants = require("../../libs/commons/formsConstants");
const sitesSelectors = require("../../libs/commons/sitesSelectors");
describe.skip('Locale - Authoring Test', function () {
    if(cy.af.isLatestAddon()) {
        context('Test Wizard Component String Language', function () {
            beforeEach(() => {
                cy.intercept("**/themes*").as("getThemesRequest");
                cy.intercept("**/templates*").as("templates");
            });

            it('Create Form in German language', function (){
                cy.changeLanguage("de");
                cy.openPage('/aem/forms.html/content/dam/formsanddocuments');
                cy.openPage('/libs/fd/fm/gui/content/forms/af/create.html').then(() => {
                    cy.wait('@templates', {requestTimeout: 30000});
                    cy.get('[data-item-id="/conf/core-components-examples/settings/wcm/templates/af-blank-v2"]').click({force: true});
                    cy.wait('@getThemesRequest').then(() => {
                        cy.get('[type="button"]').contains( 'Erstellen').click({force: true});
                        cy.get('input[name="submitDialogTitle"]').type('language-test');
                        cy.get('[data-testid="modal"]').contains('button', 'Erstellen').last().click();
                    });
                });
                cy.openPage('/editor.html/content/forms/af/language-test.html');
                const dataPath = "/content/forms/af/language-test/jcr:content/guideContainer/*",
                    responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
                cy.selectLayer("Edit");
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptives Formular – Assistenten-Layout", afConstants.components.forms.resourceType.wizard);
                cy.get('body').click(0, 0);
            });

            it('Wizard String language test for English', function () {
                cy.changeLanguage("en");
                cy.openPage("/editor.html/content/forms/af/language-test.html").then(() => {
                    cy.get('[data-path="/content/forms/af/language-test/jcr:content/guideContainer/wizard/*"]').invoke('attr', 'data-text').should('equal', 'Please drag Wizard components here');
                });
            });

            it('Wizard String language test for Italiano', function () {
                cy.changeLanguage("it");
                cy.openPage("/editor.html/content/forms/af/language-test.html").then(() => {
                    cy.get('[data-path="/content/forms/af/language-test/jcr:content/guideContainer/wizard/*"]').invoke('attr', 'data-text').should('equal', "Trascina qui i componenti della procedura guidata");
                });
            });

            after(() => {
                cy.changeLanguage("en");
                cy.openPage("/aem/formdetails.html/content/dam/formsanddocuments/language-test");
                cy.get('button[trackingelement="delete"]').click();
                cy.get('coral-dialog.is-open button').contains('Delete').click({force: true});
            });
        });
    }
})
