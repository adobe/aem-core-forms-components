/*******************************************************************************
 * Copyright 2025 Adobe
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
describe("Form Runtime with XFA", () => {
    if(cy.af.isLatestAddon()) {
        const pagePath = "content/forms/af/core-components-it/samples/xfatest.html"
        const IS = "adaptiveFormButton"

        let formContainer = null
        let toggle_array = [];

        beforeEach(() => {
            cy.fetchFeatureToggles().then((response) => {
                if (response.status === 200) {
                    toggle_array = response.body.enabled;
                }
            });

            if (toggle_array && toggle_array.includes("FT_FORMS-14518")) {
                cy.previewForm(pagePath).then(p => {
                    formContainer = p;
                })
            }
        });


        it(`xfa rules would work`, () => {
            if (toggle_array && toggle_array.includes("FT_FORMS-14518")) {
                const [textInputId] = Object.entries(formContainer._fields)[0];
                const [showButtonId] = Object.entries(formContainer._fields)[3];
                const [hideButtonId] = Object.entries(formContainer._fields)[4];
                cy.get(`#${showButtonId}`).find('.cmp-adaptiveform-button__widget').click();
                cy.get(`#${textInputId}`).should("be.visible");
                cy.get(`#${hideButtonId}`).find('.cmp-adaptiveform-button__widget').click();
                cy.get(`#${textInputId}`).should("not.be.visible");
                cy.get(`#${showButtonId}`).find('.cmp-adaptiveform-button__widget').click();
                cy.get(`#${textInputId}`).should("be.visible");
            }
        });
    }
})
