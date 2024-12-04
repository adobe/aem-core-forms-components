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
import 'cypress-wait-until';

describe("Captcha In Sites Runtime Test", () => {
    const siteWithRecaptchaScore = "content/forms/sites/core-components-it/site-with-captcha-inline-form.html";

    let formContainer = null;

    function updateEnterpriseConfig(score) {
        const secretKey = Cypress.env('RECAPTCHA_ENT_API_KEY');
        cy.openPage("/mnt/overlay/fd/af/cloudservices/recaptcha/properties.html?item=%2Fconf%2Fcore-components-it%2Fsamples%2Frecaptcha%2Fbasic%2Fsettings%2Fcloudconfigs%2Frecaptcha%2Fentscore").then(x => {
            cy.get('#recaptcha-cloudconfiguration-secret-key').clear().type(secretKey);
            cy.get('#recaptcha-cloudconfiguration-threshold-score').clear().type(score);
            cy.get("#shell-propertiespage-doneactivator").click();
        })
    }
    
    it("submission should pass for enterprise score based captcha",() => {
        updateEnterpriseConfig(0.5);
        cy.previewForm(siteWithRecaptchaScore).then((p) => {
            formContainer = p;
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
        });
    })
    
})
