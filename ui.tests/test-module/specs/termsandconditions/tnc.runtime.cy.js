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
describe("Form Runtime with Terms and Conditions", () => {

    const pagePath = "content/forms/af/core-components-it/samples/termsandconditions/basic.html",
        externalPagePathSubmit="content/forms/af/core-components-it/samples/termsandconditions/submissiontest.html"
    const bemBlock = 'cmp-adaptiveform-termsandcondition'
    const IS = "adaptiveFormTermsAndConditions"
    const selectors = {
        tnc : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state, view, count) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false || state.readOnly === true ? "" : "not."}have.attr`;
        cy.get(`#${id}`)
        .should(passVisibleCheck)
        .invoke('attr', 'data-cmp-visible')
        .should('eq', visible.toString());
        cy.get(`#${id}`)
        .invoke('attr', 'data-cmp-enabled')
        .should('eq', state.enabled.toString());
        expect(state.items.length, "model has children equal to count").to.equal(2);
        expect(view.children.length, "tab has children equal to count").to.equal(2); // this is because at any given point, either links are shown or text content is shown
        return cy.get(`#${id}`).within((root) => {
            cy.get('*').should(passVisibleCheck)
            cy.get('input')
                .should('have.length', 1)
            cy.get('input')
                .should(passDisabledAttributeCheck, 'disabled');
        })
    };

    it(" should get model and view initialized properly and parent child relationship is set ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        const fields = formContainer.getAllFields();
        Object.entries(fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id);
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel());
        });
    });

    it(" model's changes are reflected in the html ", () => {
        const tncId = formContainer._model.items[0].id
        const model = formContainer._model.getElement(tncId)
        const tabView = formContainer.getAllFields()[tncId];
        const count = 2;
        checkHTML(model.id, model.getState(), tabView, count).then(() => {
            model.visible = false;
            return checkHTML(model.id, model.getState(), tabView, count);
        }).then(() => {
            model.enable = false;
            return checkHTML(model.id, model.getState(), tabView, count);
        });
    });


    it("OOTB behaviour -> should enable approval checkbox only if links visited", () => {
        const tncWithLinksID = formContainer._model.items[1].id;
        const model = formContainer._model.getElement(tncWithLinksID)
        expect(model.getState().items[0].enabled).to.equal(false);
        cy.get(`#${tncWithLinksID}`).get('a').click()
        .then(() => {
            expect(model.getState().items[0].enabled).to.equal(true);
        })

    });

    it("OOTB behaviour -> should have show popup", () => {
        const tncWithPopup = formContainer._model.items[2].id;
        const model = formContainer._model.getElement(tncWithPopup)
        cy.get(`#${tncWithPopup} .cmp-adaptiveform-termsandcondition__content-container`)
        .should('have.class', 'cmp-adaptiveform-termsandcondition__content-container--modal')
        .invoke('attr', 'data-cmp-visible').should('eq', 'false')
        expect(model.getState().items[1].enabled).to.equal(false);
        cy.get(`#${tncWithPopup} .cmp-adaptiveform-checkbox__widget-container label`).click()
        .then(() => {
            // this test will also verify scrollDone scenario
            cy.get(`#${tncWithPopup} .cmp-adaptiveform-checkbox`).invoke('attr', 'data-cmp-enabled')
            .should('eq', 'true')
            expect(model.getState().items[1].enabled).to.equal(true);
            cy.get(`#${tncWithPopup} .cmp-adaptiveform-termsandcondition__content-container`)
            .invoke('attr', 'data-cmp-visible').should('not.exist');
            cy.get(`#${tncWithPopup} .cmp-adaptiveform-termsandcondition__close-button`)
            .should('have.attr', 'aria-label', 'Close terms and conditions document')
            .click()
            .then(() => {
                cy.get(`#${tncWithPopup} .cmp-adaptiveform-termsandcondition__content-container`)
                .invoke('attr', 'data-cmp-visible').should('eq', 'false', );
            })
        })
    });

    it('checkbox should be required by default', () => {
        const tncWithLinksID = formContainer._model.items[1].id;
        const model = formContainer._model.getElement(tncWithLinksID)
        expect(model.getState().items[0].enabled).to.equal(false);
        cy.get(`#${tncWithLinksID}`).get('a').click()
        .then(() => {
            expect(model.getState().items[0].enabled).to.equal(true);
            cy.get(`#${tncWithLinksID} .cmp-adaptiveform-checkbox`).invoke('attr', 'data-cmp-enabled')
            .should('eq', 'true'); 
            cy.get(`#${tncWithLinksID} .cmp-adaptiveform-checkbox`).click()
            .then(() => {
                cy.get(`#${tncWithLinksID} .cmp-adaptiveform-checkbox__errormessage`).should('be.empty');
            }) 
            cy.get(`#${tncWithLinksID} .cmp-adaptiveform-checkbox`).dblclick().should('not.be.checked')
            .then(() => {
                cy.get(`#${tncWithLinksID} .cmp-adaptiveform-checkbox__errormessage`).should('not.be.null');
            })      
        })
      })

 })
