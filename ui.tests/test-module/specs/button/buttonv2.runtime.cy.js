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
describe("Form Runtime with Button Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/button/buttonv2/basic.html"
    const bemBlock = 'cmp-adaptiveform-button'
    const IS = "adaptiveFormButton"
    const selectors = {
        buttonGroup : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null
    let toggle_array = [];

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })

        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    it(`should have type as button`, () => {
        cy.get('.cmp-adaptiveform-button__widget').eq(0).should('have.attr', 'type', 'button');
    });

})
