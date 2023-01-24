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
 * Testing TextInput with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropTextInputInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
    cy.get('body').click( 0,0);
  }

  const dropTextInputInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/textinput/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
    cy.get('body').click( 0,0);
  }

  const testTextInputBehaviour = function(textInputEditPathSelector, textInputDrop, isSites) {
    if (isSites) {
      dropTextInputInSites();
    } else {
      dropTextInputInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    // Check If Dialog Options Are Visible
    cy.get("[name='./multiLine']")
    .should("exist");
    cy.get("[name='./autocomplete']")
    .should("exist");

    // Checking some dynamic behaviours
    cy.get("[name='./allowRichText'][type=\"checkbox\"]").should("exist").check();
    cy.get(".cmp-adaptiveform-textinput__maxlength").invoke('css', 'display').should('equal','none');
    cy.get(".cmp-adaptiveform-textinput__minlength").invoke('css', 'display').should('equal','none');
    cy.get(".cmp-adaptiveform-base__placeholder").parent('div').invoke('css', 'display').should('equal','none');
    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(textInputDrop);
  }
  
  const testCopyPasteComponent = function(textInputEditPathSelector, textInputEditPathSelectorCopy, textInputDrop) {
    dropTextInputInContainer();
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    // Check If Dialog Options Are Visible
    cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']")
      .should("exist")
      .should("be.visible");
    cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']").focus().clear();
    cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']").invoke('val', 'textinput');
    cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']").focus().type("{enter}");
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
    cy.invokeEditableAction("[data-action='COPY']");
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
      responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.openEditableToolbar(responsiveGridDropZoneSelector);
    cy.invokeEditableAction("[data-action='PASTE']");
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

    it('insert TextInput in form container', function () {
      dropTextInputInContainer();
      cy.deleteComponentByPath(textInputDrop);
    });

    it ('open edit dialog of TextInput', function(){
      testTextInputBehaviour(textInputEditPathSelector, textInputDrop);
    })

    it.skip('pasted component should have unique name', function(){
      testCopyPasteComponent(textInputEditPathSelector, textInputEditPathSelectorCopy, textInputDrop);
    })
  })

  context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/textinput",
        textInputEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/textinput",
        textInputEditPathSelector = "[data-path='" + textInputEditPath + "']",
        textInputDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formtextinput.split("/").pop();

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms TextInput', function () {
      dropTextInputInSites();
      cy.deleteComponentByPath(textInputDrop);
    });

    it('open edit dialog of aem forms TextInput', function() {
      testTextInputBehaviour(textInputEditPathSelector, textInputDrop, true);
    });

  });
});