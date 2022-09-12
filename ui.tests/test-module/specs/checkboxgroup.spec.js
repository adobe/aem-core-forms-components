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


const commons = require('../libs/commons/commons'),
    sitesSelectors = require('../libs/commons/sitesSelectors'),
    sitesConstants = require('../libs/commons/sitesConstants'),
    guideSelectors = require('../libs/commons/guideSelectors'),
    afConstants = require('../libs/commons/formsConstants');

/**
 * Testing CheckBoxGroup with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropCheckBoxGroupInContainer = function() {
    const responsiveGridDropZone = "Drag components here", // todo:  need to localize this
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form CheckBox Group", afConstants.components.forms.resourceType.formcheckboxgroup);
    cy.get('body').click( 0,0);
  }

  const dropTextInputInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/textinput/jcr:content/root/responsivegrid/demo/component/container/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Text Input component", afConstants.components.forms.resourceType.formtextinput);
    cy.get('body').click( 0,0);
  }

  const testCheckBoxGroupBehaviour = function(checkBoxGroupEditPathSelector, checkBoxGroupDrop, isSites) {
    if (isSites) {
      dropTextInputInSites();
    } else {
      dropCheckBoxGroupInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + checkBoxGroupEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    // Check If Dialog Options Are Visible
    cy.get("[name='./type@Delete']")
    .should("exist");
    cy.get("[name='./enum@TypeHint']")
    .should("exist");
    cy.get("[name='./enumNames@TypeHint']")
    .should("exist");

    // Checking some dynamic behaviours
    cy.get("[name='./required'][type=\"checkbox\"]").should("exist").check();
    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(checkBoxGroupDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        checkBoxGroupPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/checkboxgroup",
        checkBoxGroupEditPathSelector = "[data-path='" + checkBoxGroupPath + "']",
        checkBoxGroupDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formcheckboxgroup.split("/").pop();
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert CheckBoxGroup in form container', function () {
      dropCheckBoxGroupInContainer();
      cy.deleteComponentByPath(checkBoxGroupDrop);
    });

    it ('open edit dialog of CheckboxGroup', function(){
      testCheckBoxGroupBehaviour(checkBoxGroupEditPathSelector, checkBoxGroupDrop);
    })
  })
/*
  context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/textinput",
        textInputEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/container/textinput",
        textInputEditPathSelector = "[data-path='" + textInputEditPath + "']",
        textInputDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/container/' + afConstants.components.forms.resourceType.formtextinput.split("/").pop();

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

  });*/
});