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

describe('Search And Lister - Authoring', function () {
    // we can use these values to log in
    const   pagePath = "/content/core-components-examples/library/forms-and-communications-portal/searchlister",
            componentEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/" + afConstants.components.forms.resourceType.fpsnlcomponent.split("/").pop(),
            componentEditPathSelector = "[data-path='" + componentEditPath + "']",
            componentDropPath = pagePath + afConstants.RESPONSIVE_GRID_SUFFIX + "/" + afConstants.components.forms.resourceType.fpsnlcomponent.split("/").pop(),
            componentDropPathSelector = "[data-path='" + componentDropPath + "']";


    context('Open Editor', function () {
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert search and lister component', function () {
            const responsiveGridDropZone = "Drag components here", // todo:  need to localize this
                responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "']";
            cy.selectLayer("Edit");
            // Add search and lister component and delete it
            cy.insertComponent(responsiveGridDropZoneSelector, "Search And Lister", afConstants.components.forms.resourceType.fpsnlcomponent);
            // once component is added, to remove the overlay from being active, we click on body
            cy.get('body').click(0,0);
            cy.deleteComponentByPath(componentDropPath);
        });

        it('verify edit dialog properties', function () {
            const x = "";
            // click configure action on search and lister component
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + componentEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail

            // check if default proxy component values are set correctly
            // Display tab
            cy.get("[data-foundation-tracking-event*=\"display\"]")
                .should("be.visible")
                .click();
            cy.get("[name='./title']")
                .should("be.visible")
                .should("have.value", "");
            cy.get("[name='./layout']")
                .should("be.visible")
                .should("have.value", "card");
            cy.get("input[name='./disableSearch']")
                .should("be.visible")
                .should("not.be.checked");
            cy.get("input[name='./disableSorting']")
                .should("be.visible")
                .should("not.be.checked");
            cy.get("input[name='./htmlTooltip']")
                .should("be.visible")
                .should("have.value", "");

            // Asset Folder tab, check presence of multifields
            cy.get("[data-foundation-tracking-event*=\"asset folder\"]")
                .should("be.visible")
                .click();

            var assertMultifieldLength = function (cyelement, expectedLength) {
                cyelement
                    .should("be.visible")
                    .should((multifield) => {
                        // custom assertion because need to access Coral JS multifield apis
                        expect(multifield[0].items).to.have.length(expectedLength);
                    });
            };

            var folderPathMultifieldSelector = "[data-granite-coral-multifield-name=\"./assetFolders\"]";
            assertMultifieldLength(cy.get(folderPathMultifieldSelector), 1);

            // Results tab
            cy.get("[data-foundation-tracking-event*=\"results\"]")
                .should("be.visible")
                .click();

            cy.get("input[name='./limit']")
                .should("be.visible")
                .should("have.value", "");

            // check no error tooltips visible
            cy.get("coral-tooltip[variant=\"error\"]")
                .should("not.exist");

            // dismiss window via cancel
            cy.get("button[title=\"Done\"")
                .should("be.visible")
                .click()
                .should("not.exist");
        });
    });
});
