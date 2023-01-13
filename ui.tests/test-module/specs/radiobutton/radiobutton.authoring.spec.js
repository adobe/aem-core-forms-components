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
 * Testing RadioButton with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropRadioButtonInGuideContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Radio Button", afConstants.components.forms.resourceType.formradiobutton);
    cy.get('body').click( 0,0);
  }

  const getPreviewIframeBody = () => {
    // get the iframe > document > body
    // and retry until the body element is not empty
    return cy
        .get('iframe#ContentFrame')
        .its('0.contentDocument.body').should('not.be.empty')
        .then(cy.wrap)
  }

  const testRadioButtonBehaviour = function(radioButtonEditPathSelector, radioButtonDrop) {
    dropRadioButtonInGuideContainer();
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

    // verifying prefill data is working for enum and enumNames
    cy.get('input[name="./enum"]').should('have.length', 2);
    cy.get('input[name="./enum"]').first().should('have.value', 0);
    cy.get('input[name="./enumNames"]').should('have.length', 2);
    cy.get('input[name="./enumNames"]').first().should('have.value', "Item 1");

    // selecting number as type of the radio button
    cy.get('.cmp-adaptiveform-radiobutton__type').should("exist").click();
    cy.get('coral-selectlist-item[value="number"]').should("exist").click();

    // selecting vertical alignment as an orientation
    cy.get('input[name="./orientation"][value="vertical"]').should("exist").click();

    // saving the dialog with changes
    cy.get('.cq-dialog-submit').click();

    // verifying alignment change in preview editor
    getPreviewIframeBody().find('.cmp-adaptiveform-radiobutton__widget.VERTICAL').should('have.length',1);
    getPreviewIframeBody().find('.cmp-adaptiveform-radiobutton__option').should('have.length',2);

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
    });

    it ('check value type validations', function() {

      // For Number Type
      dropRadioButtonInGuideContainer();
      cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + radioButtonEditPathSelector);
      cy.invokeEditableAction("[data-action='CONFIGURE']");
      cy.get('.cmp-adaptiveform-radiobutton__type').click();
      cy.get("coral-selectlist-item-content").contains('Number').should('be.visible').click({force: true});
      cy.get(".cmp-adaptiveform-radiobutton__value").invoke('val', 'Not a Number');
      cy.get('.cq-dialog-submit').click();
      cy.get('.coral-Form-errorlabel').should('contain.text', 'Value Type Mismatch');

      cy.get('.cq-dialog-cancel').click();
      cy.deleteComponentByPath(radioButtonDrop);

      // For Boolean
      dropRadioButtonInGuideContainer();
      cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + radioButtonEditPathSelector);
      cy.invokeEditableAction("[data-action='CONFIGURE']");
      cy.get('.cmp-adaptiveform-radiobutton__type').click();
      cy.get("coral-selectlist-item-content").contains('Boolean').should('be.visible').click({force: true});
      cy.get(".cmp-adaptiveform-radiobutton__value").invoke('val', 'Not a Boolean');
      cy.get('.cq-dialog-submit').click();
      cy.get('.coral-Form-errorlabel').should('contain.text', 'Value Type Mismatch');

      cy.get('.cq-dialog-cancel').click();
      cy.deleteComponentByPath(radioButtonDrop);
    })
  })
});