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
    const customSubmitPagePathRequestParameters = "content/forms/af/core-components-it/samples/actions/submit/customsubmit/basicwithrequestparameters.html"
    const externalPagePathSubmit = "content/forms/af/core-components-it/samples/actions/submit/external.html"
    const submitSuccessRulePagePath = "content/forms/af/core-components-it/samples/actions/submit/submitsuccessrule.html"
    const emailPagePath = "content/forms/af/core-components-it/samples/actions/submit/email.html"
    const invalidApiPagePath = "content/forms/af/core-components-it/samples/actions/submit/validate.html"
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

    // actual email won't trigger, but in case of any error, the test case would fail
    it("Clicking the button should trigger email submission of the form", () => {
        cy.previewForm(emailPagePath);
        cy.intercept({
            method: 'POST',
            url: '**/adobe/forms/af/submit/*',
        }).as('afSubmission')

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
                        cy.get(`#${id}`).find(`.cmp-adaptiveform-${id.split("-")[0]}__errormessage`).should('have.text', "Please fill in this field.")
                    }
                });
            });
    });


    it("Custom Submit Action Test", () => {
        cy.previewForm(customSubmitPagePath);
        cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
            cy.get('body').should('contain', "Thank you for submitting the form.\n")
        });
    })


    if (cy.af.isLatestAddon()) {
        it("Custom Submit Action With Redirect Parameter test", () => {
            cy.previewForm(customSubmitPagePathRequestParameters);
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                cy.url().should('include', '?prefillId');
            });
        })
    }


    it("Submit Action test without passing any custom submit event", () => {
        cy.previewForm(submitSuccessRulePagePath).then(p => {
            formContainer = p;
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                cy.location('href')
                    .should('eq', 'http://localhost:4502/aem/forms.html/content/dam/formsanddocuments');
            });

        })
    })

    it("External redirectURL post submit redirects to external page.", () => {
        cy.previewForm(externalPagePathSubmit).then(p => {
            formContainer = p;
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            Object.entries(formContainer._fields).forEach(([id, field]) => {
                fillField(id); // mark all the fields with some value
            });
        });

        // Intercept the form submission
        cy.intercept('POST', '**af/submit**').as('formSubmit');

        cy.get(`.cmp-adaptiveform-button__widget`).click();
        // Wait for the form submission interception to occur
        //cy.wait('@formSubmit');

        // Assert that the URL has changed after form submission
        cy.url().should('include', 'abc.html');
    })

    if (!cy.af.isOldCoreComponent()) { // don't run this test for old core components
        it("invalid field marked using API should not submit the form", () => {
            cy.previewForm(invalidApiPagePath).then(p => {
                let formContainer = p;
                expect(formContainer, "formcontainer is initialized").to.not.be.null;
                const [textInput, textInputFieldView] = Object.entries(formContainer._fields)[0];
                const incorrectInput = "aaa";
                const correctInput = "bbbbbbbbbbbbbbbb";
                cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                    cy.get(`#${textInput}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Please fill in this field.")
                    cy.get(`#${textInput}`).find("input").clear().type(incorrectInput).focus().blur().then(x => {
                        cy.get(`#${textInput}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Comments must be at least 15 characters long.");
                        cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                            cy.get('body').should('not.contain', "Thank you for submitting the form.\n")
                            cy.get(`#${textInput}`).find("input").clear().type(correctInput).focus().blur().then(x => {
                                cy.get(`#${textInput}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"")
                                cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                                    cy.get('body').should('contain', "Thank you for submitting the form.\n")
                                });
                            });
                        });
                    })
                });
            });
        });
    }


    if (!cy.af.isOldCoreComponent()) {
        it(`should have type as submit`, () => {
            cy.previewForm(pagePath);
            cy.get(`.cmp-adaptiveform-button__widget`).should('have.attr', 'type', 'submit');
        });
    }
})
