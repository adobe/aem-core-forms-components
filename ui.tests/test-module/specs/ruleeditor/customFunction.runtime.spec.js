/*
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2023 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

describe('Form with custom functions configured in client lib', () => {
    const pagePath = "/content/forms/af/core-components-it/samples/ruleeditor/af2-custom-function/basic.html";
    const submitPreprocessorPagePath = "content/forms/af/core-components-it/samples/ruleeditor/af2-custom-function/submitpreprocessor/basic.html"
    let formContainer = null;
    let toggle_array = [];

    /**
     * initialization of form container before every test
     * */
    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    it('should have custom function definition loaded in the window object', () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        let func;
        cy.window().then(win => {
            func = win.testFunction1;
            expect(func).to.not.be.null;
            expect(func).to.not.be.undefined;
        })

    })

    it("should have custom function registered in FunctionRuntime", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        let func;
        cy.window().then(win => {
            func = win.FormView.FunctionRuntime.customFunctions.testFunction1;
            expect(func).to.not.be.null;
            expect(func).to.not.be.undefined;
        })
    })

    it("should have set textinput value based on custom function rule", () => {
        // Rule on textBox1: set value of textBox1 to "test", which is output of custom function testFunction1()
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
        cy.get(`#${textbox1}`).find("input").should('have.value', "test")
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

    if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11541")) {
        it("should submit custom formData on button click", () => {
            // Rule when button is clicked then submit massaged formdata in custom function testSubmitFormPreprocessor()
            let submitPreprocessorFormContainer = null;
            cy.previewForm(submitPreprocessorPagePath).then(p => {
                submitPreprocessorFormContainer = p;
            })

            cy.intercept({
                method: 'POST',
                url: '**/adobe/forms/af/submit/*',
            }).as('afSubmission')

            Object.entries(submitPreprocessorFormContainer._fields).forEach(([id, field]) => {
                fillField(id); // mark all the fields with some value
            });

            cy.get(`.cmp-adaptiveform-button__widget`).click()

            cy.wait('@afSubmission').then(({ request, response }) => {
                // Check the request payload
                expect(request.body.data).to.be.not.null;
                expect(request.body.data.textbox1).to.equal("customData"); // which is set in custom function

                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.not.null;
                expect(response.body.thankYouMessage).to.be.not.null;
                expect(response.body.thankYouMessage).to.equal("Thank you for submitting the form.");
            })
        })
    }
})
