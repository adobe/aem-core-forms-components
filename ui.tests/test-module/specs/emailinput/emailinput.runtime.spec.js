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
describe("Form Runtime with Email Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/emailinput/basic.html"
    const bemBlock = 'cmp-adaptiveform-emailinput'
    const IS = "adaptiveFormEmailInput"
    const selectors = {
        textinput : `[data-cmp-is="${IS}"]`
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
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
            checkHTML(id, field.getModel().getState())
        });
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
    });

    it(" html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        const input = "value@dns.com"
        cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
            expect(model.getState().value).to.equal(input)
        })
    });

    it(" Invalid email ID generates error message ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const notAllowed = "invalidEmail"
        cy.get(`#${id}`).find("input").clear().type(notAllowed).blur().then(x => {
            cy.get('.cmp-adaptiveform-emailinput__errormessage').should('be.visible');
        })
        const invalidEmailPattern = "invalidEmail@domain"
        cy.get(`#${id}`).find("input").clear().type(invalidEmailPattern).blur().then(x => {
            cy.get('.cmp-adaptiveform-emailinput__errormessage').should('be.visible');
        })
        const validEmailPattern = "validEmail@domain.com"
        cy.get(`#${id}`).find("input").clear().type(validEmailPattern).blur().then(x => {
            cy.get('.cmp-adaptiveform-emailinput__errormessage').should('not.be.visible');
        })
    });

    it("mandatory message set by user is displayed", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[3]
        cy.window().then($window => {
            if($window.guideBridge && $window.guideBridge.isConnected()) {
                $window.guideBridge.validate();
            }
        })
        cy.get(`#${id} > div.${bemBlock}__errormessage`).should('have.text', 'custom mandatory message!');
    });

    it("validation picture clause message set by user is displayed", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find("input").type("ares@a").blur();
        cy.window().then($window => {
            if($window.guideBridge && $window.guideBridge.isConnected()) {
                $window.guideBridge.validate();
            }
        });
        cy.get(`#${id} > div.${bemBlock}__errormessage`).should('have.text', 'validation picture clause error message!');
    });

    it("custom format message set by user is displayed", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[3];
        cy.get(`#${id}`).find("input").type("ares").blur();
        cy.window().then($window => {
            if($window.guideBridge && $window.guideBridge.isConnected()) {
                $window.guideBridge.validate();
            }
        });
        cy.get(`#${id} > div.${bemBlock}__errormessage`).should('have.text', 'custom format error message!');
    });


    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })

    it("decoration element should not have same class name", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.wrap().then(() => {
            const id = formContainer._model._children[0].id;
            cy.get(`#${id}`).parent().should("not.have.class", bemBlock);
        })
    })

    it(" should add filled/empty class at container div ", () => {
      const [id, fieldView] = Object.entries(formContainer._fields)[0]
      const model = formContainer._model.getElement(id)
      const input = "value@dns.com";
      cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-emailinput--empty');
      cy.get(`#${id}`).invoke('attr', 'data-cmp-required').should('eq', 'false');
      cy.get(`#${id}`).invoke('attr', 'data-cmp-readonly').should('eq', 'false');
      cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
          expect(model.getState().value).to.equal(input);
          cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-emailinput--filled');
      });
    });
})
