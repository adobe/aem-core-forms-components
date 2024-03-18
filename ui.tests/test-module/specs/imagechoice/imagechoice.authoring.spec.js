/*
 *  Copyright 2024 Adobe Systems Incorporated
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
 * Testing ImageChoice with Sites Editor
 */
describe('Page - Authoring', function () {
    // we can use these values to log in

    const dropImageChoiceInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image Choice", afConstants.components.forms.resourceType.formimagechoice);
        cy.get('body').click(0, 0);
    }

    const dropTextInputInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/textinput/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image Choice", afConstants.components.forms.resourceType.formtextinput);
        cy.get('body').click(0, 0);
    }

    const getPreviewIframeBody = () => {
        // get the iframe > document > body
        // and retry until the body element is not empty
        return cy
        .get('iframe#ContentFrame')
        .its('0.contentDocument.body').should('not.be.empty')
        .then(cy.wrap)
    }

    const testImageChoiceBehaviour = function (imageChoiceEditPathSelector, imageChoiceDrop, isSites) {
        if (isSites) {
            dropTextInputInSites();
        } else {
            dropImageChoiceInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageChoiceEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get("[name='./type@Delete']")
        .should("exist");

        // Checking some dynamic behaviours
        cy.get("[name='./required'][type=\"checkbox\"]").should("exist");
        cy.get("[data-granite-coral-multifield-name='./options'] coral-button-label:contains('Add')").should("exist");

        // selecting number as type of the checkbox
        cy.get('.cmp-adaptiveform-imagechoice__type').should("exist").click();
        cy.get('coral-selectlist-item[value="number[]"]').should("exist").click();

        // selecting vertical alignment as an orientation
        cy.get('input[name="./orientation"][value="vertical"]').should("exist").click();

        // selecting multiple as type of the selectionType dropdown
        cy.get('.cmp-adaptiveform-imagechoice__selectionType').should("exist").click();
        cy.get('coral-selectlist-item[value="multiple"]').should("exist").click();

        // saving the dialog with changes
        cy.get('.cq-dialog-submit').click();

        // verifying alignment change in preview editor
        getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice__widget.VERTICAL').should('have.length', 1);
        getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice__option').should('have.length', 0);

        cy.deleteComponentByPath(imageChoiceDrop);
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
        imageChoicePath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/imagechoice",
        imageChoiceEditPathSelector = "[data-path='" + imageChoicePath + "']",
        imageChoiceDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formimagechoice.split("/").pop();
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert ImageChoice in form container', function () {
            dropImageChoiceInContainer();
            cy.deleteComponentByPath(imageChoiceDrop);
        });

        it('open edit dialog of ImageChoice', {
            retries: 3
        }, function () {
            cy.cleanTest(imageChoiceDrop).then(function () {
                testImageChoiceBehaviour(imageChoiceEditPathSelector, imageChoiceDrop);
            });
        });

        it('check value type validations', function () {
            // For Number Type
            dropImageChoiceInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageChoiceEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get('.cmp-adaptiveform-imagechoice__type').click();
            cy.get("coral-selectlist-item-content").contains('Number').should('be.visible').click({
                force: true
            });

            cy.get('.cmp-adaptiveform-imagechoice__value button').click();
            cy.get(".cmp-adaptiveform-imagechoice__value input").invoke('val', 'Not a Number');
            cy.get('.cq-dialog-submit').click();
            cy.get('._coral-Tooltip-label').should('contain.text', 'Value Type Mismatch');

            cy.get('.cq-dialog-cancel').click();
            cy.deleteComponentByPath(imageChoiceDrop);

            // For Boolean
            dropImageChoiceInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageChoiceEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get('.cmp-adaptiveform-imagechoice__type').click();
            cy.get("coral-selectlist-item-content").contains('Boolean').should('be.visible').click({
                force: true
            });

            cy.get('.cmp-adaptiveform-imagechoice__value button').click();
            cy.get(".cmp-adaptiveform-imagechoice__value input").invoke('val', 'Not a Boolean');
            cy.get('.cq-dialog-submit').click();
            cy.get('._coral-Tooltip-label').should('contain.text', 'Value Type Mismatch');

            cy.get('.cq-dialog-cancel').click();
            cy.deleteComponentByPath(imageChoiceDrop);
        })

        it('add options to image choice - single select', function () {
            dropImageChoiceInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageChoiceEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get("[data-granite-coral-multifield-name='./options'] coral-button-label:contains('Add')").should("exist").click({
                force: true
            });

            cy.get('input[name*="options/item"][name*="/imageValue"]').last().invoke('val', '1');
            cy.get('input[name*="options/item"][name*="/altText"]').last().invoke('val', 'corecompoLogo');
            cy.get('foundation-autocomplete[name="./options/item0/./imageSrc"]')
            .find('input[type="hidden"][name="./options/item0/./imageSrc"]')
            .invoke('val', '/content/dam/core-components-examples/library/aem-corecomponents-logo.svg', {
                force: true
            })
            .trigger('change', {
                force: true
            });
            cy.get("[data-granite-coral-multifield-name='./options'] coral-button-label:contains('Add')").should("exist").click({
                force: true
            });
            cy.get('input[name*="options/item"][name*="/imageValue"]').last().invoke('val', '2');
            cy.get('input[name*="options/item"][name*="/altText"]').last().invoke('val', 'corecomponentLogo');
            cy.get('foundation-autocomplete[name="./options/item1/./imageSrc"]')
            .find('input[type="hidden"][name="./options/item1/./imageSrc"]')
            .invoke('val', '/content/dam/core-components-examples/library/adobe-logo.svg', {
                force: true
            })
            .trigger('change', {
                force: true
            });
            cy.get('.cq-dialog-submit').click().then(() => {
                cy.get('.cq-dialog-submit').should('not.exist')
            });
            //getPreviewIframeBody().find('.cmp-adaptiveform-imagechoice__option').should('have.length', 0);
            cy.deleteComponentByPath(imageChoiceDrop);
        });

        it('add options to image choice - multiple select', function () {
            dropImageChoiceInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + imageChoiceEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");

            // selecting multiple as type of the selectionType dropdown
            cy.get('.cmp-adaptiveform-imagechoice__selectionType').should("exist").click();
            cy.get('coral-selectlist-item[value="multiple"]').should("exist").click();

            cy.get("[data-granite-coral-multifield-name='./options'] coral-button-label:contains('Add')").should("exist").click({
                force: true
            });

            cy.get('input[name*="options/item"][name*="/imageValue"]').last().invoke('val', '1');
            cy.get('input[name*="options/item"][name*="/altText"]').last().invoke('val', 'corecomponentLogo');
            cy.get('foundation-autocomplete[name="./options/item0/./imageSrc"]')
            .find('input[type="hidden"][name="./options/item0/./imageSrc"]')
            .invoke('val', '/content/dam/core-components-examples/library/aem-corecomponents-logo.svg', {
                force: true
            })
            .trigger('change', {
                force: true
            });
            cy.get("[data-granite-coral-multifield-name='./options'] coral-button-label:contains('Add')").should("exist").click({
                force: true
            });
            cy.get('input[name*="options/item"][name*="/imageValue"]').last().invoke('val', '2');
            cy.get('input[name*="options/item"][name*="/altText"]').last().invoke('val', 'adobeLogo');
            cy.get('foundation-autocomplete[name="./options/item1/./imageSrc"]')
            .find('input[type="hidden"][name="./options/item1/./imageSrc"]')
            .invoke('val', '/content/dam/core-components-examples/library/adobe-logo.svg', {
                force: true
            })
            .trigger('change', {
                force: true
            });
            cy.get('.cq-dialog-submit').click().then(() => {
                cy.get('.cq-dialog-submit').should('not.exist')
            });
            cy.deleteComponentByPath(imageChoiceDrop);
        });

    })
});
