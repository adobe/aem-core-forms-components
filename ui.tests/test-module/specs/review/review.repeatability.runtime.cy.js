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

describe("Form with Review component with repeatablity", () => {

    const pagePath = "content/forms/af/core-components-it/samples/review/repeatability.html";
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
    const fillSecondRepeatablePanel = () => {
      tab2().click();
      cy.get(`#add_address_id-widget`).click().then(() => {
        cy.get('input[name="textinput1724402488097"]').eq(1).type('sector 132');
        cy.get('input[name="textinput_19265691141724402493991"]').eq(1).type('delhi');
        cy.get('select[name="dropdown1724402520718"]').eq(1).select("Delhi")
        cy.get('input[name="numberinput1724402569060"]').eq(1).type('201301');
      });
    }

    // Verify the first panel
    const checkFirstPanel = () => {
      cy.get(`.${bemBlock}__container .${bemBlock}__panel`).eq(0).within(() => {
        cy.get(`.${bemBlock}__label-container`).should('exist');
        cy.get(`.${bemBlock}__label`).contains('Personal Information');
        cy.get(`.${bemBlock}__edit-button`)
          .should('have.attr', 'data-cmp-visible', 'true')
          .should('have.attr', 'aria-label')
          .and('contain', 'Personal Information');

        cy.get(`.${bemBlock}__content`).should('exist').within(() => {
          cy.get(`.${bemBlock}__field`).eq(0).within(() => {
            cy.get(`.${bemBlock}__label`).contains('First name');
            cy.get(`.${bemBlock}__value`).contains('john');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
          });

          cy.get(`.${bemBlock}__field`).eq(1).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Last name');
            cy.get(`.${bemBlock}__value`).contains('deo');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
          });

          cy.get(`.${bemBlock}__field`).eq(2).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Email Address');
            cy.get(`.${bemBlock}__value`).contains('abc@gmail.com');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
          });

          cy.get(`.${bemBlock}__field`).eq(3).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Mobile Number');
            cy.get(`.${bemBlock}__value`).contains('+91987654321');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
          });

          cy.get(`.${bemBlock}__field`).eq(4).within(() => {
            cy.get(`.${bemBlock}__label`).contains('DOB');
            cy.get(`.${bemBlock}__value`).contains('2020-10-10');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
          });

          cy.get(`.${bemBlock}__field`).eq(5).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Gender');
            cy.get(`.${bemBlock}__value`).contains('Male');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
          });

          cy.get(`.${bemBlock}__field`).eq(6).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Interest');
            cy.get(`.${bemBlock}__value`).contains('Music , Football');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
          });
        });
      });
    }
    // Verify the second panel
    const checkSecondPanel = () => {
      cy.get(`.${bemBlock}__container .${bemBlock}__panel`).eq(1).within(() => {
        cy.get(`.${bemBlock}__content`).should('exist').within(() => {
          cy.get(`.${bemBlock}__label-container`).should('exist');
          cy.get(`.${bemBlock}__label`).contains('Address');
          cy.get(`.${bemBlock}__edit-button`)
            .should('have.attr', 'data-cmp-visible', 'true')
            .should('have.attr', 'aria-label')
            .and('contain', 'Address');

          cy.get(`.${bemBlock}__content`).should('exist').within(() => {
            cy.get(`.${bemBlock}__field`).eq(0).within(() => {
              cy.get(`.${bemBlock}__label`).contains('Address 1');
              cy.get(`.${bemBlock}__value`).contains('adobe system');
              cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
            });

            cy.get(`.${bemBlock}__field`).eq(1).within(() => {
              cy.get(`.${bemBlock}__label`).contains('City');
              cy.get(`.${bemBlock}__value`).contains('noida');
              cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
            });

            cy.get(`.${bemBlock}__field`).eq(2).within(() => {
              cy.get(`.${bemBlock}__label`).contains('State');
              cy.get(`.${bemBlock}__value`).contains('UP');
              cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
            });

            cy.get(`.${bemBlock}__field`).eq(3).within(() => {
              cy.get(`.${bemBlock}__label`).contains('Zip code');
              cy.get(`.${bemBlock}__value`).contains('123456');
              cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
            });
          });
        });
      });
    };
    // Verify the second repeatable panel
    const checkSecondRepeatablePanel = () => {
      cy.get(`.${bemBlock}__panel--repeatable`).eq(1).within(() => {
        cy.get(`.${bemBlock}__content`).should('exist').within(() => {
          cy.get(`.${bemBlock}__field`).eq(0).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Address 1');
            cy.get(`.${bemBlock}__value`).contains('sector 132');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
          });

          cy.get(`.${bemBlock}__field`).eq(1).within(() => {
            cy.get(`.${bemBlock}__label`).contains('City');
            cy.get(`.${bemBlock}__value`).contains('delhi');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
          });

          cy.get(`.${bemBlock}__field`).eq(2).within(() => {
            cy.get(`.${bemBlock}__label`).contains('State');
            cy.get(`.${bemBlock}__value`).contains('Delhi');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
          });

          cy.get(`.${bemBlock}__field`).eq(3).within(() => {
            cy.get(`.${bemBlock}__label`).contains('Zip code');
            cy.get(`.${bemBlock}__value`).contains('201301');
            cy.get(`.${bemBlock}__edit-button`).should('have.attr', 'data-cmp-visible', 'false');
          });
        });
      });
    };

    it("should render tabs on top with review component", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.get('.cmp-tabs').should('have.length', 1);
        cy.get('.cmp-tabs__tab').should('have.length', 3);
        tab3().click();
        tab3().should('have.class', 'cmp-tabs__tab--active');
        cy.get(`.${bemBlock}`).should('exist')
    });

    it("should render filled values with labels and edit buttons", () => {
        fillFirstTab();
        fillSecondTab();
        // Check review component
        tab3().click();
        cy.get(`.${bemBlock}`).should('exist');
        cy.get(`.${bemBlock}__container`).should('exist');
        cy.get(`.${bemBlock}__container`).children(`.${bemBlock}__panel`).should('have.length', 2);
        cy.get(`.${bemBlock}__container`).then(() => {
          checkFirstPanel();
        });
        cy.get(`.${bemBlock}__container`).then(() => {
          checkSecondPanel();
        });
    });

    it("should focus on the first field of the panel when clicking the edit button of the panel", () => {
        fillFirstTab();
        fillSecondTab();
        tab3().click();
        cy.get(`.panelcontainer1724402234656 .${bemBlock}__label-container .${bemBlock}__edit-button`).click().then(() => {
            cy.get('input[name="textinput1724402270046"]').should('be.focused').and('have.value', 'john');
        });
    });

    it("should render repeatable panel with filled values and edit buttons", () => {
        fillFirstTab();
        fillSecondTab();
        fillSecondRepeatablePanel()
        tab3().click();
        cy.get(`.${bemBlock}__container`).then(() => {
            checkSecondPanel();
        });
        cy.get(`.${bemBlock}__container`).then(() => {
            checkSecondRepeatablePanel();
        });
    });

    it("should focus on the second repeatable panel when clicking the edit button of the repeatable panel", () => {
        fillFirstTab();
        fillSecondTab();
        fillSecondRepeatablePanel()
        tab3().click();
        cy.get(`.${bemBlock}__panel--repeatable`).eq(1).find(`.${bemBlock}__label-container .${bemBlock}__edit-button`).click().then(() => {
            cy.get('input[name="textinput1724402488097"]').eq(1).should('be.focused').and('have.value', 'sector 132');
        });
    });
    
});


