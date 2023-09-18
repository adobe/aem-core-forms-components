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
 * Testing Terms and Conditions with Sites Editor
 */
describe('Page - Authoring', function () {


  const dropTnCInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/termsandconditions/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Terms And Conditions", afConstants.components.forms.resourceType.termsandconditions);
    cy.get('body').click( 0,0);
  };

  const dropTncInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Terms And Conditions", afConstants.components.forms.resourceType.termsandconditions);
    cy.get('body').click(0, 0);
  }

  const testTncBehaviour = function (tncEditPathSelector, tncDrop, isSites) {
    if (isSites) {
      dropTnCInSites();
    } else {
      dropTncInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + tncEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    cy.get("[name='./name']")
    .should("exist");

    cy.get("coral-checkbox[name='./showApprovalOption']")
      .should('have.attr', 'checked');

    cy.get("input[name='./showApprovalOption']")
      .click().then(e => {
      cy.get("input[name='./showAsPopup']").click()
        .then(e => {
          cy.get("coral-checkbox[name='./showApprovalOption']")
          .should('have.attr', 'checked');
        })
    })

    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(tncDrop);
  }

  // ***** //

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        tncEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/termsandconditions",
        tncEditPathSelector = "[data-path='" + tncEditPath + "']",
        tncDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.termsandconditions.split("/").pop();

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert TnC in form container', function () {
      dropTncInContainer();
      cy.deleteComponentByPath(tncDrop);
    });

    it('Test TnC authoring behaviour', function() {
      testTncBehaviour(tncEditPathSelector, tncDrop, false);
    });
  })

  context('Open Sites Editor', function() {
    const pagePath = "/content/core-components-examples/library/adaptive-form/termsandconditions",
        tncEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/termsandconditions",
        tncDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.termsandconditions.split("/").pop(),
        tncEditPathSelector = "[data-path='" + tncEditPath + "']";

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms TnC', function () {
      dropTnCInSites();
      cy.deleteComponentByPath(tncDrop);
    });

    it('Test TnC authoring behaviour', function() {
      testTncBehaviour(tncEditPathSelector, tncDrop, true);
    });
  })
});
