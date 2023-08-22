/*******************************************************************************
 * Copyright 2023 Adobe
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
describe("Form Runtime with Recaptcha Input", () => {

    const FT_CLOUD_CONFIG_PROVIDER = "FT_FORMS-8771";
    const pagePath = "content/forms/af/core-components-it/samples/recaptcha/basic.html"
    const bemBlock = 'cmp-adaptiveform-recaptcha'
    const IS = "adaptiveFormRecaptcha"
    const selectors = {
        recaptcha : `[data-cmp-is="${IS}"]`
    };

    let formContainer = null

    let toggle_array = [];

    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    // Whitelist the error message
    cy.on('uncaught:exception', (err) => {
        // when we render form with captcha, and FT is not enabled, this error is expected
        if (err.message.includes("Missing required parameters: sitekey")) {
            return false;
        }
        // Let Cypress handle other errors
        return true;
    });


    // render the form with captcha, we have whitelisted the "Missing required parameters: sitekey" error
    beforeEach(() => {
        cy.previewForm(pagePath).then((p) => {
            formContainer = p;
        });
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
        })
    }

    if (toggle_array.includes(FT_CLOUD_CONFIG_PROVIDER)) {
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
            cy.get('#' + id + ' .cmp-adaptiveform-recaptcha__widget > div.g-recaptcha').should('exist');

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
            cy.get(`#${id}`).click().then(x => {
                cy.log(model.getState().value)
                expect(model.getState().value).to.not.be.null
            })
        });
    } else {
        it('Feature toggle of captcha is disabled, skipping tests', () => {
            cy.log('Tests were skipped because the feature toggle of captcha is disabled');
        });
    }
})