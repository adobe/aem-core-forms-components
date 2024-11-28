/*******************************************************************************
 * Copyright 2023 Adobe
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
describe("Form in site using embed container", () => {

    context('Forms inside site using adaptive form embed container', function () {
  
      before(() => {
        cy.attachConsoleErrorSpy();
      });
      const pagePath = "/content/forms/sites/core-components-it/aemembedformstest.html";
      let formContainer = [];

      beforeEach(function () {
          cy.previewForm(pagePath, {multipleEmbedContainers: true}).then(p => {
              formContainer = p;
          });
      })
  
      it("should render two form", () => {
        expect(formContainer.length).to.equal(2);
      });

      if(cy.af.isLatestAddon) {
        it("should submit on button click and thank you message of embed container must be overridden", () => {
            cy.intercept({
              method: 'POST',
              url: '**/adobe/forms/af/submit/*',
              }).as('afSubmission');
            cy.get(`.cmp-adaptiveform-button__widget`).eq(0).click().then(() => {
            cy.get('body').should('contain', "Thank You message from sites.")
          });
        });

        it("should submit on button click and thank you message of embed container must be overridden", () => {
          cy.intercept({
            method: 'POST',
            url: '**/adobe/forms/af/submit/*',
            }).as('afSubmission');
            cy.get(`.cmp-adaptiveform-button__widget`).eq(1).then(($button) => {
                if (!$button.is(':disabled')) {
                    cy.wrap($button).click().then(() => {
                        cy.get('body').should('contain', "Thank You message from new form in sites.");
                    });
                }
            });
        });
      }
    })
  });
  