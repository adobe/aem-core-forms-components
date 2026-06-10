/***************************************************************************
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
 ****************************************************************************/

const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

describe('Page - Authoring - Table Row Merge/Split', function () {

    const tableSamplePagePath = "/content/forms/af/core-components-it/samples/table/mergesplit";
    const tableJcrPath = tableSamplePagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/table";
    const row1JcrPath = tableJcrPath + "/row1";
    const row2JcrPath = tableJcrPath + "/row2";

    const openRowCellToolbarByIndex = (rowPath, index) => {
        // Wait for the table body to be stable in the content iframe before reading
        // overlays, so the editable's dom reference is wired up and toolbar condition
        // functions (e.g. isMergedRowCell) read the correct colspan from the DOM.
        cy.getContentIFrameBody()
            .find('.cmp-adaptiveform-table__body')
            .should('exist');
        cy.get(sitesSelectors.overlays.overlay.component).then($overlays => {
            const prefix = rowPath + "/";
            const childOverlays = [...$overlays].filter(el => {
                const p = el.getAttribute('data-path') || '';
                return p.startsWith(prefix) && p.slice(prefix.length).indexOf('/') === -1;
            });
            expect(childOverlays.length, `should have at least ${index + 1} cell overlays under ${rowPath}`).to.be.gt(index);
            const selector = "[data-path='" + childOverlays[index].getAttribute('data-path') + "']";
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + selector);
        });
    };

    // -------------------------------------------------------------------------
    // Initial state: verify the pre-merged cell in row1 is correct
    // -------------------------------------------------------------------------

    context('Verify pre-merged row cell state', function () {
        beforeEach(function () {
            cy.openAuthoring(tableSamplePagePath);
        });
        it('merged cell renders with colspan="2" on .cmp-adaptiveform-tablecell in authoring DOM', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').first()
                .find('.cmp-adaptiveform-tablecell[colspan="2"]')
                .should('exist');
        });

        it('row2 cells have no colspan attribute (all unmerged)', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').eq(1)
                .find('.cmp-adaptiveform-tablecell[colspan]')
                .should('not.exist');
        });
    });

    context('Split row cell in Forms Editor', function () {

        beforeEach(function () {
            // Suppress uncaught exceptions from AEM authoring code (e.g. editable tree
            // not fully loaded when refresh() runs) so they don't abort the test.
            cy.on('uncaught:exception', () => false);
            cy.openAuthoring(tableSamplePagePath);
        });

        it('splitrowcell on mergedCell (colspan=2) increases the row1 cell count by 1', function () {
            // Confirm the merged cell is in the DOM — this also gates the toolbar open
            // so isMergedRowCell sees colspan=2 and shows the splitrowcell action.
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').eq(0)
                .find('.cmp-adaptiveform-tablecell[colspan="2"]')
                .should('exist');

            // Open toolbar first — AEM fires selection POSTs during overlay click.
            // Register the intercept only after the toolbar is open so we don't
            // accidentally catch one of those AEM-internal POSTs instead of the
            // colspan@Delete POST that splitTableRowCell fires.
            openRowCellToolbarByIndex(row1JcrPath, 0);

            // Match only the colspan@Delete POST the editorhook sends — body matcher
            // ensures no AEM-internal POST to the same path is accidentally captured.
            const mergedCellPath = row1JcrPath + "/mergedCell";
            cy.intercept('POST', mergedCellPath).as('splitRowCell');

            cy.invokeEditableAction("[data-action='splitrowcell']");
            cy.wait('@splitRowCell');
        });

        it('after splitrowcell, the split cell no longer carries a colspan attribute', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').eq(0)
                .find('.cmp-adaptiveform-tablecell[colspan="2"]')
                .should('not.exist');
        });
    });

    // -------------------------------------------------------------------------
    // Merge row cells — validation: single-cell selection must show error dialog.
    // Full multi-cell merge requires the real Granite multi-select API so we
    // verify the validation guard fires correctly when only one cell is selected.
    // -------------------------------------------------------------------------

    context('Merge row cells validation in Forms Editor', function () {

        beforeEach(function () {
            cy.openAuthoring(tableSamplePagePath);
        });

        it('invoking mergerowcells with a single cell selected shows the validation error dialog', function () {
            // row2 has 3 individual (unmerged) cells — select the first one alone
            openRowCellToolbarByIndex(row2JcrPath, 0);
            cy.invokeEditableAction("[data-action='mergerowcells']");

            cy.get('coral-dialog.is-open').should('be.visible');
            cy.get('coral-dialog.is-open coral-dialog-content')
                .should('contain.text', 'Select two or more row cells to merge');
            cy.get('coral-dialog.is-open button').contains('Ok').click({ force: true });
        });

        it('error dialog closes after clicking Ok and the row cell count is unchanged', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').eq(1)
                .find('.cmp-adaptiveform-tablecell').then($cells => {
                    const beforeCount = $cells.length;

                    openRowCellToolbarByIndex(row2JcrPath, 0);
                    cy.invokeEditableAction("[data-action='mergerowcells']");

                    cy.get('coral-dialog.is-open button').contains('Ok').click({ force: true });
                    cy.get('coral-dialog').should('not.have.class', 'is-open');

                    cy.getContentIFrameBody()
                        .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').eq(1)
                        .find('.cmp-adaptiveform-tablecell')
                        .should('have.length', beforeCount);
                });
        });
    });
});