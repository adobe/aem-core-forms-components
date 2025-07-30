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

    const dropDateTimeInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Date and Time", afConstants.components.forms.resourceType.datetime);
        cy.get('body').click(0, 0);
    }

    const dropDateTimeInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/datetime/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Date and Time", afConstants.components.forms.resourceType.datetime);
        cy.get('body').click(0, 0);
    }

    const testDateTimeEditDialog = function (dateTimeEditPathSelector, dateTimeDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-datetime__editdialog'
        if (isSites) {
            dropDateTimeInSites();
        } else {
            dropDateTimeInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dateTimeEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']").then(() => {
            cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                cy.deleteComponentByPath(dateTimeDrop);
            });
        })

    }

    const testDateTimeBasicTab = function (dateTimeEditPathSelector, dateTimeDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-datetime__editdialog'
        if (isSites) {
            dropDateTimeInSites();
        } else {
            dropDateTimeInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dateTimeEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get("[name='./name']").should("exist");
        cy.get("[name='./jcr:title']").should("exist");
        cy.get("[name='./hideTitle']").should("exist");
        cy.get("[name='./placeholder']").should("exist");
        cy.get("[name='./default']").should("exist");
        cy.get('.cq-dialog-cancel').should('be.visible').click({ force: true }).then(() => {
            cy.deleteComponentByPath(dateTimeDrop);
        });
    }

    const testDateTimeValidationTab = function (dateTimeEditPathSelector, dateTimeDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-datetime__editdialog'
        if (isSites) {
            dropDateTimeInSites();
        } else {
            dropDateTimeInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dateTimeEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get(bemEditDialog).contains('Validation').click().then(() => {
            cy.get("[name='./minimumDateTime']").should("exist");
            cy.get("[name='./minimumMessage']").should("exist");
            cy.get("[name='./maximumDateTime']").should("exist");
            cy.get("[name='./maximumMessage']").should("exist");
            cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                cy.deleteComponentByPath(dateTimeDrop);
            })
        });
    }


    const testDateTimeMinimumMaximumConfiguration = function (dateTimeEditPathSelector, dateTimeDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-datetime__editdialog';
        if (isSites) {
            dropDateTimeInSites();
        } else {
            dropDateTimeInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dateTimeEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get(bemEditDialog).contains('Validation').click().then(() => {
            cy.get("input[name='./minimumDateTime']").invoke('val', "2024-06-10T00:00");
            cy.get("input[name='./maximumDateTime']").invoke('val', "2024-06-12T00:00");
            cy.get('.cq-dialog-submit').should('be.visible').click().then(() => {
                // check model json
                cy.getFormJson(dateTimeDrop).then((componentJson) => {
                    expect(componentJson).not.to.be.undefined;
                    expect(componentJson['minimum']).not.to.be.undefined;
                    expect(componentJson['minimum']).to.equal("2024-06-10T00:00");

                    expect(componentJson['maximum']).not.to.be.undefined;
                    expect(componentJson['maximum']).to.equal("2024-06-12T00:00");
                });
                cy.deleteComponentByPath(dateTimeDrop);
            });
        });
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            dateTimeEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/datetime",
            dateTimeEditPathSelector = "[data-path='" + dateTimeEditPath + "']",
            dateTimeDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.datetime.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });


        it('checking add and delete in form container', function () {
            dropDateTimeInContainer();
            cy.deleteComponentByPath(dateTimeDrop);
        });


        it('default value showing in authoring', function () {
            dropDateTimeInContainer();
            const validDate = "2021-12-12T00:00";
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dateTimeEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get('[name="./default"]').clear().focus().type(validDate, {force: true});
            cy.get('.cq-dialog-submit').should('be.visible').click();
            cy.getContentIFrameBody().find(".cmp-adaptiveform-datetime__widget")
                .should("have.attr", "value", "2021-12-12T00:00");
            cy.deleteComponentByPath(dateTimeDrop);
        });

        it('open edit dialog of DateTime', function () {
            testDateTimeEditDialog(dateTimeEditPathSelector, dateTimeDrop);
        });

        it('verify Basic tab in edit dialog of DateTime', {retries: 3}, function () {
            cy.cleanTest(dateTimeDrop).then(function () {
                testDateTimeBasicTab(dateTimeEditPathSelector, dateTimeDrop);
            });
        });

        it('verify Validation tab in edit dialog of DateTime', function () {
            cy.cleanTest(dateTimeDrop).then(function () {
                testDateTimeValidationTab(dateTimeEditPathSelector, dateTimeDrop);
            });
        });

        it('verify minimum/maximum date configuration is agnostic of client timezone', function () {
            cy.cleanTest(dateTimeDrop).then(function () {
                testDateTimeMinimumMaximumConfiguration(dateTimeEditPathSelector, dateTimeDrop);
            });
        });

    });

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/datetime",
            dateTimeEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/datetime",
            dateTimeEditPathSelector = "[data-path='" + dateTimeEditPath + "']",
            dateTimeDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.datetime.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('checking add and delete in form container', function () {
            dropDateTimeInSites();
            cy.deleteComponentByPath(dateTimeDrop);
        });

        it('open edit dialog of DateTime', function () {
            testDateTimeEditDialog(dateTimeEditPathSelector, dateTimeDrop, true);
        });

        it('verify Basic tab in edit dialog of DateTime', {retries: 3}, function () {
            cy.cleanTest(dateTimeDrop).then(function () {
                testDateTimeBasicTab(dateTimeEditPathSelector, dateTimeDrop, true);
            });
        });

        it('verify Validation tab in edit dialog of DateTime', function () {
            testDateTimeValidationTab(dateTimeEditPathSelector, dateTimeDrop, true);
        });

        it('verify minimum/maximum date configuration is agnostic of client timezone', function () {
            cy.cleanTest(dateTimeDrop).then(function () {
                testDateTimeMinimumMaximumConfiguration(dateTimeEditPathSelector, dateTimeDrop, true);
            });
        });

    });
});
