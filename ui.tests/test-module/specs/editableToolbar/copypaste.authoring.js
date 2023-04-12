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
 * Testing Copy Paste
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropComponentInContainer = function(componentString,componentType) {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, componentString, componentType);
    cy.get(sitesSelectors.overlays.self).click( 0,0);
  }
  
  const testCopyPasteComponent = function(textInputEditPathSelector, textInputEditPathSelectorCopy, textInputDrop) {
    dropComponentInContainer("Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    // Check If Dialog Options Are Visible
    cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']")
      .should("exist")
      .should("be.visible");
    cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']").focus().clear();
    cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']").invoke('val', 'textinput');
    cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']").focus().type("{enter}");
    cy.wait(1000);
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
    cy.invokeEditableAction("[data-action='COPY']");
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
      responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.openEditableToolbar(responsiveGridDropZoneSelector);
    cy.invokeEditableAction("[data-action='PASTE']")
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelectorCopy);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    // Check If Dialog Options Are Visible
    cy.get(".cmp-adaptiveform-base__editdialogbasic [name='./name']")
      .should("exist")
      .should("have.value", "textinput_copy_1");
    cy.get("coral-dialog.is-open coral-dialog-footer button[variant='default']").click();
    cy.deleteComponentByPath(textInputDrop);
    cy.deleteComponentByPath(textInputDrop+"_copy");
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        textInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/textinput",
        textInputEditPathSelector = "[data-path='" + textInputEditPath + "']",
        textInputEditPathSelectorCopy = "[data-path='" + textInputEditPath + "_copy']",
        textInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formtextinput.split("/").pop();
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('pasted component should have unique name', function(){
      testCopyPasteComponent(textInputEditPathSelector, textInputEditPathSelectorCopy, textInputDrop);
    })
  })

});