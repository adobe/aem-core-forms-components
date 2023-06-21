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
describe("Form with Wizard Container", () => {
    const pagePath = "content/forms/af/core-components-it/samples/wizard/repeatability.html";
    const bemBlock = 'cmp-tabs';
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    })

    const getTabs = () => {
        return cy.get(".cmp-adaptiveform-wizard__tab");
    }

    const getWizardPanels = () => {
        return cy.get(".cmp-adaptiveform-wizard__wizardpanel");
    }

    const getTabAtIndex = (index) => {
        return getTabs().eq(index);
    }

    const getWizardPanelAtIndex = (index) => {
        return getWizardPanels().eq(index);
    }

    it("testing add/remove instance basic", () => {
        getTabs().should('have.length', 4);
        getWizardPanels().should('have.length', 4);
        cy.get("button").contains("+R1").click().then(() => {
            getTabs().should('have.length', 5);
            getWizardPanels().should('have.length', 5);
            cy.get("button").contains("-R1").click().then(() => {
                getTabs().should('have.length', 4);
                getWizardPanels().should('have.length', 4);
                cy.get("button").contains("-R1").click().then(() => {
                    getTabs().should('have.length', 3);
                    getWizardPanels().should('have.length', 3);
                })
            })
        })
    })

    it("testing max instance addition", () => {
        getTabs().should('have.length', 4);
        getWizardPanels().should('have.length', 4);
        for (let i = 0; i < 4; i++) {
            cy.get("button").contains("+R1").click().then(() => {
                const maxOccurAllowed = 3;
                const initialNoOfTabs = 4;
                const length = i < maxOccurAllowed - 1 ? initialNoOfTabs + (i + 1) : initialNoOfTabs + maxOccurAllowed - 1;   // panel is allowed max occurence of 4
                getTabs().should('have.length', length);
                getWizardPanels().should('have.length', length);
            })
        }
    })

    it("test repeatedTab instance html", () => {
        getTabs().should('have.length', 4);
        getWizardPanels().should('have.length', 4);
        cy.get("button").contains("+R1").click().then(() => {
            getTabs().should('have.length', 5);
            getWizardPanels().should('have.length', 5);
            getTabAtIndex(1).should('have.attr', 'aria-controls');
            getTabAtIndex(1).should('have.attr', 'id');
            getTabAtIndex(1).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
            getWizardPanelAtIndex(1).should('have.attr', 'id');
            getWizardPanelAtIndex(1).should('have.attr', 'aria-labelledby');
            getWizardPanelAtIndex(1).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        })
    })

    it("test addedPanel position when inserted at first position in tab", () => {
        getTabs().should('have.length', 4);
        getWizardPanels().should('have.length', 4);
        getTabAtIndex(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
        getWizardPanelAtIndex(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        getTabAtIndex(1).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');
        getWizardPanelAtIndex(1).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        getWizardPanelAtIndex(1).find('.cmp-adaptiveform-dropdown');
        cy.get("button").contains("-R1").click().then(() => {
            getTabs().should('have.length', 3);
            getWizardPanels().should('have.length', 3);
            //check panel which was at first index is now at zero
            getWizardPanelAtIndex(0).find('.cmp-adaptiveform-dropdown');
            cy.get("button").contains("+R1").click().then(() => {
                //check that the panel is indeed added at 0th index and is active
                getWizardPanelAtIndex(0).find('.cmp-adaptiveform-numberinput');
                getTabAtIndex(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                getWizardPanelAtIndex(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
            })
        })
    })

    it("test addedPanel position when inserted at first position in instanceManager", () => {
        getTabs().should('have.length', 4);
        getWizardPanels().should('have.length', 4);
        getTabAtIndex(3).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');
        getWizardPanelAtIndex(3).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        getWizardPanelAtIndex(3).find('.cmp-adaptiveform-textinput');
        //remove the instance of panel
        cy.get("button").contains("-R2").click().then(() => {
            getTabs().should('have.length', 3);
            getWizardPanels().should('have.length', 3);
            //add instance of repeated panel
            cy.get("button").contains("+R2").click().then(() => {
                //check that the panel is indeed added again at the 2nd index and is active
                getWizardPanelAtIndex(3).find('.cmp-adaptiveform-textinput');
                getTabAtIndex(3).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                getWizardPanelAtIndex(3).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
            })

        })
    })


})

describe('visibility of navigation buttons', function () {
    const pagePath = "content/forms/af/core-components-it/samples/wizard/navigationWithRepeatability.html";
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    })

    it("navigating start to end to start", () => {
        const previousNavButton = '.cmp-adaptiveform-wizard__previousNav',
            nextNavButton = '.cmp-adaptiveform-wizard__nextNav',
            wizardItems = formContainer._model.items[0].items;

        const wizardPanelActive = 'cmp-adaptiveform-wizard__wizardpanel--active';

        getWizardPanelAtIndex(0).should('have.class', wizardPanelActive);
        cy.get(previousNavButton).should('have.attr', 'data-cmp-visible', 'false');
        for(let i=0; i<6; i++) {
            cy.get(nextNavButton).click({force: true});
        };

        getWizardPanelAtIndex(5).should('have.class', wizardPanelActive);
        cy.get(nextNavButton).should('have.attr', 'data-cmp-visible', 'false');
        for(let i=0; i<6; i++) {
            cy.get(previousNavButton).click({force: true});
        };

        getWizardPanelAtIndex(0).should('have.class', wizardPanelActive);
    })

    const getTabs = () => {
        return cy.get(".cmp-adaptiveform-wizard__tab");
    }

    const getWizardPanels = () => {
        return cy.get(".cmp-adaptiveform-wizard__wizardpanel");
    }

    const getTabAtIndex = (index) => {
        return getTabs().eq(index);
    }

    const getWizardPanelAtIndex = (index) => {
        return getWizardPanels().eq(index);
    }

    // it("testing visibility on add/remove instance", () => {
    //     const textInputId = formContainer._model.items[1].id;
    //     const wizardItems = formContainer._model.items[0].items;
    //
    //     const firstItemNavOfWizardId = wizardItems[0].id + "_wizard-item-nav",
    //         firstItemOfWizardId = wizardItems[0].id + "__wizardpanel",
    //         secondItemNavOfWizardId = wizardItems[1].id + "_wizard-item-nav",
    //         secondItemOfWizardId = wizardItems[1].id + "__wizardpanel";
    //
    //     const previousNavButton = '.cmp-adaptiveform-wizard__previousNav',
    //         nextNavButton = '.cmp-adaptiveform-wizard__nextNav',
    //         driverTextInput = '.cmp-adaptiveform-textinput__widget',
    //         wizardTabActive = 'cmp-adaptiveform-wizard__tab--active',
    //         wizardPanelActive = 'cmp-adaptiveform-wizard__wizardpanel--active';
    //
    //     cy.get(`#${firstItemNavOfWizardId}`).should('have.attr', 'data-cmp-visible', 'false');
    //     cy.get(`#${firstItemOfWizardId}`).should('have.attr', 'aria-hidden', 'true');
    //     cy.get(`#${secondItemNavOfWizardId}`).should('have.class', wizardTabActive);
    //     cy.get(`#${secondItemOfWizardId}`).should('have.class', wizardPanelActive);
    //     cy.get(previousNavButton).should('have.attr', 'data-cmp-visible', 'false');
    //     cy.get(nextNavButton).should('have.attr', 'data-cmp-visible', 'true');
    //
    //     cy.get(`#${textInputId}`).find(driverTextInput).focus().clear().type('a').blur().then(() => {
    //         // check if first is not hidden and prev is visible
    //         cy.get(`#${firstItemNavOfWizardId}`).should('have.attr', 'data-cmp-visible', 'true');
    //         cy.get(previousNavButton).should('have.attr', 'data-cmp-visible', 'true');
    //         cy.get(previousNavButton).click({force: true});
    //
    //         // check if prev is not visible now and active is first
    //         cy.get(`#${firstItemNavOfWizardId}`).should('have.class', wizardTabActive);
    //         cy.get(`#${firstItemOfWizardId}`).should('have.class', wizardPanelActive);
    //         cy.get(previousNavButton).should('have.attr', 'data-cmp-visible', 'false');
    //
    //         // check if active tab changes if current active is invisible
    //         cy.get(`#${textInputId}`).find(driverTextInput).clear().focus().type('b').blur().then(() => {
    //             cy.get(`#${firstItemNavOfWizardId}`).should('have.attr', 'data-cmp-visible', 'false');
    //             cy.get(`#${firstItemOfWizardId}`).should('have.attr', 'aria-hidden', 'true');
    //             cy.get(`#${secondItemNavOfWizardId}`).should('have.class', wizardTabActive);
    //             cy.get(`#${secondItemOfWizardId}`).should('have.class', wizardPanelActive);
    //             cy.get(previousNavButton).should('have.attr', 'data-cmp-visible', 'false');
    //             cy.get(nextNavButton).click({force: true});
    //             cy.get(nextNavButton).click({force: true});
    //
    //             // now check if next button is invisible after reaching last tab
    //             cy.get(nextNavButton).should('have.attr', 'data-cmp-visible', 'false');
    //
    //             // check if active tab changes if current active is invisible
    //             cy.get(`#${textInputId}`).find(driverTextInput).clear().focus().type('c').blur().then(() => {
    //                 cy.get(nextNavButton).should('have.attr', 'data-cmp-visible', 'true');
    //                 cy.get(nextNavButton).click({force: true});
    //                 cy.get(nextNavButton).should('have.attr', 'data-cmp-visible', 'false');
    //             });
    //         });
    //     });
    // });
});
