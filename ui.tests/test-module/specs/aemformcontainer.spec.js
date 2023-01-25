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

// This recipe is to test the AEM Forms Container Component functionality

// We are going to test a few things:
// 1. Open Edit layer
// 2. Perform few operations

// Be sure to run the aem server
// before running the tests below.

const commons = require('../libs/commons/commons'),
      sitesSelectors = require('../libs/commons/sitesSelectors'),
      sitesConstants = require('../libs/commons/sitesConstants'),
      guideSelectors = require('../libs/commons/guideSelectors'),
      wizardSelectors = require('../libs/commons/wizardSelectors'),
      afConstants = require('../libs/commons/formsConstants');

// we can use these values to log in
const   pagePath = "/content/core-components-examples/library/core-content/aemform",
    aemFormContainerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/" + afConstants.components.forms.resourceType.aemformcontainer.split("/").pop(),
    aemFormContainerEditPathSelector = "[data-path='" + aemFormContainerEditPath + "']",
    aemFormContainerDropPath = pagePath + afConstants.RESPONSIVE_GRID_SUFFIX + "/" + afConstants.components.forms.resourceType.aemformcontainer.split("/").pop(),
    aemFormContainerDropPathSelector = "[data-path='" + aemFormContainerDropPath + "']";

describe('Page - Authoring', function () {
    context('Open Editor', function () {
        beforeEach(function () {
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms container component', { retries: 3 }, function () {
            const responsiveGridDropZone = "Drag components here", // todo:  need to localize this
                responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "']";
            cy.selectLayer("Edit");
            // Add aem forms container component and delete it
            cy.insertComponent(responsiveGridDropZoneSelector, "AEM Forms Container", afConstants.components.forms.resourceType.aemformcontainer);
            // once component is added, to remove the overlay from being active, we click on body
            cy.get('body').click(0,0);
            cy.deleteComponentByPath(aemFormContainerDropPath);
        });

        it('open edit dialog of aem forms container component', { retries: 3 }, function() {
            // click configure action on aem forms container component
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + aemFormContainerEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
            // check for dynamic operations performed using JS
            cy.get("[name='./thankyouConfig'][value='message']")
                .should("be.visible")
                .click({multiple: true});
            cy.get("[name='./thankyouMessage']").should("be.visible");
            // check for dynamic operations performed using JS
            cy.get("[name='./thankyouConfig'][value='page']")
                .should("be.visible")
                .click({multiple: true});
            cy.get("[name='./thankyouPage']").should("be.visible");
            // check if use page locale is selected
            cy.get("[name='./usePageLocale'").should("be.checked");
            // check if set focus form on form is selected
            cy.get("[name='./enableFocusOnFirstField'").should("be.checked");
            // check if by default iframe is not selected
            cy.get("[name='./useiframe'").should("be.checked");
            cy.get(sitesSelectors.confirmDialog.actions.first).click();
        });

        after(function() {
            // clean up the operations performed in the test
            cy.enableOrDisableTutorials(true);
        });
    });
});
