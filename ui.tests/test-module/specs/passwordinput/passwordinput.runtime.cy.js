/*******************************************************************************
 * Copyright 2026 Adobe
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
describe("Form Runtime with Password Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/passwordinput/basic.html"
    const bemBlock = 'cmp-adaptiveform-passwordinput'
    const IS = "adaptiveFormPasswordInput"
    const selectors = {
        passwordinput : `[data-cmp-is="${IS}"]`,
        toggle: '[data-cmp-hook-adaptiveformpasswordinput="toggleVisibility"]'
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

    it(" should render masked by default ", () => {
        const [id] = Object.entries(formContainer._fields)[0]
        cy.get(`#${id} > .${bemBlock}__widget-wrapper > input`).should('have.attr', 'type', 'password');
    });

    it(" clicking the eye icon reveals plaintext and toggles aria-pressed/label ", () => {
        const [id] = Object.entries(formContainer._fields)[0]
        const value = "S3cret!23";
        cy.get(`#${id}`).find("input").clear().type(value);
        cy.get(`#${id} .${bemBlock}__toggle-visibility`)
            .should('have.attr', 'aria-pressed', 'false')
            .should('have.attr', 'aria-label', 'Show password')
            .click();
        cy.get(`#${id} > .${bemBlock}__widget-wrapper > input`)
            .should('have.attr', 'type', 'text')
            .should('have.value', value);
        cy.get(`#${id} .${bemBlock}__toggle-visibility`)
            .should('have.attr', 'aria-pressed', 'true')
            .should('have.attr', 'aria-label', 'Hide password')
            .click();
        cy.get(`#${id} > .${bemBlock}__widget-wrapper > input`)
            .should('have.attr', 'type', 'password')
            .should('have.value', value);
        cy.get(`#${id} .${bemBlock}__toggle-visibility`)
            .should('have.attr', 'aria-pressed', 'false')
            .should('have.attr', 'aria-label', 'Show password');
    });

    it(" toggle button is absent when showHidePassword is disabled ", () => {
        const [id] = Object.entries(formContainer._fields)[1]
        cy.get(`#${id}`).find(selectors.toggle).should('not.exist');
    });

    it(" value submits correctly regardless of toggle state ", () => {
        const [id] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        const value = "AnotherSecret!1"
        cy.get(`#${id}`).find("input").clear().type(value);
        cy.get(`#${id} .${bemBlock}__toggle-visibility`).click();
        cy.get(`#${id}`).find("input").blur().then(() => {
            expect(model.getState().value).to.equal(value)
        })
    });

    it(" minLength validation error message is displayed ", () => {
        const [id] = Object.entries(formContainer._fields)[2]
        cy.get(`#${id}`).find("input").clear().type("short").blur();
        cy.window().then($window => {
            if ($window.guideBridge && $window.guideBridge.isConnected()) {
                $window.guideBridge.validate();
            }
        })
        cy.get(`#${id} > div.${bemBlock}__errormessage`).should('have.text', 'Password must be at least 8 characters.');
    });

    it("mandatory message set by user is displayed", () => {
        const [id] = Object.entries(formContainer._fields)[3]
        cy.window().then($window => {
            if ($window.guideBridge && $window.guideBridge.isConnected()) {
                $window.guideBridge.validate();
            }
        })
        cy.get(`#${id} > div.${bemBlock}__errormessage`).should('have.text', 'custom mandatory message!');
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, Object.entries(formContainer._fields)[3][0]);
    })

    it("disabled field should not have aria-disabled attribute", () => {
        const [id] = Object.entries(formContainer._fields)[4];
        cy.get(`#${id} > .${bemBlock}__widget-wrapper > input`).should('not.have.attr', 'aria-disabled');
        cy.get(`#${id} > .${bemBlock}__widget-wrapper > input`).should('have.attr', 'disabled');
    });
})
