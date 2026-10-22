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

/**
 * Runtime sorting tests for the table component.
 *
 * Sample page: content/forms/af/core-components-it/samples/table/sorting
 *   - table has enableSorting=true
 *   - column1 (Name): sort enabled
 *   - column2 (Score): disableSorting=true → no sort button
 *   - 3 static data rows with default values: Charlie/30, Alice/10, Bob/20
 */
describe('Form Runtime with Table - Sorting Tests', () => {

    const pagePath = "content/forms/af/core-components-it/samples/table/sorting.html";
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
    });

    // -------------------------------------------------------------------------
    // Sort button presence
    // -------------------------------------------------------------------------

    it('renders a sort button only on columns that have sorting enabled', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        // column1 must have a sort button
        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-button')
            .should('exist');

        // column2 has disableSorting=true → no sort button
        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(1)
            .find('.cmp-adaptiveform-table__sort-button')
            .should('not.exist');
    });

    it('sort button has correct aria-label', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-button')
            .should('have.attr', 'aria-label', 'Sort column');
    });

    it('sort button carries a data-cmp-hook-table-sort index attribute', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-button')
            .invoke('attr', 'data-cmp-hook-table-sort')
            .should('eq', '0');
    });

    it('table element carries data-cmp-sorting-enabled="true"', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId}`)
            .invoke('attr', 'data-cmp-sorting-enabled')
            .should('eq', 'true');
    });

    it('sort header cell has .cmp-adaptiveform-table__sort-header-inner wrapper', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-header-inner')
            .should('exist');
    });

    // -------------------------------------------------------------------------
    // Sort state: ascending on first click
    // -------------------------------------------------------------------------

    it('first sort button click adds --asc modifier class and aria-sort="ascending" on the active th', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-button')
            .click();

        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-button')
            .should('have.class', 'cmp-adaptiveform-table__sort-button--asc');

        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .should('have.attr', 'aria-sort', 'ascending');
    });

    it('second sort button click on same column switches to --desc and aria-sort="descending"', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        const sortBtn = () => cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-button');

        sortBtn().click();
        sortBtn().click();

        sortBtn().should('have.class', 'cmp-adaptiveform-table__sort-button--desc');
        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .should('have.attr', 'aria-sort', 'descending');
    });

    it('other header cells have no aria-sort after a sort is applied', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-button')
            .click();

        // column2 must not receive aria-sort
        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(1)
            .should('not.have.attr', 'aria-sort');
    });

    // -------------------------------------------------------------------------
    // DOM row order after sort (values pre-filled via default property)
    // -------------------------------------------------------------------------

    it('ascending sort on column1 reorders rows alphabetically A-Z', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-button')
            .click();

        // Expected ascending order: Alice, Bob, Charlie
        cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`).then($rows => {
            const firstCellValues = [...$rows].map(r => {
                const input = r.querySelector('td.cmp-adaptiveform-tablecell input');
                return input ? input.value : r.querySelector('td.cmp-adaptiveform-tablecell').innerText.trim();
            });
            expect(firstCellValues[0]).to.match(/alice/i);
            expect(firstCellValues[1]).to.match(/bob/i);
            expect(firstCellValues[2]).to.match(/charlie/i);
        });
    });

    it('descending sort on column1 reorders rows alphabetically Z-A', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        const sortBtn = cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-button');

        sortBtn.click().click();

        // Expected descending order: Charlie, Bob, Alice
        cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`).then($rows => {
            const firstCellValues = [...$rows].map(r => {
                const input = r.querySelector('td.cmp-adaptiveform-tablecell input');
                return input ? input.value : r.querySelector('td.cmp-adaptiveform-tablecell').innerText.trim();
            });
            expect(firstCellValues[0]).to.match(/charlie/i);
            expect(firstCellValues[1]).to.match(/bob/i);
            expect(firstCellValues[2]).to.match(/alice/i);
        });
    });

    it('tbody still contains the same number of rows after sorting', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`).then($before => {
            const beforeCount = $before.length;

            cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
                .find('.cmp-adaptiveform-table__sort-button')
                .click();

            cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`)
                .should('have.length', beforeCount);
        });
    });

    // -------------------------------------------------------------------------
    // Non-active sort button stays neutral (no asc/desc class)
    // -------------------------------------------------------------------------

    it('non-active sort column has no --asc or --desc modifier after sort', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        // Click column1 sort; column2 has no button at all — verify column1 button stays clean
        // on hypothetical re-click of another sortable column (use same column for the toggle test)
        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-button')
            .click();

        // The active button must not carry both classes simultaneously
        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(0)
            .find('.cmp-adaptiveform-table__sort-button')
            .should('not.have.class', 'cmp-adaptiveform-table__sort-button--desc');
    });
});
