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

    const pagePath = "content/forms/af/core-components-it/samples/submitbutton/basic.html"
    const bemBlock = 'cmp-submitbutton'
    const IS = "adaptiveFormSubmitButton"
    const selectors = {
        submitbutton : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    // const checkHTML = (id, state, isMultiSelect) => {
    //     const visible = state.visible;
    //     const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
    //     const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
    //     const value = state.value;
    //     cy.get(`#${id}`)
    //         .should(passVisibleCheck)
    //         .invoke('attr', 'data-cmp-visible')
    //         .should('eq', visible.toString());
    //     cy.get(`#${id}`)
    //         .invoke('attr', 'data-cmp-enabled')
    //         .should('eq', state.enabled.toString());
    //     return cy.get(`#${id}`).within((root) => {
    //         if(isMultiSelect) {
    //             cy.get("select")
    //                 .should(passVisibleCheck)
    //                 .find(':selected').each((option) => {
    //                 expect(parseInt(option.val())).to.be.oneOf(value);
    //             });
    //         } else {
    //             cy.get("select")
    //                 .should(passVisibleCheck)
    //                 .find(':selected').should("have.value", value)
    //         }
    //     })
    // }

    it("should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });
    })

    it("Clicking the button should submit the form", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id);

        //check for default value
        cy.get(`#${id}`).find("submitbutton").click().blur().then(x => {
            cy.get('body').should('have.text', "Thank you for submitting the form.")
        })
    });

})