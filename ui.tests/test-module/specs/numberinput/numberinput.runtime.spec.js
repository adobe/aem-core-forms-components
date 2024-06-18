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
    let toggle_array = [];
    const selectors = {
        numberinput : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

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
        const value = state.displayValue == null ? '' : state.displayValue;
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

    it("should show validation error messages based on expression rules", () => {
        // Rule on numberInput4: Validate numberInput4 using Expression: numberInput4 == 64
        const [numberInput4, numberInput4FieldView] = Object.entries(formContainer._fields)[3];
        const incorrectInput = "42";
        const correctInput = "64";

        cy.get(`#${numberInput4}`).find("input").clear().type(incorrectInput).blur().then(x => {
            cy.get(`#${numberInput4}`).find(".cmp-adaptiveform-numberinput__errormessage").should('have.text',"Please enter a valid value.")
            cy.get(`#${numberInput4} > div.${bemBlock}__errormessage`).should('have.attr', 'id', `${numberInput4}__errormessage`)
            cy.get(`#${numberInput4} > .${bemBlock}__widget`).should('have.attr', 'aria-describedby', `${numberInput4}__longdescription ${numberInput4}__shortdescription ${numberInput4}__errormessage`)
            cy.get(`#${numberInput4} > .${bemBlock}__widget`).should('have.attr', 'aria-invalid', 'true')
        })

        cy.get(`#${numberInput4}`).find("input").clear().type(correctInput).blur().then(x => {
            cy.get(`#${numberInput4}`).find(".cmp-adaptiveform-numberinput__errormessage").should('have.text',"")
            cy.get(`#${numberInput4} > .${bemBlock}__widget`).should('have.attr', 'aria-describedby', `${numberInput4}__longdescription ${numberInput4}__shortdescription`)
            cy.get(`#${numberInput4} > .${bemBlock}__widget`).should('have.attr', 'aria-invalid', 'false')
        })
    })

    it("should set and clear value based on rules", () => {
        // Rule on numberInput5: When input of numberInput5 is 4502, set value of numberInput4 to 400 and clear value of numberInput1

        const [numberInput1, numberInput1FieldView] = Object.entries(formContainer._fields)[0];
        const [numberInput4, numberInput4FieldView] = Object.entries(formContainer._fields)[3];
        const [numberInput5, numberInput5FieldView] = Object.entries(formContainer._fields)[4];

        const input = "4502";
        cy.get(`#${numberInput1}`).find("input").clear().type(495)
        cy.get(`#${numberInput5}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${numberInput1}`).find("input").should('have.value',"")
            cy.get(`#${numberInput4}`).find("input").should('have.value', 400)
        })
    })

    it("display pattern on numeric input should update the display value", () => {
        const [numberInput6, numberInput6FieldView] = Object.entries(formContainer._fields)[5];
        const input = "12212";
        let model = numberInput6FieldView.getModel();

        cy.get(`#${numberInput6}`).find("input").clear().type(input).blur().then(x => {
            expect(Number(model.getState().value)).to.equal(Number(input));
            cy.get(`#${numberInput6}`).find('input').should('have.value', model.getState().displayValue);
        })
    })

    it("integer type should not accept decimal", () => {
        const [numberInput7, numberInput7FieldView] = Object.entries(formContainer._fields)[6];
        const input = "11.22";
        let model = numberInput7FieldView.getModel();

        cy.get(`#${numberInput7}`).find("input").clear().type(input).blur().then(x => {
            expect(Number(model.getState().value)).to.equal(Number(1122));
            cy.get(`#${numberInput7}`).find('input').should('have.value', model.getState().displayValue);
        })
    })

    it("decoration element should not have same class name", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.wrap().then(() => {
            const id = formContainer._model._children[0].id;
            cy.get(`#${id}`).parent().should("not.have.class", bemBlock);
        })
    })

    it(" should add filled/empty class at container div ", () => {
      const [numberInput7, numberInput7FieldView] = Object.entries(formContainer._fields)[6];
      const input = "11.22";
      let model = numberInput7FieldView.getModel();
      cy.get(`#${numberInput7}`).should('have.class', 'cmp-adaptiveform-numberinput--empty');
      cy.get(`#${numberInput7}`).invoke('attr', 'data-cmp-required').should('eq', 'false');
      cy.get(`#${numberInput7}`).invoke('attr', 'data-cmp-readonly').should('eq', 'false');
      cy.get(`#${numberInput7}`).find("input").clear().type(input).blur().then(x => {
          expect(Number(model.getState().value)).to.equal(Number(1122));
          cy.get(`#${numberInput7}`).should('have.class', 'cmp-adaptiveform-numberinput--filled');
      });
    });

    it(" should support display value expression", () => {
        if(toggle_array.includes("FT_FORMS-13193")) {
            const [numberInput, numberInputFieldView] = Object.entries(formContainer._fields)[7];
            const input = 1234567812345678;
            const formatted=  '**** **** **** 5678 '
            let model = numberInputFieldView.getModel();

            cy.get(`#${numberInput}`).find("input").clear().type(input).blur().then(x => {
                expect(Number(model.getState().value)).to.equal(Number(input));
                expect(model.getState().displayValue).to.be.equal(formatted)
                cy.get(`#${numberInput}`).find('input').should('have.value', model.getState().displayValue);
            })
        }
    });
})

describe("Form with Number Input Required Validation", () => {

    const pagePath = "content/forms/af/core-components-it/samples/numberinput/validation.html";
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
    });

    const validateRequiredMessage = (id, submitButton, errorMessage) => {
        cy.get(`#${submitButton}-widget`).click();
        cy.get(`#${id}`).find("input").then(x => {
            cy.get(`#${id}`).find(".cmp-adaptiveform-numberinput__errormessage").should('have.text',errorMessage);
        });

        cy.get(`#${id}`).find("input").clear().type("1234").blur().then(x => {
            cy.get(`#${id}`).find(".cmp-adaptiveform-numberinput__errormessage").should('have.text',"");
        });

        cy.get(`#${id}`).find("input").clear().blur().then(x => {
            cy.get(`#${id}`).find(".cmp-adaptiveform-numberinput__errormessage").should('have.text',errorMessage);
        });
    }


    it("integer type validation for required field", () => {
        const [numberInput1] = Object.entries(formContainer._fields)[0];
        const [numberInput2] = Object.entries(formContainer._fields)[1];
        const [submitbutton] = Object.entries(formContainer._fields)[3];
        validateRequiredMessage(numberInput1, submitbutton, "This is required numberinput");
        validateRequiredMessage(numberInput2, submitbutton, "This is required integer numberinput");
    });

    it("check value entered before model initialization", () => {
        const [numberInput3, numberInput3FieldView] = Object.entries(formContainer._fields)[2];
        const input = "1212";
        let model = numberInput3FieldView.getModel();
        expect(Number(model.getState().value)).to.equal(Number(10));

        cy.get(`#${numberInput3}`).find("input").clear().type(input).blur().then(x => {
            expect(Number(model.getState().value)).to.equal(Number(input));
        })
    });
})

describe("Form with number input and language", () => {
    const pagePath = "content/forms/af/core-components-it/samples/numberinput/basic.html"
    const bemBlock = 'cmp-adaptiveform-numberinput'
    const IS = "adaptiveFormNumberInput"
    const selectors = {
        numberinput : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath, {"params" : ["afAcceptLang=es"]}).then(p => {
            formContainer = p;
        })

    });

    it("display pattern on numeric input should update the display value based on field language", () => {
        const [numberInput6, numberInput6FieldView] = Object.entries(formContainer._fields)[5];
        const input = "121212";
        let model = numberInput6FieldView.getModel();

        cy.get(`#${numberInput6}`).find("input").clear().type(input).blur().then(x => {
            expect(Number(model.getState().value)).to.equal(Number(input));
// Assert that the input value contains "121" and "212,000" regardless of the space type
                cy.get(`#${numberInput6}`).find('input').invoke('val').should('equal', '121\u202F212,000');
        })
    })
})
