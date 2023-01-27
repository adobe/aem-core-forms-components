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
describe("Form Runtime with Text Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/textinput/basic.html"
    const bemBlock = 'cmp-adaptiveform-textinput'
    const IS = "adaptiveFormTextInput"
    const selectors = {
        textinput : `[data-cmp-is="${IS}"]`
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
            if(field.options.visible === "true") {
                expect(field.getId()).to.equal(id)
                expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
                checkHTML(id, field.getModel().getState())
            }
        });
    })

    it(" model's changes are reflected in the html ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        model.value = "some other value"
        checkHTML(model.id, model.getState()).then(() => {
            model.visible = false
            return checkHTML(model.id, model.getState())
        }).then(() => {
            model.enabled = false
            return checkHTML(model.id, model.getState())
        })
    });

    it(" html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        const input = "value"
        cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
            expect(model.getState().value).to.equal(input)
        })
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })

    it("should show and hide other fields on a certain input", () => {
        // Rule on textBox1: When textBox1 has input "adobe" => Show textBox3 and Hide textBox2

        const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
        const [textbox2, textbox2FieldView] = Object.entries(formContainer._fields)[1];
        const [textbox3, textbox3FieldView] = Object.entries(formContainer._fields)[2];
        const input = "adobe";

        cy.get(`#${textbox1}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${textbox3}`).should('be.visible')
            cy.get(`#${textbox2}`).should('not.be.visible')
        })
    })

    it("should enable and disable other textfields on a certain string input", () => {
        // Rule on textBox1: When textBox1 has input "aem" => Enable textBox2 and Disable textBox4

        const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
        const [textbox2, textBox2FieldView] = Object.entries(formContainer._fields)[1];
        const [textbox4, textBox4FieldView] = Object.entries(formContainer._fields)[3];
        const input = "aem";

        cy.get(`#${textbox1}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${textbox2}`).find("input").should('be.enabled')
            cy.get(`#${textbox4}`).find("input").should('not.be.enabled')
        })
    })

    it("should show validation error messages", () => {
        // Rule on textBox1: Validate textBox1 using Expression: textBox1 === "validate"

        const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
        const incorrectInput = "invalidate";
        const correctInput = "validate";


        cy.get(`#${textbox1}`).find("input").clear().type(incorrectInput).blur().then(x => {
            cy.get(`#${textbox1}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"There is an error in the field")
        })

        cy.get(`#${textbox1}`).find("input").clear().type(correctInput).blur().then(x => {
            cy.get(`#${textbox1}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"")
        })
    })
})
