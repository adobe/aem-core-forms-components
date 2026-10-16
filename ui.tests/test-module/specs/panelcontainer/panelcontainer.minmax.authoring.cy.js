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
    const dropPanelContainerInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Panel", afConstants.components.forms.resourceType.panelcontainer);
        cy.get('body').click(0, 0);
    };

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            panelContainerEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/panelcontainer",
            panelContainerEditPathSelector = "[data-path='" + panelContainerEditPath + "']",
            panelContainerDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.panelcontainer.split("/").pop(),
            editDialogConfigurationSelector = "[data-action='CONFIGURE']",
            minField = '.cmp-adaptiveform-panelcontainer__minOccur coral-numberinput',
            maxField = '.cmp-adaptiveform-panelcontainer__maxOccur coral-numberinput';

        beforeEach(function () {
            cy.openAuthoring(pagePath);
        });

        it('shows inline error when minimum occurrences is set greater than maximum occurrences', function () {
            dropPanelContainerInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + panelContainerEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get('.cmp-adaptiveform-panelcontainer__editdialog').contains('Repeat Panel').click();

            // Enable repeatability to unlock min/max occurrence fields
            cy.get('.cmp-adaptiveform-panelcontainer__repeatable coral-switch').click();
            cy.get(maxField).should('not.have.attr', 'disabled');

            // Set maximum = 5, then minimum = 10 (invalid: min > max)
            cy.get(maxField).find('input').clear().type('5');
            cy.focused().blur();
            cy.get(minField).find('input').clear().type('10');
            cy.focused().blur();

            // Both fields should be marked invalid
            cy.get(minField).should('have.attr', 'invalid');
            cy.get(maxField).should('have.attr', 'invalid');

            // Fix by lowering minimum below maximum
            cy.get(minField).find('input').clear().type('3');
            cy.focused().blur();

            // Both fields should no longer be invalid
            cy.get(minField).should('not.have.attr', 'invalid');
            cy.get(maxField).should('not.have.attr', 'invalid');

            cy.get('.cq-dialog-cancel').should('be.visible').click();
            cy.deleteComponentByPath(panelContainerDrop);
        });

        it('blocks dialog save when minimum occurrences is greater than maximum occurrences', function () {
            dropPanelContainerInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + panelContainerEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get('.cmp-adaptiveform-panelcontainer__editdialog').contains('Repeat Panel').click();

            // Enable repeatability to unlock min/max occurrence fields
            cy.get('.cmp-adaptiveform-panelcontainer__repeatable coral-switch').click();
            cy.get(maxField).should('not.have.attr', 'disabled');

            // Set an invalid state: minimum > maximum
            cy.get(maxField).find('input').clear().type('5');
            cy.focused().blur();
            cy.get(minField).find('input').clear().type('10');
            cy.focused().blur();

            // Attempt to save — dialog should remain open
            cy.get('.cq-dialog-submit').click();
            cy.get('coral-dialog[open]').should('exist');

            cy.get('.cq-dialog-cancel').should('be.visible').click();
            cy.deleteComponentByPath(panelContainerDrop);
        });
    });
});
