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
        const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
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
        cy.get(`#${id}`).find(".cmp-adaptiveform-checkboxgroup__widget .cmp-adaptiveform-checkboxgroup-item").should('have.class', 'VERTICAL')
        const [id2, fieldView2] = Object.entries(formContainer._fields)[1]
        cy.get(`#${id2}`).find(".cmp-adaptiveform-checkboxgroup__widget .cmp-adaptiveform-checkboxgroup-item").should('have.class', 'HORIZONTAL')


        checkHTML(model.id, model.getState()).then(() => {
            model.visible = false
            return checkHTML(model.id, model.getState())
        }).then(() => {
            model.enable = false
            return checkHTML(model.id, model.getState())
        })
    });

    it(" html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
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
            cy.get(`#${id}`).find(".cmp-adaptiveform-checkboxgroup__errormessage").should('have.text',"There is an error in the field")
        })
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })

})