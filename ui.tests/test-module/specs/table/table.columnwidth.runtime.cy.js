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
 * Runtime column-width tests for the table component.
 *
 * Sample page: content/forms/af/core-components-it/samples/table/columnwidth
 *   - columnWidth="1,2,1"  →  proportional: col0=25%, col1=50%, col2=25%
 *   - 3 header columns, 1 static data row
 */
describe('Form Runtime with Table - Column Width Tests', () => {

    const pagePath = "content/forms/af/core-components-it/samples/table/columnwidth.html";
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
    });

    // -------------------------------------------------------------------------
    // <colgroup> / <col> presence and count
    // -------------------------------------------------------------------------

    it('renders a <colgroup> element when columnWidth is configured', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} table.cmp-adaptiveform-table__widget colgroup`)
            .should('exist');
    });

    it('renders the correct number of <col> elements matching the column count', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        // columnWidth="1,2,1" → 3 columns
        cy.get(`#${tableId} table.cmp-adaptiveform-table__widget colgroup col`)
            .should('have.length', 3);
    });

    // -------------------------------------------------------------------------
    // Proportional widths: 1,2,1 → 25%, 50%, 25%
    // -------------------------------------------------------------------------

    it('first <col> has width close to 25% (weight 1 of sum 4)', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} table.cmp-adaptiveform-table__widget colgroup col`).eq(0)
            .invoke('attr', 'style')
            .then(style => {
                // style should contain "width: 25%" or "width:25%"
                expect(style).to.match(/width\s*:\s*25%/);
            });
    });

    it('second <col> has width close to 50% (weight 2 of sum 4)', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} table.cmp-adaptiveform-table__widget colgroup col`).eq(1)
            .invoke('attr', 'style')
            .then(style => {
                expect(style).to.match(/width\s*:\s*50%/);
            });
    });

    it('third <col> has width close to 25% (weight 1 of sum 4)', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} table.cmp-adaptiveform-table__widget colgroup col`).eq(2)
            .invoke('attr', 'style')
            .then(style => {
                expect(style).to.match(/width\s*:\s*25%/);
            });
    });


    // -------------------------------------------------------------------------
    // Basic structure still intact
    // -------------------------------------------------------------------------

    it('still renders the correct number of header columns', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).should('have.length', 3);
    });

    it('no sort buttons are rendered (sorting not enabled on this table)', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} .cmp-adaptiveform-table__sort-button`).should('not.exist');
    });

    // -------------------------------------------------------------------------
    // Without columnWidth the basic page renders no colgroup (regression guard)
    // -------------------------------------------------------------------------

    it('basic sample page (no columnWidth) has no <colgroup>', () => {
        cy.previewForm('content/forms/af/core-components-it/samples/table/basic.html').then(fc => {
            const allFields = fc.getAllFields();
            const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
            const tableId = tableView.getId();

            cy.get(`#${tableId} table.cmp-adaptiveform-table__widget colgroup`).should('not.exist');
        });
    });
});
