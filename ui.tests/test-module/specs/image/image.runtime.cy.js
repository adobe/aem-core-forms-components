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
    const pagePath = "content/forms/af/core-components-it/samples/image/basic.html";
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

    it('image should get initialized properly', () => {
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

        cy.get('.cmp-adaptiveform-textinput__widget')
          .type('Hide me');
        cy.get('.cmp-adaptiveform-textinput')
          .click({ multiple: true });
        cy.get('#image-4309210171').should('not.be.visible');

        cy.get('.cmp-adaptiveform-textinput__widget').clear()
            .type('Show me');
        cy.get('.cmp-adaptiveform-textinput')
            .click({ multiple: true });
        cy.get('#image-4309210171').should('be.visible');

    })

 })