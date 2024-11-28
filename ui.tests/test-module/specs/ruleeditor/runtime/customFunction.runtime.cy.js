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
    const formPath = "/content/forms/af/core-components-it/samples/ruleeditor/af2-custom-function/basic.html";
    let formContainer = null;
    let toggle_array = [];

    /**
     * initialization of form container before every test
     * */
    beforeEach(() => {
        cy.previewForm(formPath).then(p => {
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


    it("should submit custom formData on button click", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11541")) {
            // Rule when button is clicked then submit massaged formdata in custom function testSubmitFormPreprocessor()
            cy.intercept({
                method: 'POST',
                url: '**/adobe/forms/af/submit/*',
            }).as('afSubmission');

            cy.contains('button', 'Button').click();

            cy.wait('@afSubmission').then(({request, response}) => {
                // Check the request payload
                expect(request.body.data).to.be.not.null;
                expect(request.body.data.textinput1).to.equal("customData"); // which is set in custom function

                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.not.null;
                expect(response.body.thankYouMessage).to.be.not.null;
                expect(response.body.thankYouMessage).to.equal("Thank you for submitting the form.");
            });
        }
    })

    it("should import formData on button click", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11541")) {
            cy.contains('button', 'Import Data Button').click();
            cy.get('.cmp-adaptiveform-textinput__widget[name="textinput_12605243111716188337417"]').should('have.value', "abc");
        }
    })

    it("should set focus on email field on button click", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11541")) {
            cy.contains('button', 'Set Focus Button').click();
            cy.get('.cmp-adaptiveform-emailinput__widget[name="emailinput1716186792262"]').should('be.focused');
        }
    })

    it("should set focus on text box with nextItem option on button click", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11541")) {
            cy.contains('button', 'Set Focus Button').click();
            cy.contains('button', 'Set Focus Option Button').click();
            cy.get('.cmp-adaptiveform-textinput__widget[name="textinput1716186710837"]').should('be.focused');
        }
    })

    it("should add instance of repeatable panel on button click", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11541")) {
            cy.contains('button', 'Add Instance Button').click();
            cy.get('.cmp-container__label')
                .filter((index, element) => element.textContent.includes('Repeatable Panel'))
                .should('have.length', 3);
        }
    })

    it("should remove instance of repeatable panel on button click", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11541")) {
            cy.contains('button', 'Remove Instance Button').click();
            cy.get('.cmp-container__label')
                .filter((index, element) => element.textContent.includes('Repeatable Panel'))
                .should('have.length', 2);
        }
    })
})
