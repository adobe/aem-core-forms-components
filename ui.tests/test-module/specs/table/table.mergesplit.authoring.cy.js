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
            cy.on('uncaught:exception', () => false);
            cy.openAuthoring(tableSamplePagePath);
        });

        it('splitrowcell removes colspan and increases the row cell count by 1', function () {
            cy.getContentIFrameBody()
                .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').eq(0)
                .find('.cmp-adaptiveform-tablecell').then($cells => {
                    const beforeCount = $cells.length;
                    cy.getContentIFrameBody()
                        .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').eq(0)
                        .find('.cmp-adaptiveform-tablecell[colspan="2"]')
                        .should('exist');
                    openRowCellToolbarByIndex(row1JcrPath, 0);
                    cy.invokeEditableAction("[data-action='splitrowcell']");
                    cy.getContentIFrameBody()
                        .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').eq(0)
                        .find('.cmp-adaptiveform-tablecell')
                        .should('have.length', beforeCount + 1);

                    cy.getContentIFrameBody()
                        .find('.cmp-adaptiveform-table__body .cmp-adaptiveform-tablerow').eq(0)
                        .find('.cmp-adaptiveform-tablecell[colspan="2"]')
                        .should('not.exist');
                });
        });
    });

    // -------------------------------------------------------------------------
    // Merge row cells — validation guard: single-cell selection shows error dialog.
    // -------------------------------------------------------------------------

    context('Merge row cells validation in Forms Editor', function () {

        beforeEach(function () {
            cy.openAuthoring(tableSamplePagePath);
        });

        it('invoking mergerowcells with a single cell selected shows the validation error dialog', function () {
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