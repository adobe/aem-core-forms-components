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
    const pagePath = "/content/forms/sites/core-components-it/loadunloadaftest.html";
    let formContainer = null;

    /**
     * initialization of form container before every test
     * */
    beforeEach(() => {
        cy.openPage(pagePath);
    });

    it('should load/unload forms', () => {

        cy.get("#form1-btn").click().then(() => {
            cy.get('[data-cmp-is="adaptiveFormContainer"]').then((el) => {
                const formContainer = el[0];
                expect(formContainer, "formcontainer is initialized").to.not.be.null;
                // test if rule is applied
                cy.get('input.cmp-adaptiveform-textinput__widget').should('have.value', "Hello World")
            })
        })

        cy.get('#form2-btn').click().then(() => {
            cy.get('[data-cmp-is="adaptiveFormContainer"]').then((el) => {
                const formContainer = el[0];
                expect(formContainer, "formcontainer is initialized").to.not.be.null;
                // test if rule is applied
                cy.get('input.cmp-adaptiveform-numberinput__widget').should('have.value', "9")
            })
        })

    })
})
