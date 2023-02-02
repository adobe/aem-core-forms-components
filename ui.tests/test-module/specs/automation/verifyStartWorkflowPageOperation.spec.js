/*
 *  Copyright 2023 Adobe Systems Incorporated
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

describe('Verify Start workflow page operation on af editor', function () {

    const url = '/aem/forms.html/content/dam/formsanddocuments';
    const invokeAemWorkflowButton = '[data-item-id="fd/dashboard/components/actions/aemworkflowsubmit"]';
    const productNavigation = 'coral-panel-content[role="presentation"] button[class="_coral-Button _coral-Button--primary _coral-Button--quiet"]';

    it('verify Start workflow page operation on af editor', function () {
        cy.openPage(url);
        cy.get(productNavigation).should('exist').eq(0).click();
        cy.get('#aem-forms-create').click();
        cy.get('[title="Adaptive Form"]').click();
        Cypress.on('uncaught:exception', (err, runnable) => {
            return (!err.message.includes('Handlebars is not defined'))
        })
        cy.get('[role="tab"]').should('exist').eq(3).click();
        cy.get(invokeAemWorkflowButton).click();
        cy.get('[class="properties-panel"]')
            .should("exist");
    });
});
