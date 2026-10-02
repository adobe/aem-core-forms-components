/*
 * Copyright 2026 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global cy, Cypress */

describe('Component insertion command', () => {
    const componentName = 'Adaptive Form Telephone Input';
    const componentType = 'test/components/telephoneinput';

    Cypress.Commands.overwrite('openEditableToolbar', (original, selector) => {
        return cy.get(selector).should('be.visible');
    });

    const openInsertFixture = replaceSearchInput => {
        cy.intercept('GET', '**/__insert_component_fixture__', {
            headers: {'Content-Type': 'text/html'},
            body: `<html><body>
                <button id="overlay" data-action="INSERT">Insert</button>
                <div class="InsertComponentDialog" style="display: none">
                    <div class="InsertComponentDialog-components">
                        <input id="stale-search" type="search" value="stale">
                        <button value="${componentType}">Stale component</button>
                    </div>
                </div>
                <div id="active-dialog" class="InsertComponentDialog" style="display: none">
                    <div class="InsertComponentDialog-components">
                        <input id="active-search" type="search" value="Previous search">
                        <button id="component" value="${componentType}" style="display: none">${componentName}</button>
                    </div>
                </div>
                <div id="result"></div>
            </body></html>`
        });
        cy.visit('/__insert_component_fixture__');
        cy.document().then(doc => {
            const dialog = doc.getElementById('active-dialog');
            const input = doc.getElementById('active-search');
            const component = doc.getElementById('component');
            doc.getElementById('overlay').addEventListener('click', () => {
                doc.defaultView.setTimeout(() => {
                    dialog.style.display = 'block';
                }, 50);
            });
            if (replaceSearchInput) {
                input.addEventListener('input', () => {
                    if (input.value === '') {
                        input.replaceWith(input.cloneNode(true));
                    }
                });
            }
            dialog.addEventListener('keydown', event => {
                if (event.key === 'Enter') {
                    component.style.display = 'block';
                }
            });
            component.addEventListener('click', () => {
                doc.getElementById('result').textContent = 'inserted';
                dialog.style.display = 'none';
            });
        });
    };

    [false, true].forEach(replaceSearchInput => {
        it(replaceSearchInput ? 're-queries a search input replaced after clearing' :
            'ignores a retained hidden dialog and waits for the active dialog', () => {
            openInsertFixture(replaceSearchInput);
            cy.insertComponent('#overlay', componentName, componentType);
            cy.get('#result').should('have.text', 'inserted');
            cy.get('#active-search').should('have.value', componentName);
            cy.get('#stale-search').should('have.value', 'stale');
        });
    });
});
