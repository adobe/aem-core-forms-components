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
describe("Form Runtime with Telephone Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/telephoneinput/basic.html"
    const bemBlock = 'cmp-adaptiveform-telephoneinput'
    const IS = "adaptiveFormTelephoneInput"
    let toggle_array = [];
    const selectors = {
        telephoneinput : `[data-cmp-is="${IS}"]`
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
            cy.get('input').should('have.value', value);
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
        const input = "value"
        cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
            expect(model.getState().value).to.equal(input)
        })
    });

    it(" mandatory message set by user is displayed", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[1];
        cy.window().then($window => {
            if($window.guideBridge && $window.guideBridge.isConnected()) {
                $window.guideBridge.validate();
            }
        })
        cy.get(`#${id} > div.${bemBlock}__errormessage`).should('have.text', 'custom mandatory message!');
    });

    it(" validation picture clause message set by user is displayed", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find("input").clear().type("asd").blur();
        cy.window().then($window => {
            if($window.guideBridge && $window.guideBridge.isConnected()) {
                $window.guideBridge.validate();
            }
        })
        cy.get(`#${id} > div.${bemBlock}__errormessage`).should('have.text', 'validation picture clause error message!');
    });

    it("Validate different validation patterns", () => {
        const internationalInvalid = '+123456789012345',
            UkInvalid = '+123';
        // Validating international pattern
        const [telephoneInput6, fieldView] = Object.entries(formContainer._fields)[5];
        cy.get(`#${telephoneInput6}`).find("input").clear().type(internationalInvalid).blur().then(() => {
            cy.get(`#${telephoneInput6} > div.${bemBlock}__errormessage`).should('have.text', 'Please match the format requested.');
            cy.get(`#${telephoneInput6} > div.${bemBlock}__errormessage`).should('have.attr', 'id', `${telephoneInput6}__errormessage`);
            cy.get(`#${telephoneInput6} > .${bemBlock}__widget`).should('have.attr', 'aria-describedby', `${telephoneInput6}__errormessage`);
            cy.get(`#${telephoneInput6} > .${bemBlock}__widget`).should('have.attr', 'aria-invalid', 'true');
        })
        // Validating UK pattern
        const [telephoneInput7, fieldView1] = Object.entries(formContainer._fields)[6];
        cy.get(`#${telephoneInput7}`).find("input").clear().type(UkInvalid).blur().then(() => {
            cy.get(`#${telephoneInput7} > div.${bemBlock}__errormessage`).should('have.text', 'Please match the format requested.');
        })
    });

    it("Telephone input field should not have aria-disabled attribute if enable is false", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[1];
        cy.get(`#${id} > .${bemBlock}__widget`).should('not.have.attr', 'aria-disabled');
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
      const input = "value";
      cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-telephoneinput--empty');
      cy.get(`#${id}`).invoke('attr', 'data-cmp-required').should('eq', 'false');
      cy.get(`#${id}`).invoke('attr', 'data-cmp-readonly').should('eq', 'false');
      cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
          expect(model.getState().value).to.equal(input);
          cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-telephoneinput--filled');
      });
    });

    it(" should support display value expression", () => {
        if(toggle_array.includes("FT_FORMS-13193")) {
            const [field, fieldView] = Object.entries(formContainer._fields)[7];
            const input = 9999999999;
            const formatted=  '*******999'
            let model = fieldView.getModel();

            cy.get(`#${field}`).find("input").clear().type(input).blur().then(x => {
                expect(model.getState().value).to.equal('9999999999');
                expect(model.getState().displayValue).to.be.equal(formatted)
                cy.get(`#${field}`).find('input').should('have.value', model.getState().displayValue);
            })
        }
    });
})
