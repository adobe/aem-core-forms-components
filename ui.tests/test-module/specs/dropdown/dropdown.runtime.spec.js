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
        const passDisabledAttributeCheck = `${state.enabled === false || state.readOnly === true ? "" : "not."}have.attr`;
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
        const [id, fieldView] = Object.entries(formContainer._fields)[2]
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
        const [id, fieldView] = Object.entries(formContainer._fields)[3];
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
        const [id, fieldView] = Object.entries(formContainer._fields)[2]
        const model = formContainer._model.getElement(id);
        cy.get(`#${id} select`).select("cauliflower").then(x => {
            expect(model.value).to.equal('c');
        });
    });

    it("Multi Select: html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[3]
        const model = formContainer._model.getElement(id);
        cy.get(`#${id} select`).select(["bus","car", "bike"]).then(x => {
            expect(model.value).to.deep.equal([1,2,3]);
        });
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    });

    it("Single Select: Test clear dropdown using rule editor", () => {
        const [idDropdown, fieldView1] = Object.entries(formContainer._fields)[2];
        const [idButton, fieldView2] = Object.entries(formContainer._fields)[0];

        const model = formContainer._model.getElement(idDropdown);

        cy.get(`#${idButton}-widget`).click().then(x => {
            expect(model.value).to.be.null; // checking model
        });
        cy.get(`#${idDropdown} select`).find(":selected").should("not.exist");
    });

    it("Multi Select: Test clear dropdown using rule editor", () => {
        const [idDropdown, fieldView1] = Object.entries(formContainer._fields)[3];
        const [idButton, fieldView2] = Object.entries(formContainer._fields)[1];
        const model = formContainer._model.getElement(idDropdown);

        cy.get(`#${idButton}-widget`).click().then(x => {
            expect(model.value).to.be.null; // checking model
        });
        cy.get(`#${idDropdown} select`).find(":selected").should("not.exist");
    });

    it("should show and hide components on certain dropdown select", () => {
        // Rule on dropdown1: When dropdown1 has 'cauliflower' selected => Show dropdown5 and Hide dropdown4

        const [dropdown1, dropdown1FieldView] = Object.entries(formContainer._fields)[2];
        const [dropdown4, dropdown4FieldView] = Object.entries(formContainer._fields)[5];
        const [dropdown5, dropdown5FieldView] = Object.entries(formContainer._fields)[6];

        cy.get(`#${dropdown1} select`).select("cauliflower").then(x => {
            cy.get(`#${dropdown5} select`).should('be.visible')
            cy.get(`#${dropdown4} select`).should('not.be.visible')
        })
    })

    it("should enable and disable components on certain dropdown select", () => {
        // Rule on dropdown1: When dropdown1 has 'apple' selected => Enable dropdown4 and disable dropdown3

        const [dropdown1, dropdown1FieldView] = Object.entries(formContainer._fields)[2];
        const [dropdown3, dropdown3FieldView] = Object.entries(formContainer._fields)[4];
        const [dropdown4, dropdown4FieldView] = Object.entries(formContainer._fields)[5];

        cy.get(`#${dropdown1} select`).select("apple").then(x => {
            cy.get(`#${dropdown4} select`).should('be.enabled')
            cy.get(`#${dropdown3} select`).should('not.be.enabled')
        })
    })

    it("should show validation error messages based on expression rules", () => {
        // Rule on dropdown6: Validate dropdown using Expression: dropdown6 === dropdown3

        const [dropdown3, dropdown3FieldView] = Object.entries(formContainer._fields)[4];
        const [dropdown6, dropdown6FieldView] = Object.entries(formContainer._fields)[7];

        cy.get(`#${dropdown3} select`).select("cauliflower").blur().then(x => {
            cy.get(`#${dropdown6} select`).select("beans")
            cy.get(`#${dropdown6}`).find(".cmp-adaptiveform-dropdown__errormessage").should('have.text',"Please enter a valid value.")
            cy.get(`#${dropdown6} > div.${bemBlock}__errormessage`).should('have.attr', 'id', `${dropdown6}__errormessage`)
            cy.get(`#${dropdown6} > .${bemBlock}__widget`).should('have.attr', 'aria-describedby', `${dropdown6}__errormessage`)
            cy.get(`#${dropdown6} > .${bemBlock}__widget`).should('have.attr', 'aria-invalid', 'true')

            cy.get(`#${dropdown6} select`).select("carrot")
            cy.get(`#${dropdown6}`).find(".cmp-adaptiveform-dropdown__errormessage").should('have.text',"")
            cy.get(`#${dropdown6} > .${bemBlock}__widget`).should('have.attr', 'aria-describedby', '')
        })
    })

    it("should update enum values on providing duplicate enums", () => {

        const [dropdown7, dropdown7FieldView] = Object.entries(formContainer._fields)[8];
        cy.get(`#${dropdown7}`).find(".cmp-adaptiveform-dropdown__option").should('have.length', 2);
        cy.get(`#${dropdown7}`).find(".cmp-adaptiveform-dropdown__option").contains('Item 3');
        cy.get(`#${dropdown7}`).find(".cmp-adaptiveform-dropdown__option").contains('Item 2');
        cy.get(`#${dropdown7}`).find(".cmp-adaptiveform-dropdown__option").contains('Item 1').should('not.exist');

    })

    it("decoration element should not have same class name", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.wrap().then(() => {
            const id = formContainer._model._children[0].id;
            cy.get(`#${id}`).parent().should("not.have.class", bemBlock);
        })
    })

    it("should add filled/empty class at container div", () => {
      const id = formContainer?._model?._children[9]?._jsonModel?.id;
      const model = formContainer._model.getElement(id);
      cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-dropdown--empty');
      cy.get(`#${id}`).invoke('attr', 'data-cmp-required').should('eq', 'false');
      cy.get(`#${id}`).invoke('attr', 'data-cmp-readonly').should('eq', 'false');
      cy.get(`#${id} select`).select("Item 1").then(x => {
          expect(model.value).to.equal('1');
          cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-dropdown--filled');
      });
  });

    it("should have empty placeholder checked when default option is not configured", () => {
        const [idDropdown, fieldView1] = Object.entries(formContainer._fields)[9];
        const model = formContainer._model.getElement(idDropdown);
        cy.get(`#${idDropdown} select`).invoke('val').then(val => {
            expect(val, "Actual value of unselected dropdown").to.equal(null);
        })
        cy.get(`#${idDropdown} select`).find('option').then(options => {
            expect(options[0].selected, "Empty Placeholder to be selected").to.be.true
            expect(options[0].disabled, "Empty Placeholder to be disabled").to.be.true
            expect(options[0].value, "Empty Placeholder to be empty in it's visual content").to.equal('')
        });
    });
})
