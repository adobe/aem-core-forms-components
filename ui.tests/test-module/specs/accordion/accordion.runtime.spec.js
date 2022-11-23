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
describe("Form with Accordion Container", () => {

    const pagePath = "content/forms/af/core-components-it/samples/accordion/basic.html";
    const childBemBlock = 'cmp-accordion__item';
    const bemBlock = "cmp-accordion";
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
        expect(state.items.length, "model has children equal to count").to.equal(count);
        if (count == 0) {
            return cy.get(`.${childBemBlock}`).should('not.exist');
        } else {
            return cy.get(`.${childBemBlock}`).should('have.length', count);
        }
    };


    it(" should get model and view initialized properly and parent child relationship is set ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id);
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel());
        });

        const datepickerId = formContainer._model.items[0].items[0].id;
        const datepickerView = formContainer._fields[datepickerId];
        expect(datepickerView, "panel child view is created").to.not.be.null;
    })

    it(" model's changes are reflected in the html ", () => {
        const panelId = formContainer._model.items[0].id;
        const model = formContainer._model.getElement(panelId);
        const datepickerId = formContainer._model.items[0].items[0].id;
        const datepickerView = formContainer._fields[datepickerId];
        const count = 2;
        checkHTML(model.id, model.getState(), datepickerView, count).then(() => {
            model.visible = false;
            return checkHTML(model.id, model.getState(), datepickerView, count);
        }).then(() => {
            model.enable = false;
            return checkHTML(model.id, model.getState(),  datepickerView, count);
        });
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })
})