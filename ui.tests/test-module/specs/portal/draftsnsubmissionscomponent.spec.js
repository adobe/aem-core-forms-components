/*
 *  Copyright 2021 Adobe Systems Incorporated
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

// This recipe is to test the AEM Forms Portal Link Component functionality

// We are going to test:
// 1. Search and Lister Component can be added and deleted
// 2. Verify default values set in proxy component

// Be sure to run the aem server
// before running the tests below.

const sitesSelectors = require('../../libs/commons/sitesSelectors'),
      afConstants = require('../../libs/commons/formsConstants');

describe('Drafts And Submissions - Authoring', function () {
    // we can use these values to log in
    const   pagePath = "/content/core-components-examples/library/forms-and-communications-portal/draftsandsubmissions",
            suffixCustom = "demo_draft/component",
            componentEditPath = pagePath + afConstants.RESPONSIVE_GRID_SUFFIX + "/" + suffixCustom + "/" + afConstants.components.forms.resourceType.fpdnscomponent.split("/").pop(),
            componentEditPathSelector = "[data-path='" + componentEditPath + "']",
            componentDropPath = pagePath + afConstants.RESPONSIVE_GRID_SUFFIX + "/" + afConstants.components.forms.resourceType.fpdnscomponent.split("/").pop(),
            componentDropPathSelector = "[data-path='" + componentDropPath + "']";


    context('Open Editor', function () {
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert drafts and submission component', { retries: 3 }, function () {
            const responsiveGridDropZone = "Drag components here", // todo:  need to localize this
                responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "']";
            cy.selectLayer("Edit");
            // Add drafts and submissions component and delete it
            cy.insertComponent(responsiveGridDropZoneSelector, "Drafts and submissions", afConstants.components.forms.resourceType.fpdnscomponent);
            // once component is added, to remove the overlay from being active, we click on body
            cy.get('body').click(0,0);
            cy.deleteComponentByPath(componentDropPath);
        });

        it('verify edit dialog properties', { retries: 3 }, function () {
            const x = "";
            // click configure action on search and lister component
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + componentEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail

            // check values
            cy.get("[name='./title']")
                .should("be.visible")
                .should("have.value", "Drafts");
            cy.get("[name='./layout']")
                .should("be.visible")
                .should("have.value", "card");
            cy.get("input[name='./type']")
                .should("have.value", "DRAFT");

            // dismiss window via cancel
            cy.get("button[title=\"Done\"")
                .should("be.visible")
                .click()
                .should("not.exist");
        });
    });
});
