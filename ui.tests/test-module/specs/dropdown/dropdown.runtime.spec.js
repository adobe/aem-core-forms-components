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
describe("Form with Dropdown", () => {

    const pagePath = "content/forms/af/core-components-it/samples/dropdown/basic.html"
    const bemBlock = 'cmp-adaptiveform-dropdown'
    const IS = "adaptiveFormDropDown"
    const selectors = {
        textinput : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state, isMultiSelect) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
        const value = state.value;
        cy.get(`#${id}`)
            .should(passVisibleCheck)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', visible.toString());
        cy.get(`#${id}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', state.enabled.toString());
        return cy.get(`#${id}`).within((root) => {
            if(isMultiSelect) {
                cy.get("select")
                    .should(passVisibleCheck)
                    .find(':selected').each((option) => {
                        expect(parseInt(option.val())).to.be.oneOf(value);
                });
            } else {
                cy.get("select")
                    .should(passVisibleCheck)
                    .find(':selected').should("have.value", value)
            }
        })
    }

    it(" should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });
    })

    it("Single Select: model's changes are reflected in the html", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id);
        const isMultiSelect = model.isArrayType();
        //check for default value
        cy.get(`#${id}`).get('select').find(':selected').should("have.value", model.getState().default);

        checkHTML(model.id, model.getState(), isMultiSelect).then(() => {
            model.value = 'c'
            return checkHTML(model.id, model.getState(), isMultiSelect)
        }).then(() => {
            model.visible = false
            return checkHTML(model.id, model.getState(),isMultiSelect)
        }).then(() => {
            model.enable = false
            return checkHTML(model.id, model.getState(), isMultiSelect)
        })
    });

    it("Multi Select: model's changes are reflected in the html", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[1];
        const model = formContainer._model.getElement(id);
        const isMultiSelect = model.isArrayType();
        // check for default value
        const defaultArray = model.getState().default;
        cy.get(`#${id}`).find(':selected').each((option) => {
            expect(parseInt(option.val())).to.be.oneOf(defaultArray);
        });

        checkHTML(model.id, model.getState(), isMultiSelect).then(() => {
            model.value = [1,4];
            return checkHTML(model.id, model.getState(), isMultiSelect)
        }).then(() => {
            model.enable = false
            return checkHTML(model.id, model.getState(), isMultiSelect)
        }).then(() => {
            model.visible = false
            return checkHTML(model.id, model.getState(), isMultiSelect)
        })
    });

    it("Single Select: html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id);
        cy.get(`#${id} select`).select("cauliflower").then(x => {
            expect(model.value).to.equal('c');
        });
    });

    it("Multi Select: html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[1]
        const model = formContainer._model.getElement(id);
        cy.get(`#${id} select`).select(["bus","car", "bike"]).then(x => {
            expect(model.value).to.deep.equal([1,2,3]);
        });
    });

})