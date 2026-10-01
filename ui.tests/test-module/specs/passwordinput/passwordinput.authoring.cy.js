/*
 *  Copyright 2026 Adobe Systems Incorporated
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
 * Testing PasswordInput with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropPasswordInputInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Password input", afConstants.components.forms.resourceType.formpasswordinput);
    cy.get('body').click( 0,0);
  }

  const dropPasswordInputInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/passwordinput/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Password Input", afConstants.components.forms.resourceType.formpasswordinput);
    cy.get('body').click( 0,0);
  };

  const testPasswordInputBehaviour = function(passwordInputEditPathSelector, passwordInputDrop, isSites) {
    const bemEditDialog = '.cmp-adaptiveform-passwordinput__editdialog'
    if (isSites) {
      dropPasswordInputInSites();
    } else {
      dropPasswordInputInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + passwordInputEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    cy.get("[name='./autocomplete']")
        .should("exist");
    cy.get("[name='./showHidePassword']")
        .should("exist");
    cy.get(bemEditDialog).contains('Validation').click({force:true});
    cy.clickDialogWithRetry();
    cy.deleteComponentByPath(passwordInputDrop);
  };

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        passwordInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/passwordinput",
        passwordInputEditPathSelector = "[data-path='" + passwordInputEditPath + "']",
        passwordInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formpasswordinput.split("/").pop();
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert PasswordInput in form container',  { retries: 3 }, function () {
        cy.cleanTest(passwordInputDrop).then(function() {
            dropPasswordInputInContainer();
            cy.deleteComponentByPath(passwordInputDrop);
        });
    });

    it ('open edit dialog of PasswordInput', { retries: 3 }, function(){
        cy.cleanTest(passwordInputDrop).then(function() {
            testPasswordInputBehaviour(passwordInputEditPathSelector, passwordInputDrop);
        });
    });
  });

  context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/passwordinput",
        passwordInputEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/passwordinput",
        passwordInputEditPathSelector = "[data-path='" + passwordInputEditPath + "']",
        passwordInputDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formpasswordinput.split("/").pop();

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms PasswordInput', function () {
      dropPasswordInputInSites();
      cy.deleteComponentByPath(passwordInputDrop);
    });

    it('open edit dialog of aem forms PasswordInput', function() {
      testPasswordInputBehaviour(passwordInputEditPathSelector, passwordInputDrop, true);
    });

  });
});
