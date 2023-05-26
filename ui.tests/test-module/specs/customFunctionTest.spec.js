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
    const pagePath = "/content/forms/af/core-components-it/samples/af2-custom-function/basic.html";
    let formContainer = null;

    /**
     * initialization of form container before every test
     * */
    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    if (cy.af.isLatestAddon()) {
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
                ``
                expect(func).to.not.be.undefined;
            })
        })

        it("should have set textinput value based on custom function rule", () => {
            // Rule on textBox1: set value of textBox1 to "test", which is output of custom function testFunction1()
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
            cy.get(`#${textbox1}`).find("input").should('have.value', "test")
        })
    }
})
