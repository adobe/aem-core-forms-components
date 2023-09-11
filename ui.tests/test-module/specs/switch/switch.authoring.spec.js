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


const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

/**
 * Testing Switch with Sites Editor
 */
describe('Page - Authoring', function () {


  const dropSwitchInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/switch/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Switch", afConstants.components.forms.resourceType.switch);
    cy.get('body').click( 0,0);
  };

  const dropSwitchInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Switch", afConstants.components.forms.resourceType.switch);
    cy.get('body').click(0, 0);
  }

  const testSwitchBehaviour = function (switchEditPathSelector, switchDrop, isSites) {
    if (isSites) {
      dropSwitchInSites();
    } else {
      dropSwitchInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + switchEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    cy.get("[name='./name']")
    .should("exist");


    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(switchDrop);
  }

  // ***** //

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",

        switchEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/switch",
        switchEditPathSelector = "[data-path='" + switchEditPath + "']",
        switchDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.switch.split("/").pop();

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert Switch in form container', function () {
      dropSwitchInContainer();
      cy.deleteComponentByPath(switchDrop);
    });

    it('when enableUnchecked is false hides off field', function () {
      dropSwitchInContainer();
      const pagePath = "/content/forms/af/core-components-it/blank",
      switchEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/switch",
      switchEditPathSelector = "[data-path='" + switchEditPath + "']";
      cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + switchEditPathSelector);
      cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
      cy.get(".cmp-adaptiveform-switch__enums coral-multifield-item").eq(0).should('not.be.visible')
      const enableUnchecked = '[name="./enableUncheckedValue"]';
      cy.get(enableUnchecked).eq(0).click().then(() => {
        cy.get(".cmp-adaptiveform-switch__enums coral-multifield-item").eq(0).should('be.visible')
      })
      cy.get('.cq-dialog-cancel').click();
      cy.deleteComponentByPath(switchDrop);
    });

    it('open edit dialog of aem forms Switch', function() {
      testSwitchBehaviour(switchEditPathSelector, switchDrop, false);
    });
  })

  context('Open Sites Editor', function() {
    const pagePath = "/content/core-components-examples/library/adaptive-form/switch",
        switchEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/switch",
        switchDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.switch.split("/").pop(),
    switchEditPathSelector = "[data-path='" + switchEditPath + "']";

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms Switch', function () {
      dropSwitchInSites();
      cy.deleteComponentByPath(switchDrop);
    });

    it('when enableUnchecked is false hides off field', function () {
      dropSwitchInSites();
      cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + switchEditPathSelector);
      cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
      cy.get(".cmp-adaptiveform-switch__enums coral-multifield-item").eq(0).should('not.be.visible');
      const enableUnchecked = '[name="./enableUncheckedValue"]';
      cy.get(enableUnchecked).eq(0).click().then(() => {
        cy.get(".cmp-adaptiveform-switch__enums coral-multifield-item").eq(0).should('be.visible')
      })
      cy.get('.cq-dialog-cancel').click();
      cy.deleteComponentByPath(switchDrop);
    });

    it('open edit dialog of aem forms switch', function() {
      testSwitchBehaviour(switchEditPathSelector, switchDrop, true);
    });
  })
});
