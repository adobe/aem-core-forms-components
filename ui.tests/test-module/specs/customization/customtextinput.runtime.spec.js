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
describe("Form Runtime with Custom Text Input", () => {

    before(() => {
        cy.attachConsoleErrorSpy();
    });

    const pagePath = "content/forms/af/core-components-it/samples/textinput/custom.html"
    const bemBlock = 'cmp-adaptiveform-textinput'
    const IS = "adaptiveFormTextInput"
    const selectors = {
        textinput : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null
    let toggle_array = [];

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
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
        cy.expectNoConsoleErrors();
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
        cy.expectNoConsoleErrors();
    });

    it(" html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        const input = "value"
        cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
            expect(model.getState().value).to.equal(input)
        })
        cy.expectNoConsoleErrors();
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })


    it("should show different default error messages on different constraints only on click of submit button", () => {
        const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
        const [textbox6, textBox6FieldView] = Object.entries(formContainer._fields)[5];
        const [textbox7, textBox7FieldView] = Object.entries(formContainer._fields)[6];
        const [textbox8, textBox8FieldView] = Object.entries(formContainer._fields)[7];

        const [submitbutton1, fieldView] = Object.entries(formContainer._fields)[11];

        // Required field should not show error on blur due to custom text field
        cy.get(`#${textbox6}`).find("input").focus().clear().blur().then(x => {
            cy.get(`#${textbox6}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"")
        })

        // Click the submit button
        cy.get(`#${submitbutton1}-widget`).click();

        cy.get(`#${textbox7}`).find("input").then(x => {
            cy.get(`#${textbox7}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Please shorten this text to 20 characters or less.")
        })

        cy.get(`#${textbox8}`).find("input").then(x => {
            cy.get(`#${textbox8}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Please lengthen this text to 12 characters or more.")
        })
        cy.get(`#${textbox6}`).find("input").then(x => {
            cy.get(`#${textbox6}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Please fill in this field.")
        })

        cy.expectNoConsoleErrors();

    })

})
