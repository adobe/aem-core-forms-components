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

    it('', function() {
        // filling the form
        cy.get("input[name='name']").type("John Doe");
        cy.get("input[name='dob']").type("1999-10-10");
        cy.get("input[name='gender']").first().check();
        cy.get("select[name='job']").select('Working');

        // submitting the form and fetching the prefillID
        let prefillId, url;
        cy.get("button").click();

        cy.wait('@afSubmission').then(({response}) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.not.undefined;
            expect(response.body.metadata).to.be.not.undefined;
            expect(response.body.metadata.prefillId).to.be.not.undefined;

            prefillId = response.body.metadata.prefillId;
            url = response.url;
            console.log(url)

            cy.visit(pagePath + `?wcmmode=disabled&prefillId=${prefillId}`).then(() => {
                cy.get("input[name='name']").should("be.equal","John Doe");
            })
        })

    });

})