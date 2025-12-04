/**
 * Copyright 2025 Adobe Systems Incorporated
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
 */

const sitesSelectors = require('../../libs/commons/sitesSelectors'),
      afConstants = require('../../libs/commons/formsConstants');

describe('Page - Authoring', function () {
    const dropScribbleInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Scribble", afConstants.components.forms.resourceType.scribble);
        cy.get('body').click(0, 0);
    };

    const dropScribbleInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/scribble/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Scribble", afConstants.components.forms.resourceType.scribble);
        cy.get('body').click(0, 0);
    };

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            scribbleEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/scribble",
            scribbleEditPathSelector = "[data-path='" + scribbleEditPath + "']",
            scribbleDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.scribble.split("/").pop(),
            scribbleBlockBemSelector = '.cmp-adaptiveform-scribble';
        beforeEach(function () {
            cy.openAuthoring(pagePath);
        });

        it('insert Scribble in form container', function () {
            dropScribbleInContainer();
            cy.deleteComponentByPath(scribbleDrop);
        });

        it('verify Basic tab in edit dialog of Scribble', function () {
            dropScribbleInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + scribbleEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get(scribbleBlockBemSelector + '__editdialog').contains('Validation').click().then(() => {
                cy.get(scribbleBlockBemSelector + '__editdialog').contains('Help Content').click().then(() => {
                    cy.get(scribbleBlockBemSelector + '__editdialog').contains('Accessibility').click().then(() => {
                        cy.get(scribbleBlockBemSelector + '__editdialog').contains('Basic').click().then(() => {
                            // Add more assertions here if needed
                        });
                    });
                });
            });
            cy.get('.cq-dialog-cancel').click();
            cy.deleteComponentByPath(scribbleDrop);
        });
    });

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/scribble",
            scribbleEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/scribble",
            scribbleEditPathSelector = "[data-path='" + scribbleEditPath + "']",
            scribbleDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.scribble.split("/").pop(),
            scribbleBlockBemSelector = '.cmp-adaptiveform-scribble';
        beforeEach(function () {
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms Scribble', function () {
            dropScribbleInSites();
            cy.deleteComponentByPath(scribbleDrop);
        });

        it('open edit dialog of aem forms Scribble', function () {
            cy.cleanTest(scribbleDrop).then(function () {
                dropScribbleInSites();
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + scribbleEditPathSelector);
                cy.invokeEditableAction("[data-action='CONFIGURE']");
                cy.get(scribbleBlockBemSelector + '__editdialog').contains('Validation').click().then(() => {
                    cy.get(scribbleBlockBemSelector + '__editdialog').contains('Help Content').click().then(() => {
                        cy.get(scribbleBlockBemSelector + '__editdialog').contains('Accessibility').click().then(() => {
                            cy.get(scribbleBlockBemSelector + '__editdialog').contains('Basic').click().then(() => {
                                // Add more assertions here if needed
                            });
                        });
                    });
                });
                cy.get('.cq-dialog-cancel').click();
                cy.deleteComponentByPath(scribbleDrop);
            });
        });
    });
});
