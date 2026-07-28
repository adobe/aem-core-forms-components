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

describe('Page - Authoring', function () {
    const dropTextInputInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
        cy.get('body').click(0, 0);
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            textInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/textinput",
            textInputEditPathSelector = "[data-path='" + textInputEditPath + "']",
            textInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formtextinput.split("/").pop();

        beforeEach(function () {
            cy.openAuthoring(pagePath);
        });

        it('shows inline error when minLength is set greater than maxLength', function () {
            dropTextInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get('.cmp-adaptiveform-textinput__editdialog').contains('Validation').click({force: true});

            // Set maxLength = 5, then minLength = 10 (invalid: min > max)
            cy.get('.cmp-adaptiveform-textinput__maxlength coral-numberinput').find('input').clear().type('5');
            cy.focused().blur();
            cy.get('.cmp-adaptiveform-textinput__minlength coral-numberinput').find('input').clear().type('10');
            cy.focused().blur();

            // Both fields should be marked invalid
            cy.get('.cmp-adaptiveform-textinput__minlength coral-numberinput').should('have.attr', 'invalid');
            cy.get('.cmp-adaptiveform-textinput__maxlength coral-numberinput').should('have.attr', 'invalid');

            // Fix by lowering minLength below maxLength
            cy.get('.cmp-adaptiveform-textinput__minlength coral-numberinput').find('input').clear().type('3');
            cy.focused().blur();

            // Both fields should no longer be invalid
            cy.get('.cmp-adaptiveform-textinput__minlength coral-numberinput').should('not.have.attr', 'invalid');
            cy.get('.cmp-adaptiveform-textinput__maxlength coral-numberinput').should('not.have.attr', 'invalid');

            cy.get('.cq-dialog-cancel').should('be.visible').click();
            cy.deleteComponentByPath(textInputDrop);
        });

        it('blocks dialog save when minLength is greater than maxLength', function () {
            dropTextInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get('.cmp-adaptiveform-textinput__editdialog').contains('Validation').click({force: true});

            // Set an invalid state: minLength > maxLength
            cy.get('.cmp-adaptiveform-textinput__maxlength coral-numberinput').find('input').clear().type('5');
            cy.focused().blur();
            cy.get('.cmp-adaptiveform-textinput__minlength coral-numberinput').find('input').clear().type('10');
            cy.focused().blur();

            // Attempt to save — dialog should remain open
            cy.get('.cq-dialog-submit').click();
            cy.get('coral-dialog[open]').should('exist');

            cy.get('.cq-dialog-cancel').should('be.visible').click();
            cy.deleteComponentByPath(textInputDrop);
        });
    });
});
