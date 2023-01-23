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
 describe("Form with Panel Container", () => {

    const pagePath = "content/forms/af/core-components-it/samples/tabsontop/basic.html";
    const childBemBlock = 'cmp-adaptiveform-datepicker';
    const bemBlock = 'cmp-tabs';
    let formContainer = null;

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
            cy.get(`.${childBemBlock}`).should('not.exist');
        } else {
            cy.get(`.${childBemBlock}`).should('have.length', count);
        }

        expect(view.children.length, "tab has children equal to count").to.equal(count);
        return cy.get(`#${id}`);
    };


    it(" should get model and view initialized properly and parent child relationship is set ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id);
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel());
        });

        const tabId = formContainer._model.items[0].items[0].id;
        const datepickerId = formContainer._model.items[0].items[0].items[0].id;
        const tabView = formContainer._fields[tabId];
        const datepickerView = formContainer._fields[datepickerId];
        expect(tabView, "tab view is created").to.not.be.null;
        expect(datepickerView, "tabs child view is created").to.not.be.null;
        expect(tabView.children[0].id, "tab has reference to child view").to.equal(datepickerId);
        expect(datepickerView.parentView.id, "date picker has reference to parent panel view").to.equal(tabId);
    })

    it(" model's changes are reflected in the html ", () => {
        const tabId = formContainer._model.items[0].items[0].id;
        const model = formContainer._model.getElement(tabId);
        const tabView = formContainer.getAllFields()[tabId];
        const count = 2;
        checkHTML(model.id, model.getState(), tabView, count).then(() => {
            model.visible = false;
            return checkHTML(model.id, model.getState(), tabView, count);
        }).then(() => {
            model.enable = false;
            return checkHTML(model.id, model.getState(), tabView, count);
        });
    });
    const tabSelector = 'ol li';
    const tab1 = () => {
        return cy.get(tabSelector).first();
    }
    const tab2 = () => {
        return cy.get(tabSelector).last();
    }
    it("switch tab in runtime", () => {
        tab2().click();
        tab2().should('have.class','cmp-tabs__tab--active');
        tab2().should('have.attr','aria-selected','true');
        tab1().should('have.attr','aria-selected','false');
        tab1().click();
        tab1().should('have.class','cmp-tabs__tab--active');
        tab1().should('have.attr','aria-selected','true');
        tab2().should('have.attr','aria-selected','false');
    });

    it("switch tab in runtime using keyboard", () => {
       
        tab1().trigger('keydown',{
            keyCode: 40
        });
        
        tab2().should('have.class','cmp-tabs__tab--active');
        tab2().should('have.attr','aria-selected','true');
        tab1().should('have.attr','aria-selected','false');

        tab2().trigger('keydown',{
            keyCode: 38
        });
        tab1().should('have.class','cmp-tabs__tab--active');
        tab1().should('have.attr','aria-selected','true');
        tab2().should('have.attr','aria-selected','false');
    });

   it("should toggle description and tooltip", () => {
     cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
   })
});