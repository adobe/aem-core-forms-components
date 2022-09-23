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
// 1. Link Component can be added and deleted
// 2. Verify default values set in proxy component
// 3. Check rendered link

// Be sure to run the aem server
// before running the tests below.

const sitesSelectors = require('../../libs/commons/sitesSelectors'),
      afConstants = require('../../libs/commons/formsConstants');

describe('Link - Authoring', function () {
    // we can use these values to log in
    const   pagePath = "/content/core-components-examples/library/forms-and-communications-portal/link",
            linkComponentEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/" + afConstants.components.forms.resourceType.fplinkcomponent.split("/").pop(),
            linkComponentEditPathSelector = "[data-path='" + linkComponentEditPath + "']",
            linkComponentDropPath = pagePath + afConstants.RESPONSIVE_GRID_SUFFIX + "/" + afConstants.components.forms.resourceType.fplinkcomponent.split("/").pop(),
            linkComponentDropPathSelector = "[data-path='" + linkComponentDropPath + "']";

    context('Open Editor', function () {
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert link component', function () {
            const responsiveGridDropZone = "Drag components here", // todo:  need to localize this
                responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "']";
            cy.selectLayer("Edit");
            // Add link component and delete it
            cy.insertComponent(responsiveGridDropZoneSelector, "Link", afConstants.components.forms.resourceType.fplinkcomponent);
            // once component is added, to remove the overlay from being active, we click on body
            cy.get('body').click(0,0);
            cy.deleteComponentByPath(linkComponentDropPath);
        });

        it('verify edit dialog properties', function () {
            const x = "";
            // click configure action on link component
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + linkComponentEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail

            // check if default proxy component values are set correctly
            // Display tab
            cy.get("[name='./title']")
                .should("be.visible")
                .should("have.value", "Sample Link Component");
            cy.get("[name='./tooltip']")
                .should("be.visible")
                .should("have.value", "Sample Tooltip");

            // Asset Info tab
            cy.get("[data-foundation-tracking-event*=\"asset info\"]")
                .should("be.visible")
                .click();

            cy.get("[name='./assetType']")
                .should("be.visible")
                .should("have.value", "Adaptive Form");

            cy.get("[name='./adaptiveFormPath']")
                .should("be.visible")
                .should("have.value", "");

            // Query Params tab
            cy.get("[data-foundation-tracking-event*=\"query params\"]")
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

            // verify no items present in multifield beforehand
            var queryParamsMultifieldSelector = "[data-granite-coral-multifield-name=\"./queryParams\"]";
            assertMultifieldLength(cy.get(queryParamsMultifieldSelector), 0);

            // click add item and don't fill mandatory values
            cy.get("[coral-multifield-add]")
                .should("be.visible")
                .click();
            assertMultifieldLength(cy.get(queryParamsMultifieldSelector), 1);

            // check no error tooltips visible, then try submitting and verify error is visible
            cy.get("coral-tooltip[variant=\"error\"]")
                .should("not.exist");
            cy.get("button[title=\"Done\"")
                .should("be.visible")
                .click();
            cy.get("coral-tooltip[variant=\"error\"]")
                .should("be.visible");

            // dismiss window via cancel
            cy.get("button[title=\"Cancel\"")
                .should("be.visible")
                .click()
                .should("not.exist");
        });

        it('navigate to rendered page and verify link', function () {
            cy.visit(pagePath + '.html');
            cy.get("a[class*=\"cmp-link__anchor\"]")
                .should("have.attr", "href", "#")
                .should("have.attr", "target", "_self");
        });

    });
});
