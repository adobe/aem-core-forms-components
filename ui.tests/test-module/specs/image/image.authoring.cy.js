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
  let toggle_array = [];
  const FT_NGDM_IMAGE_PICKER = "FT_FORMS-26424";

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
    cy.get("[name='./name']")
      .should("exist");
    cy.get("[name='./dataRef']")
        .should("exist");
    cy.get("[name='./readOnly']")
        .should("not.exist");
    cy.get("[name='./unboundFormElement']")
        .should("not.exist");
    cy.get("[name='./dorBindRef']")
        .should("not.exist");
    cy.get("[name='./visible'][type=\"checkbox\"]").should("exist").check();
    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(imageDrop);
  }

  // FT_FORMS-26424 (Next Gen Dynamic Media): the image dialog renders one of two
  // fileupload widgets via granite:rendercondition -
  //   - "file" (NGDM), when the toggle is ON, shows a "Pick" split-button dropdown
  //     (`.polaris-dropdown` / `.polaris-dd-menu`) offering "Local" and "Remote" asset sources.
  //   - "fileLegacy", when the toggle is OFF, shows a plain "Pick" button with no dropdown.
  const testImageFilePickerBehaviour = function(imageEditPathSelector, imageDrop, isSites) {
    if (isSites) {
      dropImageInSites();
    } else {
      dropImageInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']");
    cy.get("[name='./file']").should("exist");
    if (toggle_array.includes(FT_NGDM_IMAGE_PICKER)) {
      // NGDM picker: dropdown with Local/Remote options
      cy.get("[name='./file'] .polaris-dropdown .polaris-dd-button").should("exist").and("contain.text", "Pick");
      cy.get("[name='./file'] .polaris-dd-menu li.cq-FileUpload-picker").should("exist").and("contain.text", "Local");
      cy.get("[name='./file'] .polaris-dd-menu li.cq-FileUpload-picker-polaris").should("exist").and("contain.text", "Remote");
    } else {
      // Legacy picker: plain Pick button, no dropdown
      cy.get("[name='./file'] .polaris-dropdown").should("not.exist");
      cy.get("[name='./file'] button.cq-FileUpload-picker").first().should("exist").and("contain.text", "Pick");
    }
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
      cy.fetchFeatureToggles().then((response) => {
        if (response.status === 200) {
          toggle_array = response.body.enabled;
        }
      });
    });

    it('insert Image in form container', function () {
      dropImageInContainer();
      cy.deleteComponentByPath(imageDrop);
    });

    it ('open edit dialog of Image', function(){
      testImageBehaviour(imageEditPathSelector, imageDrop);
    });

    it('check rich text support for label', function(){
      dropImageInContainer();
      cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageEditPathSelector);
      cy.invokeEditableAction("[data-action='CONFIGURE']");
      //rich text shouldn't be present in image component
      cy.get("div[name='richTextTitle']").should('not.exist');
      cy.get('.cmp-adaptiveform-base__istitlerichtext').should('not.exist');
      cy.get('.cq-dialog-cancel').click();
      cy.deleteComponentByPath(imageDrop);
    });

    it('verify file picker widget based on FT_FORMS-26424 (NGDM) toggle', function(){
      testImageFilePickerBehaviour(imageEditPathSelector, imageDrop);
    });
  });

  context('Open Sites Editor', function () {
    const pagePath = "/content/core-components-examples/library/adaptive-form/image",
       imageEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/image",
       imageEditPathSelector = "[data-path='" + imageEditPath + "']",
       imageDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formimage.split("/").pop();

    beforeEach(function () {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
      cy.fetchFeatureToggles().then((response) => {
        if (response.status === 200) {
          toggle_array = response.body.enabled;
        }
      });
    });

    it('insert aem forms Image', function () {
      dropImageInSites();
      cy.deleteComponentByPath(imageDrop);
    });

    it('open edit dialog of aem forms Image', function() {
      testImageBehaviour(imageEditPathSelector, imageDrop, true);
    });

    it('verify file picker widget based on FT_FORMS-26424 (NGDM) toggle', function(){
      testImageFilePickerBehaviour(imageEditPathSelector, imageDrop, true);
    });

  });
});