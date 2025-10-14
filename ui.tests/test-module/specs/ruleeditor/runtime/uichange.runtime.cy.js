/*
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe Systems Incorporated
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

describe('Form with custom functions containing ui change action configured in client lib', () => {
    const formPath = "content/forms/af/core-components-it/samples/ruleeditor/uichange.html";
    let formContainer = null;

    /**
     * initialization of form container before every test
     * */
    beforeEach(() => {
        cy.previewForm(formPath).then(p => {
            formContainer = p;
        });
    });

    it("ui change action should reset field model based on custom function", () => {
        // Rule on textBox1: set value of textBox1 to "test", which is output of custom function testFunction1()
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        const [numberInput1, fieldView1] = Object.entries(formContainer._fields)[0]
        const [numberInput7, fieldView2] = Object.entries(formContainer._fields)[6]
        const numberInput1Model = formContainer._model.getElement(numberInput1)
        const numberInput7Model = formContainer._model.getElement(numberInput7)
        numberInput1Model.value = 123;
        cy.get(`#${numberInput1}`).find("input").should('have.value',"123")
        // let's trigger ui change action by doing changes via the dom API's
        cy.get(`#${numberInput7}`).find("input").clear().type("93").blur().then(x => {
            cy.get(`#${numberInput1}`).find("input").should('have.value',"")
        })
    })


    it("setting value programmatically should not reset the model value", () => {
        // Rule on textBox1: set value of textBox1 to "test", which is output of custom function testFunction1()
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        const [numberInput1, fieldView1] = Object.entries(formContainer._fields)[0]
        const [numberInput7, fieldView2] = Object.entries(formContainer._fields)[6]
        const numberInput1Model = formContainer._model.getElement(numberInput1)
        const numberInput7Model = formContainer._model.getElement(numberInput7)
        numberInput1Model.value = 123;
        cy.get(`#${numberInput1}`).find("input").should('have.value',"123")
        // let's trigger ui change action by doing changes via the dom API's
        numberInput7Model.value = 93;
        cy.get(`#${numberInput1}`).find("input").should('have.value',"123");
    })
})
