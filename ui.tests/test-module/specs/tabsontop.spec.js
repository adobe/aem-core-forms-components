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


const commons = require('../libs/commons/commons'),
    sitesSelectors = require('../libs/commons/sitesSelectors'),
    sitesConstants = require('../libs/commons/sitesConstants'),
    guideSelectors = require('../libs/commons/guideSelectors'),
    afConstants = require('../libs/commons/formsConstants');

/**
 * Testing Tabs on top Container with Sites Editor
 */
describe('Page - Authoring', function () {

  const dropComponent = function(responsiveGridDropZoneSelector, componentTitle, componentType) {
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, componentTitle, componentType);
    cy.get('body').click( 0,0);
  }  

  const getDropZoneSelector = function(responsiveGridDropZone) {
    return sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "']";
  }

  const dropTabsInContainer = function() {
    const responsiveGridDropZoneSelector = getDropZoneSelector("Drag components here");
    dropComponent(responsiveGridDropZoneSelector, "Adaptive Form Tabs On Top component", afConstants.components.forms.resourceType.tabsontop);
  }

  const dropTextInputInTabComponent = function() {
    const responsiveGridDropZoneSelector = getDropZoneSelector("Please drag Tab components here");
    dropComponent(responsiveGridDropZoneSelector, "Adaptive Form Text Input component", afConstants.components.forms.resourceType.formtextinput);
  }

  const dropTabsInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/panelcontainer/jcr:content/root/responsivegrid/demo/component/container/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    dropComponent(responsiveGridDropZoneSelector, "Adaptive Form Tabs On Top component", afConstants.components.forms.resourceType.tabsontop);
  }

  const testPanelBehaviour = function(tabsEditPathSelector, tabsContainerDrop, isSites) {
    if (isSites) {
      dropTabsInSites();
    } else {
      dropTabsInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + tabsEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    // Check If Dialog Options Are Visible
    cy.get("[name='./roleAttribute']")
    .should("exist");
    cy.get("[name='./name']")
    .should("exist");
    cy.get("[name='./jcr:title']")
    .should("exist");
    cy.get("[name='./layout']")
    .should("exist");
    cy.get("[name='./dataRef']")
        .should("exist");
    cy.get("[name='./visible']")
        .should("exist");
    cy.get("[name='./enabled']")
        .should("exist");
    cy.get("[name='./assistPriority']")
        .should("exist");
    cy.get("[name='./custom']")
        .should("exist");
    cy.get("[name='./minItems']")
        .should("exist");
    cy.get("[name='./maxItems']")
        .should("exist");

    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(tabsContainerDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        panelEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/tabsontop",
        panelContainerPathSelector = "[data-path='" + panelEditPath + "']";
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert Tabs on top in form container', function () {
      dropTabsInContainer();
      cy.deleteComponentByPath(panelEditPath);
    });

    it('drop element in tabs on top', function () {
        dropTabsInContainer();
        dropTextInputInTabComponent();
        cy.get(`[data-path="${panelEditPath}"] [data-path="${panelEditPath}/textinput"]`).should('be.visible');
        cy.deleteComponentByPath(panelEditPath);
    });

    it ('open edit dialog of Tab on top', function(){
      testPanelBehaviour(panelContainerPathSelector, panelEditPath);
    })
  })

  context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/panelcontainer",
        panelContainerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/container/tabsontop",
        tabsEditPathSelector = "[data-path='" + panelContainerEditPath + "']";

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert tabs on top of form', function () {
      dropTabsInSites();
      cy.deleteComponentByPath(panelContainerEditPath);
    });

    it('open edit dialog of tabs on top of form', function() {
      testPanelBehaviour(tabsEditPathSelector, panelContainerEditPath, true);
    });

  });
});