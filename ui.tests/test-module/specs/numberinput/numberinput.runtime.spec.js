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
describe("Form with Number Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/numberinput/basic.html"
    const bemBlock = 'cmp-adaptiveform-numberinput'
    const IS = "adaptiveFormNumberInput"
    const selectors = {
        numberinput : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
        const value = state.value == null ? '' : state.value;
        cy.get(`#${id}`)
            .should(passVisibleCheck)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', visible.toString());
        cy.get(`#${id}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', state.enabled.toString());
        return cy.get(`#${id}`).within((root) => {
            cy.get('*').should(passVisibleCheck)
            cy.get('input')
                .should(passDisabledAttributeCheck, 'disabled');
            cy.get('input').should('have.value', value)
        })
    }

    it(" should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
            checkHTML(id, field.getModel().getState())
        });
    })

    it(" model's changes are reflected in the html ", () => {
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            let model = field.getModel();
            model.value = 24
            checkHTML(model.id, model.getState()).then(() => {
                model.visible = false
                return checkHTML(model.id, model.getState())
            }).then(() => {
                model.enabled = false
                return checkHTML(model.id, model.getState())
            })
        });
    });

    it(" html changes are reflected in model ", () => {
        const input = 23
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            let model = field.getModel();
            if (model.visible && model.enabled) {
                cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
                    expect(Number(model.getState().value)).to.equal(input)
                })
            }
        });
    });

    it(" non-number html changes are reflected in model ", () => {
        const input = "$23"
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            let model = field.getModel();
            if (model.visible && model.enabled) {
                cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
                    expect(Number(model.getState().value)).to.equal(23)
                })
            }
        });
    });

    it(" copy-paste html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[2]
        const model = formContainer._model.getElement(id)
        model.enabled = true
        let input = "$23" // in case of invalid input, copy paste does not work
        cy.get(`#${id}`).find("input").clear().paste({pasteType: 'text/plain', pastePayload: `${input}`}).blur().then(x => {
            expect(model.getState().value).to.equal("")
            input = "23" // in case of valid input, paste works
            cy.get(`#${id}`)
                .find("input")
                .clear()
                .paste({pasteType: 'text/plain', pastePayload: `${input}`}) // dispatch paste event
                .type(input) // typing explicitly since synthetic paste event does not affect document content
                .blur().then(x => {
                expect(Number(model.getState().value)).to.equal(Number(input));
            })
        })
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })

    it("should show and hide other fields on a certain number input", () => {
        // Rule on numberInput1: When numberInput1 has input 93 => Show numberInput2 and Hide numberInput3

        const [numberInput1, numberInput1FieldView] = Object.entries(formContainer._fields)[0];
        const [numberInput2, numberInput2FieldView] = Object.entries(formContainer._fields)[1];
        const [numberInput3, numberInput3FieldView] = Object.entries(formContainer._fields)[2];

        const input = "93";

        cy.get(`#${numberInput1}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${numberInput2}`).should('be.visible')
            cy.get(`#${numberInput3}`).should('not.be.visible')
        })
    })

    it("should enable and disable other numberfields on a certain number input", () => {
        // Rule on numberInput1: When numberInput1 has input 123 => Enable numberInput3 and Disable numberInput4

        const [numberInput1, numberInput1FieldView] = Object.entries(formContainer._fields)[0];
        const [numberInput3, numberInput3FieldView] = Object.entries(formContainer._fields)[2];
        const [numberInput4, numberInput4FieldView] = Object.entries(formContainer._fields)[3];
        const input = "123";

        cy.get(`#${numberInput1}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${numberInput3}`).find("input").should('be.enabled')
            cy.get(`#${numberInput4}`).find("input").should('not.be.enabled')
        })
    })

    it("should show validation error messages", () => {
        // Rule on numberInput4: Validate numberInput4 using Expression: numberInput4 == 64

        const [numberInput4, numberInput1FieldView] = Object.entries(formContainer._fields)[3];
        const incorrectInput = "42";
        const correctInput = "64";


        cy.get(`#${numberInput4}`).find("input").clear().type(incorrectInput).blur().then(x => {
            cy.get(`#${numberInput4}`).find(".cmp-adaptiveform-numberinput__errormessage").should('have.text',"There is an error in the field")
        })

        cy.get(`#${numberInput4}`).find("input").clear().type(correctInput).blur().then(x => {
            cy.get(`#${numberInput4}`).find(".cmp-adaptiveform-numberinput__errormessage").should('have.text',"")
        })
    })
})
