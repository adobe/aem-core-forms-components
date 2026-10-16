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
    const dropDatePickerInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Date Picker", afConstants.components.forms.resourceType.datepicker);
        cy.get('body').click(0, 0);
    };

    const setDatePickerValue = function (selector, isoDate) {
        cy.get(selector).then(($el) => {
            $el[0].value = isoDate;
            $el[0].dispatchEvent(new Event('change', { bubbles: true }));
        });
    };

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            datePickerEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/datepicker",
            datePickerEditPathSelector = "[data-path='" + datePickerEditPath + "']",
            datePickerDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.datepicker.split("/").pop(),
            editDialogConfigurationSelector = "[data-action='CONFIGURE']",
            minField = '.cmp-adaptiveform-datepicker__mindate coral-datepicker',
            maxField = '.cmp-adaptiveform-datepicker__maxdate coral-datepicker';

        beforeEach(function () {
            cy.openAuthoring(pagePath);
        });

        it('shows inline error when minimum date is set after maximum date', function () {
            dropDatePickerInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + datePickerEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get('.cmp-adaptiveform-datepicker__editdialog').contains('Validation').click();

            // Set max = 2024-01-10, then min = 2024-01-20 (invalid: min after max)
            setDatePickerValue(maxField, '2024-01-10');
            setDatePickerValue(minField, '2024-01-20');

            // Both fields should be marked invalid
            cy.get(minField).should('have.attr', 'invalid');
            cy.get(maxField).should('have.attr', 'invalid');

            // Fix by setting min before max
            setDatePickerValue(minField, '2024-01-05');

            // Both fields should no longer be invalid
            cy.get(minField).should('not.have.attr', 'invalid');
            cy.get(maxField).should('not.have.attr', 'invalid');

            cy.get('.cq-dialog-cancel').should('be.visible').click();
            cy.deleteComponentByPath(datePickerDrop);
        });

        it('blocks dialog save when minimum date is after maximum date', function () {
            dropDatePickerInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + datePickerEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get('.cmp-adaptiveform-datepicker__editdialog').contains('Validation').click();

            // Set an invalid state: min after max
            setDatePickerValue(maxField, '2024-01-10');
            setDatePickerValue(minField, '2024-01-20');

            // Attempt to save — dialog should remain open
            cy.get('.cq-dialog-submit').click();
            cy.get('coral-dialog[open]').should('exist');

            cy.get('.cq-dialog-cancel').should('be.visible').click();
            cy.deleteComponentByPath(datePickerDrop);
        });
    });
});
