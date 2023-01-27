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


const commons = require('../../libs/commons/commons'),
    sitesSelectors = require('../../libs/commons/sitesSelectors'),
    sitesConstants = require('../../libs/commons/sitesConstants'),
    guideSelectors = require('../../libs/commons/guideSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

/**
 * Testing Tabs on top Container with Sites Editor
 */
describe.only('Page - Authoring', function () {

  const dropComponent = function(responsiveGridDropZoneSelector, componentTitle, componentType) {
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, componentTitle, componentType);
    cy.get('body').click( 0,0);
  }  

  const getDropZoneSelector = function(responsiveGridDropZone) {
    return sitesSelectors.overlays.overlay.component + "[data-path='" + responsiveGridDropZone + "']";
  }

  const dropTabsInContainer = function() {
    const responsiveGridDropZoneSelector = getDropZoneSelector("/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*");
    dropComponent(responsiveGridDropZoneSelector, "Adaptive Form Horizontal Tabs", afConstants.components.forms.resourceType.tabsontop);
  }

  const dropTextInputInTabComponent = function() {
    const responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='Please drag Tab components here']:last";
    dropComponent(responsiveGridDropZoneSelector, "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
  }
  const dropDatePickerInTabComponent = function() {
    const responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='Please drag Tab components here']:last";
    dropComponent(responsiveGridDropZoneSelector, "Adaptive Form Date Picker", afConstants.components.forms.resourceType.datepicker);
  }
  const dropTabsInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/panelcontainer/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    dropComponent(responsiveGridDropZoneSelector, "Adaptive Form Horizontal Tabs", afConstants.components.forms.resourceType.tabsontop);
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
    cy.get("[name='./name']")
    .should("exist");
    cy.get("[name='./jcr:title']")
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

    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(tabsContainerDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        tabsPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/tabsontop",
        tabsContainerPathSelector = "[data-path='" + tabsPath + "']";
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert Tabs on top in form container', function () {
      dropTabsInContainer();
      cy.deleteComponentByPath(tabsPath);
    });

    it('drop element in tabs on top', function () {
        dropTabsInContainer();
        dropTextInputInTabComponent();
        cy.get(`[data-path="${tabsPath}"] [data-path="${tabsPath}/textinput"]`).should('be.visible');
        cy.deleteComponentByPath(tabsPath);
    });

    // todo: flaky
    it('switch tabs using dialog select panel button in toolbar', { retries: 3 }, function(){
      dropTabsInContainer();
      //Add 2 children in tabs on top component
      dropTextInputInTabComponent();
      dropDatePickerInTabComponent();
      cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + tabsContainerPathSelector);
      cy.invokeEditableAction("[data-action='PANEL_SELECT']");
      cy.get("table.cmp-panelselector__table").find("tr").should("have.length", 2);
      const datePickerPath = tabsPath+"/datepicker";
      cy.get(`[data-id="${datePickerPath}`).click();
      cy.get('body').click( 0,0);
      cy.invokeEditableAction("[data-action='PANEL_SELECT']");
      //Click datepicker from panel select list
      cy.get(`[data-id="${datePickerPath}`).click();
      cy.get(`[data-path="${datePickerPath}"]`).should('be.visible');
      cy.deleteComponentByPath(tabsPath);
    });

    it ('open edit dialog of Tab on top', function(){
      testPanelBehaviour(tabsContainerPathSelector, tabsPath);
    })
  })

  context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/panelcontainer",
        panelContainerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/tabsontop",
        tabsEditPathSelector = "[data-path='" + panelContainerEditPath + "']";

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert tabs on top of form', function () {
      dropTabsInSites();
      cy.deleteComponentByPath(panelContainerEditPath);
    });

    it('open edit dialog of tabs on top of form', { retries: 3 }, function() {
      testPanelBehaviour(tabsEditPathSelector, panelContainerEditPath, true);
    });

  });
});
