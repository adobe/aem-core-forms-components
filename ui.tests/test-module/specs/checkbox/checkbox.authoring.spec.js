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
 * Testing CheckBox with Sites Editor
 */
describe('Page - Authoring', function () {


  const dropCheckBoxInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/checkbox/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form CheckBox", afConstants.components.forms.resourceType.checkbox);
    cy.get('body').click( 0,0);
  };

  const dropCheckboxInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form CheckBox", afConstants.components.forms.resourceType.checkbox);
    cy.get('body').click(0, 0);
  }

  const testCheckboxBehaviour = function (checkboxEditPathSelector, checkboxDrop, isSites) {
    if (isSites) {
      dropCheckBoxInSites();
    } else {
      dropCheckboxInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + checkboxEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    cy.get("[name='./name']")
    .should("exist");

    cy.get('.cmp-adaptiveform-checkbox__options').should('not.have.css', 'display', 'none')
    cy.get(".cmp-adaptiveform-checkbox__type").click();
    cy.get("coral-selectlist-item-content").contains('Boolean').should('be.visible').click({force: true});
    cy.get('.cmp-adaptiveform-checkbox__options').should('have.css', 'display', 'none')

    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(checkboxDrop);
  }

  // ***** //

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        checkboxEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/checkbox",
        checkboxEditPathSelector = "[data-path='" + checkboxEditPath + "']",
        checkboxDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.checkbox.split("/").pop();

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    // it('insert TextInput in form container', function () {
    //   dropCheckboxInContainer();
    //   cy.deleteComponentByPath(checkboxDrop);
    // });

    it('open edit dialog of aem forms Checkbox', function() {
      testCheckboxBehaviour(checkboxEditPathSelector, checkboxDrop, false);
    });
  })

  context('Open Sites Editor', function() {
    const pagePath = "/content/core-components-examples/library/adaptive-form/checkbox",
        checkboxEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/checkbox",
        checkboxDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.checkbox.split("/").pop(),
    checkboxEditPathSelector = "[data-path='" + checkboxEditPath + "']";

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms CheckBox', function () {
      dropCheckBoxInSites();
      cy.deleteComponentByPath(checkboxDrop);
    });

    it('open edit dialog of aem forms Checkbpx', function() {
      testCheckboxBehaviour(checkboxEditPathSelector, checkboxDrop, true);
    });
  })
});
