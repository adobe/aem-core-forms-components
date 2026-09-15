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
import 'cypress-wait-until';

describe("Form Runtime with Recaptcha Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/recaptcha/basic.html"
    const v2checkboxPagePath = "content/forms/af/core-components-it/samples/recaptcha/v2checkbox.html"
    const enterprisePagePath = "content/forms/af/core-components-it/samples/recaptcha/enterprisescore.html"
    const v3PagePath = "content/forms/af/core-components-it/samples/recaptcha/v3.html"
    const bemBlock = 'cmp-adaptiveform-recaptcha'
    const IS = "adaptiveFormRecaptcha"
    const selectors = {
        recaptcha : `[data-cmp-is="${IS}"]`
    };

    let formContainer = null

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

    it("decoration element should not have same class name", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.wrap().then(() => {
            const id = formContainer._model._children[0].id;
            cy.get(`#${id}`).parent().should("not.have.class", bemBlock);
        })
    })

    function updateEnterpriseConfig(score) {
        const secretKey = Cypress.env('RECAPTCHA_ENT_API_KEY');
        cy.openPage("/mnt/overlay/fd/af/cloudservices/recaptcha/properties.html?item=%2Fconf%2Fcore-components-it%2Fsamples%2Frecaptcha%2Fbasic%2Fsettings%2Fcloudconfigs%2Frecaptcha%2Fentscore").then(x => {
            cy.get('#recaptcha-cloudconfiguration-secret-key').clear().type(secretKey);
            cy.get('#recaptcha-cloudconfiguration-threshold-score').clear().type(score);
            cy.get("#shell-propertiespage-doneactivator").click();
        })
    }

    function updateRecaptchaSecretKey(secretKey) {
        cy.openPage("/mnt/overlay/fd/af/cloudservices/recaptcha/properties.html?item=%2Fconf%2Fcore-components-it%2Fsamples%2Frecaptcha%2Fbasic%2Fsettings%2Fcloudconfigs%2Frecaptcha%2Fv2checkbox").then(x => {
            cy.get('#recaptcha-cloudconfiguration-secret-key').clear().type(secretKey);
            cy.get("#shell-propertiespage-doneactivator").click();
        })
    }

    function updateRecaptchaV3Config(score) {
        const secretKey = Cypress.env('RECAPTCHA_V3_API_KEY');
        cy.openPage("/mnt/overlay/fd/af/cloudservices/recaptcha/properties.html?item=%2Fconf%2Fcore-components-it%2Fsamples%2Frecaptcha%2Fbasic%2Fsettings%2Fcloudconfigs%2Frecaptcha%2Fv3").then(x => {
            cy.get('#recaptcha-cloudconfiguration-secret-key').clear().type(secretKey);
            // v3 is score-based, but the addon dialog nests Threshold Score inside the hidden
            // enterprise-fields container for v3, so the coral-numberinput wrapper is never
            // upgraded to a clearable element. Target its inner native input directly and force
            // past the visibility check — the value still syncs to the field and is submitted on save.
            cy.get('#recaptcha-cloudconfiguration-threshold-score input').clear({force: true}).type(score, {force: true});
            cy.get("#shell-propertiespage-doneactivator").click();
        })
    }


    it("client side validation should fail if recaptcha is not filled", () => {
        cy.previewForm(v2checkboxPagePath).then((p) => {
            formContainer = p;
        });
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
            cy.get('.cmp-adaptiveform-recaptcha__errormessage').should('exist').contains('Please fill in this field.');
        });
    })

    it("submission should pass for mandatory recaptcha v2", () => {
        const secretKey="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
        updateRecaptchaSecretKey(secretKey);
        cy.previewForm(v2checkboxPagePath).then((p) => {
            formContainer = p;
        });
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.intercept('POST', /\/adobe\/forms\/af\/submit\/.*/).as('submitForm');
        cy.get(`div.g-recaptcha iframe`).should('be.visible').then(() => {
            const [id, fieldView] = Object.entries(formContainer._fields).find(([id, fieldView]) => id.includes("captcha"));
            const model = formContainer._model.getElement(id);
            cy.get(`#${id}`).then(x => {
                model.value = "dummyResponseToken";
                cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                    cy.wait('@submitForm').then((interception) => {
                        expect(interception.response.statusCode).to.equal(200);
                    });
                    cy.get('body').should('contain', "Thank you for submitting the form.\n")
                });
            })
        });
    });

    it("submission should fail for mandatory recaptcha v2", () => {
        if (cy.af.isLatestAddon()) {
            const secretKey="incorrectSecretkey";
            updateRecaptchaSecretKey(secretKey);
            cy.previewForm(v2checkboxPagePath).then((p) => {
                formContainer = p;
            });
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
        }
    })


    it("submission should pass for enterprise score based captcha",() => {
        updateEnterpriseConfig(0.5);
        cy.previewForm(enterprisePagePath).then((p) => {
            formContainer = p;
        });
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.get(`div.grecaptcha-badge`).should('exist').then(() => {
            cy.intercept('POST', /\/adobe\/forms\/af\/submit\/.*/).as('submitForm');
            const submitForm = () => {
                cy.get(`.cmp-adaptiveform-button__widget`).click();

                // Wait for the submitForm request
                return cy.wait('@submitForm',{ timeout: 50000 }).then((interception) => {
                    if (interception.response.statusCode === 200) {
                        // Request succeeded
                        cy.log('Submit request succeeded');
                        return cy.wrap(true);
                    } else {
                        // Request failed
                        cy.log(`Submit request failed, retrying...`);
                        return cy.wrap(false);
                    }
                });
            };
            // Need to submit multiple times until the form is submitted successfully
            // Due to below error while validating recaptcha enterprise
            // https://cloud.google.com/recaptcha-enterprise/docs/faq#returned_browser_error_when_creating_an_assessment_what_should_i_do_about_this
            cy.waitUntil(() => submitForm(), {
                errorMsg: 'Maximum retry limit reached, request did not succeed',
                timeout: 50000, // Total timeout (10 seconds)
                interval: 5000, // Interval between retries (1 second)
            });
        });
    })

    it("submission should fail for enterprise score based captcha",() => {
        if (cy.af.isLatestAddon()) {
            updateEnterpriseConfig(1.0);
            cy.on('window:alert', (message) => {
                expect(message).to.equal('Encountered an internal error while submitting the form.');
            });
            cy.intercept('POST', /\/adobe\/forms\/af\/submit\/.*/).as('submitForm');
            cy.previewForm(enterprisePagePath).then((p) => {
                formContainer = p;
            });
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.get(`div.grecaptcha-badge`).should('exist').then(() => {
                cy.get(`.cmp-adaptiveform-button__widget`).click();
                cy.wait('@submitForm',{ timeout: 50000 }).then((interception) => {
                    expect(interception.response.statusCode).to.equal(400);
                    expect(interception.response.body).to.have.property('title', 'The CAPTCHA validation failed. Please try again.');
                });
            });
        }
    })

    it("should render reCAPTCHA v3 as an invisible badge", () => {
        cy.previewForm(v3PagePath).then((p) => {
            formContainer = p;
        });
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.wrap().then(() => {
            const [id] = Object.entries(formContainer._fields).find(([id]) => id.includes("captcha"));
            // v3 has no visible challenge; the widget must render badge-only (invisible).
            cy.get(`#${id} .cmp-adaptiveform-recaptcha__widget > div.g-recaptcha`)
                .should('exist')
                .and('have.class', 'g-recaptcha-invisible');
        });
    })

    it("submission should pass for reCAPTCHA v3", () => {
        // Exercises the v3 token fetch + submit flow. The secret key is injected via the
        // RECAPTCHA_V3_API_KEY env var; the site key lives in the v3 cloud config fixture.
        // Low threshold so a token from a headless browser passes server-side verification.
        updateRecaptchaV3Config(0.1);
        cy.previewForm(v3PagePath).then((p) => {
            formContainer = p;
        });
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.get(`div.grecaptcha-badge`).should('exist').then(() => {
            cy.intercept('POST', /\/adobe\/forms\/af\/submit\/.*/).as('submitForm');
            const submitForm = () => {
                cy.get(`.cmp-adaptiveform-button__widget`).click();
                return cy.wait('@submitForm', { timeout: 50000 }).then((interception) => {
                    if (interception.response.statusCode === 200) {
                        cy.log('Submit request succeeded');
                        return cy.wrap(true);
                    } else {
                        cy.log('Submit request failed, retrying...');
                        return cy.wrap(false);
                    }
                });
            };
            // Retry like the enterprise-score test, since reCAPTCHA can intermittently return a
            // browser-error on the first assessment.
            cy.waitUntil(() => submitForm(), {
                errorMsg: 'Maximum retry limit reached, request did not succeed',
                timeout: 50000,
                interval: 5000,
            });
        });
    })
})
