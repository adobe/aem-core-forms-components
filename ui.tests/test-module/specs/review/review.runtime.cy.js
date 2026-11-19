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

describe("Form with Review component", () => {

    const pagePath = "content/forms/af/core-components-it/samples/review/basic.html";
    const bemBlock = 'cmp-adaptiveform-review';
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const tabSelector = 'ol li';
    const tab1 = () => {
        return cy.get(tabSelector).eq(0);
    }
    const tab2 = () => {
      return cy.get(tabSelector).eq(1);
    }
    const tab3 = () => {
        return cy.get(tabSelector).eq(2);
    }
    const fillFirstTab = () => {
      tab1().click();
      cy.get('input[name="textinput1724402270046"]').type('john');
      cy.get('input[name="textinput_16829110921724402298524"]').type('deo');
      cy.get('input[name="emailinput1724402315995"]').type('abc@gmail.com');
      cy.get('input[name="telephoneinput1724402330900"]').type('+91987654321');
      cy.get('input[name="datepicker1724402449174"]').type('2020-10-10');
      cy.get(`#gender_id-widget`).find("input").eq(0).click();
      cy.get(`#interest_id-widget`).find("input").eq(0).click();
      cy.get(`#interest_id-widget`).find("input").eq(1).click();
    }
    const fillSecondTab = () => {
      tab2().click();
      cy.get('input[name="textinput1724402488097"]').type('adobe system');
      cy.get('input[name="textinput_19265691141724402493991"]').type('noida');
      cy.get('select[name="dropdown1724402520718"]').select("UP")
      cy.get('input[name="numberinput1724402569060"]').type('123456');
    }

    // Verify the first panel
    const checkFirstPanel = () => {
      cy.get(`.${bemBlock}__container .${bemBlock}__panel`).within(() => {
        cy.get(`.${bemBlock}__label-container`).should('exist');
        cy.get(`.${bemBlock}__label`).contains('Personal Information');
        cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');

        cy.get(`.${bemBlock}__content`).should('exist').within(() => {
          cy.get(`.${bemBlock}__field`).eq(0).within(() => {
            cy.get(`.${bemBlock}__label`).contains('First name');
            cy.get(`.${bemBlock}__value`).contains('john');
            cy.get(`.${bemBlock}__edit-button`)
              .should('have.attr', 'data-cmp-visible', 'true')
              .should('have.attr', 'aria-label')
              .and('contain', 'First name');
          });

          cy.get(`.${bemBlock}__field`).eq(1).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Last name');
            cy.get(`.${bemBlock}__value`).contains('deo');
            cy.get(`.${bemBlock}__edit-button`)
              .should('have.attr', 'data-cmp-visible', 'true')
              .should('have.attr', 'aria-label')
              .and('contain', 'Last name');
          });

          cy.get(`.${bemBlock}__field`).eq(2).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Full name');
            cy.get(`.${bemBlock}__value`).contains('johndeo');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'true');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'disabled');
          });

          cy.get(`.${bemBlock}__field`).eq(3).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Email Address');
            cy.get(`.${bemBlock}__value`).contains('abc@gmail.com');
            cy.get(`.${bemBlock}__edit-button`)
              .should('have.attr', 'data-cmp-visible', 'true')
              .should('have.attr', 'aria-label')
              .and('contain', 'Email Address');
          });

          cy.get(`.${bemBlock}__field`).eq(4).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Mobile Number');
            cy.get(`.${bemBlock}__value`).contains('+91987654321');
            cy.get(`.${bemBlock}__edit-button`)
              .should('have.attr', 'data-cmp-visible', 'true')
              .should('have.attr', 'aria-label')
              .and('contain', 'Mobile Number');
          });

          cy.get(`.${bemBlock}__field`).eq(5).within(() => {
            cy.get(`.${bemBlock}__label`).contains('DOB');
            cy.get(`.${bemBlock}__value`).contains('2020-10-10');
            cy.get(`.${bemBlock}__edit-button`)
              .should('have.attr', 'data-cmp-visible', 'true')
              .should('have.attr', 'aria-label')
              .and('contain', 'DOB');
          });

          cy.get(`.${bemBlock}__field`).eq(6).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Gender');
            cy.get(`.${bemBlock}__value`).contains('Male');
            cy.get(`.${bemBlock}__edit-button`)
              .should('have.attr', 'data-cmp-visible', 'true')
              .should('have.attr', 'aria-label')
              .and('contain', 'Gender');
          });

          cy.get(`.${bemBlock}__field`).eq(7).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Interest');
            cy.get(`.${bemBlock}__value`).contains('Music , Football');
            cy.get(`.${bemBlock}__edit-button`)
              .should('have.attr', 'data-cmp-visible', 'true')
              .should('have.attr', 'aria-label')
              .and('contain', 'Interest');
          });
        });
      });
    }

    it("should render tabs on top with review component", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.get('.cmp-tabs').should('have.length', 1);
        cy.get('.cmp-tabs__tab').should('have.length', 3);
        tab3().click();
        tab3().should('have.class', 'cmp-tabs__tab--active');
        cy.get(`.${bemBlock}`).should('exist')
    });

    it("should render linked panel (Tab 1) and check filled value", () => {
        fillFirstTab();
        fillSecondTab();
        tab3().click();
        cy.get(`.${bemBlock}`).should('exist');
        cy.get(`.${bemBlock}__container`).should('exist');
        cy.get(`.${bemBlock}__container`).should('contain', 'Personal Information');
        cy.get(`.${bemBlock}__container`).then(() => {
          checkFirstPanel();
        });
    });

    it("should not render unlinked panel", () => {
      tab3().click();
      cy.get(`.${bemBlock}__panel`).should('have.length', 1);
      cy.get(`.${bemBlock}__panel`).find('Address').should('not.exist');
      cy.get(`.${bemBlock}__panel`).find('Address 1').should('not.exist');
      cy.get(`.${bemBlock}__panel`).find('City').should('not.exist');
    });

    it("should focus on the first field of the panel when clicking the edit button of the panel", () => {
        fillFirstTab();
        tab3().click();
        cy.get(`.textinput1724402270046 .${bemBlock}__edit-button`).click().then(() => {
            cy.get('input[name="textinput1724402270046"]').should('be.focused').and('have.value', 'john');
        });
    });

    it("Edit button should be disabled for disabled field", () => {
      fillFirstTab();
      tab3().click();
      cy.get(`.textinput_19678416231729233302926 .${bemBlock}__edit-button`).should('have.attr', 'disabled');
    });

    it("Hidden field should not be visible", () => {
      tab3().click();
      cy.get(`.${bemBlock}__container .hidden_name`).should('not.exist');
    });

    it("Button field should not be visible", () => {
      tab3().click();
      cy.get(`.${bemBlock}__container .hidden_button`).should('not.exist');
    });
});


