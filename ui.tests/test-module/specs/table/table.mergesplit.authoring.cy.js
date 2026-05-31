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

/**
 * Authoring tests for table body-row cell merge/split.
 * Header cell merge/split is not yet supported in this release.
 *
 * Sample page: /content/forms/af/core-components-it/samples/table/mergesplit
 *   header : 3 plain columns (no colspan)
 *   row1   : mergedCell (colspan=2) + cell3   ← pre-merged, used for split tests
 *   row2   : cell1 + cell2 + cell3            ← fully unmerged, used for merge validation
 */
describe('Page - Authoring - Table Row Merge/Split', function () {

    const tableSamplePagePath = "/content/forms/af/core-components-it/samples/table/mergesplit";
    const tableJcrPath = tableSamplePagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/table";
    const row1JcrPath = tableJcrPath + "/row1";
    const row2JcrPath = tableJcrPath + "/row2";

    const username = () => Cypress.env('crx.username') || 'admin';
    const password = () => Cypress.env('crx.password') || 'admin';

    const deleteJcrNode = (path) => {
        cy.request({
            method: 'POST',
            url: path,
            auth: { username: username(), password: password() },
            form: true,
            body: { ':operation': 'delete' },
            failOnStatusCode: false
        });
    };

    const setJcrProperty = (path, properties) => {
        cy.request({
            method: 'POST',
            url: path,
            auth: { username: username(), password: password() },
            form: true,
            body: Object.assign({ '_charset_': 'UTF-8' }, properties),
            failOnStatusCode: false
        });
    };

    /**
     * Opens the editable toolbar for the Nth direct child of the given row/container path.
     */
    const openRowCellToolbarByIndex = (rowPath, index) => {
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

        it('mergedCell in row1 has colspan=2 in JCR', function () {
            cy.request({
                url: row1JcrPath + "/mergedCell.json",
                auth: { username: username(), password: password() }
            }).then(({ body }) => {
                expect(String(body.colspan)).to.eq('2');
            });
        });

        it('merged cell renders with colspan="2" on .cmp-adaptiveform-tablecell in authoring DOM', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').first()
                .find('.cmp-adaptiveform-tablecell[colspan="2"]')
                .should('exist');
        });

        it('header cells have no colspan attribute (header merge not yet supported)', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead[colspan]')
                .should('not.exist');
        });

        it('row2 cells have no colspan attribute (all unmerged)', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').eq(1)
                .find('.cmp-adaptiveform-tablecell[colspan]')
                .should('not.exist');
        });
    });

    // -------------------------------------------------------------------------
    // Split row cell — each test is self-contained:
    //   split mergedCell (colspan=2) → assert cell count increases →
    //   restore colspan=2 + delete extra cell via JCR → reload → assert restored
    // -------------------------------------------------------------------------

    context('Split row cell in Forms Editor', function () {

        beforeEach(function () {
            cy.openAuthoring(tableSamplePagePath);
        });

        it('splitrowcell on mergedCell (colspan=2) increases the row1 cell count by 1', function () {
            // --- Starting state: row1 has 2 cells (mergedCell + cell3) ---
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').first()
                .find('.cmp-adaptiveform-tablecell')
                .should('have.length', 2);

            // --- Invoke split on the merged cell (index 0 in row1) ---
            openRowCellToolbarByIndex(row1JcrPath, 0);
            cy.invokeEditableAction("[data-action='splitrowcell']");

            // After split: colspan=2 becomes 2 individual cells → row1 now has 3 cells
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').first()
                .find('.cmp-adaptiveform-tablecell')
                .should('have.length', 3);

            // --- Restore: put colspan=2 back on mergedCell and delete the new cell ---
            setJcrProperty(row1JcrPath + "/mergedCell", { 'colspan': '2' });
            cy.request({
                url: row1JcrPath + ".1.json",
                auth: { username: username(), password: password() }
            }).then(({ body }) => {
                const originals = new Set(['mergedCell', 'cell3']);
                Object.keys(body).forEach(key => {
                    if (key.startsWith(':') || key.startsWith('jcr:') || key.startsWith('sling:')) return;
                    if (originals.has(key)) return;
                    deleteJcrNode(row1JcrPath + "/" + key);
                });
            });

            // Reload and verify row1 is back to 2 cells
            cy.openAuthoring(tableSamplePagePath);
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').first()
                .find('.cmp-adaptiveform-tablecell')
                .should('have.length', 2);
        });

        it('after splitrowcell, the split cell no longer carries a colspan attribute', function () {
            openRowCellToolbarByIndex(row1JcrPath, 0);
            cy.invokeEditableAction("[data-action='splitrowcell']");

            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').first()
                .find('.cmp-adaptiveform-tablecell[colspan]')
                .should('not.exist');

            // Restore
            setJcrProperty(row1JcrPath + "/mergedCell", { 'colspan': '2' });
            cy.request({
                url: row1JcrPath + ".1.json",
                auth: { username: username(), password: password() }
            }).then(({ body }) => {
                const originals = new Set(['mergedCell', 'cell3']);
                Object.keys(body).forEach(key => {
                    if (key.startsWith(':') || key.startsWith('jcr:') || key.startsWith('sling:')) return;
                    if (originals.has(key)) return;
                    deleteJcrNode(row1JcrPath + "/" + key);
                });
            });
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

                    // Cell count in row2 must not have changed
                    cy.getContentIFrameBody()
                        .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').eq(1)
                        .find('.cmp-adaptiveform-tablecell')
                        .should('have.length', beforeCount);
                });
        });
    });
});
