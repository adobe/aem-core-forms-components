/*******************************************************************************
 * Copyright 2024 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
describe("Embed form in site inside an iframe", () => {

    context('Form inside iframe embedded in site', function () {
  
      before(() => {
        cy.attachConsoleErrorSpy();
      });
      const pagePath = "/content/forms/sites/core-components-it/aemembedformsiniframetest.html";
      let formContainer = [];
      
      beforeEach(function () {
        cy.openPage(pagePath);
      })

    it.skip("thank you message check on submission of form embedded inside side using adaptive form embed container", () => {
      // getting the iframe
        cy.get('.cmp-aemform__iframecontent').its('0.contentDocument.body').should('not.be.empty')
        .within(() => {
          // accessing the form inside the iframe
          cy.get('.cmp-adaptiveform-container').should("exist").within(() => {
            cy.get(`.cmp-adaptiveform-button__widget`).should('be.visible').click();
          });
          // accessing the div containing the thank you message
          cy.get('.cmp-aemform__content').should("exist").should('contain', "Thank you for submitting the form.\n");;
        });
      })
    });
  });