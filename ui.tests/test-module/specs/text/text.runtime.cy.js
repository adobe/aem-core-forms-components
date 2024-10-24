/*
 *  Copyright 2022 Adobe Systems Incorporated
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

 describe('Form with Adaptive form text', () => {
    const pagePath = "content/forms/af/core-components-it/samples/text/basic.html";
    let formContainer = null;

    /**
    * initialization of form container before every test
    * */
    beforeEach(() => {
    cy.previewForm(pagePath).then(p => {
        formContainer = p;
        })
    });
    const checkHTML = (id, state) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
        const value = state.value
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

    it('text should get initialized properly', () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });

    })

     it(" should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });
    })

     it(" html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        const input = "value"
        cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
            expect(model.getState().value).to.equal(input)
        })
    });

     it('test the rules editor', () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[1];
        cy.get('.cmp-adaptiveform-textinput__widget')
          .type('Hide me');
        cy.get('.cmp-adaptiveform-textinput')
          .click({ multiple: true });
        cy.get(`#${id}`).should('not.be.visible');

        cy.get('.cmp-adaptiveform-textinput__widget').clear()
            .type('Show me');
        cy.get('.cmp-adaptiveform-textinput')
            .click({ multiple: true });
        cy.get(`#${id}`).should('be.visible');

        cy.get('.cmp-adaptiveform-textinput__widget').clear()
            .type('Change me').blur();
        cy.get(`#${id}`).contains("CHANGED");
    });

     it(" Reset should not reset Static Text ", () => {
         const [id, fieldView] = Object.entries(formContainer._fields)[2];
         const [resetId, resetFieldView] = Object.entries(formContainer._fields)[3];
         const model = formContainer._model.getElement(id);
         expect(model.value, " Text model value should have").contains("Test text");
         cy.get(`#${id}`).contains("Test text");
         cy.get(`#${resetId}`).should("be.visible").click().then(() => {
             expect(model.value, " Text model after reset should have same value").contains("Test text");
             cy.get(`#${id}`).contains("Test text");
         });
     });

     it(" prefill of static text using explicit dataRef, name bindings is not supported", () => {
         const [id, fieldView] = Object.entries(formContainer._fields)[3];
         const [buttonId, buttonFieldView] = Object.entries(formContainer._fields)[5];
         const model = formContainer._model.getElement(id);
         cy.get(`#${buttonId} button`).should("be.visible").click().then(() => {
             expect(model.value, " Text model should import data").contains("prefilled");
             cy.get(`#${id}`).contains("prefilled");
         });
     });

     it("text hyperlink and new tab should be working", () => {
         const [id, fieldView] = Object.entries(formContainer._fields)[6];
         const model = formContainer._model.getElement(id);
         // expect(model.value, " Text model value should have").contains("Test text");
         // cy.get(`#${id}`).contains("Test text");
         cy.get(`#${id}`).should('have.attr', 'href', 'https://google.com') // Ensure the link has the correct href
             .should('have.attr', 'target', '_blank'); // Ensure the link opens in a new tab

         // Spy on the window.open event to ensure a new tab is being opened
         cy.window().then((win) => {
             cy.stub(win, 'open').as('windowOpen');
         });

         // Trigger a click on the link
         cy.get(`#${id}`).click();
         // Verify that window.open was called, meaning a new tab would open
         cy.get('@windowOpen').should('be.calledWith', 'https://google.com');
     });

 })