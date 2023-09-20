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

    const pagePath = "content/forms/af/core-components-it/samples/termsandconditions/basic.html"
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
        cy.get(`#${id}`)
        .should(passVisibleCheck)
        .invoke('attr', 'data-cmp-visible')
        .should('eq', visible.toString());
        cy.get(`#${id}`)
        .invoke('attr', 'data-cmp-enabled')
        .should('eq', state.enabled.toString());
        expect(state.items.length, "model has children equal to count").to.equal(3);
        expect(view.children.length, "tab has children equal to count").to.equal(2); // this is because at any given point, either links are shown or text content is shown
        return cy.get(`#${id}`);
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
        const count = 3;
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

    })
})

