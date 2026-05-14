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

describe("Form with Summary Step component", () => {

    const pagePath = "content/forms/af/core-components-it/samples/summarystep/basic.html";
    const bemBlock = 'cmp-adaptiveform-summarystep';
    const IS = "adaptiveFormSummaryStep";
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
    });

    const tabSelector = 'ol li';
    const tab1 = () => cy.get(tabSelector).eq(0);
    const tab2 = () => cy.get(tabSelector).eq(1);

    it("should initialize form container", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
    });

    it("should render the summary step in the second tab", () => {
        tab2().click();
        tab2().should('have.class', 'cmp-tabs__tab--active');
        cy.get(`[data-cmp-is="${IS}"]`).should('exist').and('be.visible');
    });

    it("should have correct BEM block and data attributes on the summary step", () => {
        tab2().click();
        cy.get(`[data-cmp-is="${IS}"]`)
            .should('have.attr', 'data-cmp-is', IS)
            .and('have.attr', 'data-cmp-visible', 'true');
        cy.get(`.${bemBlock}`).should('exist');
        cy.get(`.${bemBlock}__content`).should('exist');
    });

    it("should display the configured displayMsg in the message area", () => {
        tab2().click();
        cy.get(`.${bemBlock}__message`)
            .should('exist')
            .and('not.be.empty');
        cy.get(`.${bemBlock}__message`).invoke('text').then(text => {
            expect(text.trim()).to.include('Thank you');
        });
    });

    it("should not show the summary step on the first tab", () => {
        tab1().click();
        cy.get(`[data-cmp-is="${IS}"]`).should('not.be.visible');
    });
});
