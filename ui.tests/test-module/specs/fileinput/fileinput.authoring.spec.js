/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/


const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

/**
 * Testing FileInput with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropFileInputInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "File Attachment", afConstants.components.forms.resourceType.formfileinput);
    cy.get('body').click( 0,0);
  }

  const dropFileInputInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/fileinput/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "File Attachment", afConstants.components.forms.resourceType.formfileinput);
    cy.get('body').click( 0,0);
  }

  const testFileInputBehaviour = function(fileInputEditPathSelector, fileInputDrop, isSites) {
    if (isSites) {
      dropFileInputInSites();
    } else {
      dropFileInputInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + fileInputEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    // Check If Dialog Options Are Visible
    cy.get("[name='./multiSelection']")
    .should("exist");
    cy.get("[name='./accept']")
    .should("exist");

    // Checking some dynamic behaviours
    cy.get("[name='./multiSelection'][type=\"checkbox\"]").should("exist").check();
    cy.get(".cmp-adaptiveform-fileinput__minimumFiles").invoke('css', 'display').should('equal','block');
    cy.get(".cmp-adaptiveform-fileinput__maximumFiles").invoke('css', 'display').should('equal','block');
   // cy.get(".cmp-adaptiveform-base__placeholder").parent('div').invoke('css', 'display').should('equal','none');
    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(fileInputDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        fileInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/fileinput",
        fileInputEditPathSelector = "[data-path='" + fileInputEditPath + "']",
        fileInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formfileinput.split("/").pop();
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert FileInput in form container', function () {
      dropFileInputInContainer();
      cy.deleteComponentByPath(fileInputDrop);
    });

    it ('open edit dialog of FileInput', function(){
      testFileInputBehaviour(fileInputEditPathSelector, fileInputDrop);
    })
  })

  context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/fileinput",
        fileInputEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/fileinput",
        fileInputEditPathSelector = "[data-path='" + fileInputEditPath + "']",
        fileInputDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formfileinput.split("/").pop();

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms FileInput', function () {
      dropFileInputInSites();
      cy.deleteComponentByPath(fileInputDrop);
    });

    it('open edit dialog of aem forms FileInput', function() {
      testFileInputBehaviour(fileInputEditPathSelector, fileInputDrop, true);
    });

  });
});