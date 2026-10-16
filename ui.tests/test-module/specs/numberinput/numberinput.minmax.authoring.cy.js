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

const afConstants = require("../../libs/commons/formsConstants");
const sitesSelectors = require("../../libs/commons/sitesSelectors");

describe('Page - Authoring', function () {
    const dropNumberInputInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Number Input", afConstants.components.forms.resourceType.formnumberinput);
        cy.get('body').click(0, 0);
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            numberInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/numberinput",
            numberInputEditPathSelector = "[data-path='" + numberInputEditPath + "']",
            numberInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formnumberinput.split("/").pop(),
            numberInputBlockBemSelector = '.cmp-adaptiveform-numberinput',
            editDialogConfigurationSelector = "[data-action='CONFIGURE']";

        beforeEach(function () {
            cy.openAuthoring(pagePath);
        });

        it('shows inline error when minimum is set greater than maximum', function () {
            dropNumberInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + numberInputEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(numberInputBlockBemSelector + '__editdialog').contains('Validation').click();

            // Set maximum = 5, then minimum = 10 (invalid: min > max)
            cy.get(numberInputBlockBemSelector + '__maximum').find('input').clear().type('5');
            cy.focused().blur();
            cy.get(numberInputBlockBemSelector + '__minimum').find('input').clear().type('10');
            cy.focused().blur();

            // Both fields should be marked invalid
            cy.get(numberInputBlockBemSelector + '__minimum').should('have.attr', 'invalid');
            cy.get(numberInputBlockBemSelector + '__maximum').should('have.attr', 'invalid');

            // Fix by lowering minimum below maximum
            cy.get(numberInputBlockBemSelector + '__minimum').find('input').clear().type('3');
            cy.focused().blur();

            // Both fields should no longer be invalid
            cy.get(numberInputBlockBemSelector + '__minimum').should('not.have.attr', 'invalid');
            cy.get(numberInputBlockBemSelector + '__maximum').should('not.have.attr', 'invalid');

            cy.get('.cq-dialog-cancel').should('be.visible').click();
            cy.deleteComponentByPath(numberInputDrop);
        });

        it('blocks dialog save when minimum is greater than maximum', function () {
            dropNumberInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + numberInputEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(numberInputBlockBemSelector + '__editdialog').contains('Validation').click();

            // Set an invalid state: minimum > maximum
            cy.get(numberInputBlockBemSelector + '__maximum').find('input').clear().type('5');
            cy.focused().blur();
            cy.get(numberInputBlockBemSelector + '__minimum').find('input').clear().type('10');
            cy.focused().blur();

            // Attempt to save — dialog should remain open
            cy.get('.cq-dialog-submit').click();
            cy.get('coral-dialog[open]').should('exist');

            cy.get('.cq-dialog-cancel').should('be.visible').click();
            cy.deleteComponentByPath(numberInputDrop);
        });
    });
});
