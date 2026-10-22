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

describe('Form Runtime with Table - Basic Tests', () => {

    const pagePath = "content/forms/af/core-components-it/samples/table/basic.html";
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
    });

    // -------------------------------------------------------------------------
    // HTML structure
    // -------------------------------------------------------------------------

    it('table renders the correct top-level HTML structure', () => {
        const allFields = formContainer.getAllFields();
        const tableModel = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        expect(tableModel, 'table view should be initialized').to.exist;

        const tableId = tableModel.getId();
        cy.get(`#${tableId}`)
            .should('exist')
            .should('have.attr', 'data-cmp-is', 'adaptiveFormTable');

        cy.get(`#${tableId} table.cmp-adaptiveform-table__widget`).should('exist');
        cy.get(`#${tableId} thead.cmp-adaptiveform-table__head`).should('exist');
        cy.get(`#${tableId} tbody.cmp-adaptiveform-table__body`).should('exist');
    });

    it('table has correct visibility and enabled state', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId}`)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', 'true');
        cy.get(`#${tableId}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', 'true');
    });

    it('table label renders when label is visible', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId}`).then(() => {
            const labelModel = tableView.getModel().label;
            if (labelModel && labelModel.visible) {
                cy.get(`#${tableId} .cmp-adaptiveform-table__title`).should('exist');
            }
        });
    });

    // -------------------------------------------------------------------------
    // Table header
    // -------------------------------------------------------------------------

    it('table header renders a <tr> inside <thead> with correct semantics', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} thead tr.cmp-adaptiveform-tableheader`)
            .should('exist')
            .should('have.attr', 'data-cmp-is', 'adaptiveFormTableHeader');
    });

    it('table header renders two <th> cells with scope="col" and correct labels', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        // Assert structural semantics
        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).should('have.length', 2);
        cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).each($th => {
            cy.wrap($th).should('have.attr', 'scope', 'col');
        });

        // Assert label text from the model — strip any HTML tags since the model may
        // store rich text (e.g. "<p>Age</p>") while the DOM renders plain text
        const headerView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTableHeader');
        const headerItems = headerView.getModel().items;
        headerItems.forEach((item, index) => {
            const raw = item.value || item.label?.value || '';
            const expectedText = raw.replace(/<[^>]*>/g, '').trim();
            if (expectedText) {
                cy.get(`#${tableId} thead th.cmp-adaptiveform-tablehead`).eq(index)
                    .should('contain.text', expectedText);
            }
        });
    });

    it('table header has correct data attributes for visibility and enabled state', () => {
        const allFields = formContainer.getAllFields();
        const headerView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTableHeader');
        expect(headerView, 'tableheader view should be initialized').to.exist;
        const headerId = headerView.getId();

        cy.get(`#${headerId}`)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', 'true');
        cy.get(`#${headerId}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', 'true');
    });

    // -------------------------------------------------------------------------
    // Static table row
    // -------------------------------------------------------------------------

    it('static table row renders a <tr> inside <tbody> with correct class', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        // row1 is the non-repeatable row
        cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`).should('have.length.gte', 1);
    });

    it('static table row contains the correct number of <td> cells', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        // row1: 2 textinput cells → 2 <td> elements
        cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`).first().within(() => {
            cy.get('td.cmp-adaptiveform-tablecell').should('have.length', 2);
        });
    });

    it('static table row has no add/remove buttons', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        // row1 is non-repeatable so it must not render runtime controls
        cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`).first().within(() => {
            cy.get('.cmp-adaptiveform-tablerow__add-button').should('not.exist');
            cy.get('.cmp-adaptiveform-tablerow__remove-button').should('not.exist');
        });
    });

    it('static row has correct data attributes', () => {
        const allFields = formContainer.getAllFields();
        const rowViews = Object.values(allFields).filter(f => f.getClass && f.getClass() === 'adaptiveFormTableRow');
        const staticRow = rowViews.find(r => !r.getModel().repeatable);
        expect(staticRow, 'static table row view should exist').to.exist;
        const rowId = staticRow.getId();

        cy.get(`#${rowId}`)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', 'true');
        cy.get(`#${rowId}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', 'true');
    });

    // -------------------------------------------------------------------------
    // Model / view consistency
    // -------------------------------------------------------------------------

    it('form container initializes table, tableheader and tablerow views', () => {
        const allFields = formContainer.getAllFields();
        const tableViews = Object.values(allFields).filter(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const headerViews = Object.values(allFields).filter(f => f.getClass && f.getClass() === 'adaptiveFormTableHeader');
        const rowViews = Object.values(allFields).filter(f => f.getClass && f.getClass() === 'adaptiveFormTableRow');

        expect(tableViews.length, 'one table view should be initialized').to.equal(1);
        expect(headerViews.length, 'one tableheader view should be initialized').to.equal(1);
        // row1 (static) + row2 (repeatable, 1 initial instance)
        expect(rowViews.length, 'at least two tablerow views should be initialized').to.be.gte(2);
    });

    it('table model children count matches view children count', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');

        const modelChildCount = tableView.getModel().items.length;
        expect(modelChildCount, 'model should have children').to.be.gte(1);
        // The table view's children array should reflect what the model reports
        expect(tableView.children.length).to.equal(modelChildCount);
    });
});
