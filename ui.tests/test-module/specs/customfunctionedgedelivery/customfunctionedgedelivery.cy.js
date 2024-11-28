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

describe("Form to check custom function defined in edge delivery", () => {

    const pagePath = "content/forms/af/core-components-it/samples/customfunctionedgedelivery/customfunctionedgedelivery.html"
    let toggle_array = [];
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });



    it(" fullName field should update on change in first name and last name ", () => {
            const firstName = Object.entries(formContainer._fields)[0];
            const lastName = Object.entries(formContainer._fields)[1];
            const fullName = Object.entries(formContainer._fields)[2];
            cy.get(`#${firstName[0]}`).find("input").clear().type("fname").blur().then(x => {
                cy.get(`#${lastName[0]}`).find("input").clear().type("lname").blur().then(x => {
                    cy.get(`#${fullName[0]}`).find("input").should('have.value', 'fname lname')
                })
            })
    })

})
