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

describe('Form Runtime with Table - Repeatability Tests', () => {

    // Sample page has: table > header (2 cols) + row1 (static) + row2 (repeatable, min=1, max=3)
    const pagePath = "content/forms/af/core-components-it/samples/table/basic.html";
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
    });

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    const getRepeatableRowInstanceManager = () => {
        const allFields = formContainer.getAllFields();
        const rowViews = Object.values(allFields).filter(f => f.getClass && f.getClass() === 'adaptiveFormTableRow');
        const repeatableRowView = rowViews.find(r => r.getModel().repeatable);
        expect(repeatableRowView, 'repeatable table row view must exist').to.exist;
        return repeatableRowView.getInstanceManager();
    };

    /**
     * Fires addInstance() or removeInstance() on the instance manager, waits for
     * the AF event, then resolves with the updated instance count.
     */
    const triggerInstanceChange = (instanceManager, isAdd) => {
        const EVENT_NAME = isAdd ? 'AF_PanelInstanceAdded' : 'AF_PanelInstanceRemoved';
        let resolve;
        const promise = new Cypress.Promise(r => { resolve = r; });

        cy.get('[data-cmp-is="adaptiveFormContainer"]').then(el => {
            const listener = e => {
                el[0].removeEventListener(EVENT_NAME, listener);
                resolve(e.detail);
            };
            el[0].addEventListener(EVENT_NAME, listener);
        }).then(() => {
            if (isAdd) {
                instanceManager.addInstance();
            } else {
                instanceManager.removeInstance();
            }
        });

        return promise;
    };

    // -------------------------------------------------------------------------
    // Initial render of the repeatable row
    // -------------------------------------------------------------------------

    it('repeatable row renders add and remove buttons', () => {
        const allFields = formContainer.getAllFields();
        const rowViews = Object.values(allFields).filter(f => f.getClass && f.getClass() === 'adaptiveFormTableRow');
        const repeatableRowView = rowViews.find(r => r.getModel().repeatable);
        const rowId = repeatableRowView.getId();

        cy.get(`#${rowId} .cmp-adaptiveform-tablerow__add-button`).should('exist');
        cy.get(`#${rowId} .cmp-adaptiveform-tablerow__remove-button`).should('exist');
    });

    it('add button hook attribute references its own row id', () => {
        const allFields = formContainer.getAllFields();
        const rowViews = Object.values(allFields).filter(f => f.getClass && f.getClass() === 'adaptiveFormTableRow');
        const repeatableRowView = rowViews.find(r => r.getModel().repeatable);
        const rowId = repeatableRowView.getId();

        cy.get(`#${rowId} .cmp-adaptiveform-tablerow__add-button`)
            .invoke('attr', 'data-cmp-hook-add-instance')
            .should('eq', rowId);
    });

    it('remove button hook attribute references its own row id', () => {
        const allFields = formContainer.getAllFields();
        const rowViews = Object.values(allFields).filter(f => f.getClass && f.getClass() === 'adaptiveFormTableRow');
        const repeatableRowView = rowViews.find(r => r.getModel().repeatable);
        const rowId = repeatableRowView.getId();

        cy.get(`#${rowId} .cmp-adaptiveform-tablerow__remove-button`)
            .invoke('attr', 'data-cmp-hook-remove-instance')
            .should('eq', rowId);
    });

    // -------------------------------------------------------------------------
    // minOccur / maxOccur button visibility at initial state (count = 1)
    // -------------------------------------------------------------------------

    it('remove button is hidden at minOccur (1 instance)', () => {
        // data-cmp-visible is only written after an add/remove event fires, so we
        // add one instance then remove it to land back at minOccur=1 with the
        // attribute correctly set to 'false'.
        const instanceManager = getRepeatableRowInstanceManager();

        triggerInstanceChange(instanceManager, true).then(() => {
            triggerInstanceChange(instanceManager, false).then(() => {
                expect(instanceManager.children.length).to.equal(1);
                const firstRowId = instanceManager.children[0].getId();
                cy.get(`#${firstRowId} .cmp-adaptiveform-tablerow__remove-button`)
                    .invoke('attr', 'data-cmp-visible')
                    .should('eq', 'false');
            });
        });
    });

    it('add button is visible when instance count is below maxOccur', () => {
        // data-cmp-visible is only written after an add/remove event fires, so we
        // add one instance then remove it to land back at count=1 (below maxOccur=3)
        // with the attribute correctly set to 'true'.
        const instanceManager = getRepeatableRowInstanceManager();

        triggerInstanceChange(instanceManager, true).then(() => {
            triggerInstanceChange(instanceManager, false).then(() => {
                expect(instanceManager.children.length).to.equal(1);
                const firstRowId = instanceManager.children[0].getId();
                cy.get(`#${firstRowId} .cmp-adaptiveform-tablerow__add-button`)
                    .invoke('attr', 'data-cmp-visible')
                    .should('eq', 'true');
            });
        });
    });

    // -------------------------------------------------------------------------
    // Add instance
    // -------------------------------------------------------------------------

    it('adding a row increases the tbody row count by 1', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();

        cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`).then($rows => {
            const before = $rows.length;
            const instanceManager = getRepeatableRowInstanceManager();

            triggerInstanceChange(instanceManager, true).then(() => {
                cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`)
                    .should('have.length', before + 1);
            });
        });
    });

    it('added rows have unique id attributes', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();
        const instanceManager = getRepeatableRowInstanceManager();

        triggerInstanceChange(instanceManager, true).then(() => {
            triggerInstanceChange(instanceManager, true).then(() => {
                cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`).then($rows => {
                    const ids = [...$rows].map(r => r.id).filter(Boolean);
                    const uniqueIds = new Set(ids);
                    expect(uniqueIds.size).to.equal(ids.length);
                });
            });
        });
    });

    it('add/remove hook attributes on cloned rows point to the correct row id', () => {
        const instanceManager = getRepeatableRowInstanceManager();

        triggerInstanceChange(instanceManager, true).then(() => {
            // Assert on the instance manager's children directly — these are guaranteed
            // to be repeatable rows and always have add/remove buttons.
            instanceManager.children.forEach(childView => {
                const rowId = childView.getId();
                cy.get(`#${rowId} .cmp-adaptiveform-tablerow__add-button`)
                    .invoke('attr', 'data-cmp-hook-add-instance')
                    .should('eq', rowId);
                cy.get(`#${rowId} .cmp-adaptiveform-tablerow__remove-button`)
                    .invoke('attr', 'data-cmp-hook-remove-instance')
                    .should('eq', rowId);
            });
        });
    });

    // -------------------------------------------------------------------------
    // maxOccur enforcement (max = 3)
    // -------------------------------------------------------------------------

    it('add button is hidden on all rows when maxOccur is reached', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();
        const instanceManager = getRepeatableRowInstanceManager();

        // Add 2 more rows to reach maxOccur=3
        triggerInstanceChange(instanceManager, true).then(() => {
            triggerInstanceChange(instanceManager, true).then(() => {
                expect(instanceManager.children.length).to.equal(3);
                cy.get(`#${tableId} .cmp-adaptiveform-tablerow__add-button`).each($btn => {
                    cy.wrap($btn).invoke('attr', 'data-cmp-visible').should('eq', 'false');
                });
            });
        });
    });

    it('instance manager model reflects correct count at maxOccur', () => {
        const instanceManager = getRepeatableRowInstanceManager();

        triggerInstanceChange(instanceManager, true).then(() => {
            triggerInstanceChange(instanceManager, true).then(() => {
                expect(instanceManager.children.length).to.equal(3);
                expect(instanceManager.getModel().items.length).to.equal(3);
                // Adding beyond max should not increase count
                instanceManager.addInstance();
                expect(instanceManager.children.length).to.equal(3);
            });
        });
    });

    // -------------------------------------------------------------------------
    // Remove instance
    // -------------------------------------------------------------------------

    it('removing a row decreases the tbody row count by 1', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();
        const instanceManager = getRepeatableRowInstanceManager();

        // Add one first so we can remove without hitting minOccur
        triggerInstanceChange(instanceManager, true).then(() => {
            cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`).then($rows => {
                const before = $rows.length;
                triggerInstanceChange(instanceManager, false).then(() => {
                    cy.get(`#${tableId} tbody tr.cmp-adaptiveform-tablerow__root`)
                        .should('have.length', before - 1);
                });
            });
        });
    });

    it('remove button is hidden on all rows when minOccur is reached after removal', () => {
        const allFields = formContainer.getAllFields();
        const tableView = Object.values(allFields).find(f => f.getClass && f.getClass() === 'adaptiveFormTable');
        const tableId = tableView.getId();
        const instanceManager = getRepeatableRowInstanceManager();

        // Add then remove to land back at minOccur=1
        triggerInstanceChange(instanceManager, true).then(() => {
            triggerInstanceChange(instanceManager, false).then(() => {
                expect(instanceManager.children.length).to.equal(1);
                cy.get(`#${tableId} .cmp-adaptiveform-tablerow__remove-button`).each($btn => {
                    cy.wrap($btn).invoke('attr', 'data-cmp-visible').should('eq', 'false');
                });
            });
        });
    });
});
