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
describe("Form Runtime with CheckBox Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/checkbox/basic.html"
    const bemBlock = 'cmp-adaptiveform-checkbox'
    const IS = "adaptiveFormCheckBox"
    const selectors = {
        checkboxgroup : `[data-cmp-is="${IS}"]`
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
        const passDisabledAttributeCheck = `${state.enabled === false || state.readOnly === true ? "" : "not."}have.attr`;
        const value = state.value
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
                .should('have.length', 1)
            cy.get('input')
                .should(passDisabledAttributeCheck, 'disabled');
            cy.get('input').should('be.checked');
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

    it(" model's changes are reflected in the html ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        model.value = 'true'

        checkHTML(model.id, model.getState()).then(() => {
            return checkHTML(model.id, model.getState())
        }).then(() => {
            model.enable = false
            return checkHTML(model.id, model.getState())
        })
    });

    it ('should have initial value "undefined" if no default set', () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        expect(model.getState().value).eq(undefined)
    })

    it ('should have value set to false if checked and then unchecked', () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        cy.get(`#${id}`).find("input").click().then(() => {
            cy.get(`#${id}`).find("input").click().then(() => {
                expect(model.getState().value).eq('false')
            })
        })

    })

    it ('should have value set to default during initial render', () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[1]
        const model = formContainer._model.getElement(id)
        expect(model.getState().value).to.contain('true');
        cy.get(`#${id}`).get('input').should('be.checked');
    })

    it(" html changes are reflected in model ", () => {

        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        cy.get(`#${id}`).find("input").click().then(x => {
            expect(model.getState().value).to.contain('true');
        })

        cy.get(`#${id}`).find("input").click().then(x => {
            expect(model.getState().value).to.contain('false');
        })
    });

    it(" should show error messages in the HTML ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[2]
        const model = formContainer._model.getElement(id)

        cy.get(`#${id}`).find("input").click().then(x => {
            expect(model.getState().value).to.contain('true');
        })

        cy.get(`#${id}`).find("input").click().then(x => {
            cy.get(`#${id}`).find(".cmp-adaptiveform-checkbox__errormessage").should('have.text',"This is a custom required checkbox")
        })

        cy.get(`#${id}`).find("input").click().then(x => {
            cy.get(`#${id}`).find(".cmp-adaptiveform-checkbox__errormessage").should('have.text',"")
        })
    });

    it("should toggle description and tooltip", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        cy.toggleDescriptionTooltip(bemBlock, id);
    })

    it("should show and hide components on certain checkbox input", () => {
        // Rule on checkbox2: When checkbox2 has Item 1 AND Item 3 selected => Show checkbox3 and Hide checkBox4

        const [checkbox, checkBox2FieldView] = Object.entries(formContainer._fields)[3];
        const [hiddenCB, checkBox3FieldView] = Object.entries(formContainer._fields)[4];

        cy.get(`#${hiddenCB}`).should('not.be.visible');

        cy.get(`#${checkbox}`).find('input').click().then(x => {
            cy.get(`#${hiddenCB}`).should('be.visible');
            cy.get(`#${checkbox}`).find('input').click().then(x => {
                cy.get(`#${hiddenCB}`).should('not.be.visible')
            });
        });

    })

    it("should enable and disable components on certain checkbox input", () => {
        // Rule on checkbox4: When checkbox4 has Item 3 selected => Enable checkbox1 and Disable checkBox2

        const [enabledisablecb, checkBox1FieldView] = Object.entries(formContainer._fields)[5];
        const [cbUnderTest, checkBox2FieldView] = Object.entries(formContainer._fields)[6];

        // Initially cb should be disabled
        cy.get(`#${cbUnderTest}`).find("input").should('not.be.enabled')

        // check to enable cb
        cy.get(`#${enabledisablecb}`).find("input").click().then(x => {
            cy.get(`#${cbUnderTest}`).find("input").should('be.enabled')
            // uncheck to disable cb
            cy.get(`#${enabledisablecb}`).find("input").click().then(x => {
                cy.get(`#${cbUnderTest}`).find("input").should('not.be.enabled')

            })
        })
    })

    it(" should add filled/empty class at container div ", () => {
      const [id, fieldView] = Object.entries(formContainer._fields)[2]
      const model = formContainer._model.getElement(id)

      cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-checkbox--empty');
      cy.get(`#${id}`).find("input").click().then(x => {
          expect(model.getState().value).to.contain('true');
          cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-checkbox--filled');
      });
    });
})
