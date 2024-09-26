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

    beforeEach(() => {
        cy.previewForm(formPath).then(p => {
            formContainer = p;
        });
    });

    it("should show loading icon during submit", () => {
        // Intercept the form submission error
        cy.on('window:alert', (message) => {
            expect(message).to.equal('Encountered an internal error while submitting the form.');
        });
        const [id, fieldView] = Object.entries(formContainer._fields)[0];

        // Click the button and verify that the loading icon is added
        cy.get(`.cmp-adaptiveform-button__widget`).click();

        // Verify that the loading class is not present until validations are complete
        cy.get('[data-cmp-adaptiveform-container-loader]').should('not.have.class', 'cmp-adaptiveform-container--loading');

        // fill the mandatory fields
        cy.get(`#${id}`).find('.cmp-adaptiveform-textinput__widget').focus().type('a').blur().then(() => {

            cy.get(`.cmp-adaptiveform-button__widget`).then(($button) => {
                if (!$button.is(':disabled')) {
                    cy.wrap($button).click().then(() => {
                        // Verify that the loading class is removed from the form container after submission success or failure
                        cy.get('[data-cmp-adaptiveform-container-loader]').should('not.have.class', 'cmp-adaptiveform-container--loading');
                    });
                }
            });
        })

    });
})
