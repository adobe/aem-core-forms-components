/*******************************************************************************
 * Copyright 2022 Adobe
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
describe("Form with Submit Button", () => {

    const pagePath = "content/forms/af/core-components-it/samples/actions/submit/basic.html"
    const customSubmitPagePath = "content/forms/af/core-components-it/samples/actions/submit/customsubmit/basic.html"
    const bemBlock = 'cmp-button'
    const IS = "adaptiveFormButton"
    const selectors = {
        submit : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null;

    it("should get model and view initialized properly ", () => {
        cy.previewForm(pagePath).then(p => {
                formContainer = p;
                expect(formContainer, "formcontainer is initialized").to.not.be.null;
                expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
                Object.entries(formContainer._fields).forEach(([id, field]) => {
                expect(field.getId()).to.equal(id)
                expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
                    });
                })
    })

    it("Form submit should show validation errors", () => {
            cy.previewForm(pagePath);
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                Object.entries(formContainer._fields).forEach(([id, field]) => {
                    // if non submit field, check that all have error message in them
                    if (id.indexOf('submit') === -1) {
                        cy.get(`#${id}`).find(`.cmp-adaptiveform-${id.split("-")[0]}__errormessage`).should('have.text', "There is an error in the field")
                    }
                });
            });
    });


    it("Custom Submit Action Test", () => {
        cy.previewForm(customSubmitPagePath);
        cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
            cy.get('body').should('have.text', "Thank you for submitting the form.\n")
        });
    })

})