/*******************************************************************************
 * Copyright 2024 Adobe
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
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Numeric Stepper", afConstants.components.forms.resourceType.formnumberstepper);
        cy.get('body').click(0, 0);
    }

    const dropNumberInputInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/numberstepper/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Numeric Stepper", afConstants.components.forms.resourceType.formnumberstepper);
        cy.get('body').click(0, 0);
    }


    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            numberStepperEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/numberstepper",
            numberStepperEditPathSelector = "[data-path='" + numberStepperEditPath + "']",
            numberStepperDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formnumberstepper.split("/").pop(),
            numberStepperBlockBemSelector = '.cmp-adaptiveform-numberstepper',
            editDialogConfigurationSelector = "[data-action='CONFIGURE']";
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert NumberStepper in form container', function () {
            dropNumberInputInContainer();
            cy.deleteComponentByPath(numberStepperDrop);
        });

        it('verify Basic tab in edit dialog of NumberStepper', function () {
            dropNumberInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + numberStepperEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(numberStepperBlockBemSelector + '__editdialog').contains('Validation').click().then(() => {
                cy.get(numberStepperBlockBemSelector + '__editdialog').contains('Help Content').click().then(() => {
                    cy.get(numberStepperBlockBemSelector + '__editdialog').contains('Accessibility').click().then(() => {
                            cy.get(numberStepperBlockBemSelector + '__editdialog').contains('Basic').click().then(() => {
                                cy.get("[name='./name']").should("exist");
                                cy.get("[name='./jcr:title']").should("exist");
                                cy.get("[name='./hideTitle']").should("exist");
                                cy.get("[name='./placeholder']").should("exist");
                                cy.get("[name='./default']").should("exist");
                                cy.get("[name='./minimum']").should("exist");
                                cy.get("[name='./exclusiveMinimum']").should("exist");
                                cy.get("[name='./maximum']").should("exist");
                                cy.get("[name='./exclusiveMaximum']").should("exist");
                                cy.get('.cq-dialog-submit').should('be.visible');
                                cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                                    cy.deleteComponentByPath(numberStepperDrop);
                                });
                            })
                       })     
                   })
               });
           });
       });

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/numberstepper",
            numberStepperEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/numberstepper",
            numberStepperEditPathSelector = "[data-path='" + numberStepperEditPath + "']",
            editDialogConfigurationSelector = "[data-action='CONFIGURE']",
            numberStepperDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formnumberstepper.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms NumberStepper', function () {
            dropNumberInputInSites();
            cy.deleteComponentByPath(numberStepperDrop);
        });

        it('open edit dialog of aem forms NumberStepper', {retries: 3}, function () {
            cy.cleanTest(numberStepperDrop).then(function () {
                dropNumberInputInSites();
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + numberStepperEditPathSelector);
                cy.invokeEditableAction("[data-action='CONFIGURE']");
                cy.get("[name='./name']").should("exist").then(() => {
                    cy.get("[name='./jcr:title']").should("exist");
                    cy.get("[name='./hideTitle']").should("exist");
                    cy.get("[name='./placeholder']").should("exist");
                    cy.get("[name='./default']").should("exist");
                    cy.get("[name='./minimum']").should("exist");
                    cy.get("[name='./exclusiveMinimum']").should("exist");
                    cy.get("[name='./maximum']").should("exist");
                    cy.get("[name='./exclusiveMaximum']").should("exist");
                    cy.get('.cq-dialog-submit').should('be.visible');
                    cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                        cy.deleteComponentByPath(numberStepperDrop);
                    })
                })


                // this line is causing frame busting which is causing cypress to fail

            });
        });

    });
})