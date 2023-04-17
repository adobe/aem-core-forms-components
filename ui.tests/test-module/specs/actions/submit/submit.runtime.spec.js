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
describe("Form with Submit Button", () => {

    const pagePath = "content/forms/af/core-components-it/samples/actions/submit/basic.html"
    const customSubmitPagePath = "content/forms/af/core-components-it/samples/actions/submit/customsubmit/basic.html"
    const bemBlock = 'cmp-button'
    const IS = "adaptiveFormButton"
    const selectors = {
        submit : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null;

    it("should get model and view initialized properly ", () => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
            Object.entries(formContainer._fields).forEach(([id, field]) => {
                expect(field.getId()).to.equal(id)
                expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
            });
        })
    })

    const fillField = (id) => {
        const component = id.split('-')[0]; // get the component name from the id
        switch (component) {
            case "textinput":
                cy.get(`#${id}`).find("input").type("abc");
                break;
            case "numberinput":
                cy.get(`#${id}`).find("input").type("159");
                break;
            case "checkboxgroup":
                cy.get(`#${id}`).find("input").check(["0"]);
                break;
            case "radiobutton":
                cy.get(`#${id}`).find("input").eq(0).click();
                break;
            case "dropdown":
                cy.get(`#${id} select`).select(["0"])
                break;
        }
    };

    it("Clicking the button should submit the form", () => {
        cy.previewForm(pagePath);
        cy.intercept({
            method: 'POST',
            url: '**/adobe/forms/af/submit/*',
        }).as('afSubmission')

        Object.entries(formContainer._fields).forEach(([id, field]) => {
            fillField(id); // mark all the fields with some value
        });

        cy.get(`.cmp-adaptiveform-button__widget`).click()
        cy.wait('@afSubmission').then(({ response}) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.not.null;
            expect(response.body.thankYouMessage).to.be.not.null;
            expect(response.body.thankYouMessage).to.equal("Thank you for submitting the form.");
        })
    });


    it("Form submit should show validation errors", () => {
            cy.previewForm(pagePath);
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                Object.entries(formContainer._fields).forEach(([id, field]) => {
                    // if non submit field, check that all have error message in them
                    if (id.indexOf('submit') === -1) {
                        cy.get(`#${id}`).find(`.cmp-adaptiveform-${id.split("-")[0]}__errormessage`).should('have.text', "There is an error in the field")
                    }
                });
            });
    });


    it("Custom Submit Action Test", () => {
        cy.previewForm(customSubmitPagePath);
        cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
            cy.get('body').should('have.text', "Thank you for submitting the form.\n")
        });
    })

    it("Tampering redirectURL post submit redirects to default ThankYou Page", () => {
        cy.previewForm(pagePath);
        // intercepting submit call and tampering the redirectURL in its reponse
        cy.intercept('POST', '**/adobe/forms/af/submit/*', (request) => {
            request.reply(response => {
                response.body = {...response.body, "redirectUrl" : "https://google.in"}
            });
        }).as('tamperedAFSubmission');

        cy.intercept('GET', '**/guideContainer.guideThankYouPage.html').as('thankYouPage');

        Object.entries(formContainer._fields).forEach(([id, field]) => {
            fillField(id); // mark all the fields with some value
        });

        cy.get(`.cmp-adaptiveform-button__widget`).click();
        // it should redirect to the default thank You page
        cy.wait('@thankYouPage').then(({response}) => {
            expect(response.statusCode).to.equal(200);
            cy.get('body').should('have.text', "Thank you for submitting the form.\n")
        })
    })
})