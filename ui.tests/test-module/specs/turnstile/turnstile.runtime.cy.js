/*
 *  Copyright 2024 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
describe("Form Runtime with Turnstile Input", () => {

    const FT_TURNSTILE = "FT_FORMS-12407";
    const pagePath = "content/forms/af/core-components-it/samples/turnstile/managed.html"
    const invisiblePagePath = "content/forms/af/core-components-it/samples/turnstile/invisible.html"
    const bemBlock = 'cmp-adaptiveform-turnstile'
    // The secret keys are part of public documentation and are not sensitive : 
    // https://developers.cloudflare.com/turnstile/troubleshooting/testing/
    const alwaysPassSecretKey = "1x0000000000000000000000000000000AA";
    const alwaysFailSecretKey = "2x0000000000000000000000000000000AA";
    let formContainer = null

    let toggle_array = [];

    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    function updateTurnstileSecretKey(secretKey, configName) {
        cy.openPage(`mnt/overlay/fd/af/cloudservices/turnstile/properties.html?item=%2Fconf%2Fcore-components-it%2Fsettings%2Fcloudconfigs%2Fturnstile%2F${configName}`).then(x => {
            cy.get('#captcha-cloudconfiguration-secret-key').clear().type(secretKey).then(x => {
                cy.get("#shell-propertiespage-doneactivator").click();
            });
        });
    }

    // render the form with captcha, we have whitelisted the "Missing required parameters: sitekey" error
    beforeEach(() => {
        if (cy.af.isLatestAddon()) {
            cy.previewForm(pagePath).then((p) => {
                formContainer = p;
            });
        }
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
        if (cy.af.isLatestAddon() && toggle_array.includes(FT_TURNSTILE)) {
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
            Object.entries(formContainer._fields).forEach(([id, field]) => {
                expect(field.getId()).to.equal(id)
                expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
            });
        }
    })

    it(" model's changes are reflected in the html ", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes(FT_TURNSTILE)) {
            const [id, fieldView] = Object.entries(formContainer._fields)[0]
            const model = formContainer._model.getElement(id)
            cy.get('.cmp-adaptiveform-turnstile__widget').should('exist');

            checkHTML(model.id, model.getState()).then(() => {
                model.visible = false
                return checkHTML(model.id, model.getState())
            }).then(() => {
                model.enable = false
                return checkHTML(model.id, model.getState())
            })
        }
    });

    it(" html changes are reflected in model ", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes(FT_TURNSTILE)) {
            const [id, fieldView] = Object.entries(formContainer._fields)[0]
            const model = formContainer._model.getElement(id)
            cy.log(model.getState().value)
            cy.get(`#${id}`).click().then(x => {
                cy.log(model.getState().value)
                expect(model.getState().value).to.not.be.null
            })
        }
    });


    it("decoration element should not have same class name", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes(FT_TURNSTILE)) {
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.wrap().then(() => {
                const id = formContainer._model._children[0].id;
                cy.get(`#${id}`).parent().should("not.have.class", bemBlock);
            })
        }
    })

    it("client side validation should fail if captcha is not filled", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes(FT_TURNSTILE)) {
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                cy.get('.cmp-adaptiveform-turnstile__errormessage').should('exist').contains('Please fill in this field.');
            });
        }
    })

    it("submission should pass for mandatory captcha", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes(FT_TURNSTILE)) {
            updateTurnstileSecretKey(alwaysPassSecretKey, "managed");
            cy.previewForm(pagePath).then((p) => {
                formContainer = p;
            });
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.get('.cmp-adaptiveform-turnstile__widget').should('be.visible').then($iframe => {
                cy.wrap($iframe).then($iframe => {
                    cy.window().should('have.property', 'turnstile').and('not.be.undefined')
                        .then((turnstile) => {
                            turnstile.execute();
                            return new Cypress.Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                }, 3000);
                            });
                        }).then(() => {
                            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                                cy.get('body').should('contain', "Thank you for submitting the form.\n")
                        });
                    })
                });
            });
        }
    })

    it("submission should fail for mandatory captcha", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes(FT_TURNSTILE)) {
            updateTurnstileSecretKey(alwaysFailSecretKey, "managed");
            cy.previewForm(pagePath).then((p) => {
                formContainer = p;
            });
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.get('.cmp-adaptiveform-turnstile__widget').should('be.visible').then($iframe => {
                cy.wrap($iframe).then($iframe => {
                    cy.window().should('have.property', 'turnstile').and('not.be.undefined')
                        .then((hcaptcha) => {
                            hcaptcha.execute();
                            return new Cypress.Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                }, 3000);
                            });
                        }).then(() => {
                        cy.on('window:alert', (message) => {
                            expect(message).to.equal('Encountered an internal error while submitting the form.');
                        });
                        cy.intercept('POST', /\/adobe\/forms\/af\/submit\/.*/).as('submitForm');
                        cy.get(`.cmp-adaptiveform-button__widget`).click();
                        cy.wait('@submitForm').then((interception) => {
                            expect(interception.response.statusCode).to.equal(400);
                            expect(interception.response.body).to.have.property('title', 'The CAPTCHA validation failed. Please try again.');
                            expect(interception.response.body).to.have.property('detail', 'com.adobe.aem.forms.af.rest.exception.CaptchaValidationException: Captcha validation failed.');
                        });
                    })
                });
            });
        }
    })

    it("submission should pass for mandatory invisible captcha", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes(FT_TURNSTILE)) {
            updateTurnstileSecretKey(alwaysPassSecretKey, "invisible");
            cy.previewForm(invisiblePagePath).then((p) => {
                formContainer = p;
            });
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.get(`.cmp-adaptiveform-turnstile__widget`).should('exist').then(() => {
                cy.intercept('POST', /\/adobe\/forms\/af\/submit\/.*/, (req) => {
                    req.reply((res) => {
                        expect(res.statusCode).to.equal(200);
                    });
                });
                cy.get(`.cmp-adaptiveform-button__widget`).click();
            });
        }
    });

    it("submission should return 400 if invisible captcha validation fails", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes(FT_TURNSTILE)) {
            updateTurnstileSecretKey(alwaysFailSecretKey, "invisible");
            cy.previewForm(invisiblePagePath).then((p) => {
                formContainer = p;
            });
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.get(`.cmp-adaptiveform-turnstile__widget`).should('exist').then(() => {
                cy.intercept('POST', /\/adobe\/forms\/af\/submit\/.*/, (req) => {
                    req.reply((res) => {
                        expect(res.statusCode).to.equal(400);
                    });
                });
            cy.get(`.cmp-adaptiveform-button__widget`).click();
            });
        }
    });

})
