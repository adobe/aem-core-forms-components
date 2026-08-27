/*******************************************************************************
 * Copyright 2026 Adobe
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
 * Testing ImageChoice with Sites Editor
 */
describe('Page - Authoring', function () {

  const dropImageChoiceInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image Choice", afConstants.components.forms.resourceType.formimagechoice);
    cy.get('body').click(0, 0);
  }

  const dropImageChoiceInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/imagechoice/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image Choice", afConstants.components.forms.resourceType.formimagechoice);
    cy.get('body').click(0, 0);
  }

  const getPreviewIframeBody = () => {
    return cy
        .get('iframe#ContentFrame')
        .its('0.contentDocument.body').should('not.be.empty')
        .then(cy.wrap)
  }

  const testImageChoiceBehaviour = function(imageChoiceEditPathSelector, imageChoiceDrop, isSites) {
    if (isSites) {
      dropImageChoiceInSites();
    } else {
      dropImageChoiceInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageChoiceEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']");

    // Check If Dialog Options Are Visible
    cy.get("[name='./selectionType']")
        .should("exist");
    cy.get("[name='./type']")
        .should("exist");
    cy.get("[name='./enum']")
        .should("exist");
    cy.get("[name='./enumNames']")
        .should("exist");

    // Image source multifield should exist
    cy.get(".cmp-adaptiveform-imagechoice__imagesrc").should("exist");

    // Orientation options should exist
    cy.get('input[name="./orientation"][value="horizontal"]').should("exist");
    cy.get('input[name="./orientation"][value="vertical"]').should("exist");

    // Checking some dynamic behaviours
    cy.get("[data-granite-coral-multifield-name='./enum'] coral-button-label:contains('Add')").should("exist");

    // verifying prefill data is working for enum and enumNames
    cy.get('input[name="./enum"]').should('have.length', 2);
    cy.get('input[name="./enum"]').first().should('have.value', 0);
    cy.get('input[name="./enumNames"]').should('have.length', 2);
    cy.get('input[name="./enumNames"]').first().should('have.value', "Option 1");

    // selecting number as data type
    cy.get('.cmp-adaptiveform-imagechoice__type').should("exist").click();
    cy.get('coral-selectlist-item[value="number"]').should("exist").click();

    // selecting vertical alignment as orientation
    cy.get('input[name="./orientation"][value="vertical"]').should("exist").click();

    // saving the dialog with changes
    cy.get('.cq-dialog-submit').click();

    // verifying alignment change in preview editor
    getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice__widget.vertical').should('have.length', 1);
    getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice__option').should('have.length', 2);

    cy.deleteComponentByPath(imageChoiceDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        imageChoicePath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/imagechoice",
        imageChoiceEditPathSelector = "[data-path='" + imageChoicePath + "']",
        imageChoiceDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formimagechoice.split("/").pop();

    beforeEach(function () {
      cy.openAuthoring(pagePath);
    });

    it('insert ImageChoice in form container', function () {
      cy.cleanTest(imageChoiceDrop).then(function() {
        dropImageChoiceInContainer();
        cy.deleteComponentByPath(imageChoiceDrop);
      });
    });

    it('open edit dialog of ImageChoice', { retries: 3 }, function () {
      cy.cleanTest(imageChoiceDrop).then(function() {
        testImageChoiceBehaviour(imageChoiceEditPathSelector, imageChoiceDrop);
      });
    });

    it('verify selection type toggle between single and multi', { retries: 3 }, function () {
      cy.cleanTest(imageChoiceDrop).then(function() {
        dropImageChoiceInContainer();
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageChoiceEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");

        // default should be single select
        cy.get('.cmp-adaptiveform-imagechoice__selectiontype').should("exist");

        // switch to multi select
        cy.get('.cmp-adaptiveform-imagechoice__selectiontype').click();
        cy.get('coral-selectlist-item[value="multi"]').click();

        cy.get('.cq-dialog-submit').click();

        // verify multi select renders checkboxes
        getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice').should('exist');
        getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice')
            .invoke('attr', 'data-cmp-selection-type').should('eq', 'multi');
        getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice input[type="checkbox"]').should('have.length', 2);

        cy.deleteComponentByPath(imageChoiceDrop);
      });
    });

    it('verify image source multifield in dialog', { retries: 3 }, function () {
      cy.cleanTest(imageChoiceDrop).then(function() {
        dropImageChoiceInContainer();
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageChoiceEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");

        // image source multifield should be present
        cy.get(".cmp-adaptiveform-imagechoice__imagesrc").should("exist");
        // add an image source entry
        cy.get(".cmp-adaptiveform-imagechoice__imagesrc coral-button-label:contains('Add')").should("exist").click({ force: true });
        cy.get('.cmp-adaptiveform-imagechoice__imagesrc input[name="./imageSrc"]').should('have.length.at.least', 1);

        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(imageChoiceDrop);
      });
    });

    it('check for duplicate enum values', { retries: 3 }, function () {
      cy.cleanTest(imageChoiceDrop).then(function() {
        dropImageChoiceInContainer();
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageChoiceEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");

        cy.get("[data-granite-coral-multifield-name='./enum'] coral-button-label:contains('Add')").should("exist").click({ force: true });
        cy.get('input[name="./enum"]').last().invoke('val', '0');
        cy.get('input[name="./enumNames"]').last().invoke('val', 'Item 3');
        cy.get('.cq-dialog-submit').click().then(() => {
          cy.get('.cq-dialog-submit').should('not.exist')
        });
        getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice__option').should('have.length', 2);
        getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice').parent().parent().contains('Item 3');
        getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice').parent().parent().contains('Option 2');
        getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice').parent().parent().contains('Option 1').should('not.exist');
        cy.deleteComponentByPath(imageChoiceDrop);
      });
    });
  });

  context('Open Sites Editor', function () {
    const pagePath = "/content/core-components-examples/library/adaptive-form/imagechoice",
        imageChoiceEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/imagechoice",
        imageChoiceEditPathSelector = "[data-path='" + imageChoiceEditPath + "']",
        imageChoiceDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formimagechoice.split("/").pop();

    beforeEach(function () {
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms ImageChoice', function () {
      dropImageChoiceInSites();
      cy.deleteComponentByPath(imageChoiceDrop);
    });

  });
});
