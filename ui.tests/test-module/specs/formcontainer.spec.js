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
    sitesConstants = require('../libs/commons/sitesConstants'),
    guideSelectors = require('../libs/commons/guideSelectors'),
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
            });
        });

        // commenting once we support adaptive form container in sites editor, uncomment this test
        context.skip("Open Sites Editor", function () {
            // we can use these values to log in
            const pagePath = "/content/core-components-examples/library/adaptive-form/guideContainer",
                formContainerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/formContainer",
                formContainerEditPathSelector = "[data-path='" + formContainerEditPath + "']",
                formContainerDropPath = pagePath + afConstants.RESPONSIVE_GRID_SUFFIX + "/" + afConstants.components.forms.resourceType.formcontainer.split("/").pop(),
                formContainerDropPathSelector = "[data-path='" + formContainerDropPath + "']";
                beforeEach(function () {
                    // this is done since cypress session results in 403 sometimes
                    cy.openAuthoring(pagePath);
                });

                it('insert adaptive form container component', function () {
                    const responsiveGridDropZone = "Drag components here", // todo:  need to localize this
                        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "'][title='Layout Container [Root]']";
                    cy.selectLayer("Edit");
                    // Add adaptibe form container component and delete it
                    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Container", afConstants.components.forms.resourceType.formcontainer);
                    // once component is added, to remove the overlay from being active, we click on body
                    cy.get('body').click(0, 0);
                    cy.deleteComponentByPath(formContainerDropPath);
                });

                it('open edit dialog of adaptive form container component', function () {
                    checkEditDialog(formContainerEditPathSelector);
                    cy.get(sitesSelectors.confirmDialog.actions.first).click();
                });
        });

});
