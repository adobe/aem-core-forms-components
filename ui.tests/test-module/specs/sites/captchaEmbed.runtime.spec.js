/*******************************************************************************
 * Copyright 2024 Adobe
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
describe("Captcha In Sites Runtime Test", () => {
    const pagePath = "content/forms/sites/core-components-it/site-with-captcha-afv2-form.html";
    const hCaptchaPagePath = "content/forms/sites/core-components-it/site-with-hcaptcha-afv2-form.html";
    const FT_HCAPTCHA = "FT_FORMS-12407";

    let formContainer = null;

    let toggle_array = [];

    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });


    it("captcha should render when form is embedded in site", () => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
            cy.get('.cmp-adaptiveform-recaptcha__widget > div.g-recaptcha').should('exist').then($iframe => {
                cy.wrap($iframe).then($iframe => {
                    cy.window().should('have.property', 'grecaptcha').and('not.be.undefined');
                });
            });
        })
    })

    it("form should not submit due to captcha validation failure", () => {
        if (cy.af.isLatestAddon()) {
            cy.openPage("/mnt/overlay/fd/af/cloudservices/recaptcha/properties.html?item=%2Fconf%2Fcore-components-it%2Fsamples%2Frecaptcha%2Fbasic%2Fsettings%2Fcloudconfigs%2Frecaptcha%2Fv2checkbox").then(x => {
                cy.get('#recaptcha-cloudconfiguration-secret-key').clear().type("incorrectSecretKey");
                cy.get("#shell-propertiespage-doneactivator").click();
            })
            cy.previewForm(pagePath).then(p => {
                formContainer = p;
                expect(formContainer, "formcontainer is initialized").to.not.be.null;
                cy.on('window:alert', (message) => {
                    expect(message).to.equal('Encountered an internal error while submitting the form.');
                });
                cy.intercept('POST', /\/adobe\/forms\/af\/submit\/.*/).as('submitForm');
                cy.get(`div.g-recaptcha iframe`).should('be.visible').then(() => {
                    const [id, fieldView] = Object.entries(formContainer._fields).find(([id, fieldView]) => id.includes("captcha"));
                    const model = formContainer._model.getElement(id);
                    cy.get(`#${id}`).then(x => {
                        model.value = "dummyResponseToken";
                        cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                            cy.wait('@submitForm').then((interception) => {
                                expect(interception.response.statusCode).to.equal(400);
                                expect(interception.response.body).to.have.property('title', 'The CAPTCHA validation failed. Please try again.');
                            });
                        });
                    })
                });
            })
        }
    })

    it("hcaptcha should render when form is embedded in site", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes(FT_HCAPTCHA)) {
            cy.previewForm(hCaptchaPagePath).then(p => {
                formContainer = p;
                expect(formContainer, "formcontainer is initialized").to.not.be.null;
                expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
                cy.get('.cmp-adaptiveform-hcaptcha__widget > div.h-captcha').should('exist').then($iframe => {
                    cy.wrap($iframe).then($iframe => {
                        cy.window().should('have.property', 'hcaptcha').and('not.be.undefined');
                    });
                });

            })
        }
    })
})
