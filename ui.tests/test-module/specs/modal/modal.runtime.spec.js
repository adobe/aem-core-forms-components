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
describe('Form Runtime with Modal Component', () => {
    const pagePath = "content/forms/af/core-components-it/samples/modal/basic.html"
    const bemBlock = 'cmp-adaptiveform-modal'
    const IS = "adaptiveFormModal"
    const selectors = {
        modal : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it('opens the modal when the button is clicked, and makes the background inactive', () => {
        // Click the button to open the modal
        cy.get(`.${bemBlock}__button`).click();

        // Check that the modal and overlay are visible
        cy.get(`.${bemBlock}__dialog`).should('be.visible');

        cy.get(`.${bemBlock}__overlay`).should('be.visible');
    });

    it('closes the modal when the Escape key is pressed, and makes the background active again', () => {
        // Open the modal
        cy.get(`.${bemBlock}__button`).click();

        // Check that the modal is visible
        cy.get(`.${bemBlock}__overlay`).should('be.visible');

        // Simulate pressing the Escape key
        cy.get('body').type('{esc}');

        // Check that the modal is no longer visible
        cy.get(`.${bemBlock}__overlay`).should('not.exist');
    });

});