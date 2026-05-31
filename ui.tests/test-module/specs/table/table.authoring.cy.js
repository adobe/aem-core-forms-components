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
    // JCR cleanup runs at the START of beforeEach so the page always loads
    // against a known-clean 2-column state, regardless of what a prior test left.
    // -------------------------------------------------------------------------

    context('Column add in Forms Editor', function () {

        beforeEach(function () {
            // Clean up any extra columns left by a previous run before opening the page,
            // so the page always renders with exactly the original 2 columns.
            const username = Cypress.env('crx.username') || 'admin';
            const password = Cypress.env('crx.password') || 'admin';
            cy.request({
                url: tableHeaderJcrPath + ".1.json",
                auth: { username, password },
                failOnStatusCode: false
            }).then(({ body }) => {
                if (!body) return;
                const originalCols = new Set(['column1', 'column2']);
                Object.keys(body).forEach(key => {
                    if (key.startsWith(':') || key.startsWith('jcr:') || key.startsWith('sling:')) return;
                    if (originalCols.has(key)) return;
                    deleteJcrNode(tableHeaderJcrPath + "/" + key);
                    ['row1', 'row2'].forEach(rowName => {
                        cy.request({
                            url: tableJcrPath + "/" + rowName + ".1.json",
                            auth: { username, password },
                            failOnStatusCode: false
                        }).then(({ body: rowBody }) => {
                            if (!rowBody) return;
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

            cy.openAuthoring(tableSamplePagePath);
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
    // Sorting: enable/disable per column via toolbar actions
    //
    // Sample page: /samples/table/sorting
    //   enableSorting=true on the table; column1 is sortable; column2 has disableSorting=true.
    //
    // Each test is fully self-contained:
    //   - it performs the toggle action and asserts the new state
    //   - it then performs the reverse toggle and asserts the page is back to its
    //     known starting state
    // This ensures tests never leave dirty JCR state that would break the next test.
    // -------------------------------------------------------------------------

    context('Sorting: disable per-column sort in Forms Editor', function () {

        const sortingSamplePagePath = "/content/forms/af/core-components-it/samples/table/sorting";
        const sortingTableHeaderJcrPath = sortingSamplePagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/table/header";

        // column1 and column2 are fixed node names in the sorting sample page so we
        // build the overlay selector directly — no $overlays snapshot that goes stale
        // after the table refreshes following a toolbar action.
        const openSortingHeaderCellToolbar = (nodeName) => {
            const cellPath = sortingTableHeaderJcrPath + "/" + nodeName;
            const selector = sitesSelectors.overlays.overlay.component + "[data-path='" + cellPath + "']";
            // Wait for the overlay to exist and be attached before opening the toolbar,
            // so we don't race with the post-action table refresh.
            cy.get(selector).should('exist');
            cy.openEditableToolbar(selector);
        };

        beforeEach(function () {
            cy.openAuthoring(sortingSamplePagePath);
        });

        // ------------------------------------------------------------------
        // Initial state assertions (read-only — no JCR mutations)
        // ------------------------------------------------------------------

        it('column1 (sort enabled) shows a sort button in the authoring DOM', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead').eq(0)
                .find('.cmp-adaptiveform-table__sort-button')
                .should('exist');
        });

        it('column2 (disableSorting=true) has no sort button in the authoring DOM', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead').eq(1)
                .find('.cmp-adaptiveform-table__sort-button')
                .should('not.exist');
        });

        it('table element has data-cmp-sorting-enabled="true" in authoring mode', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table[data-cmp-sorting-enabled="true"]')
                .should('exist');
        });

        // ------------------------------------------------------------------
        // Toggle test 1: disable column1 sort → assert removed → re-enable → assert restored
        // ------------------------------------------------------------------

        it('removecolumnsorting on column1 removes its sort button; enablecolumnsorting restores it', function () {
            // Starting state: column1 has a sort button
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead').eq(0)
                .find('.cmp-adaptiveform-table__sort-button')
                .should('exist');

            // Disable sort on column1
            openSortingHeaderCellToolbar('column1');
            cy.invokeEditableAction("[data-action='removecolumnsorting']");

            // Wait for the table refresh: sort button disappears from column1
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead').eq(0)
                .find('.cmp-adaptiveform-table__sort-button')
                .should('not.exist');

            // Re-enable sort on column1 — overlay re-renders after refresh so wait for it
            openSortingHeaderCellToolbar('column1');
            cy.invokeEditableAction("[data-action='enablecolumnsorting']");

            // Sort button reappears — page is back to starting state
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead').eq(0)
                .find('.cmp-adaptiveform-table__sort-button')
                .should('exist');
        });

        // ------------------------------------------------------------------
        // Toggle test 2: enable column2 sort → assert added → disable → assert restored
        // ------------------------------------------------------------------

        it('enablecolumnsorting on column2 adds its sort button; removecolumnsorting removes it again', function () {
            // Starting state: column2 has NO sort button
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead').eq(1)
                .find('.cmp-adaptiveform-table__sort-button')
                .should('not.exist');

            // Enable sort on column2
            openSortingHeaderCellToolbar('column2');
            cy.invokeEditableAction("[data-action='enablecolumnsorting']");

            // Sort button appears on column2 after refresh
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead').eq(1)
                .find('.cmp-adaptiveform-table__sort-button')
                .should('exist');

            // Disable it again to restore starting state
            openSortingHeaderCellToolbar('column2');
            cy.invokeEditableAction("[data-action='removecolumnsorting']");

            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead').eq(1)
                .find('.cmp-adaptiveform-table__sort-button')
                .should('not.exist');
        });

        // ------------------------------------------------------------------
        // Combined: total sort-button count stays consistent across both toggles
        // ------------------------------------------------------------------

        it('total sort button count changes correctly when toggling both columns', function () {
            // Starting state: 1 sort button (column1 only)
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-table__sort-button')
                .should('have.length', 1);

            // Enable column2 → 2 sort buttons
            openSortingHeaderCellToolbar('column2');
            cy.invokeEditableAction("[data-action='enablecolumnsorting']");
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-table__sort-button')
                .should('have.length', 2);

            // Disable column1 → 1 sort button (column2 only)
            openSortingHeaderCellToolbar('column1');
            cy.invokeEditableAction("[data-action='removecolumnsorting']");
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-table__sort-button')
                .should('have.length', 1);

            // Restore: re-enable column1 → 2 sort buttons
            openSortingHeaderCellToolbar('column1');
            cy.invokeEditableAction("[data-action='enablecolumnsorting']");
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-table__sort-button')
                .should('have.length', 2);

            // Restore: disable column2 → back to 1 sort button (starting state)
            openSortingHeaderCellToolbar('column2');
            cy.invokeEditableAction("[data-action='removecolumnsorting']");
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-table__sort-button')
                .should('have.length', 1);
        });
    });

    // -------------------------------------------------------------------------
    // Column delete
    // JCR restoration runs at the START of beforeEach so the page always loads
    // with the original column2 present, regardless of what a prior test left.
    // -------------------------------------------------------------------------

    context('Column delete in Forms Editor', function () {

        beforeEach(function () {
            // Restore header column2 if a previous run deleted it, before opening the page.
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

            // Restore cell2 in each data row if a previous run deleted it.
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

            cy.openAuthoring(tableSamplePagePath);
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
