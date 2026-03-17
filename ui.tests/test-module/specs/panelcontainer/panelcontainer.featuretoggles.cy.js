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
describe("Form Runtime - Panel Container Feature Toggles", () => {
    if (cy.af.isLatestAddon()) {
        const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/basic.html";

        let formContainer = null;
        let toggle_array = [];

        before(() => {
            cy.fetchFeatureToggles().then((response) => {
                if (response.status === 200) {
                    toggle_array = response.body.enabled;
                }
            });
        });

        it("FT_FORMS-24358: panel container children should be accessible when exported as items array", () => {
            if (toggle_array.includes("FT_FORMS-24358")) {
                // With FT_SKIP_ITEMS_MAP enabled, AbstractContainerImpl returns an empty :items map
                // and an empty :itemsOrder array, but populates the "items" array instead.
                // The runtime must initialize children correctly from the array format.
                cy.previewFormWithPanel(pagePath).then(p => {
                    formContainer = p;
                    expect(formContainer, "formContainer is initialized").to.not.be.null;
                    const fields = formContainer.getAllFields();
                    expect(Object.keys(fields).length, "all panel children are registered").to.be.greaterThan(0);
                    cy.get('[data-cmp-is="adaptiveFormPanel"]').should("exist");
                    const [firstChildId] = Object.entries(formContainer._fields)[0];
                    cy.get(`#${firstChildId}`).should("exist");
                });
            }
        });
    }
});
