/*******************************************************************************
 * Copyright 2022 Adobe
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
const guideSelectors = require("../../libs/commons/guideSelectors");

describe('Page - Authoring', function () {
    // we can use these values to log in

    const dropWizardInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Wizard Layout", afConstants.components.forms.resourceType.wizard);
        cy.get('body').click(0, 0);
    }

    const addComponentInWizard = function (componentString, componentType) {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/wizard/*",
            wizardDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(wizardDropZoneSelector, componentString, componentType);

        cy.get('body').click(0, 0);
    }

    const dropWizardInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/wizard/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Wizard Layout", afConstants.components.forms.resourceType.wizard);
        cy.get('body').click(0, 0);
    }


    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            wizardLayoutDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.wizard.split("/").pop(),
            wizardEditPathSelector = "[data-path='" + wizardLayoutDrop + "']",
            wizardBlockBemSelector = '.cmp-adaptiveform-wizard',
            insertComponentDialog_searchField = ".InsertComponentDialog-components input[type='search']",
            editDialogNavigationPanelSelector = "[data-action='PANEL_SELECT']",
            textInputPath = wizardLayoutDrop + "/" + afConstants.components.forms.resourceType.formtextinput.split("/").pop(),
            numberInputPath = wizardLayoutDrop + "/" + afConstants.components.forms.resourceType.formnumberinput.split("/").pop(),
            textInputDataId = "[data-id='" + textInputPath + "']",
            numberInputDataId = "[data-id='" + numberInputPath + "']",
            textInputDataPath = "[data-path='" + textInputPath + "']",
            numberInputDataPath = "[data-path='" + numberInputPath + "']",
            editDialogConfigurationSelector = "[data-action='CONFIGURE']";
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('runtime library should not be loaded', function() {
            cy.intercept('GET', /jcr:content\/guideContainer\/wizard\.html/).as('wizardRequest');
            dropWizardInContainer();
            cy.wait('@wizardRequest').then((interception) => {
                const htmlContent = interception.response.body;
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                const runtimeUrlPattern = /core\/fd\/af-clientlibs\/core-forms-components-runtime-base/;
                const scriptTags = Array.from(doc.querySelectorAll('script[src]'));
                const isClientLibraryLoaded = scriptTags.some(script => runtimeUrlPattern.test(script.src));
                expect(isClientLibraryLoaded).to.be.false;
            })
            cy.deleteComponentByPath(wizardLayoutDrop);
        })

        it('verify Basic tab in edit dialog of Wizard', function () {
            dropWizardInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + wizardEditPathSelector).then(() => {
                cy.invokeEditableAction(editDialogConfigurationSelector).then(() => {
                    cy.get(wizardBlockBemSelector + '__editdialog').contains('Help Content').click().then(() => {
                        cy.get(wizardBlockBemSelector + '__editdialog').contains('Basic').click().then(() => {
                            cy.get("[name='./name']").should("exist");
                            cy.get("[name='./jcr:title']").should("exist");
                            cy.get("[name='./layout']").should("not.exist");
                            cy.get("[name='./dataRef']").should("exist");
                            cy.get("[name='./visible']").should("exist");
                            cy.get("[name='./enabled']").should("exist");
                            cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                                cy.deleteComponentByPath(wizardLayoutDrop);
                            });
                        });
                    });
                });
            });
        });

        it('verify Navigation Working between tabs in Authoring', {retries: 3}, function () {
            cy.cleanTest(wizardLayoutDrop).then(function () {
                dropWizardInContainer();
                addComponentInWizard("Adaptive Form Number Input", afConstants.components.forms.resourceType.formnumberinput);
                addComponentInWizard("Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + wizardEditPathSelector);
                cy.invokeEditableAction(editDialogNavigationPanelSelector);
                cy.wait(2000).then(() => {
                    cy.get("table.cmp-panelselector__table").find("tr").should("have.length", 2);
                    // In select panel, text will be in format: <component type>: <title>
                    cy.get("table.cmp-panelselector__table tr").eq(0)
                        .should("contain.text", "Adaptive Form Number Input: Number Input");
                    cy.get("table.cmp-panelselector__table tr").eq(1)
                        .should("contain.text", "Adaptive Form Text Box: Text Input");
                    cy.get("table.cmp-panelselector__table").find(textInputDataId).find("td").first().should('be.visible').click();
                    cy.get('body').click(0, 0);
                    cy.get('div' + numberInputDataPath).should('not.be.visible');
                    cy.invokeEditableAction(editDialogNavigationPanelSelector);
                    cy.get("table.cmp-panelselector__table").find(numberInputDataId).find("td").first().should('be.visible').click();
                    cy.get('body').click(0, 0);
                    cy.get('div' + textInputDataPath).should('not.be.visible');
                    cy.deleteComponentByPath(wizardLayoutDrop);
                });
            });
        });
    });

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/wizard",
            wizardEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/wizard",
            wizardBlockBemSelector = '.cmp-adaptiveform-wizard',
            editDialogConfigurationSelector = "[data-action='CONFIGURE']",
            wizardEditPathSelector = "[data-path='" + wizardEditPath + "']";

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms Wizard', {retries: 3}, function () {
            cy.cleanTest(wizardEditPath).then(function () {
                dropWizardInSites();
                cy.deleteComponentByPath(wizardEditPath);
            });
        });

        // adding retry, sometimes site editor does not load
        it('open edit dialog of aem forms Wizard', {retries: 3}, function () {
            cy.cleanTest(wizardEditPath).then(function () {
                dropWizardInSites();
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + wizardEditPathSelector);
                cy.invokeEditableAction(editDialogConfigurationSelector);
                cy.get(wizardBlockBemSelector + '__editdialog').contains('Help Content').click();
                cy.get(wizardBlockBemSelector + '__editdialog').contains('Basic').click();
                cy.get("[name='./name']").should("exist");
                cy.get("[name='./jcr:title']").should("exist");
                cy.get("[name='./layout']").should("not.exist");
                cy.get("[name='./dataRef']").should("exist");
                cy.get("[name='./visible']").should("exist");
                cy.get("[name='./enabled']").should("exist");
                cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                    cy.deleteComponentByPath(wizardEditPath);
                })

            });
        });

    });
})