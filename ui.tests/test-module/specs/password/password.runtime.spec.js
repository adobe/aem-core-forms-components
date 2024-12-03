/*******************************************************************************
 * Copyright 2024 Adobe
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
describe("Form Runtime with Password", () => {

    before(() => {
        cy.attachConsoleErrorSpy();
    });

    const pagePath = "content/forms/af/core-components-it/samples/password/basic.html"
    const bemBlock = 'cmp-adaptiveform-password'
    const IS = "adaptiveFormPassword"
    const selectors = {
        password : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null;

   /**
    * initialization of form container before every test
    * */
    beforeEach(() => {
            cy.previewForm(pagePath).then(p => {
                formContainer = p;
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
        });
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
        const [id, passwordfieldView] = Object.entries(formContainer._fields)[0]
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
        const [id, password1fieldView] = Object.entries(formContainer._fields)[0]
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
        // Rule on passwordbox1: When passwordbox1 has input "Adobe@123" => Show passwordbox3 and Hide passwordbox2

        const [passwordbox1, passwordbox1FieldView] = Object.entries(formContainer._fields)[0];
        const [passwordbox2, passwordbox2FieldView] = Object.entries(formContainer._fields)[1];
        const [passwordbox3, passwordbox3FieldView] = Object.entries(formContainer._fields)[2];
        const input = "Adobe@123";

        cy.get(`#${passwordbox1}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${passwordbox3}`).should('be.visible')
            cy.get(`#${passwordbox2}`).should('not.be.visible')
        })
        cy.expectNoConsoleErrors();
    })

    it("should enable and disable other textfields on a certain string input", () => {
        // Rule on passwordbox1: When passwordbox1 has input "Aem@123" => Enable passwordbox2 and Disable passwordbox4

        const [passwordbox1, passwordbox1FieldView] = Object.entries(formContainer._fields)[0];
        const [passwordbox2, passwordbox2FieldView] = Object.entries(formContainer._fields)[1];
        const [passwordbox4, passwordbox4FieldView] = Object.entries(formContainer._fields)[3];
        const input = "Aem@123";

        cy.get(`#${passwordbox1}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${passwordbox2}`).find("input").should('be.enabled')
            cy.get(`#${passwordbox4}`).find("input").should('not.be.enabled')
        })
        cy.expectNoConsoleErrors();
    })

    it("should set and clear value based on rules", () => {
        // Rule on passwordbox5: When input of passwordbox5 is "Aemforms@123", set value of passwordbox1 to "new password" and clear value of passwordbox4

        const [passwordbox1, passwordbox1FieldView] = Object.entries(formContainer._fields)[0];
        const [passwordbox4, passwordbox4FieldView] = Object.entries(formContainer._fields)[3];
        const [passwordbox5, passwordbox5FieldView] = Object.entries(formContainer._fields)[4];

        const input = "Aemforms@123";
       // cy.get(`#${passwordbox4}`).find("input").clear().type("this must be cleared")
        cy.get(`#${passwordbox5}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${passwordbox4}`).find("input").should('have.value',"")
            cy.get(`#${passwordbox1}`).find("input").should('have.value', "new password")
        })
        cy.expectNoConsoleErrors();
    })

    it("should show required error message on blur when field is empty", () =>{
        const [passwordbox6, passwordbox6FieldView] = Object.entries(formContainer._fields)[5];
        cy.get(`#${passwordbox6}`).find("input").clear().focus().blur().then(x => {
        cy.get(`#${passwordbox6}`).find(".cmp-adaptiveform-password__errormessage").should('have.text',"Please fill in this field.")
        })
    })

    it("decoration element should not have same class name", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.wrap().then(() => {
            const id = formContainer._model._children[0].id;
            cy.get(`#${id}`).parent().should("not.have.class", "cmp-adaptiveform-password");
        })

    })
})

