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
describe( "Form Runtime with Panel Container", () => {

    const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/basic.html";
    const childBemBlock = 'cmp-adaptiveform-datepicker';
    const bemBlock = 'cmp-container';
    let formContainer = null;

    beforeEach(() => {
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
        });
    });

    const checkHTML = (id, state, view, count) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const checkView = () => {
            expect(view.children.length, "panel has children equal to count").to.equal(count);
            return cy.get(`#${id}`);
        }
        cy.get(`#${id}`)
            .should(passVisibleCheck)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', visible.toString());
        cy.get(`#${id}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', state.enabled.toString());
        expect(state.items.length, "model has children equal to count").to.equal(count);
        if (count == 0) {
            return cy.get(`.${childBemBlock}`).should('not.exist').then(checkView);
        } else {
            return cy.get(`.${childBemBlock}`).should('have.length', count).then(checkView);
        }
    };

    const checkAddRemoveInstance = (panelId, panelModel, panelView, count, isAdd) => {
        const EVENT_NAME = isAdd ? "AF_PanelChildAdded" : "AF_PanelChildRemoved";
        let innerResolution = undefined;
        const innerPromise = new Cypress.Promise((resolve, reject) => {innerResolution = resolve;});

        let resolution = undefined;
        cy.get(`#${panelId}`).then(panelElement => {
            const listener1 = e => {
                console.error(`received ${EVENT_NAME}`);
                panelElement[0].removeEventListener(EVENT_NAME, listener1);
                resolution(e.detail);
            };
            console.error(`waiting for ${EVENT_NAME}`)
            panelElement[0].addEventListener(EVENT_NAME, listener1);
        })
        .then(() => {
            const promise = new Cypress.Promise((resolve, reject) => {resolution = resolve;});
            if (isAdd == true) {
                panelView._addInstance();
            } else {
                panelView._removeInstance();
            }
            promise.then(() => {
                const e = checkHTML(panelId, panelModel.getState(), panelView, count);
                innerResolution(e);
            });
        });

        return innerPromise;
    };

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
        expect(panelView.children.length, "panel has one child").to.equal(1);
        expect(panelView.children[0].id, "panel has reference to child view").to.equal(datepickerId);
        expect(datepickerView.parentView.id, "date picker has reference to parent panel view").to.equal(panelId);
    })

    it(" model's changes are reflected in the html ", () => {
        const panelId = formContainer._model.items[0].id;
        const model = formContainer._model.getElement(panelId);
        const panelView = formContainer._fields[panelId];
        const count = 1;
        checkHTML(model.id, model.getState(), panelView, count).then(() => {
            model.visible = false;
            return checkHTML(model.id, model.getState(), panelView, count);
        }).then(() => {
            model.enable = false;
            return checkHTML(model.id, model.getState(), panelView, count);
        });
    });

    it(" add instance and remove instance of model is reflected in html ", () => {
        const panelId = formContainer._model.items[0].id;
        const panelModel = formContainer._model.getElement(panelId);
        const panelView = formContainer._fields[panelId];

        panelModel.visible = true;
        panelModel.enable = true;


        checkHTML(panelId, panelModel.getState(), panelView, 1)
        .then(() => {
            checkAddRemoveInstance(panelId, panelModel, panelView, 2, true)
            .then(() => {
                checkAddRemoveInstance(panelId, panelModel, panelView, 3, true)
                .then(() => {
                    checkAddRemoveInstance(panelId, panelModel, panelView, 4, true)
                    .then(() => {
                        //max is 4
                        panelView._addInstance();
                        checkHTML(panelId, panelModel.getState(), panelView, 4);
                        checkAddRemoveInstance(panelId, panelModel, panelView, 3)
                        .then(() => {
                            checkAddRemoveInstance(panelId, panelModel, panelView, 2)
                            .then(() => {
                                checkAddRemoveInstance(panelId, panelModel, panelView, 1)
                                .then(() => {
                                    checkAddRemoveInstance(panelId, panelModel, panelView, 0)
                                    .then(() => {
                                        //can't go below zero
                                        //todo uncomment code below, once model remove on zero is fixed
                                        //panelView._removeInstance();
                                        //checkHTML(panelId, panelModel.getState(), panelView, 0);
                                        //ability to add instance from zero
                                        checkAddRemoveInstance(panelId, panelModel, panelView, 1, true);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test', 'panel short', 'panel long');
    })

    it("disabled panel's children are also disabled ", () => {
        const disabledPanelElemId = formContainer._model.items[1].id;
        cy.get(`#${disabledPanelElemId}`).should('have.attr',"data-cmp-enabled","false");
        cy.get(`#${disabledPanelElemId}`).should('have.length',1);
        cy.get(`#${disabledPanelElemId}`).should('have.class','cmp-container');
        cy.get(`#${disabledPanelElemId}`).find("[data-cmp-is='adaptiveFormNumberInput'][data-cmp-enabled='false']").should("exist");


    });

    it("readOnly panel's children are also readOnly ", () => {
        const readOnlyPanelElemId = formContainer._model.items[2].id;
        cy.get(`#${readOnlyPanelElemId}`).should('have.length',1);
        cy.get(`#${readOnlyPanelElemId}`).should('have.attr','data-cmp-is','adaptiveFormPanel');
        cy.get(`#${readOnlyPanelElemId}`).should('have.class','cmp-container');
        cy.get(`#${readOnlyPanelElemId}`).find(".cmp-adaptiveform-numberinput__widget").should('have.attr',"readonly");
    });

    it("enable panel's child when panel and child is disabled  ", () => {
        const textInputOfFormElemId=formContainer._model.items[3].id;
        const numberInputOfPanelId=formContainer._model.items[4].items[0].id;
        cy.get(`#${numberInputOfPanelId}`).should('have.attr','data-cmp-enabled',"false");
        cy.get(`#${textInputOfFormElemId} input`).type('a').blur().then(()=>{
            cy.get(`#${numberInputOfPanelId}`).should('have.attr','data-cmp-enabled',"true");
        });
    });

    it("enable panel and check that child behaved properly",()=>{
        const numberInputOfPanelId=formContainer._model.items[4].items[0].id;
        const textInputOfPanelId=formContainer._model.items[4].items[1].id;
        const textInputOfFormElemId=formContainer._model.items[3].id;
        cy.get(`#${numberInputOfPanelId}`).should('have.attr', 'data-cmp-enabled', 'false');
        cy.get(`#${textInputOfPanelId}`).should('have.attr', 'data-cmp-enabled', 'false');
        cy.get(`#${textInputOfFormElemId}`).find(".cmp-adaptiveform-textinput__widget")
            .type("b").blur().then(() => {
            cy.get(`#${numberInputOfPanelId}`).should('have.attr', 'data-cmp-enabled', 'false');
            cy.get(`#${textInputOfPanelId}`).should('have.attr', 'data-cmp-enabled', 'true');
        });
    });

    it("make readonly panel not readonly and check that child behaved properly",()=>{
        const numberInputOfPanelId=formContainer._model.items[5].items[0].id;
        const textInputOfPanelId=formContainer._model.items[5].items[1].id;
        const textInputOfFormElemId=formContainer._model.items[3].id;
        cy.get(`#${numberInputOfPanelId}`).find('.cmp-adaptiveform-numberinput__widget').should('have.attr', 'readonly');
        cy.get(`#${textInputOfPanelId}`).find('.cmp-adaptiveform-textinput__widget').should('have.attr', 'readonly');
        cy.get(`#${textInputOfFormElemId}`).find(".cmp-adaptiveform-textinput__widget")
            .type("c").blur().then(() => {
            cy.get(`#${numberInputOfPanelId}`).find('.cmp-adaptiveform-numberinput__widget').should('not.have.attr', 'readonly');
            cy.get(`#${textInputOfPanelId}`).find('.cmp-adaptiveform-textinput__widget').should('have.attr', 'readonly');
        })

    });
})