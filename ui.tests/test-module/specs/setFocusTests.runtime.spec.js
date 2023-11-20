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
describe("Form with multipe components", () => {

    const pagePath = "content/forms/af/core-components-it/samples/setfocus.html";
    let formContainer = null


    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it("check if first tab activated if focus call from other tab", () => {
        const firstChildComponentId = formContainer._model.items[7].items[1].items[0].id;
        const firstChildComponentButtonId = formContainer._model.items[0].id ;
                cy.get(`#${firstChildComponentButtonId}`).click();
                cy.get(`#${firstChildComponentId}`).isElementInViewport().should("eq", true);
            })
        
   
})