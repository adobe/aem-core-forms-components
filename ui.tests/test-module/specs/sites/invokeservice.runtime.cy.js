/*******************************************************************************
 * Copyright 2023 Adobe
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
describe("Invoke Service", () => {
    const pagePath = "content/forms/sites/core-components-it/blank.html";

    let formContainer = null;
    let toggle_array = [];

    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    if (cy.af.isLatestAddon()) {
        it("should execute for forms inside sites", () => {
            cy.intercept('POST', '**af.dermis**').as('invokeService');
            cy.previewForm(pagePath)
            cy.wait('@invokeService').then(({response}) => {
                expect(response.statusCode).to.equal(400);
                if (toggle_array.includes("FT_FORMS-3512")) {
                    expect(response.body).to.contain('Invalid form data model path');
                } else {
                    expect(response.body).to.contain('Error During Form Submission');
                }
            });
        })
    }
})