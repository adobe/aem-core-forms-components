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

describe('Custom form container with loader Test', () => {
    const formPath = "/content/forms/af/core-components-it/samples/container/custom.html";
    let formContainer = null;

    it("should show loading icon during submit", () => {
        cy.previewForm(formPath).then(p => {
            formContainer = p;
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
        });

        // Intercept the form submission
        cy.intercept('POST', '**af/submit**').as('formSubmit');

        // Click the button and verify that the loading icon is added
        cy.get(`.cmp-adaptiveform-button__widget`).click();

        // Verify that the loading class is removed from the form container after submission success or failure
        cy.get('[data-cmp-adaptiveform-container-loader]').should('not.have.class', 'cmp-adaptiveform-container--loading');
    });
})
