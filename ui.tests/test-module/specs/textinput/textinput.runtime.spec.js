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

    before(() => {
        cy.attachConsoleErrorSpy();
    });

    const pagePath = "content/forms/af/core-components-it/samples/textinput/basic.html"
    const localisationPagePath = "content/forms/af/core-components-it/samples/textinput/basic_with_dictionary_en_to_de.de.html"
    const bemBlock = 'cmp-adaptiveform-textinput'
    const IS = "adaptiveFormTextInput"
    const selectors = {
        textinput : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    beforeEach(() => {
        if (Cypress.mocha.getRunner().suite.ctx.currentTest.title  !== "should show different localised default error messages on different constraints") {
            cy.previewForm(pagePath).then(p => {
                formContainer = p;
            })
        }
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
        cy.expectNoConsoleErrors();
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
        cy.expectNoConsoleErrors();
    })

    it("should set and clear value based on rules", () => {
        // Rule on textBox5: When input of textBox5 is "aemforms", set value of textBox1 to "new value" and clear value of textBox4

        const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
        const [textbox4, textBox4FieldView] = Object.entries(formContainer._fields)[3];
        const [textbox5, textBox5FieldView] = Object.entries(formContainer._fields)[4];

        const input = "aemforms";
        cy.get(`#${textbox4}`).find("input").clear().type("this must be cleared")
        cy.get(`#${textbox5}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${textbox4}`).find("input").should('have.value',"")
            cy.get(`#${textbox1}`).find("input").should('have.value', "new value")
        })
        cy.expectNoConsoleErrors();
    })

    it("should show different default error messages on different constraints", () => {
        const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
        const [textbox6, textBox6FieldView] = Object.entries(formContainer._fields)[5];
        const [textbox7, textBox7FieldView] = Object.entries(formContainer._fields)[6];
        const [textbox8, textBox8FieldView] = Object.entries(formContainer._fields)[7];

        const [submitbutton1, fieldView] = Object.entries(formContainer._fields)[8]

        // 1. Required
        cy.get(`#${textbox6}`).find("input").focus().blur().then(x => {
            cy.get(`#${textbox6}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Please fill in this field.")
        })

        // 2. Pattern: [^'\x22]+
        cy.get(`#${textbox6}`).find("input").clear().type("'").blur().then(x => {
            cy.get(`#${textbox6}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Please match the format requested.")
        })

        // 3. Maximum Number of Characters: 20
        cy.get(`#${submitbutton1}`).find("button").click()
        cy.get(`#${textbox7}`).find("input").then(x => {
            cy.get(`#${textbox7}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Please shorten this text to 20 characters or less.")
        })

        // 4. Minimum Number of Characters: 12
        cy.get(`#${textbox8}`).find("input").then(x => {
            cy.get(`#${textbox8}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Please lengthen this text to 12 characters or more.")
        })

        // 5. Script Validation: Validate textBox1 using Expression: textBox1 === "validate"
        // Rule on textBox1: Validate textBox1 using Expression: textBox1 === "validate"

        const incorrectInput = "invalidate";
        const correctInput = "validate";


        cy.get(`#${textbox1}`).find("input").clear().type(incorrectInput).blur().then(x => {
            cy.get(`#${textbox1}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Please enter a valid value.")
        })

        cy.get(`#${textbox1}`).find("input").clear().type(correctInput).blur().then(x => {
            cy.get(`#${textbox1}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"")
        })
        cy.expectNoConsoleErrors();

    })

    //Todo: Uncomment once the strings are translated in de.json
    it.skip("should show different localised default error messages on different constraints", () => {
        cy.previewForm(localisationPagePath).then(p => {
            formContainer = p;

            const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
            const [textbox2, textBox2FieldView] = Object.entries(formContainer._fields)[1];
            const [textbox3, textBox3FieldView] = Object.entries(formContainer._fields)[2];
            const [textbox4, textBox4FieldView] = Object.entries(formContainer._fields)[3];

            const [submitbutton1, fieldView] = Object.entries(formContainer._fields)[4]

            // 1. Required
            cy.get(`#${textbox2}`).find("input").focus().blur().then(x => {
                cy.get(`#${textbox2}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Bitte füllen Sie dieses Feld aus.")
            })

            // 2. Pattern: [^'\x22]+
            cy.get(`#${textbox2}`).find("input").clear().type("'").blur().then(x => {
                cy.get(`#${textbox2}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Bitte passen Sie das gewünschte Format an.")
            })

            // 3. Maximum Number of Characters: 20
            cy.get(`#${submitbutton1}`).find("button").click()
            cy.get(`#${textbox3}`).find("input").then(x => {
                cy.get(`#${textbox3}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Bitte kürzen Sie diesen Text auf maximal 20 Zeichen.")
            })

            // 4. Minimum Number of Characters: 12
            cy.get(`#${textbox4}`).find("input").then(x => {
                cy.get(`#${textbox4}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Bitte verlängern Sie diesen Text auf 12 Zeichen oder mehr.")
            })

            // 5. Script Validation: Validate textBox1 using Expression: textBox1 === "validate"
            // Rule on textBox1: Validate textBox1 using Expression: textBox1 === "validate"

            const incorrectInput = "invalidate";
            const correctInput = "validate";


            cy.get(`#${textbox1}`).find("input").clear().type(incorrectInput).blur().then(x => {
                cy.get(`#${textbox1}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Bitte geben Sie einen gültigen Wert ein.")
            })

            cy.get(`#${textbox1}`).find("input").clear().type(correctInput).blur().then(x => {
                cy.get(`#${textbox1}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"")
            })
        })

        it("should not show hidden text field component fields in different localised form", () => {
            cy.previewForm(localisationPagePath).then(p => {
                formContainer = p;

                const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
                const [textbox2, textBox2FieldView] = Object.entries(formContainer._fields)[1];
                const [textbox3, textBox3FieldView] = Object.entries(formContainer._fields)[2];
                const [textbox4, textBox4FieldView] = Object.entries(formContainer._fields)[3];

                const [submitbutton1, fieldView] = Object.entries(formContainer._fields)[4]

                // 1. Required
                cy.get(`#${textbox2}`).find("input").focus().blur().then(x => {
                    cy.get(`#${textbox2}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Bitte füllen Sie dieses Feld aus.")
                })

                // 2. Pattern: [^'\x22]+
                cy.get(`#${textbox2}`).find("input").clear().type("'").blur().then(x => {
                    cy.get(`#${textbox2}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Bitte passen Sie das gewünschte Format an.")
                })

                // 3. Maximum Number of Characters: 20
                cy.get(`#${submitbutton1}`).find("button").click()
                cy.get(`#${textbox3}`).find("input").then(x => {
                    cy.get(`#${textbox3}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Bitte kürzen Sie diesen Text auf maximal 20 Zeichen.")
                })

                // 4. Minimum Number of Characters: 12
                cy.get(`#${textbox4}`).find("input").then(x => {
                    cy.get(`#${textbox4}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Bitte verlängern Sie diesen Text auf 12 Zeichen oder mehr.")
                })

                // 5. Script Validation: Validate textBox1 using Expression: textBox1 === "validate"
                // Rule on textBox1: Validate textBox1 using Expression: textBox1 === "validate"

                const incorrectInput = "invalidate";
                const correctInput = "validate";


                cy.get(`#${textbox1}`).find("input").clear().type(incorrectInput).blur().then(x => {
                    cy.get(`#${textbox1}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Bitte geben Sie einen gültigen Wert ein.")
                })

                cy.get(`#${textbox1}`).find("input").clear().type(correctInput).blur().then(x => {
                    cy.get(`#${textbox1}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"")
                })
            })

    })
})
