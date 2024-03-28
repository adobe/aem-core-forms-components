/*******************************************************************************
 * Copyright 2024 Adobe
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
 ******************************************************************************/
describe("SetFocus Test", () => {
    const pagePath = "content/forms/af/core-components-it/samples/setfocustest.html"
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
    });

    const nextBtn = '#button-c974c7515a-widget';
    const focusTnC = '#button-61a837277a-widget';

    it('Check setFocus for all components' ,() => {
        cy.get('[data-cmp-is="adaptiveFormPanel"]').find('[data-cmp-is]').each(($component) => {
            cy.get(nextBtn).click().then(() => {
                    cy.wrap($component).should('have.attr', 'data-cmp-active', 'true');
            });
        });
        cy.get(focusTnC).click().then(() => {
            cy.get('[id="text-3c677e9184"]').should('have.attr', 'data-cmp-active', 'true');
        })
    });

    it('Check if setting focus by clicking/typing in view is reflected in model', () => {
        cy.get('[data-cmp-is="adaptiveFormNumberInput"] > input').type('123').then(() => {
            cy.get(nextBtn).click().then(() => {
                cy.get('[data-cmp-is="adaptiveFormTelephoneInput"]').should('have.attr', 'data-cmp-active', 'true');
            })
        })
    })
});