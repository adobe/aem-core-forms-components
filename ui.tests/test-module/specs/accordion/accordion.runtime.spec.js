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
    const childBemBlock = 'cmp-adaptiveform-datepicker';

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkView = (id, view, count) => {
        expect(view.children.length, "Accordion has children equal to count").to.equal(count);
    }

    const checkViewUpdate = (id, view, count) => {
        //adding delay for view update via mutation observer after html is appended
        const delayId = "delayAdder";
        cy.document().then($document => {
            cy.get(`#${id}`).then(($div) => {
                function delay(){
                    var mydiv = $document.createElement("div");
                    mydiv.setAttribute("id", delayId);
                    mydiv.innerText = "This is for adding delay.";
                    return mydiv;
                }
                $div.append(delay)
            })
        });
        return cy.get(`#${delayId}`)
            .then($el => $el.remove())
            .then(() => {
                cy.get(`#${delayId}`).should('not.exist');
                return cy.get(`#${id}`);
            })
            .then(() => {
                checkView(id, view, count);
            });
    }

    const checkHTML = (id, state, count, view) => {
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
        cy.get(`.${childBemBlock}`).should('have.length', count);

        checkViewUpdate(id, view, count);

        return cy.get(`#${id}`).within((root) => {
            cy.get(`.${childBemBlock}`).should('have.length', count);
        });
    }

    it(" should get model and view initialized properly and parent child relationship is set ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id);
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel());
        });

        const panelId = formContainer._model.items[0].id;
        const datepickerId = formContainer._model.items[0].items[0].id;
        const panelView = formContainer._fields[panelId];
        const datepickerView = formContainer._fields[datepickerId];
        expect(panelView, "panel view is created").to.not.be.null;
        expect(datepickerView, "panel child view is created").to.not.be.null;
        expect(panelView.children[0].id, "panel has reference to child view").to.equal(datepickerId);
        expect(datepickerView.parentView.id, "date picker has reference to parent panel view").to.equal(panelId);
    })

    it(" model's changes are reflected in the html ", () => {
        const panelId = formContainer._model.items[0].id;
        const model = formContainer._model.getElement(panelId);
        const panelView = formContainer._fields[panelId];
        const count = 1;
        checkHTML(model.id, model.getState(), count, panelView).then(() => {
            model.visible = false;
            return checkHTML(model.id, model.getState(), count, panelView);
        }).then(() => {
            model.enable = false;
            return checkHTML(model.id, model.getState(), count, panelView);
        });
    });

    // it(" add instance and remove instance of model is reflected in html ", () => {
    //     const panelId = formContainer._model.items[0].id;
    //     const panelModel = formContainer._model.getElement(panelId);
    //     const panelView = formContainer._fields[panelId];
    //     panelModel.visible = true;
    //     panelModel.enable = true;
    //
    //     let count = 2;
    //     console.log(panelView);
    //     panelView._addInstance();
    //     console.log(panelView);
    //     checkHTML(panelModel.id, panelModel.getState(), count, panelView)
    //         .then(() => {
    //             count = 3;
    //             //todo add payload tests once this is fixed in model
    //             panelView._addInstance();
    //             return checkHTML(panelModel.id, panelModel.getState(), count, panelView);
    //         }).then(() => {
    //             count = 4;
    //             panelView._addInstance();
    //             return checkHTML(panelModel.id, panelModel.getState(), count, panelView);
    //         }).then(() => {
    //             //max is 4 so shouldn't increase
    //             panelView._addInstance();
    //             return checkHTML(panelModel.id, panelModel.getState(), count, panelView);
    //         }).then(() => {
    //             count = 3;
    //             panelView._removeInstance();
    //             return checkHTML(panelModel.id, panelModel.getState(), count, panelView);
    //         }).then(() => {
    //             count = 2;
    //             panelView._removeInstance();
    //             return checkHTML(panelModel.id, panelModel.getState(), count, panelView);
    //         }).then(() => {
    //             count = 1;
    //             panelView._removeInstance();
    //             return checkHTML(panelModel.id, panelModel.getState(), count, panelView);
    //         }).then(() => {
    //             count = 0;
    //             panelView._removeInstance();
    //             return checkHTML(panelModel.id, panelModel.getState(), count, panelView);
    //         }).then(() => {
    //             //can't go below zero
    //             //todo remove commenting of below line once fixed in model
    //             //panelView._removeInstance();
    //             return checkHTML(panelModel.id, panelModel.getState(), count, panelView);
    //         }).then(() => {
    //             //after removing all, still one should be able to repeat instance
    //             count = 1;
    //             panelView._addInstance();
    //             return checkHTML(panelModel.id, panelModel.getState(), count, panelView);
    //         });
    // });

})