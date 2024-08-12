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

    const dropNumberInputInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/numberinput/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
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
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert NumberInput in form container', function () {
            dropNumberInputInContainer();
            cy.deleteComponentByPath(numberInputDrop);
        });

        it('verify Basic tab in edit dialog of NumberInput', function () {
            dropNumberInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + numberInputEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(numberInputBlockBemSelector + '__editdialog').contains('Validation').click().then(() => {
                cy.get(numberInputBlockBemSelector + '__editdialog').contains('Help Content').click().then(() => {
                    cy.get(numberInputBlockBemSelector + '__editdialog').contains('Accessibility').click().then(() => {
                        cy.get(numberInputBlockBemSelector + '__editdialog').contains('Formats').click().then(() => {
                            cy.get(numberInputBlockBemSelector + '__editdialog').contains('Basic').click().then(() => {
                                cy.get("[name='./name']").should("exist");
                                cy.get("[name='./jcr:title']").should("exist");
                                cy.get("[name='./hideTitle']").should("exist");
                                cy.get("[name='./placeholder']").should("exist");
                                cy.get("[name='./type']").should("exist");
                                cy.get("[name='./default']").should("exist");
                                cy.get("[name='./minimum']").should("exist");
                                cy.get("[name='./exclusiveMinimum']").should("exist");
                                cy.get("[name='./maximum']").should("exist");
                                cy.get("[name='./exclusiveMaximum']").should("exist");
                                cy.get('.cq-dialog-submit').should('be.visible');
                                cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                                    cy.deleteComponentByPath(numberInputDrop);
                                });
                            })
                        });
                    })
                })
            });
        });

        it(' type dropdown in Basic tab in edit dialog of NumberInput', function () {
            dropNumberInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + numberInputEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(numberInputBlockBemSelector + '__editdialog').contains('Validation').click().then(() => {
                cy.get(numberInputBlockBemSelector + '__editdialog').contains('Basic').click().then(() => {
                    cy.get(numberInputBlockBemSelector + "__type").children('._coral-Dropdown-trigger').click();
                    cy.get("._coral-Menu-itemLabel").contains('Decimal').should('be.visible');
                    cy.get("._coral-Menu-itemLabel").contains('Integer').should('be.visible').click();
                    cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                        cy.deleteComponentByPath(numberInputDrop);
                    })
                });
            });
        })

       it('verify Minimum and Maximum fields in edit dialog of NumberInput', function () {
            dropNumberInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + numberInputEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(numberInputBlockBemSelector + '__editdialog').contains('Validation').click().then(() => {
                // get the minimum and maximum fields
                cy.get(numberInputBlockBemSelector + "__minimum").scrollIntoView().should('be.visible');
                cy.get(numberInputBlockBemSelector + "__maximum").scrollIntoView().should('be.visible');
                // check the step attribute
                cy.get(numberInputBlockBemSelector + "__minimum").should('have.attr', 'step', '0.01');
                cy.get(numberInputBlockBemSelector + "__maximum").should('have.attr', 'step', '0.01');
                // set the minimum and maximum fields
                cy.get(numberInputBlockBemSelector + "__minimum").clear().type('10.2');
                cy.get(numberInputBlockBemSelector + "__maximum").clear().type('11.5');
                // click on the basic tab and update the type field
                cy.get(numberInputBlockBemSelector + '__editdialog').contains('Basic').click().then(() => {
                    cy.get(numberInputBlockBemSelector + "__type").children('._coral-Dropdown-trigger').click();
                    cy.get("._coral-Menu-itemLabel").contains('Integer').should('be.visible').click();
                    // check the step attribute
                    cy.get(numberInputBlockBemSelector + "__minimum").scrollIntoView().should('have.attr', 'step', '1');
                    cy.get(numberInputBlockBemSelector + "__maximum").scrollIntoView().should('have.attr', 'step', '1');
                    // verify the values in the DOM
                    cy.get(numberInputBlockBemSelector + '__editdialog').contains('Validation').click().then(() => {
                        cy.get(numberInputBlockBemSelector + "__minimum input").should('have.attr', 'value', '10');
                        cy.get(numberInputBlockBemSelector + "__maximum input").should('have.attr', 'value', '11');
                        cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                            cy.deleteComponentByPath(numberInputDrop);
                        });
                    })
                });
        });
});

        // todo: leadDigits and fracDigits are not supported as of today
        it.skip('verify editFormat Value Getting saved correctly', function () {
            dropNumberInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + numberInputEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(numberInputBlockBemSelector + '__editdialog').contains('Formats').click().then(() => {
                cy.get(numberInputBlockBemSelector + '__leaddigits').clear();
                cy.get(numberInputBlockBemSelector + '__leaddigits').type(4);
                cy.get(numberInputBlockBemSelector + '__fracdigits').clear();
                cy.get(numberInputBlockBemSelector + '__fracdigits').type(4);
                cy.get('.cq-dialog-submit').should('be.visible').click().then(() => {
                    cy.get('.cq-dialog-submit').should('not.exist').then(() => {
                        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + numberInputEditPathSelector);
                        cy.invokeEditableAction(editDialogConfigurationSelector).then(() => {
                            cy.get(numberInputBlockBemSelector + '__editdialog').contains('Formats').click();
                            cy.get(numberInputBlockBemSelector + '__leaddigits').should('have.value', 4);
                            cy.get(numberInputBlockBemSelector + '__fracdigits').should('have.value', 4);
                            cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                                cy.deleteComponentByPath(numberInputDrop);
                            })
                        })
                    })
                })
            });
        })

        it(' Format should not appear when type is No Pattern', function () {
            dropNumberInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + numberInputEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(numberInputBlockBemSelector + '__editdialog').contains('Validation').click().then(() => {
                cy.get(numberInputBlockBemSelector + '__editdialog').contains('Formats').click().then(() => {
                    cy.get(numberInputBlockBemSelector + '__displaypattern').children('button').click();
                    cy.get('coral-selectlist-item-content').contains('No Pattern').click({force: true}).then(() => {
                        cy.get('.coral-Form-fieldwrapper').should('be.hidden');
                    });
                    cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                        cy.deleteComponentByPath(numberInputDrop);
                    })
                });
            });
        })
    });

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/numberinput",
            numberInputEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/numberinput",
            numberInputEditPathSelector = "[data-path='" + numberInputEditPath + "']",
            editDialogConfigurationSelector = "[data-action='CONFIGURE']",
            numberInputDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formnumberinput.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms NumberInput', function () {
            dropNumberInputInSites();
            cy.deleteComponentByPath(numberInputDrop);
        });

        it('open edit dialog of aem forms NumberInput', {retries: 3}, function () {
            cy.cleanTest(numberInputDrop).then(function () {
                dropNumberInputInSites();
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + numberInputEditPathSelector);
                cy.invokeEditableAction("[data-action='CONFIGURE']");
                cy.get("[name='./name']").should("exist").then(() => {
                    cy.get("[name='./jcr:title']").should("exist");
                    cy.get("[name='./hideTitle']").should("exist");
                    cy.get("[name='./placeholder']").should("exist");
                    cy.get("[name='./type']").should("exist");
                    cy.get("[name='./default']").should("exist");
                    cy.get("[name='./minimum']").should("exist");
                    cy.get("[name='./exclusiveMinimum']").should("exist");
                    cy.get("[name='./maximum']").should("exist");
                    cy.get("[name='./exclusiveMaximum']").should("exist");
                    cy.get('.cq-dialog-submit').should('be.visible');
                    cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                        cy.deleteComponentByPath(numberInputDrop);
                    })
                })


                // this line is causing frame busting which is causing cypress to fail

            });
        });

    });
})