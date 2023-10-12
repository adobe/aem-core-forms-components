/*
 *  Copyright 2023 Adobe Systems Incorporated
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

const commons = require('../libs/commons/commons'),
    sitesSelectors = require('../libs/commons/sitesSelectors'),
    afConstants = require('../libs/commons/formsConstants');

describe('Fragment Authoring', function () {
    const checkEditDialog = function(fragmentContainerEditPathSelector) {
        // click configure action on adaptive form fragment container component
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + fragmentContainerEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail

        cy.get("[name='./redirect'").should("not.exist"); // should exist
        cy.get("[name='./actionType'").should("not.exist"); // should exist
        cy.get("[name='./clientLibRef'").should("exist"); // should exist
    };

    const checkTitleInEditDialog = function(formContainerEditPathSelector) {
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + formContainerEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get("[name='./title'").should("exist");
        cy.get("[name='./title'").should("have.value", "AF Fragment (v2)");
    }

    const verifyOpenDataModel = function(fragmentContainerEditPathSelector) {
        // click configure action on adaptive form fragment container component
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + fragmentContainerEditPathSelector);
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
        cy.get("coral-icon[icon=\"alert\"]").should("be.visible");

        //select fdm and save it
        cy.get(".cmp-adaptiveform-container__fdmselector").should("be.visible").click();
        cy.get("coral-selectlist-item[value='/content/dam/formsanddocuments-fdm/portal-unified-storage-form-data-model']").contains('Portal Unified Storage Form Data Model').should('be.visible').click();
        cy.get(".cq-dialog-submit").click();
    };

    const verifyChangeDataModel = function(fragmentContainerEditPathSelector) {
        // click configure action on adaptive form container component
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + fragmentContainerEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail

        //open data model tab
        cy.get('.cmp-adaptiveform-container'+'__editdialog').contains('Data Model').click({force:true});

        //since data model is already selected it should be disabled
        cy.get(".cmp-adaptiveform-container__selectformmodel").should("not.have.attr", "disabled");
        cy.get(".cmp-adaptiveform-container__fdmselector").click();

        cy.get("coral-selectlist-item[value='/content/dam/formsanddocuments-fdm/forms-ootb-usc-workflow-fdm']").contains('Workflow Unified Storage Form Data Model').should('be.visible').click();
        cy.get("#formModelChange").should("be.visible");
        cy.get("#formModelDialogAcceptButton").click();
        // Not undo the changes
        cy.get(".cmp-adaptiveform-container__selectformmodel").click();
        cy.get("coral-selectlist-item[value='none']")
            .contains('None')
            .click();
        cy.get(".cq-dialog-submit").click();
    };

    context("Open Forms Editor", function () {
        const pagePath = "/content/forms/af/core-components-it/samples/fragment/test-fragment",
            fragmentContainerEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX,
            fragmentContainerEditPathSelector = "[data-path='" + fragmentContainerEditPath + "']",
            fragmentContainerDropPath = pagePath + afConstants.RESPONSIVE_GRID_SUFFIX + "/" + afConstants.components.forms.resourceType.fragmentcontainer.split("/").pop();
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('open edit dialog of adaptive form fragment container component', function () {
            checkEditDialog(fragmentContainerEditPathSelector);
            cy.get('.cq-dialog-cancel').click();
        });

        it('open and select data model in fragment container edit dialog box', function () {
            verifyOpenDataModel(fragmentContainerEditPathSelector);
        });

        it('change data model in fragment container edit dialog box', {retries: 3},function () {
            verifyChangeDataModel(fragmentContainerEditPathSelector);
        });

        it ('check tabs and title in edit dialog', {retries: 3}, function() {
            checkTitleInEditDialog(fragmentContainerEditPathSelector);
            // stringent check on fragment container edit dialog tabs so that introducing new tab
            // in form container edit dialog should force author to check if that is required for fragment
            cy.get(".cmp-adaptiveform-container__editdialog coral-tab").should("have.length", 2);
            cy.get(".cmp-adaptiveform-container__editdialog coral-tab-label:contains('Basic')")
                .should("exist");
            cy.get(".cmp-adaptiveform-container__editdialog coral-tab-label:contains('Data Model')")
                .should("exist");
            cy.get(".cmp-adaptiveform-container__editdialog coral-tab-label:contains('Submission')")
                .should("not.exist");
            cy.get('.cq-dialog-cancel').click();
        })
    });
});
