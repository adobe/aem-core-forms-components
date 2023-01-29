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
 * Testing Text with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropTextInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Text", afConstants.components.forms.resourceType.formtext);
    cy.get('body').click( 0,0);
  }

  const dropTextInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/text/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Text", afConstants.components.forms.resourceType.formtext);
    cy.get('body').click( 0,0);
  }

  const testTextBehaviour = function(textEditPathSelector, textDrop, isSites) {
    if (isSites) {
      dropTextInSites();
    } else {
      dropTextInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']");
    // Check If Dialog Options Are Visible
    cy.get("[name='./name']")
    .should("exist");
    cy.get("[name='./dataRef']")
    .should("exist");

    cy.get("[name='./visible'][type=\"checkbox\"]").should("exist").check();
    cy.get('.cq-dialog-cancel').click();

    const input = "abc"
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textEditPathSelector);
    cy.invokeEditableAction("[data-action='EDIT']");
    cy.get("[title='Save'][type='button']").click();
    cy.deleteComponentByPath(textDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        textEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/text",
        textEditPathSelector = "[data-path='" + textEditPath + "']",
        textDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formtext.split("/").pop();
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert Text in form container', function () {
      dropTextInContainer();
      cy.deleteComponentByPath(textDrop);
    });

    it ('open edit dialog of Text', function(){
      testTextBehaviour(textEditPathSelector, textDrop);
    })
  })

  context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/text",
        textEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/text",
        textEditPathSelector = "[data-path='" + textEditPath + "']",
        textDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formtext.split("/").pop();

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms Text', function () {
      dropTextInSites();
      cy.deleteComponentByPath(textDrop);
    });

    it('open edit dialog of aem forms Text', function() {
      testTextBehaviour(textEditPathSelector, textDrop, true);
    });

  });
});