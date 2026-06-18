/*
 *  Copyright 2026 Adobe Systems Incorporated
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

    const dropDateInputInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Date Input", afConstants.components.forms.resourceType.formdateinput);
        cy.get('body').click(0, 0);
    }

    const dropDateInputInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/dateinput/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Date Input", afConstants.components.forms.resourceType.formdateinput);
        cy.get('body').click(0, 0);
    }

    const testDateInputEditDialog = function (dateInputEditPathSelector, dateInputDrop, isSites) {
        if (isSites) {
            dropDateInputInSites();
        } else {
            dropDateInputInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dateInputEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']").then(() => {
            cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                cy.deleteComponentByPath(dateInputDrop);
            });
        });
    }

    const testDateInputBasicTab = function (dateInputEditPathSelector, dateInputDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-dateinput__editdialog';
        if (isSites) {
            dropDateInputInSites();
        } else {
            dropDateInputInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dateInputEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        // Inherited base fields
        cy.get("[name='./name']").should("exist");
        cy.get("[name='./jcr:title']").should("exist");
        cy.get("[name='./hideTitle']").should("exist");
        // Date-input-specific fields
        cy.get("[name='./default']").should("exist");
        cy.get("[name='./titleDay']").should("exist");
        cy.get("[name='./titleMonth']").should("exist");
        cy.get("[name='./titleYear']").should("exist");
        cy.get("[name='./placeholderDay']").should("exist");
        cy.get("[name='./placeholderMonth']").should("exist");
        cy.get("[name='./placeholderYear']").should("exist");
        cy.get("[name='./hideTitleDate']").should("exist");
        cy.get('.cq-dialog-cancel').should('be.visible').click({ force: true }).then(() => {
            cy.deleteComponentByPath(dateInputDrop);
        });
    }

    const testDateInputValidationTab = function (dateInputEditPathSelector, dateInputDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-dateinput__editdialog';
        if (isSites) {
            dropDateInputInSites();
        } else {
            dropDateInputInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dateInputEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get(bemEditDialog).contains('Validation').click().then(() => {
            cy.get("[name='./minimumDate']").should("exist");
            cy.get("[name='./minimumMessage']").should("exist");
            cy.get("[name='./maximumDate']").should("exist");
            cy.get("[name='./maximumMessage']").should("exist");
            cy.get("[name='./excludeMinimum']").should("exist");
            cy.get("[name='./excludeMaximum']").should("exist");
            cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                cy.deleteComponentByPath(dateInputDrop);
            });
        });
    }

    const testDateInputFormatsTab = function (dateInputEditPathSelector, dateInputDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-dateinput__editdialog';
        if (isSites) {
            dropDateInputInSites();
        } else {
            dropDateInputInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dateInputEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get(bemEditDialog).contains('Formats').click().then(() => {
            cy.get("[name='./dateDisplayFormat']").should("exist");
            cy.get('.cq-dialog-cancel').should('be.visible').click().then(() => {
                cy.deleteComponentByPath(dateInputDrop);
            });
        });
    }

    const testDefaultValueInAuthoring = function (dateInputEditPathSelector, dateInputDrop) {
        dropDateInputInContainer();
        const validDate = "2024-11-15";
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dateInputEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get('[name="./default"]').clear().focus().type(validDate, { force: true });
        cy.get('.cq-dialog-submit').should('be.visible').click();
        cy.getContentIFrameBody().find(".cmp-adaptiveform-dateinput__widget--combined").last()
            .should("have.attr", "value", validDate);
        cy.deleteComponentByPath(dateInputDrop);
    }

    const testMinMaxConfiguration = function (dateInputEditPathSelector, dateInputDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-dateinput__editdialog';
        if (isSites) {
            dropDateInputInSites();
        } else {
            dropDateInputInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dateInputEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get(bemEditDialog).contains('Validation').click().then(() => {
            cy.get("input[name='./minimumDate']").invoke('val', "2024-06-10T00:00:00.000-00:00");
            cy.get("input[name='./maximumDate']").invoke('val', "2024-06-30T00:00:00.000-00:00");
            cy.get('.cq-dialog-submit').should('be.visible').click().then(() => {
                cy.wait(2000);
                cy.getFormJson(dateInputDrop).then((componentJson) => {
                    expect(componentJson).not.to.be.undefined;
                    expect(componentJson['minimum']).to.equal("2024-06-10");
                    expect(componentJson['maximum']).to.equal("2024-06-30");
                });
                cy.deleteComponentByPath(dateInputDrop);
            });
        });
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            dateInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/dateinput",
            dateInputEditPathSelector = "[data-path='" + dateInputEditPath + "']",
            dateInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formdateinput.split("/").pop();

        beforeEach(function () {
            cy.openAuthoring(pagePath);
        });

        it('insert Date Input in form container', function () {
            dropDateInputInContainer();
            cy.deleteComponentByPath(dateInputDrop);
        });

        it('open edit dialog of Date Input', function () {
            testDateInputEditDialog(dateInputEditPathSelector, dateInputDrop);
        });

        it('verify Basic tab in edit dialog of Date Input', { retries: 3 }, function () {
            cy.cleanTest(dateInputDrop).then(function () {
                testDateInputBasicTab(dateInputEditPathSelector, dateInputDrop);
            });
        });

        it('verify Validation tab in edit dialog of Date Input', function () {
            cy.cleanTest(dateInputDrop).then(function () {
                testDateInputValidationTab(dateInputEditPathSelector, dateInputDrop);
            });
        });

        it('verify Formats tab in edit dialog of Date Input', function () {
            cy.cleanTest(dateInputDrop).then(function () {
                testDateInputFormatsTab(dateInputEditPathSelector, dateInputDrop);
            });
        });

        it('default value is reflected in the authoring preview', function () {
            cy.cleanTest(dateInputDrop).then(function () {
                testDefaultValueInAuthoring(dateInputEditPathSelector, dateInputDrop);
            });
        });

        it('minimum/maximum date configuration is timezone-agnostic', { retries: 3 }, function () {
            cy.cleanTest(dateInputDrop).then(function () {
                testMinMaxConfiguration(dateInputEditPathSelector, dateInputDrop);
            });
        });
    });

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/dateinput",
            dateInputEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/dateinput",
            dateInputEditPathSelector = "[data-path='" + dateInputEditPath + "']",
            dateInputDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formdateinput.split("/").pop();

        beforeEach(function () {
            cy.openAuthoring(pagePath);
        });

        it('insert Date Input in Sites editor', function () {
            dropDateInputInSites();
            cy.deleteComponentByPath(dateInputDrop);
        });

        it('open edit dialog of Date Input', function () {
            testDateInputEditDialog(dateInputEditPathSelector, dateInputDrop, true);
        });

        it('verify Basic tab in edit dialog of Date Input', { retries: 3 }, function () {
            cy.cleanTest(dateInputDrop).then(function () {
                testDateInputBasicTab(dateInputEditPathSelector, dateInputDrop, true);
            });
        });

        it('verify Validation tab in edit dialog of Date Input', function () {
            cy.cleanTest(dateInputDrop).then(function () {
                testDateInputValidationTab(dateInputEditPathSelector, dateInputDrop, true);
            });
        });

        it('verify Formats tab in edit dialog of Date Input', function () {
            cy.cleanTest(dateInputDrop).then(function () {
                testDateInputFormatsTab(dateInputEditPathSelector, dateInputDrop, true);
            });
        });

        it('minimum/maximum date configuration is timezone-agnostic', function () {
            cy.cleanTest(dateInputDrop).then(function () {
                testMinMaxConfiguration(dateInputEditPathSelector, dateInputDrop, true);
            });
        });
    });
});
