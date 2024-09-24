


describe("Form Runtime with Fragment", () => {
const pagePath = "content/forms/af/core-components-it/samples/formcontainer/basic.html"

const selectors = {
    hamburgerIcon : `.cmp-adaptiveform-container-hamburger-icon`,
    hamburgerMenu : `.cmp-adaptiveform-container-hamburger-menu`,
    hamburgerMenuNavBar: `.cmp-adaptiveform-container-nav-bar`,
    hamburgerMenuNavPrevious: `.cmp-adaptiveform-container-nav-button-previous`,
    hamburgerMenuNavNext: `.cmp-adaptiveform-container-nav-button-next`,
    hamburgerMenuNavTitle: `.cmp-adaptiveform-container-nav-title`,
    hamburgerMenuContainer: `.cmp-adaptiveform-container-hamburger-menu-container`,
    hamburgerMenuBreadCrumbsContainer: `.cmp-adaptiveform-container-breadcrumbs-container`
}

const cssClasses = {
    hamburgerMenuActive: 'cmp-adaptiveform-container-hamburger-menu-item-active',
    hamburgerMenuActiveParent: 'cmp-adaptiveform-container-hamburger-menu-item-activeparent',
    hamburgerMenuNavOpen: `cmp-adaptiveform-container-nav-button-open`,
    hamburgerMenuNavClose: `cmp-adaptiveform-container-nav-button-Close`,
}

let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it(" should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
    })


    it(`Test hamburger menu support to open on icon click`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerIcon).click();
        cy.get(selectors.hamburgerIcon).should("be.visible");
        cy.get(selectors.hamburgerMenu).should("be.visible");
    })

    it(`Test hamburger menu and nav bar support should not available in web view`, () => {
        cy.get(selectors.hamburgerIcon).should('have.css', 'display', 'none');
        cy.get(selectors.hamburgerMenu).should('have.css', 'display', 'none');
        cy.get(selectors.hamburgerMenuContainer).should('have.css', 'display', 'none');
    })

    it(`Test hamburger menu should render exact number of items`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerIcon).click();
        cy.get(selectors.hamburgerMenu+ ' > li').should('have.length', 2);
    })

    it(`Test hamburger menu should render breadcrumb container`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuBreadCrumbsContainer).should('be.visible');
    })

    it(`Test hamburger menu should render navigation bar`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuNavBar).should('be.visible');
    });

    it(`Test hamburger menu initial state where first item is selected along with the hierarchy`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerIcon).click();
        cy.get(selectors.hamburgerMenu+ ' > li > a').first().should('have.class', cssClasses.hamburgerMenuActiveParent);
        cy.get(selectors.hamburgerMenu+ ' > li > ul > li > a').first().should('have.class', cssClasses.hamburgerMenuActive);
    });

    it(`Test hamburger menu should render navigation bar along with title`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuNavBar).should('be.visible');
        cy.get(selectors.hamburgerMenuNavBar + ' > ' + selectors.hamburgerMenuNavTitle).should('be.visible').and('have.text', 'Panel 1');;
    });

    it(`Test hamburger menu should render navigation bar along with title`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenuNavBar).should('be.visible');
        cy.get(selectors.hamburgerMenuNavBar + ' > ' + selectors.hamburgerMenuNavTitle).should('be.visible').and('have.text', 'Panel 1');;
    });

    it(`Test hamburger menu initial state where first item is selected along with the hierarchy`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerMenu+ ' > li > a').first().should('have.class', cssClasses.hamburgerMenuActiveParent);
        cy.get(selectors.hamburgerMenu+ ' > li > ul > li > a').first().should('have.class', cssClasses.hamburgerMenuActive);
    });

    it(`Test hamburger menu check all nav buttons`, () => {
        cy.viewport('iphone-x');

        // Checking the initial state
        cy.get(selectors.hamburgerIcon).click();
        cy.get(selectors.hamburgerMenu + ' > li > a').first().should('have.class', cssClasses.hamburgerMenuActiveParent);
        cy.get(selectors.hamburgerMenu + ' > li > ul > li > a').first().should('have.class', cssClasses.hamburgerMenuActive);
        cy.get(selectors.hamburgerIcon).click();

        // Checking the right navigation
        cy.get(selectors.hamburgerMenuNavNext).click();
        cy.get(selectors.hamburgerMenu + ' > li > ul > li').eq(1).find('a').should('have.class', cssClasses.hamburgerMenuActiveParent);
        cy.get(selectors.hamburgerMenu + ' > li > ul > li').eq(1).find('a').should('have.class', cssClasses.hamburgerMenuActive);
        cy.get(selectors.hamburgerMenu + ' > li > ul > li').eq(1).find('a > button').should('have.class', cssClasses.hamburgerMenuNavOpen);


        // Checking the left navigation
        cy.get(selectors.hamburgerMenuNavPrevious).click();
        cy.get(selectors.hamburgerMenu + ' > li > a').first().should('have.class', cssClasses.hamburgerMenuActiveParent);
        cy.get(selectors.hamburgerMenu + ' > li > ul > li > a').first().should('have.class', cssClasses.hamburgerMenuActive);
        cy.get(selectors.hamburgerMenu + ' > li > ul > li').eq(1).find('a > button').should('have.class', cssClasses.hamburgerMenuNavOpen);
        
    });

})

