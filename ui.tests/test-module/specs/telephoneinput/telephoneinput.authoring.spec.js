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
 * Testing TelephoneInput with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropTelephoneInputInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Telephone input", afConstants.components.forms.resourceType.formtelephoneinput);
    cy.get('body').click( 0,0);
  }

  const dropTelephoneInputInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/telephoneinput/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Telephone Input", afConstants.components.forms.resourceType.formtelephoneinput);
    cy.get('body').click( 0,0);
  }

  const testTelephoneInputBehaviour = function(telephoneInputEditPathSelector, telephoneInputDrop, isSites) {
    const bemEditDialog = '.cmp-adaptiveform-telephoneinput__editdialog'
    if (isSites) {
      dropTelephoneInputInSites();
    } else {
      dropTelephoneInputInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + telephoneInputEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    cy.get(bemEditDialog).contains('Validation').click({force:true});
    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(telephoneInputDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        telephoneInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/telephoneinput",
        telephoneInputEditPathSelector = "[data-path='" + telephoneInputEditPath + "']",
        telephoneInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formtelephoneinput.split("/").pop();
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert TelephoneInput in form container', function () {
      dropTelephoneInputInContainer();
      cy.deleteComponentByPath(telephoneInputDrop);
    });

    it ('open edit dialog of TelephoneInput', function(){
      testTelephoneInputBehaviour(telephoneInputEditPathSelector, telephoneInputDrop);
    })
  })

  context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/telephoneinput",
        telephoneInputEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/telephoneinput",
        telephoneInputEditPathSelector = "[data-path='" + telephoneInputEditPath + "']",
        telephoneInputDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formtelephoneinput.split("/").pop();

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms TelephoneInput', function () {
      dropTelephoneInputInSites();
      cy.deleteComponentByPath(telephoneInputDrop);
    });

    it('open edit dialog of aem forms TelephoneInput', function() {
      testTelephoneInputBehaviour(telephoneInputEditPathSelector, telephoneInputDrop, true);
    });

  });
});