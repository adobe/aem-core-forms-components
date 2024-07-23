


describe("Form Runtime with Fragment", () => {
const pagePath = "content/forms/af/core-components-it/samples/formcontainer/basic.html"
const bemBlock = 'cmp-adaptiveform-fragment'
const IS = "adaptiveFormFragment"
const selectors = {
    hamburgerIcon : `.cmp-adaptiveform-container-hamburger`,
    hamburgerMenu : `.cmp-adaptiveform-container-hamburgerMenu`
}
let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
        const value = state.value == null ? '' : state.value;
        cy.get(`#${id}`)
            .should(passVisibleCheck)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', visible.toString());
        cy.get(`#${id}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', state.enabled.toString());
        return cy.get(`#${id}`).within((root) => {
            cy.get('*').should(passVisibleCheck)
            cy.get('input')
                .should(passDisabledAttributeCheck, 'disabled');
            cy.get('input').should('have.value', value)
        })
    }

    // const checkInstanceHTML = (instanceManager, count) => {
    //     expect(instanceManager.children.length, " instance manager view has children equal to count ").to.equal(count);
    //     expect(instanceManager.getModel().items.length, " instance manager model has items equal to count ").to.equal(count);
    //     const checkChild = (childView) => {
    //         checkHTML(childView.getId(), childView.getModel(), childView);
    //     }
    //     instanceManager.children.forEach(checkChild);
    //     return cy.get('[data-cmp-is="adaptiveFormContainer"]');
    // };

    it(" should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
    })


    it(`Test hamburger menu support to open on icon click`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerIcon).click();
        cy.get(selectors.hamburgerIcon).should("be.visible");
        cy.get(selectors.hamburgerMenu).should("be.visible");
    })

    it(`Test hamburger menu support is not available in web view`, () => {
        cy.get(selectors.hamburgerIcon).should("not.be.visible");
        cy.get(selectors.hamburgerMenu).should("not.be.visible");
    })

    it(`Test hamburger menu should render exact number of items`, () => {
        cy.viewport('iphone-x');
        cy.get(selectors.hamburgerIcon).click();
        cy.get(selectors.hamburgerMenu+ ' > li').should('have.length', 3);
    })

    it(`Test hamburger menu item click and check first non panel field to be in focus`, () => {
        cy.viewport('iphone-x');
        // Click on the hamburger icon
        cy.get(selectors.hamburgerIcon).click();
        cy.get(selectors.hamburgerMenu+ ' > li').eq(0).trigger('click');
        cy.get(selectors.hamburgerMenu+ ' > li').find('li').eq(0).trigger('click');

        let inputId = ''
        cy.contains('label', 'Accordion Panel 1 Text Input').should(($label) => {
            inputId = $label.attr('for');
            if (inputId) {
                console.log(`#${inputId}`);
                // cy.get(`#${inputId}`).as('panel1Input');
                cy.get(`#${inputId}`).should('be.focused'); // Example: assert input value
            }
        });
    })

})

