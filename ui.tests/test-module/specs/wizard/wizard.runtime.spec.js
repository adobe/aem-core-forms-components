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
describe("Form with Wizard Layout Container", () => {

    const pagePath = "content/forms/af/core-components-it/samples/wizard/basic.html";
    const bemBlock = 'cmp-adaptiveform-wizard';

    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });


    it("check If Two Tabs are present in the page", () => {
        cy.get(".cmp-adaptiveform-wizard__tab").should('have.length', 2);
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").should('have.length', 2);
    });

    it("check First tab is active", () => {
        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
    });

    it("verify Next Navigation Button Functionality", () => {
        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');

        cy.get(".cmp-adaptiveform-wizard__nextNav").click({force: true});

        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('have.class', 'cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');

        cy.get(".cmp-adaptiveform-wizard__nextNav").click({force: true});

        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('have.class', 'cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
    });

    it("verify Prev Navigation Button Functionality", () => {
        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');

        cy.get(".cmp-adaptiveform-wizard__previousNav").click({force: true});

        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');


        cy.get(".cmp-adaptiveform-wizard__nextNav").click({force: true});

        cy.get(".cmp-adaptiveform-wizard__previousNav").click({force: true});

        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');

    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })

});

describe("Form with Wizard Layout Container With Validation", () => {

    const pagePath = "content/forms/af/core-components-it/samples/wizard/validation.html";
    const bemBlock = 'cmp-adaptiveform-wizard';

    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

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

    const getNextButton = () => {
        return cy.get(".cmp-adaptiveform-wizard__nextNav");
    }

    const getPreviousButton = () => {
        return cy.get(".cmp-adaptiveform-wizard__previousNav");
    }

    it("check if first tab validation is stopping from going to next tab", () => {
        getTabs().should('have.length', 5);
        getWizardPanels().should('have.length', 5);
        getTabAtIndex(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
        getWizardPanelAtIndex(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        getNextButton().click({force: true}).then(() => {
            //still first tab should be active as validation errors are there
            getTabAtIndex(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
            getWizardPanelAtIndex(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
            //check for validation error's presence in all the applicable fields in panel
            getWizardPanelAtIndex(0).get('.cmp-adaptiveform-numberinput__errormessage').should('have.text', 'required');
            getWizardPanelAtIndex(0).get('.cmp-adaptiveform-datepicker__errormessage').should('have.text', 'hello, please put a date');
        })
    });

    it("check that first tab validation is allowing to next step on entering required fields ", () => {
        getTabs().should('have.length', 5);
        getWizardPanels().should('have.length', 5);
        getTabAtIndex(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
        getWizardPanelAtIndex(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        getWizardPanelAtIndex(0).find('.cmp-adaptiveform-numberinput__widget').type('1').then(() => {
            getWizardPanelAtIndex(0).find('.cmp-adaptiveform-datepicker__widget').clear().type('2020-10-10').blur().then(() => {
                getNextButton().click({force: true}).then(() => {
                    //0th index now shouldn't be active
                    getTabAtIndex(0).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');
                    getWizardPanelAtIndex(0).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                    //1st index should be active
                    getTabAtIndex(1).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                    getWizardPanelAtIndex(1).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                    //check that if there is no validation then next tab navigation is working properly
                    getNextButton().click({force: true}).then(() => {
                        getTabAtIndex(1).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');
                        getWizardPanelAtIndex(1).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                        getTabAtIndex(2).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                        getWizardPanelAtIndex(2).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                    })
                })
            })
        })
    });

    it("check that on  validation error previous tabs are accessible ", () => {
        getWizardPanelAtIndex(0).find('.cmp-adaptiveform-numberinput__widget').type('1').then(() => {
            getWizardPanelAtIndex(0).find('.cmp-adaptiveform-datepicker__widget').clear().type('2020-10-10').blur().then(() => {
                getNextButton().click({force: true}).then(() => {
                    //1st index should be active
                    getTabAtIndex(1).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                    getWizardPanelAtIndex(1).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                    getNextButton().click({force: true}).then(() => {
                        //2nd index should be active
                        getTabAtIndex(2).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                        getWizardPanelAtIndex(2).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                        getNextButton().click({force: true}).then(() => {
                            //3rd index should be active
                            getTabAtIndex(3).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                            getWizardPanelAtIndex(3).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                            getNextButton().click({force: true}).then(() => {
                                // still 3rd index should be active as validation will fail for required field
                                getTabAtIndex(3).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                                getWizardPanelAtIndex(3).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                                getPreviousButton().click({force: true}).then(() => {
                                    //3rd index should be inactive now
                                    getTabAtIndex(3).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');
                                    getWizardPanelAtIndex(3).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                                    //now 2nd index should be active
                                    getTabAtIndex(2).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                                    getWizardPanelAtIndex(2).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                                })

                            })
                        })
                    })
                })
            })
        })
    });
});

describe("Form with Wizard Layout Container with focus", () => {

    const pagePath = "content/forms/af/core-components-it/samples/wizard/focus.html";
    const bemBlock = 'cmp-adaptiveform-wizard';

    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });


    it("check If Two Tabs are present in the page", () => {
        cy.get(".cmp-adaptiveform-wizard__tab").should('have.length', 2);
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").should('have.length', 2);
    });

    it("check if first tab activated if focus call from other tab", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0];

        // panel 1 active
        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');

        cy.get(".cmp-adaptiveform-wizard__nextNav").click({force: true}).then(() => {
            // panel 2 active
            cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');
            cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
            cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
            cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');

            cy.get(".cmp-adaptiveform-wizard__wizardpanel").then(() => {
                formContainer.setFocus(id);
                cy.get(".cmp-adaptiveform-wizard__tab").then(() => {
                    // panel 1 active
                    cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                    cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__tab--active');
                    cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                    cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                });
            });
        });
    });

});

describe("Form with wizard Layout Container with Hidden Children", () => {

    const pagePath = "content/forms/af/core-components-it/samples/wizard/visibility.html";
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it("check if first tab is hidden on page load honoring jcr and second tab is active", () => {

        const firstItemNavOfWizardId = formContainer._model.items[0].items[0].id + "_wizard-item-nav";
        const firstItemOfWizardId = formContainer._model.items[0].items[0].id + "__wizardpanel";
        const secondItemNavOfWizardId = formContainer._model.items[0].items[1].id + "_wizard-item-nav";
        const secondItemOfWizardId = formContainer._model.items[0].items[1].id + "__wizardpanel";

        cy.get(`#${firstItemNavOfWizardId}`).should('have.attr', 'data-cmp-visible', 'false');
        cy.get(`#${firstItemOfWizardId}`).should('have.attr', 'aria-hidden', 'true');
        cy.get(`#${secondItemNavOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(`#${secondItemOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
    });

    it("check if rule is working to hide child", () => {
        const secondItemNavOfWizardId = formContainer._model.items[0].items[1].id + "_wizard-item-nav";
        const secondItemOfWizardId = formContainer._model.items[0].items[1].id + "__wizardpanel";
        //check initial state
        cy.get(`#${secondItemNavOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
        cy.get(`#${secondItemOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');

        const textInputId = formContainer._model.items[1].id;
        cy.get(`#${textInputId}`).find('.cmp-adaptiveform-textinput__widget').focus().type('b').blur().then(() => {
            cy.get(`#${secondItemNavOfWizardId}`).should('not.be.visible').should('have.attr', 'data-cmp-visible', 'false');
            cy.get(`#${secondItemOfWizardId}`).should('not.have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
            const thirdItemNavOfWizardId = formContainer._model.items[0].items[2].id + "_wizard-item-nav";
            const thirdItemOfWizardId = formContainer._model.items[0].items[2].id + "__wizardpanel";
            cy.get(`#${thirdItemNavOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
            cy.get(`#${thirdItemOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
        })
    });

    it("check if navigation is working after hide child", () => {
        const textInputId = formContainer._model.items[1].id;
        cy.get(`#${textInputId}`).find('.cmp-adaptiveform-textinput__widget').focus().type('b').blur().then(() => {
            cy.get(`#${textInputId}`).find('.cmp-adaptiveform-textinput__widget').focus().clear().type('a').blur().then(() => {
                cy.get('.cmp-adaptiveform-wizard__nextNav').click({force: true}).then(() => {
                    const thirdItemNavOfWizardId = formContainer._model.items[0].items[2].id + "_wizard-item-nav";
                    const thirdItemOfWizardId = formContainer._model.items[0].items[2].id + "__wizardpanel";
                    cy.get(`#${thirdItemNavOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                    cy.get(`#${thirdItemOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                    cy.get('.cmp-adaptiveform-wizard__previousNav').click({force: true}).then(() => {
                        const firstItemNavOfWizardId = formContainer._model.items[0].items[0].id + "_wizard-item-nav";
                        const firstItemOfWizardId = formContainer._model.items[0].items[0].id + "__wizardpanel";
                        cy.get(`#${firstItemNavOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                        cy.get(`#${firstItemOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                        cy.get('.cmp-adaptiveform-wizard__nextNav').click({force: true}).then(() => {
                            cy.get(`#${thirdItemNavOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__tab--active');
                            cy.get(`#${thirdItemOfWizardId}`).should('have.class', 'cmp-adaptiveform-wizard__wizardpanel--active');
                        })
                    })
                })
            })
        })
    });
});