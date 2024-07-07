/*
 *  Copyright 2022 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

/**
 * Testing Custom Prefill
 */

describe('Custom Prefill Test', function () {
    const pagePath = "content/forms/af/core-components-it/samples/prefill/basic.html";
    const nameTextBox = "input[name='name']",
        dobDropdown = "input[name='dob']",
        genderRadioButton = "input[name='radiobutton-c8c660bac8_name']",
        jobDropdown = "select[name='job']";
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })

        cy.intercept({
            method: 'POST',
            url: '**/adobe/forms/af/submit/*',
        }).as('afSubmission')
    });

    const validatePrefill = (prefillId, customService) => {
        if (customService) {
            cy.intercept('GET', '**/af/data/**').as('afPrefill');
            // preview the form by passing the prefillId parameter in the URL
            cy.previewForm(pagePath, {"params" : [`prefillId=${prefillId}`, `dataRef=service://${customService}`]});
            // this test ensures that the prefill service is called, returns 500 since service does not exist on server
            cy.wait('@afPrefill').its('response.statusCode').should('eq', 500);
        } else {
            // preview the form by passing the prefillId parameter in the URL
            cy.previewForm(pagePath, {"params" : [`prefillId=${prefillId}`]});
            // validating the prefilled data
            cy.get(nameTextBox).should("have.value", "John Doe");
            cy.get(dobDropdown).should("have.value", "10 October, 1999");
            cy.get(genderRadioButton).should("have.value", "0");
            cy.get(jobDropdown).should("have.value", "1");
        }

    }

    it('', function() {
        // filling the form
        cy.get(nameTextBox).type("John Doe");
        cy.get(dobDropdown).type("1999-10-10");
        cy.get(genderRadioButton).first().check();
        cy.get(jobDropdown).select('Working');

        // submitting the form and fetching the prefillID
        let prefillId;
        cy.get("button").last().click();

        cy.wait('@afSubmission').then(({response}) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.not.null;
            expect(response.body.metadata).to.be.not.null;
            expect(response.body.metadata.prefillId).to.be.not.null;

            prefillId = response.body.metadata.prefillId;
            validatePrefill(prefillId);
        })
    });

    it('prefill using service in dataRef', function() {
        // filling the form
        cy.get(nameTextBox).type("John Doe");
        cy.get(dobDropdown).type("1999-10-10");
        cy.get(genderRadioButton).first().check();
        cy.get(jobDropdown).select('Working');

        // submitting the form and fetching the prefillID
        let prefillId;
        cy.get("button").last().click();

        cy.wait('@afSubmission').then(({response}) => {
            prefillId = response.body.metadata.prefillId;
            validatePrefill(prefillId, "temp");
        })
    });

})
