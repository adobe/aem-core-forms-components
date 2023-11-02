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
 * Testing Image with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropImageInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image", afConstants.components.forms.resourceType.formimage);
    cy.get('body').click( 0,0);
  }

  const dropImageInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/image/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image", afConstants.components.forms.resourceType.formimage);
    cy.get('body').click( 0,0);
  }

  const testImageBehaviour = function(imageEditPathSelector, imageDrop, isSites) {
    if (isSites) {
      dropImageInSites();
    } else {
      dropImageInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
    // Check If Dialog Options Are Visible
    cy.get("[name='./jcr:description']")
    .should("exist");
    cy.get("[name='./file']")
    .should("exist");
    cy.get("[name='./altText']")
     .should("exist");
    cy.get("[name='./visible'][type=\"checkbox\"]").should("exist").check();
    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(imageDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        imageEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/image",
        imageEditPathSelector = "[data-path='" + imageEditPath + "']",
        imageDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formimage.split("/").pop();
    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert Image in form container', function () {
      dropImageInContainer();
      cy.deleteComponentByPath(imageDrop);
    });

    it ('open edit dialog of Image', function(){
      testImageBehaviour(imageEditPathSelector, imageDrop);
    })
  })

  context('Open Sites Editor', function () {
    const pagePath = "/content/core-components-examples/library/adaptive-form/image",
       imageEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/image",
       imageEditPathSelector = "[data-path='" + imageEditPath + "']",
       imageDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formimage.split("/").pop();

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms Image', function () {
      dropImageInSites();
      cy.deleteComponentByPath(imageDrop);
    });

    it('open edit dialog of aem forms Image', function() {
      testImageBehaviour(imageEditPathSelector, imageDrop, true);
    });

  });
});