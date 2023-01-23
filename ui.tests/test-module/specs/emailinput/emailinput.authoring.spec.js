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
 * Testing EmailInput with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropEmailInputInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Email input", afConstants.components.forms.resourceType.formemailinput);
    cy.get('body').click( 0,0);
  }

  const dropEmailInputInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/emailinput/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Email Input", afConstants.components.forms.resourceType.formemailinput);
    cy.get('body').click( 0,0);
  }

  const testEmailInputBehaviour = function(emailInputEditPathSelector, emailInputDrop, isSites) {
    const bemEditDialog = '.cmp-adaptiveform-emailinput__editdialog'
    if (isSites) {
      dropEmailInputInSites();
    } else {
      dropEmailInputInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + emailInputEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    cy.get(bemEditDialog).contains('Validation').click({force:true});
    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(emailInputDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        emailInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/emailinput",
        emailInputEditPathSelector = "[data-path='" + emailInputEditPath + "']",
        emailInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formemailinput.split("/").pop();
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert EmailInput in form container', function () {
      dropEmailInputInContainer();
      cy.deleteComponentByPath(emailInputDrop);
    });

    it ('open edit dialog of EmailInput', function(){
      testEmailInputBehaviour(emailInputEditPathSelector, emailInputDrop);
    })
  })

  context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/emailinput",
        emailInputEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/emailinput",
        emailInputEditPathSelector = "[data-path='" + emailInputEditPath + "']",
        emailInputDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formemailinput.split("/").pop();

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms EmailInput', function () {
      dropEmailInputInSites();
      cy.deleteComponentByPath(emailInputDrop);
    });

    it('open edit dialog of aem forms EmailInput', function() {
      testEmailInputBehaviour(emailInputEditPathSelector, emailInputDrop, true);
    });

  });
});