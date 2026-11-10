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

const afConstants = require("../../libs/commons/formsConstants");
const sitesSelectors = require("../../libs/commons/sitesSelectors");

describe('Page - Authoring', function () {
    const dropSliderInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Slider", afConstants.components.forms.resourceType.formslider);
        cy.get('body').click(0, 0);
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            sliderEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/slider",
            sliderEditPathSelector = "[data-path='" + sliderEditPath + "']",
            sliderDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formslider.split("/").pop(),
            sliderBlockBemSelector = '.cmp-adaptiveform-slider',
            editDialogConfigurationSelector = "[data-action='CONFIGURE']";

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert Slider in form container', function () {
            dropSliderInContainer();
            cy.deleteComponentByPath(sliderDrop);
        });

        it('verify Basic and Validation tabs in edit dialog of Slider', function () {
            dropSliderInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + sliderEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(sliderBlockBemSelector + '__editdialog').contains('Validation').click().then(() => {
                cy.get("[name='./minimumMessage']").should("exist");
                cy.get("[name='./maximumMessage']").should("exist");
                cy.get("[name='./stepMessage']").should("exist");
                cy.get(sliderBlockBemSelector + '__editdialog').contains('Help Content').click().then(() => {
                    cy.get(sliderBlockBemSelector + '__editdialog').contains('Basic').click().then(() => {
                        cy.get("[name='./name']").should("exist");
                        cy.get("[name='./jcr:title']").should("exist");
                        cy.get("[name='./minimum']").should("exist");
                        cy.get("[name='./maximum']").should("exist");
                        cy.get("[name='./step']").should("exist");
                        cy.get("[name='./default']").should("exist");
                        cy.get('.cq-dialog-submit').should('be.visible');
                        cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                            cy.deleteComponentByPath(sliderDrop);
                        });
                    });
                });
            });
        });

        it('block saving when the minimum is not less than the maximum', function () {
            dropSliderInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + sliderEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(sliderBlockBemSelector + '__minimum input').clear().type("50");
            cy.get(sliderBlockBemSelector + '__maximum input').clear().type("10").blur();
            cy.get('.coral-Form-errorlabel').should('contain.text', 'Minimum value must be less than the maximum value.');
            cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                cy.deleteComponentByPath(sliderDrop);
            });
        });

        it('block saving when the step is not greater than 0', function () {
            dropSliderInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + sliderEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(sliderBlockBemSelector + '__step input').clear().type("0").blur();
            cy.get('.coral-Form-errorlabel').should('contain.text', 'Step must be greater than 0.');
            cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                cy.deleteComponentByPath(sliderDrop);
            });
        });
    });
})
