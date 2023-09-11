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
describe("Form Runtime with Switch Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/switch/basic.html"
    const bemBlock = "cmp-adaptiveform-switch"

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
        const id = formContainer._model.items[0].id;
        const model = formContainer._model.getElement(id)
        model.value = '0'

        checkHTML(model.id, model.getState()).then(() => {
            return checkHTML(model.id, model.getState())
        }).then(() => {
            model.enable = false
            return checkHTML(model.id, model.getState())
        })
    });

    it('should have initial value "undefined" if no default set', () => {
        const id = formContainer._model.items[0].id;
        const model = formContainer._model.getElement(id)
        expect(model.getState().value).eq(undefined)
    })

    it ('should have value set to false if checked and then unchecked', () => {
        const id = formContainer._model.items[0].id;
        const model = formContainer._model.getElement(id)
        cy.get(`#${id}`).find("input").click().then(() => {
            cy.get(`#${id}`).find("input").click().then(() => {
                expect(model.getState().value).eq(undefined)
            })
        })

    })

    it('should have value set to default during initial render', () => {
        const id = formContainer._model.items[1].id;
        const model = formContainer._model.getElement(id)
        expect(model.getState().value).to.contain('0');
        cy.get(`#${id}`).get('input').should('be.checked');
    })

    it(" html changes are reflected in model ", () => {

        const id = formContainer._model.items[0].id;
        const model = formContainer._model.getElement(id)
        cy.get(`#${id}`).find("input").click().then(x => {
            expect(model.getState().value).to.contain('0');
        })

        cy.get(`#${id}`).find("input").click().then(x => {
            expect(model.getState().value).equal(undefined);
        })
    });

    it(" should show error messages in the HTML ", () => {
        const id = formContainer._model.items[2].id;
        const model = formContainer._model.getElement(id)

        cy.get(`#${id}`).find("input").click().then(x => {
            expect(model.getState().value).to.contain('0');
        })

        cy.get(`#${id}`).find("input").click().then(x => {
            cy.get(`#${id}`).find(".cmp-adaptiveform-switch__errormessage").should('have.text',"This is a custom required switch")
        })

        cy.get(`#${id}`).find("input").click().then(x => {
            cy.get(`#${id}`).find(".cmp-adaptiveform-switch__errormessage").should('have.text',"")
        })
    });

    it("should toggle description and tooltip", () => {
        const id = formContainer._model.items[0].id;
        cy.toggleDescriptionTooltip(bemBlock, id);
    })

    it("should show and hide components on certain switch input", () => {
        // Rule on switch4: When switch4 is ON => Show switch5 and
        // hide switch5 when switch4 is OFF

        const ruleSwitch = formContainer._model.items[3].id;
        const hiddenCB = formContainer._model.items[4].id;

        cy.get(`#${hiddenCB}`).should('not.be.visible');

        cy.get(`#${ruleSwitch}`).find('input').click().then(x => {
            cy.get(`#${hiddenCB}`).should('be.visible');
            cy.get(`#${ruleSwitch}`).find('input').click().then(x => {
                cy.get(`#${hiddenCB}`).should('not.be.visible')
            });
        });

    })

    it("should enable and disable components on certain switch input", () => {
        // Rule on switch enabledisable: When switch 'enabledisable' is ON => Enable switch cb5
        // and hide cb5 when enabledisable is OFF

        const enabledisablecb = formContainer._model.items[5].id;
        const cbUnderTest = formContainer._model.items[6].id;

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
})
