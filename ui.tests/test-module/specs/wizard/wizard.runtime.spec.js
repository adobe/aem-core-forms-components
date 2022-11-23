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


    it("check If Two Tabs are present in the page",()=> {
        cy.get(".cmp-adaptiveform-wizard__tab").should('have.length',2);
    }) ;

    it("check If Two Components are present in the page",()=> {
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").should('have.length',2);
    }) ;

    it("check First tab is active",()=> {
        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class','cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class','cmp-adaptiveform-wizard__tab--active');
    }) ;

    it("check First Component div is active",()=> {
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class','cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class','cmp-adaptiveform-wizard__wizardpanel--active');
    }) ;

    it("check If Navigation Buttons are present",()=> {
        cy.get(".cmp-adaptiveform-wizard__previousNav").should('have.length',1);
        cy.get(".cmp-adaptiveform-wizard__nextNav").should('have.length',1);
    }) ;

    it("verify Next Navigation Button Functionality",()=> {
        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class','cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class','cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class','cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class','cmp-adaptiveform-wizard__wizardpanel--active');

        cy.get(".cmp-adaptiveform-wizard__nextNav").click({force:true});

        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('not.have.class','cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('have.class','cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('not.have.class','cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('have.class','cmp-adaptiveform-wizard__wizardpanel--active');

        cy.get(".cmp-adaptiveform-wizard__nextNav").click({force:true});

        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('not.have.class','cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('have.class','cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('not.have.class','cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('have.class','cmp-adaptiveform-wizard__wizardpanel--active');
    }) ;

    it("verify Prev Navigation Button Functionality",()=> {
        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class','cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class','cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class','cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class','cmp-adaptiveform-wizard__wizardpanel--active');

        cy.get(".cmp-adaptiveform-wizard__previousNav").click({force:true});

        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class','cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class','cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class','cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class','cmp-adaptiveform-wizard__wizardpanel--active');


        cy.get(".cmp-adaptiveform-wizard__nextNav").click({force:true});

        cy.get(".cmp-adaptiveform-wizard__previousNav").click({force:true});

        cy.get(".cmp-adaptiveform-wizard__tab").eq(0).should('have.class','cmp-adaptiveform-wizard__tab--active');
        cy.get(".cmp-adaptiveform-wizard__tab").eq(1).should('not.have.class','cmp-adaptiveform-wizard__tab--active');

        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(0).should('have.class','cmp-adaptiveform-wizard__wizardpanel--active');
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").eq(1).should('not.have.class','cmp-adaptiveform-wizard__wizardpanel--active');

    }) ;

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })

});