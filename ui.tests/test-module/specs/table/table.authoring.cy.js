/*
 *  Copyright 2024 Adobe Systems Incorporated
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

    const pagePath = "/content/forms/af/core-components-it/blank";
    const tableSamplePagePath = "/content/forms/af/core-components-it/samples/table/basic";

    // Drop zone inside the blank form
    const formContainerDropZone = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/*";
    const formContainerDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerDropZone + "']";

    // Path where the table lands after insertion into the blank form
    const tableEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/table";
    const tableEditPathSelector = "[data-path='" + tableEditPath + "']";

    // Repeatable row overlay path inside the sample page
    const repeatableRowEditPath = tableSamplePagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/table/row2";
    const repeatableRowEditPathSelector = "[data-path='" + repeatableRowEditPath + "']";

    // Header container JCR + overlay paths for the sample page
    const tableHeaderJcrPath = tableSamplePagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/table/header";
    const tableJcrPath = tableSamplePagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/table";

    /**
     * Finds the first direct-child .cq-Overlay--component under the given container path
     * at runtime and opens its editable toolbar. This avoids hardcoding node names like
     * "column1" or "column_<timestamp>" which vary depending on JCR state.
     */
    const openFirstHeaderCellToolbar = function (headerContainerPath) {
        cy.get(sitesSelectors.overlays.overlay.component).then($overlays => {
            const prefix = headerContainerPath + "/";
            const firstChildOverlay = [...$overlays].find(el => {
                const p = el.getAttribute('data-path') || '';
                return p.startsWith(prefix) && p.slice(prefix.length).indexOf('/') === -1;
            });
            expect(firstChildOverlay, 'first header cell overlay should exist').to.exist;
            const childSelector = "[data-path='" + firstChildOverlay.getAttribute('data-path') + "']";
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + childSelector);
        });
    };

    /**
     * Deletes a JCR node via Sling POST API. Does not fail if the node is already absent.
     */
    const deleteJcrNode = function (path) {
        const username = Cypress.env('crx.username') || 'admin';
        const password = Cypress.env('crx.password') || 'admin';
        cy.request({
            method: 'POST',
            url: path,
            auth: { username, password },
            form: true,
            body: { ':operation': 'delete' },
            failOnStatusCode: false
        });
    };

    /**
     * Creates a JCR node via Sling POST API. Does not fail if the node already exists.
     */
    const createJcrNode = function (path, properties) {
        const username = Cypress.env('crx.username') || 'admin';
        const password = Cypress.env('crx.password') || 'admin';
        cy.request({
            method: 'POST',
            url: path,
            auth: { username, password },
            form: true,
            body: properties,
            failOnStatusCode: false
        });
    };

    const dropTableInContainer = function () {
        cy.selectLayer("Edit");
        cy.insertComponent(formContainerDropZoneSelector, "Adaptive Form Table", afConstants.components.forms.resourceType.table);
        cy.get('body').click(0, 0);
    };

    // -------------------------------------------------------------------------
    // Basic authoring: insert, configure dialog, delete
    // -------------------------------------------------------------------------

    context('Open Forms Editor', function () {

        beforeEach(function () {
            cy.openAuthoring(pagePath);
        });

        it('insert Table in form container', function () {
            dropTableInContainer();
            cy.deleteComponentByPath(tableEditPath);
        });

        it('open edit dialog of Table and verify dialog fields', function () {
            dropTableInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + tableEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");

            cy.get("[name='./jcr:title']").should("exist");
            cy.get("[name='./name']").should("exist");
            cy.get("[name='./columnWidth']").should("exist");
            cy.get("[name='./enableSorting']").should("exist");
            
            cy.get('.cq-dialog-cancel').click();
            cy.deleteComponentByPath(tableEditPath);
        });
    });

    // -------------------------------------------------------------------------
    // TableRow dialog: Repeat Panel tab
    // -------------------------------------------------------------------------

    context('Open Forms Editor with sample table page', function () {

        beforeEach(function () {
            cy.openAuthoring(tableSamplePagePath);
        });

        it('open Repeat Panel tab of TableRow dialog and verify repeatability fields', function () {
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + repeatableRowEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");

            cy.get("coral-tab").contains("Repeat Panel").click();

            cy.get("[name='./repeatable']").should("exist");
            cy.get("[name='./minOccur']").should("exist");
            cy.get("[name='./maxOccur']").should("exist");

            cy.get('.cq-dialog-cancel').click();
        });
    });

    // -------------------------------------------------------------------------
    // Column add
    // afterEach removes any extra column nodes added during the test via Sling
    // so the page is always restored to its original 2-column state
    // -------------------------------------------------------------------------

    context('Column add in Forms Editor', function () {

        beforeEach(function () {
            cy.openAuthoring(tableSamplePagePath);
        });

        afterEach(function () {
            // Remove any header column nodes that aren't the original column1/column2
            const username = Cypress.env('crx.username') || 'admin';
            const password = Cypress.env('crx.password') || 'admin';
            cy.request({
                url: tableHeaderJcrPath + ".1.json",
                auth: { username, password }
            }).then(({ body }) => {
                const originalCols = new Set(['column1', 'column2']);
                Object.keys(body).forEach(key => {
                    if (key.startsWith(':') || key.startsWith('jcr:') || key.startsWith('sling:')) return;
                    if (originalCols.has(key)) return;
                    // Delete the extra header column
                    deleteJcrNode(tableHeaderJcrPath + "/" + key);
                    // Delete the corresponding cell (same index) from every data row
                    ['row1', 'row2'].forEach(rowName => {
                        cy.request({
                            url: tableJcrPath + "/" + rowName + ".1.json",
                            auth: { username, password },
                            failOnStatusCode: false
                        }).then(({ body: rowBody }) => {
                            const originalCells = new Set(['cell1', 'cell2']);
                            Object.keys(rowBody).forEach(cellKey => {
                                if (cellKey.startsWith(':') || cellKey.startsWith('jcr:') || cellKey.startsWith('sling:')) return;
                                if (originalCells.has(cellKey)) return;
                                deleteJcrNode(tableJcrPath + "/" + rowName + "/" + cellKey);
                            });
                        });
                    });
                });
            });
        });

        it('add column via toolbar action on header cell', function () {
            cy.getContentIFrameBody().find('.cmp-adaptiveform-tablehead').then($cells => {
                const initialCount = $cells.length;

                openFirstHeaderCellToolbar(tableHeaderJcrPath);
                cy.invokeEditableAction("[data-action='addcolumn']");

                cy.getContentIFrameBody().find('.cmp-adaptiveform-tablehead')
                    .should('have.length', initialCount + 1);
            });
        });
    });

    // -------------------------------------------------------------------------
    // Column delete
    // afterEach restores deleted column2 + its cells via Sling so other tests
    // always start with the original 2-column state
    // -------------------------------------------------------------------------

    context('Column delete in Forms Editor', function () {

        beforeEach(function () {
            cy.openAuthoring(tableSamplePagePath);
        });

        afterEach(function () {
            // Restore header column2 if it was deleted
            const username = Cypress.env('crx.username') || 'admin';
            const password = Cypress.env('crx.password') || 'admin';
            cy.request({
                url: tableHeaderJcrPath + "/column2.json",
                auth: { username, password },
                failOnStatusCode: false
            }).then(({ status }) => {
                if (status === 404) {
                    createJcrNode(tableHeaderJcrPath + "/column2", {
                        'jcr:primaryType': 'nt:unstructured',
                        'sling:resourceType': 'forms-components-examples/components/form/text',
                        'fieldType': 'plain-text',
                        'jcr:title': 'Age',
                        'name': 'column2',
                        'value': 'Age'
                    });
                }
            });

            // Restore cell2 in each data row if it was deleted
            [
                { row: 'row1', name: 'ageInput1', title: 'Age Input' },
                { row: 'row2', name: 'ageInput2', title: 'Age Input' }
            ].forEach(({ row, name, title }) => {
                cy.request({
                    url: tableJcrPath + "/" + row + "/cell2.json",
                    auth: { username, password },
                    failOnStatusCode: false
                }).then(({ status }) => {
                    if (status === 404) {
                        createJcrNode(tableJcrPath + "/" + row + "/cell2", {
                            'jcr:primaryType': 'nt:unstructured',
                            'sling:resourceType': 'forms-components-examples/components/form/textinput',
                            'fieldType': 'text-input',
                            'jcr:title': title,
                            'name': name
                        });
                    }
                });
            });
        });

        it('delete column via toolbar action on header cell', function () {
            cy.getContentIFrameBody().find('.cmp-adaptiveform-tablehead').then($cells => {
                const initialCount = $cells.length;

                openFirstHeaderCellToolbar(tableHeaderJcrPath);
                cy.invokeEditableAction("[data-action='delcolumn']");

                cy.get('coral-dialog.is-open').should('be.visible');
                cy.get('coral-dialog.is-open button').contains('Yes').click({force: true});

                cy.getContentIFrameBody().find('.cmp-adaptiveform-tablehead')
                    .should('have.length', initialCount - 1);
            });
        });
    });
});
