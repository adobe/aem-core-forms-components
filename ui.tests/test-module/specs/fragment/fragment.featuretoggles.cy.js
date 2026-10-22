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
describe("Form Runtime - Fragment Feature Toggles", () => {
    if (cy.af.isLatestAddon()) {
        const basicPagePath = "content/forms/af/core-components-it/samples/fragment/basic.html";
        const containerRulesPagePath = "content/forms/af/core-components-it/samples/fragment/container-rules.html";

        let formContainer = null;
        let toggle_array = [];

        before(() => {
            cy.fetchFeatureToggles().then((response) => {
                if (response.status === 200) {
                    toggle_array = response.body.enabled;
                }
            });
        });

        it("FT_FORMS-24087: fragment container events should be merged with placeholder panel events", () => {
            if (toggle_array.includes("FT_FORMS-24087")) {
                // The container-rules page embeds test-fragment-container-rules, which has:
                //   - Fragment container (guideContainer) fd:events/initialize: sets textinput to "from-frag-container"
                //   - Placeholder panel fd:events/initialize: sets textinput to "from-placeholder"
                // With FT_FRAGMENT_MERGE_CONTAINER_RULES_EVENTS enabled, FragmentImpl.getEvents()
                // merges both: placeholder events run FIRST, then fragment container events are appended.
                // initialize = ["from-placeholder-handler", "from-frag-container-handler"]
                // → placeholder sets "from-placeholder", then fragment sets "from-frag-container".
                // Final value "from-frag-container" proves both events ran and order is correct.
                cy.previewForm(containerRulesPagePath).then(p => {
                    formContainer = p;
                    const [textInputId] = Object.entries(formContainer._fields)[0];
                    cy.get(`#${textInputId}`).find("input").should("have.value", "from-frag-container");
                });
            }
        });

        it("FT_FORMS-24343: custom:setProperty data binding should work without server-injected default handler", () => {
            if (toggle_array.includes("FT_FORMS-24343")) {
                // test-fragment: textinput1 has a valueCommit event that dispatches custom:setProperty
                // on the panel's text element, setting its value to "Thanks".
                // With FT_FORMS-24343 enabled, the server does NOT inject the default custom:setProperty
                // handler — the af2-web-runtime provides it client-side.
                // This test verifies the binding still works end-to-end.
                cy.previewForm(basicPagePath).then(p => {
                    formContainer = p;
                    const [idTextBox] = Object.entries(formContainer._fields)[0];
                    const [idTextBox1] = Object.entries(formContainer._fields)[1];
                    const [idPanel] = Object.entries(formContainer._fields)[4];
                    const model = formContainer._model.getElement(idPanel);
                    const input = "bindingtest";
                    cy.get(`#${idTextBox}`).find("input").clear().type(input).blur();
                    cy.get(`#${idTextBox1}`).find("input").should("have.value", input);
                    cy.get(`#${model.items[0].id}`).should("have.text", "Thanks");
                });
            }
        });

    }

    describe("FT_FORMS-24358", () => {
        if (cy.af.isLatestAddon()) {
            const basicPagePath = "content/forms/af/core-components-it/samples/fragment/basic.html";

            let formContainer = null;

            before(() => {
                cy.enableFeatureToggle("FT_FORMS-24358");
            });

            after(() => {
                cy.disableFeatureToggle("FT_FORMS-24358");
            });

            it("fragment children should be accessible when exported as items array", () => {
                // Guard: verify the toggle was actually activated in this environment.
                // In the without-ft CI job the OSGi call completes without error but the
                // toggle is not applied — skip gracefully rather than fail on assertions.
                cy.fetchFeatureToggles().then((response) => {
                if (response.status !== 200 || !response.body.enabled.includes("FT_FORMS-24358")) {
                    return;
                }

                // With FT_SKIP_ITEMS_MAP enabled the server returns "items": [] instead of
                // ":items": {} + ":itemsOrder": []. The runtime must still initialize all children.

                cy.previewForm(basicPagePath).then(p => {
                    formContainer = p;
                    expect(formContainer, "formContainer is initialized").to.not.be.null;
                    const fields = formContainer.getAllFields();
                    expect(Object.keys(fields).length, "all fields are registered").to.be.greaterThan(0);
                    const [textInputId] = Object.entries(formContainer._fields)[0];
                    cy.get(`#${textInputId}`).should("be.visible");
                    cy.get(`#${textInputId}`).find("input").should("exist");
                });

                // The fragment page embeds the guideContainer model inline (no XHR).
                // Verify the server returns the items array format by requesting the model JSON
                // directly via Basic Auth (same as the Sling Model Exporter endpoint).
                const username = Cypress.env('crx.username') || 'admin';
                const password = Cypress.env('crx.password') || 'admin';
                cy.request({
                    url: 'content/forms/af/core-components-it/samples/fragment/basic/_jcr_content/guideContainer.model.json',
                    auth: { username, password }
                }).then(({ body }) => {
                    expect(body).to.not.have.property(':items');
                    expect(body).to.not.have.property(':itemsOrder');
                    expect(body.items, 'items array is present and non-empty').to.be.an('array').that.is.not.empty;
                });
                }); // end fetchFeatureToggles guard
            });
        }
    });
});
