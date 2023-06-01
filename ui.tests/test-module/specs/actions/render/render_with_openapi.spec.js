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
describe("Render form", () => {
    const pagePath = "content/forms/af/core-components-it/samples/actions/submit/basic.html";
    let formContainer = null;

    //if (cy.af.isLatestAddon()) {
        it("using open api to list/render form", () => {
            cy.previewForm(pagePath);
            // important: For this to work in local cloud ready SDK, restart is required
            // intercepting render call and returning with open api
            cy.getFromDefinitionUsingOpenAPI("/content/forms/af/core-components-it/samples/actions/submit/basic").then(function({body}){
                cy.intercept("GET",  '**/guideContainer.model.json', req => {
                    req.continue((res) => {
                        res.body = body.afModelDefinition;
                    });
                });
                cy.previewForm(pagePath, {'noLogin' : true}).then(p => {
                    formContainer = p;
                    expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
                });
            });
        }) 
    //}
});