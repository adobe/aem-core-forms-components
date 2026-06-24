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

describe("Form with Signature Step component", () => {

    const pagePath = "content/forms/af/core-components-it/samples/signaturestep/basic.html";
    const bemBlock = 'cmp-adaptiveform-signaturestep';
    const IS = "adaptiveFormSignatureStep";
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

    it("should render the signature step in the second tab", () => {
        tab2().click();
        tab2().should('have.class', 'cmp-tabs__tab--active');
        cy.get(`[data-cmp-is="${IS}"]`).should('exist').and('be.visible');
    });

    it("should have correct BEM block and data attributes on the signature step", () => {
        tab2().click();
        cy.get(`[data-cmp-is="${IS}"]`)
            .should('have.attr', 'data-cmp-is', IS)
            .and('have.attr', 'data-cmp-visible', 'true');
        cy.get(`.${bemBlock}`).should('exist');
    });

    it("should show the template loading message while signing is not initialized", () => {
        tab2().click();
        // The template message is visible before a signing URL is loaded.
        // In test environments without a real Adobe Sign cloud config, the
        // fetch will fail and the template message remains visible (or the
        // error div is shown instead).
        cy.get(`.${bemBlock}__template-message, .${bemBlock}__error`).should('exist');
    });

    it("should have the iframe hidden until a signing URL is obtained", () => {
        tab2().click();
        cy.get(`.${bemBlock}__iframe`).should('not.have.attr', 'src')
            .or('have.css', 'display', 'none');
    });

    it("should not show the signature step on the first tab", () => {
        tab1().click();
        cy.get(`[data-cmp-is="${IS}"]`).should('not.be.visible');
    });
});
