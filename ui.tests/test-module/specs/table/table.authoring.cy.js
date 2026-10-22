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

    const formContainerDropZone = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/*";
    const formContainerDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerDropZone + "']";

    const tableEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/table";
    const tableEditPathSelector = "[data-path='" + tableEditPath + "']";

    const repeatableRowEditPath = tableSamplePagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/table/row2";
    const repeatableRowEditPathSelector = "[data-path='" + repeatableRowEditPath + "']";

    const tableHeaderJcrPath = tableSamplePagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/table/header";

    /**
     * Opens the editable toolbar for the first direct-child cell of the given header container.
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
    // -------------------------------------------------------------------------

    context('Column add in Forms Editor', function () {

        beforeEach(function () {
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
    // Column delete
    // -------------------------------------------------------------------------

    context('Column delete in Forms Editor', function () {

        beforeEach(function () {
            cy.openAuthoring(tableSamplePagePath);
        });

        it('delete column via toolbar action on header cell', function () {
            cy.getContentIFrameBody().find('.cmp-adaptiveform-tablehead').then($cells => {
                const initialCount = $cells.length;

                openFirstHeaderCellToolbar(tableHeaderJcrPath);
                cy.invokeEditableAction("[data-action='delcolumn']");

                cy.get('coral-dialog.is-open').should('be.visible');
                cy.get('coral-dialog.is-open button').contains('Yes').click({ force: true });

                cy.getContentIFrameBody().find('.cmp-adaptiveform-tablehead')
                    .should('have.length', initialCount - 1);
            });
        });
    });

    // -------------------------------------------------------------------------
    // Sorting: enable/disable per column via toolbar actions
    // Sample page: /samples/table/sorting
    //   enableSorting=true on the table; column1 is sortable; column2 has disableSorting=true.
    // -------------------------------------------------------------------------

    context('Sorting: disable per-column sort in Forms Editor', function () {

        const sortingSamplePagePath = "/content/forms/af/core-components-it/samples/table/sorting";
        const sortingTableHeaderJcrPath = sortingSamplePagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/table/header";

        const openSortingHeaderCellToolbar = (nodeName) => {
            const cellPath = sortingTableHeaderJcrPath + "/" + nodeName;
            const selector = sitesSelectors.overlays.overlay.component + "[data-path='" + cellPath + "']";
            // Wait for both the overlay and the content iframe table to be stable
            // before opening the toolbar, so the editable's dom reference is wired up
            // and the toolbar condition functions read the correct DOM state.
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table[data-cmp-sorting-enabled]')
                .should('exist');
            cy.get(selector).should('exist');
            cy.openEditableToolbar(selector);
        };

        beforeEach(function () {
            // Suppress uncaught exceptions from AEM authoring code (e.g. editable tree
            // not fully loaded when refresh() runs) so they don't abort the test.
            cy.on('uncaught:exception', () => false);
            cy.openAuthoring(sortingSamplePagePath);
        });

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

        it('removecolumnsorting on column1 removes its sort button', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead').eq(0)
                .find('.cmp-adaptiveform-table__sort-button')
                .should('exist');

            // Open toolbar first — AEM fires selection POSTs during overlay click.
            // Register the intercept only after the toolbar is open so we don't catch
            // one of those AEM-internal POSTs instead of the disableSorting POST.
            openSortingHeaderCellToolbar('column1');

            const column1Path = sortingTableHeaderJcrPath + "/column1";
            cy.intercept('POST', column1Path).as('removeSort');

            cy.invokeEditableAction("[data-action='removecolumnsorting']");
            cy.wait('@removeSort');
        });

        it('enablecolumnsorting on column2 adds its sort button', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead').eq(1)
                .find('.cmp-adaptiveform-table__sort-button')
                .should('not.exist');

            // Same: register intercept after toolbar open to avoid catching AEM selection POSTs.
            openSortingHeaderCellToolbar('column2');

            const column2Path = sortingTableHeaderJcrPath + "/column2";
            cy.intercept('POST', column2Path).as('enableSort');

            cy.invokeEditableAction("[data-action='enablecolumnsorting']");
            cy.wait('@enableSort');
        });
    });
});
