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

const sitesSelectors = require('../libs/commons/sitesSelectors'),
    afConstants = require('../libs/commons/formsConstants');

/**
 * Testing TextInput with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropRadioButtonInGuideContainer = function() {
    const responsiveGridDropZone = "Drag components here", // todo:  need to localize this
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Radio Button", afConstants.components.forms.resourceType.formradiobutton);
    cy.get('body').click( 0,0);
  }

  const dropRadioButonInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/radiobutton/jcr:content/root/responsivegrid/demo/component/container/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Radio Button", afConstants.components.forms.resourceType.formradiobutton);
    cy.get('body').click( 0,0);
  }

  const testRadioButtonBehaviour = function(radioButtonEditPathSelector, radioButtonDrop, isSites) {
    if (isSites) {
      dropRadioButonInSites();
    } else {
      dropRadioButtonInGuideContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + radioButtonEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']");
    // Check If Dialog Options Are Visible
    cy.get("[name='./type@Delete']")
        .should("exist");
    cy.get("[name='./enum@Delete']")
        .should("exist");
    cy.get("[name='./enumNames@Delete']")
        .should("exist");

    // Checking some dynamic behaviours
    cy.get("[name='./required'][type=\"checkbox\"]").should("exist");
    cy.get("[data-granite-coral-multifield-name='./enum'] coral-button-label:contains('Add')").should("exist");
    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(radioButtonDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        radioButtonPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/radiobutton",
        radioButtonEditPathSelector = "[data-path='" + radioButtonPath + "']",
        radioButtonDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formradiobutton.split("/").pop();
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert radio button in form container', function () {
      dropRadioButtonInGuideContainer();
      cy.deleteComponentByPath(radioButtonDrop);
    });

    it ('open edit dialog of Radio Button', function(){
      testRadioButtonBehaviour(radioButtonEditPathSelector, radioButtonDrop);
    })
  })
});