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
describe("Form Runtime with Button Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/button/buttonv1/basic.html"
    const bemBlock = 'cmp-adaptiveform-button'
    const IS = "adaptiveFormButton"
    const selectors = {
        buttonGroup : `[data-cmp-is="${IS}"]`
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
            cy.get('button')
                .should(passDisabledAttributeCheck, 'disabled')
            cy.get('button')
                .should('have.value', value);
        })
    }

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


    it("should toggle description and tooltip", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[3]
        cy.toggleDescriptionTooltip(bemBlock, id);
    });

    it("Button should not have aria-disabled attribute if enable is false", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[2];
        cy.get(`#${id} > .${bemBlock}__widget`).should('not.have.attr', 'aria-disabled');
    });


    it("should open a new window on click of button", () => {
        cy.window().then((win) => {
            // click
            cy.stub(win, 'open');
            const [id, fieldView] = Object.entries(formContainer._fields)[4]
            // click the button with navigate
            cy.get(`#${id}`).find("button").click().then(x => {
                // check if window open is called
                cy.window().its('open').should('have.been.calledWithMatch', (arg1) => {
                    // do whatever comparisons you want on the arg1, and return `true` if
                    //  it matches
                    if (arg1 === "https://www.google.com") {
                        return true;
                    } else {
                        return false;
                    }
                });
            });
        });
    });

    it(`should have type as button`, () => {
        cy.get('.cmp-adaptiveform-button__widget').eq(0).should('have.attr', 'type', 'button');
    });

})
