/*
 *  Copyright 2024 Adobe Systems Incorporated
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


const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

describe.only('Page - Authoring', function () {

    const dropComponent = function (responsiveGridDropZoneSelector, componentTitle, componentType) {
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, componentTitle, componentType);
        cy.get('body').click(0, 0);
    }

    const getDropZoneSelector = function (responsiveGridDropZone) {
        return sitesSelectors.overlays.overlay.component + "[data-path='" + responsiveGridDropZone + "']";
    }

    const dropTabsInContainer = function () {
        const responsiveGridDropZoneSelector = getDropZoneSelector("/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*");
        dropComponent(responsiveGridDropZoneSelector, "Adaptive Form Horizontal Tabs", afConstants.components.forms.resourceType.tabsontop);
    }
    const dropPanelInTabComponent = function () {
      const responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='Please drag Tab components here']:last";
      dropComponent(responsiveGridDropZoneSelector, "Adaptive Form Panel", afConstants.components.forms.resourceType.panelcontainer);
    }
    const dropTextInputInTabComponent = function () {
        const responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='Please drag Tab components here']:first";
        dropComponent(responsiveGridDropZoneSelector, "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
    }
    const dropReviewInTabComponent = function () {
      const responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='Please drag Tab components here']";
      cy.get(responsiveGridDropZoneSelector).eq(1).then(($element) => {
        dropComponent($element, "Adaptive Form Review", afConstants.components.forms.resourceType.review);
      });
    }
    const dropTabsInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/panelcontainer/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        dropComponent(responsiveGridDropZoneSelector, "Adaptive Form Horizontal Tabs", afConstants.components.forms.resourceType.tabsontop);
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            tabsPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/tabsontop",
            tabsContainerPathSelector = "[data-path='" + tabsPath + "']",
            reviewPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/review",
            reviewContainerPathSelector = "[data-path='" + reviewPath + "']",
            editDialogConfigurationSelector = "[data-action='CONFIGURE']",
            reviewBlockBemSelector = '.cmp-adaptiveform-review';
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });


        it('Drop tabs and drop element in tabs on top', {retries: 3}, function () {
            cy.cleanTest(tabsPath).then(function () {
                dropTabsInContainer();
                dropPanelInTabComponent();
                dropTextInputInTabComponent();
                dropPanelInTabComponent();
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + tabsContainerPathSelector);
                cy.invokeEditableAction("[data-action='PANEL_SELECT']").then(() => {
                  cy.get("table.cmp-panelselector__table tr").eq(1).click().then(() => {
                    cy.get('body').click(0, 0);
                    dropReviewInTabComponent();

                    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + reviewContainerPathSelector);
                    cy.invokeEditableAction(editDialogConfigurationSelector);
                    cy.get("[name='./name']").should("exist");
                    cy.get("[name='./jcr:title']").should("exist");
                    cy.get("[name='./fd:editModeAction']").should("exist");
                    cy.get("[name='./fd:editModeAction'] coral-select-item").should("have.length", 4);
                    cy.get("[name='./linkedPanels']").should("exist");
                    cy.get("[name='./linkedPanels'] coral-select-item").should("have.length", 2);
                    cy.deleteComponentByPath(tabsPath);
                  })
                });
            });
        });
    });
});
