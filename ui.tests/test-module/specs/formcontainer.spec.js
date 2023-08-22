/*
 *  Copyright 2022 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


/// <reference types="cypress" />

// This recipe is to test the Adaptive Form Container Component functionality

// We are going to test a few things:
// 1. Open Edit layer
// 2. Perform few operations

// Be sure to run the aem server
// before running the tests below.

const commons = require('../libs/commons/commons'),
    sitesSelectors = require('../libs/commons/sitesSelectors'),
    afConstants = require('../libs/commons/formsConstants');

// todo: beta specific form authoring test cases are not run (only common functionality [of beta and to be GA] test are executed)
describe('Page/Form Authoring', function () {
        const checkEditDialog = function(formContainerEditPathSelector) {
            // click configure action on adaptive form container component
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + formContainerEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
            // check if few dialog options are visible
            //cy.get("[name='./formModelDocumentPath']").should("be.visible"); // this was in v1, but test are run against latest always
            cy.get("[name='./redirect'").should("exist"); // should exist
            cy.get("[name='./actionType'").should("exist"); // should exist
            cy.get("[name='./prefillService'").should("exist"); // prefillService option exist in v2

            //open submission tab
            cy.get('.cmp-adaptiveform-container'+'__editdialog').contains('Submission').click({force:true});
            cy.get("[name='./actionType']").should("exist");
        };

        const checkTitleInEditDialog = function(formContainerEditPathSelector) {
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + formContainerEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get("[name='./title'").should("exist");
            cy.get("[name='./title'").should("have.value", "Adaptive Form V2 (IT)");
        }

    const checkAndSaveSubmitAction = function(formContainerEditPathSelector) {
        // click configure action on adaptive form container component
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + formContainerEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail

        //open submission tab
        cy.get('.cmp-adaptiveform-container'+'__editdialog').contains('Submission').click({force:true});
        cy.get("[name='./actionType']").should("exist");

        //select email submit action
        cy.get(".cmp-adaptiveform-container__submitaction").children('._coral-Dropdown-trigger').click();
        cy.get("._coral-Menu-itemLabel").contains('Send email').should('be.visible').click();
        cy.get("[name='./useExternalEmailTemplate']").should("exist");
        cy.get("[name='./templatePath']").should("exist");

        cy.get("[name='./useExternalEmailTemplate']").should("exist").first().click();
        cy.get("[name='./template']").should("exist");

        //select rest endpoint submit action
        cy.get(".cmp-adaptiveform-container__submitaction").children('._coral-Dropdown-trigger').click();
        cy.get("._coral-Menu-itemLabel").contains('Submit to REST endpoint').should('be.visible').click();
        cy.get("[name='./enableRestEndpointPost']").should("exist");
        cy.get("[name='./enableRestEndpointPost']").first().click();
        cy.get("[name='./restEndpointPostUrl']").should("exist").type("http://localhost:4502/some/endpoint");

        //save the configuration
        cy.get('.cq-dialog-submit').click();
    };

    const verifySavedSubmitAction = function(formContainerEditPathSelector) {
        //check if saved configuration persists
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + formContainerEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        cy.get('.cmp-adaptiveform-container'+'__editdialog').contains('Submission').click({force:true});
        cy.get("[name='./actionType'] coral-select-item:selected").first().should(
            "have.text",
            "Submit to REST endpoint"
        );
        cy.get("[name='./restEndpointPostUrl'").should("exist");
        cy.get("[name='./restEndpointPostUrl'").invoke('attr', 'value').should('eq', 'http://localhost:4502/some/endpoint');
    };

    const verifyOpenDataModel = function(formContainerEditPathSelector) {
        // click configure action on adaptive form container component
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + formContainerEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail

        //open data model tab
        cy.get('.cmp-adaptiveform-container'+'__editdialog').contains('Data Model').click({force:true});
        cy.get("[name='./schemaType']").should("exist");
        cy.get("[name='./schemaRef']").invoke('attr', 'type').should('eq', 'hidden');

        //select data model
        cy.get(".cmp-adaptiveform-container__selectformmodel").click();
        cy.get("coral-selectlist-item[value='none']").contains('None').should('exist');
        cy.get("coral-selectlist-item[value='formdatamodel']").contains('Form Data Model').should('be.visible').click();

        //click save without selecting the fdm model, error should be displayed
        cy.get(".cq-dialog-submit").click();
        cy.get(".coral-Form-errorlabel").should("be.visible");

        //select fdm and save it
        cy.get(".cmp-adaptiveform-container__fdmselector").should("be.visible").click();
        cy.get("coral-selectlist-item[value='/content/dam/formsanddocuments-fdm/portal-unified-storage-form-data-model']").contains('Portal Unified Storage Form Data Model').should('be.visible').click();
        cy.get(".cq-dialog-submit").click();
    };

    const verifyChangeDataModel = function(formContainerEditPathSelector) {
        // click configure action on adaptive form container component
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + formContainerEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail

        //open data model tab
        cy.get('.cmp-adaptiveform-container'+'__editdialog').contains('Data Model').click({force:true});

        //since data model is already selected it should be disabled
        cy.get(".cmp-adaptiveform-container__selectformmodel").should("not.have.attr", "disabled");
        cy.get(".cmp-adaptiveform-container__fdmselector").click();

        cy.get("coral-selectlist-item[value='/content/dam/formsanddocuments-fdm/forms-ootb-usc-workflow-fdm']").contains('Workflow Unified Storage Form Data Model').should('be.visible').click();
        cy.get("#formModelChange").should("be.visible");
        cy.get("#formModelDialogAcceptButton").click();
        cy.get(".cq-dialog-submit").click();
    };

        context("Open Forms Editor", function () {
            // we can use these values to log in
            const pagePath = "/content/forms/af/core-components-it/blank",
                formContainerEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX,
                formContainerEditPathSelector = "[data-path='" + formContainerEditPath + "']",
                formContainerDropPath = pagePath + afConstants.RESPONSIVE_GRID_SUFFIX + "/" + afConstants.components.forms.resourceType.formcontainer.split("/").pop();
            beforeEach(function () {
                // this is done since cypress session results in 403 sometimes
                cy.openAuthoring(pagePath);
            });

            it('open edit dialog of adaptive form container component', function () {
                // click configure action on adaptive form container component
                checkEditDialog(formContainerEditPathSelector);
                cy.get('.cq-dialog-cancel').click();
            });

            it('open edit dialog, check and save a submit action', function() {
                checkAndSaveSubmitAction(formContainerEditPathSelector);
            });

            it('open edit dialog, verify saved submit action', function() {
                verifySavedSubmitAction(formContainerEditPathSelector);
                cy.get('.cq-dialog-cancel').click();
            });

            it('open and select data model in container edit dialog box', function () {
                verifyOpenDataModel(formContainerEditPathSelector);
            });

            it('change data model in container edit dialog box', {retries: 3},function () {
                verifyChangeDataModel(formContainerEditPathSelector);
            });

            it ('check title in edit dialog', {retries: 3}, function() {
                checkTitleInEditDialog(formContainerEditPathSelector);
                cy.get('.cq-dialog-cancel').click();
            })
        });

        // commenting once we support adaptive form container in sites editor, uncomment this test
        context("Open Sites Editor", function () {
            // we can use these values to log in
            const pagePath = "/content/core-components-examples/library/adaptive-form/container",
                formContainerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/formContainer",
                formContainerEditPathSelector = "[data-path='" + formContainerEditPath + "']",
                formContainerDropPath = pagePath + afConstants.RESPONSIVE_GRID_SUFFIX + "/" + afConstants.components.forms.resourceType.formcontainer.split("/").pop();
                beforeEach(function () {
                    // this is done since cypress session results in 403 sometimes
                    cy.openAuthoring(pagePath);
                });

                it('insert adaptive form container component', { retries: 3 }, function () {
                    cy.cleanTest(formContainerDropPath).then(function() {
                        const responsiveGridDropZone = "Drag components here", // todo:  need to localize this
                            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "'][title='Layout Container [Root]']";
                        cy.selectLayer("Edit");
                        // Add adaptibe form container component and delete it
                        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Container", afConstants.components.forms.resourceType.formcontainer);
                        // once component is added, to remove the overlay from being active, we click on body
                        cy.get('body').click(0, 0);
                        cy.deleteComponentByPath(formContainerDropPath);
                    });
                });

                it('open edit dialog of adaptive form container component', function () {
                    checkEditDialog(formContainerEditPathSelector);
                    cy.get(sitesSelectors.confirmDialog.actions.first).click();
                });

                it('open edit dialog, check and save a submit action', function() {
                    checkAndSaveSubmitAction(formContainerEditPathSelector);
                });

                it('open edit dialog, verify saved submit action', function() {
                    verifySavedSubmitAction(formContainerEditPathSelector);
                    cy.get(sitesSelectors.confirmDialog.actions.first).click();
                });

                it('open and select data model in container edit dialog box', function () {
                    verifyOpenDataModel(formContainerEditPathSelector);
                });

                it('change data model in container edit dialog box', function () {
                    verifyChangeDataModel(formContainerEditPathSelector);
                });

                it ('check title in edit dialog', function() {
                    checkEditDialog(formContainerEditPathSelector);
                    cy.get(sitesSelectors.confirmDialog.actions.first).click();
                })
        });
});
