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
 * Testing CheckBoxGroup with Sites Editor
 */
describe('Page - Authoring', function () {
  // we can use these values to log in

  const dropCheckBoxGroupInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form CheckBox Group", afConstants.components.forms.resourceType.formcheckboxgroup);
    cy.get('body').click( 0,0);
  }

  const dropTextInputInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/textinput/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form CheckBox Group", afConstants.components.forms.resourceType.formtextinput);
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

  const getRuleEditorIframe = () => {
      // get the iframe > document > body
      // and retry until the body element is not empty
      return cy
          .get('iframe#af-rule-editor')
          .its('0.contentDocument.body').should('not.be.empty')
          .then(cy.wrap)
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
    cy.get("[name='./enum']")
    .should("exist");
    cy.get("[name='./enumNames']")
    .should("exist");

    // Checking some dynamic behaviours
    cy.get("[name='./required'][type=\"checkbox\"]").should("exist");
    cy.get("[data-granite-coral-multifield-name='./enum'] coral-button-label:contains('Add')").should("exist");

    // verifying prefill data is working for enum and enumNames
    cy.get('input[name="./enum"]').should('have.length', 2);
    cy.get('input[name="./enum"]').first().should('have.value', 0);
    cy.get('input[name="./enumNames"]').should('have.length', 2);
    cy.get('input[name="./enumNames"]').first().should('have.value', "Item 1");

    // selecting number as type of the checkbox
    cy.get('.cmp-adaptiveform-checkboxgroup__type').should("exist").click();
    cy.get('coral-selectlist-item[value="number[]"]').should("exist").click();

    // selecting vertical alignment as an orientation
    cy.get('input[name="./orientation"][value="vertical"]').should("exist").click();

    // saving the dialog with changes
    cy.get('.cq-dialog-submit').click();

    // verifying alignment change in preview editor
    getPreviewIframeBody().find('.cmp-adaptiveform-checkboxgroup__widget.VERTICAL').should('have.length',1);
    getPreviewIframeBody().find('.cmp-adaptiveform-checkboxgroup-item').should('have.length',2);

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

    it ('open edit dialog of CheckboxGroup', { retries: 3 }, function(){
        cy.cleanTest(checkBoxGroupDrop).then(function() {
            testCheckBoxGroupBehaviour(checkBoxGroupEditPathSelector, checkBoxGroupDrop);
        });
    });

    it ('check value type validations', { retries: 3 }, function() {
        cy.cleanTest(checkBoxGroupDrop).then(function() {
            // For Number Type
            dropCheckBoxGroupInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + checkBoxGroupEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get('.cmp-adaptiveform-checkboxgroup__type').click();
            cy.get("coral-selectlist-item-content").contains('Number').should('be.visible').click({force: true});

            cy.get('.cmp-adaptiveform-checkboxgroup__value button').click();
            cy.get(".cmp-adaptiveform-checkboxgroup__value input").invoke('val', 'Not a Number');
            cy.get('.cq-dialog-submit').click();
            cy.get('._coral-Tooltip-label').should('contain.text', 'Value Type Mismatch');

            cy.get('.cq-dialog-cancel').should('be.visible').click({force: true});
            cy.get('.cq-dialog-cancel').should('not.exist');
            cy.deleteComponentByPath(checkBoxGroupDrop);

            // For Boolean
            dropCheckBoxGroupInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + checkBoxGroupEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get('.cmp-adaptiveform-checkboxgroup__type').click();
            cy.get("coral-selectlist-item-content").contains('Boolean').should('be.visible').click({force: true});

            cy.get('.cmp-adaptiveform-checkboxgroup__value button').click();
            cy.get(".cmp-adaptiveform-checkboxgroup__value input").invoke('val', 'Not a Boolean');
            cy.get('.cq-dialog-submit').click();
            cy.get('._coral-Tooltip-label').should('contain.text', 'Value Type Mismatch');

            cy.get('.cq-dialog-cancel').should('be.visible').click({force: true});
            cy.get('.cq-dialog-cancel').should('not.exist');
            cy.deleteComponentByPath(checkBoxGroupDrop);
        });
    })

    it ('check for duplicate enum values', { retries: 3 }, function() {
        cy.cleanTest(checkBoxGroupDrop).then(function() {
            dropCheckBoxGroupInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + checkBoxGroupEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get("[data-granite-coral-multifield-name='./enum'] coral-button-label:contains('Add')").should("exist").click({force: true});
            cy.get('input[name="./enum"]').last().invoke('val', '0');
            cy.get('input[name="./enumNames"]').last().invoke('val', 'Item 3');
            cy.get('.cq-dialog-submit').click().then(() => {
                cy.get('.cq-dialog-submit').should('not.exist')
            });
            getPreviewIframeBody().find('.cmp-adaptiveform-checkboxgroup-item').should('have.length', 2);
            getPreviewIframeBody().find('.cmp-adaptiveform-checkboxgroup').parent().parent().contains('Item 3');
            getPreviewIframeBody().find('.cmp-adaptiveform-checkboxgroup').parent().parent().contains('Item 2');
            getPreviewIframeBody().find('.cmp-adaptiveform-checkboxgroup').parent().parent().contains('Item 1').should('not.exist');
            cy.deleteComponentByPath(checkBoxGroupDrop);
        });
    });

    it('check rich text support for label', function(){
        dropCheckBoxGroupInContainer();
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + checkBoxGroupEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get("div[name='richTextTitle']").should('not.be.visible');

        // check rich text selector and see if RTE is visible for title.
        cy.get('.cmp-adaptiveform-base__istitlerichtext').should('exist').click();
        cy.get("div[name='richTextTitle']").scrollIntoView();
        cy.get("div[name='richTextTitle']").should('be.visible');

        // check rich text selector and see if RTE is visible for enum names.
        cy.get(".cmp-adaptiveform-base__richTextEnumNames").first().should('not.be.visible');
        cy.get('.cmp-adaptiveform-base__areOptionsRichText').should('exist').click();
        cy.get("div[name='richTextEnumNames']").then(($el) => {
            $el[0].scrollIntoView();
        })
        cy.get("[data-cq-richtext-editable='true'][data-wrapperclass='cmp-adaptiveform-base__richTextEnumNames']").eq(0).focus().clear().type("Select 1");
        cy.get("div[name='richTextEnumNames']").first().should('be.visible');
        cy.get(".cmp-adaptiveform-base__richTextEnumNames").first().should('be.visible');
        cy.get('.cq-dialog-submit').click({ force: true });
        getPreviewIframeBody().find('.cmp-adaptiveform-checkboxgroup-item').should('have.length',2);
        getPreviewIframeBody().find('.cmp-adaptiveform-checkboxgroup').parent().parent().contains('Select 1');
        getPreviewIframeBody().find('.cmp-adaptiveform-checkboxgroup').parent().parent().contains('Item 2');
    });

    it('check rich text inline editor is present', function(){
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + checkBoxGroupEditPathSelector);
        cy.invokeEditableAction("[data-action='EDIT']");
        cy.get(".rte-toolbar").should('be.visible');
        cy.get('.rte-toolbar-item[title="Close"]').should('be.visible').click();
    });

    // adding retry since rule editor sometimes does not open at first try
    it('rule editor is working with rich text enum names', { retries: 3 }, function(){
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + checkBoxGroupEditPathSelector);
        cy.invokeEditableAction("[data-action='editexpression']");
        cy.get("#af-rule-editor").should("be.visible");
        getRuleEditorIframe().find("#objectNavigationTree").should("be.visible");
        getRuleEditorIframe().find("#create-rule-button").click();
        getRuleEditorIframe().find('#create-rule-button').then(($el) => {
            $el[0].click();
            getRuleEditorIframe().find('.child-choice-name').click();
            getRuleEditorIframe().find('coral-selectlist-item[value="EVENT_SCRIPTS"]').then(($el) => {
                $el[0].scrollIntoView();
                $el[0].click();
                getRuleEditorIframe().find('.EVENT_AND_COMPARISON_OPERATOR').then(($el) => {
                    $el[0].click();
                    getRuleEditorIframe().find('coral-selectlist-item[value="CONTAINS"]').then(($el) => {
                        $el[0].click();
                        getRuleEditorIframe().find('.PRIMITIVE_EXPRESSION .NUMERIC_LITERAL button').then(($el) => {
                            $el[0].click();
                            getRuleEditorIframe().find('[handle="selectList"] coral-list-item-content').first().should("have.text", "Select 1");
                        });
                    });
                });
            });
            getRuleEditorIframe().find('.exp-Close-Button').then(($el) => {
                $el[0].click();
            });
        });
    });
  });
/*
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

  });*/
});