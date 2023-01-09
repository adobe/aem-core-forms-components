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
describe("Form Runtime with CheckBoxGroup Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/checkboxgroup/basic.html"
    const bemBlock = 'cmp-adaptiveform-checkboxgroup'
    const IS = "adaptiveFormCheckBoxGroup"
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
                .should('have.length', 4)
            cy.get('input')
                .should(passDisabledAttributeCheck, 'disabled');
            cy.get('input').eq(1).should('be.checked')
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
        const val = Array('1','2')
        model.value = '1'
        cy.get(`#${id}`).find(".cmp-adaptiveform-checkboxgroup__widget").should('have.class', 'VERTICAL')
        const [id2, fieldView2] = Object.entries(formContainer._fields)[1]
        cy.get(`#${id2}`).find(".cmp-adaptiveform-checkboxgroup__widget").should('have.class', 'HORIZONTAL')


        checkHTML(model.id, model.getState()).then(() => {
            model.visible = false
            return checkHTML(model.id, model.getState())
        }).then(() => {
            model.enable = false
            return checkHTML(model.id, model.getState())
        })
    });

    it(" html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[1]
        const model = formContainer._model.getElement(id)

        cy.log(model.getState().value)
        cy.get(`#${id}`).find("input").eq(1).click().then(x => {
            cy.log(model.getState().value)
            expect(model.getState().value).to.contain('1');
        })

        cy.get(`#${id}`).find("input").eq(2).click().then(x => {
            cy.log(model.getState().value)
            expect(model.getState().value).to.contain('2');
        })
    });

    it(" should show error messages in the HTML ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[1]
        const model = formContainer._model.getElement(id)

        cy.get(`#${id}`).find("input").eq(1).click().then(x => {
            cy.log(model.getState().value)
            expect(model.getState().value).to.contain('1');
        })

        cy.get(`#${id}`).find("input").eq(1).click().then(x => {
            cy.get(`#${id}`).find(".cmp-adaptiveform-checkboxgroup__errormessage").should('have.text',"This is a custom required checkboxgroup")
        })

        cy.get(`#${id}`).find("input").eq(1).click().then(x => {
            cy.get(`#${id}`).find(".cmp-adaptiveform-checkboxgroup__errormessage").should('have.text',"")
        })
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })

    it("should show and hide components on certain checkbox input", () => {
        // Rule on checkbox2: When checkbox2 has Item 1 AND Item 3 selected => Show checkbox3 and Hide checkBox4

        const [checkBox2, checkBox2FieldView] = Object.entries(formContainer._fields)[1];
        const [checkBox3, checkBox3FieldView] = Object.entries(formContainer._fields)[2];
        const [checkBox4, checkBox4FieldView] = Object.entries(formContainer._fields)[3];

        cy.get(`#${checkBox2}`).find("input").check(["0","3"]).then(x => {
            cy.get(`#${checkBox3}`).should('be.visible')
            cy.get(`#${checkBox4}`).should('not.be.visible')
        })
    })

    it("should enable and disable components on certain checkbox input", () => {
        // Rule on checkbox4: When checkbox4 has Item 3 selected => Enable checkbox1 and Disable checkBox2

        const [checkBox1, checkBox1FieldView] = Object.entries(formContainer._fields)[0];
        const [checkBox2, checkBox2FieldView] = Object.entries(formContainer._fields)[1];
        const [checkBox4, checkBox4FieldView] = Object.entries(formContainer._fields)[3];

        cy.get(`#${checkBox4}`).find("input").check(["2"]).then(x => {
            cy.get(`#${checkBox1}`).find("input").should('be.enabled')
            cy.get(`#${checkBox2}`).find("input").should('not.be.enabled')
        })
    })
})