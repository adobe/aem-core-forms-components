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
describe("Form with TabsOnTop Container", () => {
    const pagePath = "content/forms/af/core-components-it/samples/tabsontop/repeatability.html";
    const bemBlock = 'cmp-tabs';
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    })

    const getTabs = () => {
        return cy.get(".cmp-tabs__tab");
    }

    const getTabPanels = () => {
        return cy.get(".cmp-tabs__tabpanel");
    }

    const getTabAtIndex = (index) => {
        return getTabs().eq(index);
    }

    const getTabPanelAtIndex = (index) => {
        return getTabPanels().eq(index);
    }

    it("testing add/remove instance basic", () => {
        getTabs().should('have.length', 4);
        getTabPanels().should('have.length', 4);
        cy.get("button").contains("+R1").click().then(() => {
            getTabs().should('have.length', 5);
            getTabPanels().should('have.length', 5);
            cy.get("button").contains("-R1").click().then(() => {
                getTabs().should('have.length', 4);
                getTabPanels().should('have.length', 4);
                cy.get("button").contains("-R1").click().then(() => {
                    getTabs().should('have.length', 3);
                    getTabPanels().should('have.length', 3);
                })
            })
        })
    })

    it("testing max instance addition", () => {
        getTabs().should('have.length', 4);
        getTabPanels().should('have.length', 4);
        for (let i = 0; i < 4; i++) {
            cy.get("button").contains("+R1").click().then(() => {
                const maxOccurAllowed = 4;
                const initialNoOfTabs = 4;
                const length = i < maxOccurAllowed - 1 ? initialNoOfTabs + (i + 1) : 7;   // panel is allowed max occurence of 4
                getTabs().should('have.length', length);
                getTabPanels().should('have.length', length);
            })
        }
    })

    it("test repeatedTab instance html", () => {
        getTabs().should('have.length', 4);
        getTabPanels().should('have.length', 4);
        cy.get("button").contains("+R1").click().then(() => {
            getTabs().should('have.length', 5);
            getTabPanels().should('have.length', 5);
            getTabAtIndex(1).should('have.attr', 'aria-controls');
            getTabAtIndex(1).should('have.attr', 'id');
            getTabAtIndex(1).should('have.class', 'cmp-tabs__tab--active');
            getTabPanelAtIndex(1).should('have.attr', 'id');
            getTabPanelAtIndex(1).should('have.attr', 'aria-labelledby');
            getTabPanelAtIndex(1).should('have.class', 'cmp-tabs__tabpanel--active');
        })
    })

    it("test addedPanel position when inserted at first position in tab", () => {
        getTabs().should('have.length', 4);
        getTabPanels().should('have.length', 4);
        getTabAtIndex(0).should('have.class', 'cmp-tabs__tab--active');
        getTabPanelAtIndex(0).should('have.class', 'cmp-tabs__tabpanel--active');
        getTabAtIndex(1).should('not.have.class', 'cmp-tabs__tab--active');
        getTabPanelAtIndex(1).should('not.have.class', 'cmp-tabs__tabpanel--active');
        getTabPanelAtIndex(1).find('.cmp-adaptiveform-numberinput');
        cy.get("button").contains("-R1").click().then(() => {
            getTabs().should('have.length', 3);
            getTabPanels().should('have.length', 3);
            //check panel which was at first index is now at zero
            getTabPanelAtIndex(0).find('.cmp-adaptiveform-numberinput');
            cy.get("button").contains("+R1").click().then(() => {
                //check that the panel is indeed added at 0th index and is active
                getTabPanelAtIndex(0).find('.cmp-adaptiveform-textinput');
                getTabAtIndex(0).should('have.class', 'cmp-tabs__tab--active');
                getTabPanelAtIndex(0).should('have.class', 'cmp-tabs__tabpanel--active');
            })
        })
    })

    it("test addedPanel position when inserted at first position in instanceManager", () => {
        getTabs().should('have.length', 4);
        getTabPanels().should('have.length', 4);
        getTabAtIndex(2).should('not.have.class', 'cmp-tabs__tab--active');
        getTabPanelAtIndex(2).should('not.have.class', 'cmp-tabs__tabpanel--active');
        getTabPanelAtIndex(2).find('.cmp-adaptiveform-datepicker');
        //remove the instance of panel
        cy.get("button").contains("-R2").click().then(() => {
            getTabs().should('have.length', 3);
            getTabPanels().should('have.length', 3);
            // check that panel instance gpr removed
            getTabPanelAtIndex(2).find('.cmp-adaptiveform-dropdown');
            //add instance of repeated panel
            cy.get("button").contains("+R2").click().then(() => {
                //check that the panel is indeed added again at the 2nd index and is active
                getTabPanelAtIndex(2).find('.cmp-adaptiveform-datepicker');
                getTabAtIndex(2).should('have.class', 'cmp-tabs__tab--active');
                getTabPanelAtIndex(2).should('have.class', 'cmp-tabs__tabpanel--active');
            })

        })
    })


})
