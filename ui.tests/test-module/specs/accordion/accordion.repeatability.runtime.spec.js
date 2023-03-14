/*******************************************************************************
 * Copyright 2022 Adobe
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
describe("Form with Accordion Container with repeatable elements", () => {

    const pagePath = "content/forms/af/core-components-it/samples/accordion/repeatability.html";
    const childBemBlock = 'cmp-accordion__item';
    const bemBlock = "cmp-accordion";
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const getItemDivs = () => {
        return cy.get(".cmp-accordion__item");
    }

    const getAccordionPanels = () => {
        return cy.get(".cmp-accordion__panel");
    }

    const getAccordionButtons = () => {
        return cy.get(".cmp-accordion__button");
    }

    const getExpandedPanelDiv = () => {
        return cy.get(".cmp-accordion__panel--expanded");
    }

    const getExpandedButtonDiv = () => {
        return cy.get(".cmp-accordion__button--expanded");
    }

    const getAccordionPanelsAtIndex = (index) => {
        return getAccordionPanels().eq(index);
    }

    const getAccordionButtonsAtIndex = (index) => {
        return getAccordionButtons().eq(index);
    }

    const getAccordionItemAtIndex = (index) => {
        return getItemDivs().eq(index);
    }

    it("testing add/remove instance basic", () => {
        getItemDivs().should('have.length', 5);
        getAccordionPanels().should('have.length', 5);
        getAccordionButtons().should('have.length', 5);
        getExpandedPanelDiv().should('have.length', 1);
        getExpandedButtonDiv().should('have.length', 1);
        const initialNoOfAccordionPanels = 5;
        const maxOccurAllowed = formContainer._model.items[0].items[4].maxOccur;
        const minOccurAllowed = formContainer._model.items[0].items[4].minOccur;
        // -1 because inialNoOfPanels has 1 instance of this panel.
        const maxNoOfPanels = initialNoOfAccordionPanels + maxOccurAllowed - 1;
        //clicking on addinstance more than the maxOccurAllowed times to check that maxOccue is honored
        for (let i = 1; i < maxOccurAllowed + 2; i++) {
            cy.get("button").contains("+RP3").click().then(() => {
                //since initial occurence is already 1 that's why since i< maxOccurAllowed instances should increase
                if (i <= maxOccurAllowed - minOccurAllowed) {
                    getItemDivs().should('have.length', initialNoOfAccordionPanels + i);
                    getAccordionPanels().should('have.length', initialNoOfAccordionPanels + i);
                    getAccordionButtons().should('have.length', initialNoOfAccordionPanels + i);
                } else {
                    //after i==maxOccurAllowed noOfInstances will be constant.
                    getItemDivs().should('have.length', maxNoOfPanels);
                    getAccordionPanels().should('have.length', maxNoOfPanels);
                    getAccordionButtons().should('have.length', maxNoOfPanels);
                }
            })
        }

        //clicking on removeinstance more than the maxOccurAllowed times to check that minOccur is honored as already maxOccur no of instance of this panel is present
        for (let i = 1; i < maxOccurAllowed + 2; i++) {
            cy.get("button").contains("-RP3").click().then(() => {
                //since initial occurence is already maxOccurAllowed that's why till (i > maxOccurAllowed-minOccurAllowed) instances should decrease
                if (i <= maxOccurAllowed - minOccurAllowed) {
                    getItemDivs().should('have.length', maxNoOfPanels - i);
                    getAccordionPanels().should('have.length', maxNoOfPanels - i);
                    getAccordionButtons().should('have.length', maxNoOfPanels - i);
                } else {
                    //after i==maxOccurAllowed noOfInstances will be constant.
                    getItemDivs().should('have.length', initialNoOfAccordionPanels);
                    getAccordionPanels().should('have.length', initialNoOfAccordionPanels);
                    getAccordionButtons().should('have.length', initialNoOfAccordionPanels);
                }
            })
        }
    })

    it("test repeatedTab instance html", () => {
        getItemDivs().should('have.length', 5);
        getAccordionPanels().should('have.length', 5);
        getAccordionButtons().should('have.length', 5);
        getExpandedPanelDiv().should('have.length', 1);
        getExpandedButtonDiv().should('have.length', 1);
        cy.get("button").contains("+RP1").click().then(() => {
            getItemDivs().should('have.length', 6);
            getAccordionPanels().should('have.length', 6);
            getAccordionButtons().should('have.length', 6);
            getExpandedPanelDiv().should('have.length', 1);
            getExpandedButtonDiv().should('have.length', 1);
            getAccordionItemAtIndex(1).should('have.attr', 'data-cmp-expanded');
            getAccordionButtonsAtIndex(1).should('have.attr', 'aria-controls');
            getAccordionButtonsAtIndex(1).should('have.class', 'cmp-accordion__button--expanded');
            getAccordionPanelsAtIndex(1).should('have.class', 'cmp-accordion__panel--expanded');
            getAccordionPanelsAtIndex(1).should('have.attr', 'aria-labelledby');
        })
    })

    it("test addedPanel position when inserted at first position in tab", () => {
        getItemDivs().should('have.length', 5);
        getAccordionPanels().should('have.length', 5);
        getAccordionButtons().should('have.length', 5);
        getExpandedPanelDiv().should('have.length', 1);
        getExpandedButtonDiv().should('have.length', 1);
        getAccordionItemAtIndex(0).should('have.attr', 'data-cmp-expanded');
        getAccordionButtonsAtIndex(0).should('have.class', 'cmp-accordion__button--expanded');
        //initially the panel at index 0 has emailInput
        getAccordionPanelsAtIndex(0).find('.cmp-adaptiveform-emailinput');
        //initially the panel at index 1 has datepicker
        getAccordionPanelsAtIndex(1).find('.cmp-adaptiveform-datepicker');
        cy.get("button").contains("-RP1").click().then(() => {
            //check panel which was at first index is now at zero
            getAccordionPanelsAtIndex(0).find('.cmp-adaptiveform-datepicker');
            cy.get("button").contains("+RP1").click().then(() => {
                //check that the panel is indeed added at 0th index and is active
                getAccordionPanelsAtIndex(0).find('.cmp-adaptiveform-emailinput');
                getAccordionItemAtIndex(0).should('have.attr', 'data-cmp-expanded');
                getAccordionButtonsAtIndex(0).should('have.class', 'cmp-accordion__button--expanded');
            })
        })
    })

    it("test addedPanel position when inserted at any position within instance manager other than first in tab", () => {
        getItemDivs().should('have.length', 5);
        getAccordionPanels().should('have.length', 5);
        getAccordionButtons().should('have.length', 5);
        getExpandedPanelDiv().should('have.length', 1);
        getExpandedButtonDiv().should('have.length', 1);

        //initially the panel at index 4 has numberInput
        getAccordionPanelsAtIndex(4).find('.cmp-adaptiveform-numberinput');
        cy.get("button").contains("+RP3").click().then(() => {
            //check that the panel is indeed added at 5th index i.e., 2nd index of its instance manager and is active
            getAccordionPanelsAtIndex(5).find('.cmp-adaptiveform-numberinput');
            //check that original panel is intact at 4th index
            getAccordionPanelsAtIndex(4).find('.cmp-adaptiveform-numberinput');
            getAccordionItemAtIndex(5).should('have.attr', 'data-cmp-expanded');
            getAccordionButtonsAtIndex(5).should('have.class', 'cmp-accordion__button--expanded');
        })
    })

    it("test addedPanel position when multiple removable repeatable panels appear before it in view", () => {
        getItemDivs().should('have.length', 5);
        getAccordionPanels().should('have.length', 5);
        getAccordionButtons().should('have.length', 5);
        getExpandedPanelDiv().should('have.length', 1);
        getExpandedButtonDiv().should('have.length', 1);
        cy.get("button").contains("-RP2").click().then(() => {
            cy.get("button").contains("-RP4").click().then(() => {
                cy.get("button").contains("+RP4").click().then(() => {
                    getItemDivs().should('have.length', 4);
                    getAccordionPanels().should('have.length', 4);
                    getAccordionButtons().should('have.length', 4);
                    //verify that added panel is at 2nd index;
                    getAccordionItemAtIndex(2).should('have.attr', 'data-cmp-expanded');
                    getAccordionButtonsAtIndex(2).should('have.class', 'cmp-accordion__button--expanded');
                    getAccordionPanelsAtIndex(2).find('.cmp-adaptiveform-checkboxgroup');
                })
            })
        })
    })
})