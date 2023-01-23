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


const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

/**
 * Testing Panel Container with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropPanelInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Panel", afConstants.components.forms.resourceType.panelcontainer);
    cy.get('body').click( 0,0);
  }

  const dropPanelInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/panelcontainer/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Panel", afConstants.components.forms.resourceType.panelcontainer);
    cy.get('body').click( 0,0);
  }

  const testPanelBehaviour = function(panelContainerEditPathSelector, panelContainerDrop, isSites) {
    if (isSites) {
      dropPanelInSites();
    } else {
      dropPanelInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + panelContainerEditPathSelector);
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

    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(panelContainerDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        panelEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/panelcontainer",
        panelContainerPathSelector = "[data-path='" + panelEditPath + "']";
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert Panel in form container', function () {
      dropPanelInContainer();
      cy.deleteComponentByPath(panelEditPath);
    });

    it ('open edit dialog of Panel', function(){
      testPanelBehaviour(panelContainerPathSelector, panelEditPath);
    })
  })

  context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/panelcontainer",
        panelContainerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/panelcontainer",
        panelContainerEditPathSelector = "[data-path='" + panelContainerEditPath + "']";

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms Panel', function () {
      dropPanelInSites();
      cy.deleteComponentByPath(panelContainerEditPath);
    });

    it('open edit dialog of aem forms Panel', function() {
      testPanelBehaviour(panelContainerEditPathSelector, panelContainerEditPath, true);
    });

  });
});