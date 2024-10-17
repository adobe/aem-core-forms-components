/*
 *  Copyright 2024 Adobe Systems Incorporated
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

describe("Form Runtime with Hamburger Menu", () => {
    const pagePath = "content/forms/af/core-components-it/samples/formcontainer/basic.html";

    let formContainer = null
    let selectors = null;
    let cssClasses = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
        cy.window().then($window => {
            selectors = $window.HamburgerMenu.selectors;
            cssClasses = $window.HamburgerMenu.cssClasses;
        });
    });

    it(" should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
    })


    it(`Test hamburger menu support to open on icon click`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuTopContainer.hamburgerMenuIcon).click();
        cy.get(selectors.hamburgerMenuTopContainer.hamburgerMenuIcon).should("be.visible");
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu).should("be.visible");
    })

    it(`Test hamburger menu should render exact number of items`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuTopContainer.hamburgerMenuIcon).click();
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu + ' > li').should('have.length', 2);
    })

    it(`Test hamburger menu should render breadcrumb container`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuMiddleContainer).should('be.visible');
    })

    it(`Test hamburger menu should render navigation bar`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuBottomContainer.self).should('be.visible');
    });

    it(`Test hamburger menu initial state where first item is selected along with the hierarchy`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuTopContainer.hamburgerMenuIcon).click();
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu+ ' > li > a').first().should('have.class', cssClasses.activeParent);
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu+ ' > li > ul > li > a').first().should('have.class', cssClasses.active);
    });

    it(`Test hamburger menu should render navigation bar along with title`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuBottomContainer.self).should('be.visible');
        cy.get(selectors.hamburgerMenuBottomContainer.self + ' > ' + selectors.hamburgerMenuBottomContainer.hamburgerMenuActiveItemTitle).should('be.visible').and('have.text', 'Panel 1');;
    });

    it(`Test hamburger menu should render navigation bar along with title`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuBottomContainer.self).should('be.visible');
        cy.get(selectors.hamburgerMenuBottomContainer.self + ' > ' + selectors.hamburgerMenuBottomContainer.hamburgerMenuActiveItemTitle).should('be.visible').and('have.text', 'Panel 1');;
    });

    it(`Test hamburger menu initial state where first item is selected along with the hierarchy`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu+ ' > li > a').first().should('have.class', cssClasses.activeParent);
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu+ ' > li > ul > li > a').first().should('have.class', cssClasses.active);
    });

    it(`Test hamburger menu check all nav buttons`, () => {
        cy.viewport('iphone-x');

        // Checking the initial state
        cy.get(selectors.hamburgerMenuTopContainer.hamburgerMenuIcon).click();
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu + ' > li > a').first().should('have.class', cssClasses.activeParent);
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu + ' > li > ul > li > a').first().should('have.class', cssClasses.active);
        cy.get(selectors.hamburgerMenuTopContainer.hamburgerMenuIcon).click();

        // Checking the right navigation
        cy.get(selectors.hamburgerMenuBottomContainer.hamburgerMenuNextNavButton).click();
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu + ' > li > ul > li').eq(1).find('a').should('have.class', cssClasses.activeParent);
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu + ' > li > ul > li').eq(1).find('a').should('have.class', cssClasses.active);
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu + ' > li > ul > li').eq(1).find('a > button').should('have.class', cssClasses.hamburgerMenuWidget.hamburgerMenuOpenNavButton);


        // Checking the left navigation
        cy.get(selectors.hamburgerMenuBottomContainer.hamburgerMenuPreviousNavButton).click();
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu + ' > li > a').first().should('have.class', cssClasses.activeParent);
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu + ' > li > ul > li > a').first().should('have.class', cssClasses.active);
        cy.get(selectors.hamburgerMenuWidget.hamburgerMenu + ' > li > ul > li').eq(1).find('a > button').should('have.class', cssClasses.hamburgerMenuWidget.hamburgerMenuOpenNavButton);
        
    });

})

