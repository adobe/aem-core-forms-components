/*******************************************************************************
 * Copyright 2023 Adobe
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
describe("Form Runtime with Fragment", () => {

    const pagePath = "content/forms/af/core-components-it/samples/fragment/basic.html"
    const bemBlock = 'cmp-adaptiveform-fragment'
    const IS = "adaptiveFormFragment"
    const selectors = {
        textinput : `[data-cmp-is="${IS}"]`
    }
    const fragmentChildCount = 2;
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
        const value = state.value == null ? '' : state.value;
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
            // now panel's also have value because of exportData support in container
            if (value && (typeof value !== 'object' || Array.isArray(value))) {
                cy.get('input').should('have.value', value)
            }
        })
    }

    const checkInstanceHTML = (instanceManager, count) => {
        expect(instanceManager.children.length, " instance manager view has children equal to count ").to.equal(count);
        expect(instanceManager.getModel().items.length, " instance manager model has items equal to count ").to.equal(count);
        const checkChild = (childView) => {
            checkHTML(childView.getId(), childView.getModel(), childView);
        }
        instanceManager.children.forEach(checkChild);
        return cy.get('[data-cmp-is="adaptiveFormContainer"]');
    };

    const checkAddRemoveInstance = (instanceManager, count, isAdd, childCount) => {
        const EVENT_NAME = isAdd ? "AF_PanelInstanceAdded" : "AF_PanelInstanceRemoved";
        let innerResolution = undefined;
        const innerPromise = new Cypress.Promise((resolve, reject) => {innerResolution = resolve;});

        let resolution = undefined;
        cy.get('[data-cmp-is="adaptiveFormContainer"]').then(formElement => {
            const listener1 = e => {
                formElement[0].removeEventListener(EVENT_NAME, listener1);
                resolution(e.detail);
            };
            formElement[0].addEventListener(EVENT_NAME, listener1);
        })
            .then(() => {
                const promise = new Cypress.Promise((resolve, reject) => {resolution = resolve;});
                if (isAdd == true) {
                    instanceManager.addInstance();
                } else {
                    instanceManager.removeInstance();
                }
                promise.then(() => {
                    const e = checkInstanceHTML(instanceManager, count, childCount);
                    innerResolution(e);
                });
            });

        return innerPromise;
    };

    it.skip(" should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;

        const fields = formContainer.getAllFields();
        const fragmentId = formContainer._model.items[0].items[0].id;
        const textInputId = formContainer._model.items[0].items[0].items[0].id;
        const fragmentView = fields[fragmentId];
        const textInputView = fields[textInputId];

        expect(fragmentView, "fragment view is created").to.not.be.null;
        expect(textInputView, "fragment child view is created").to.not.be.null;
        expect(fragmentView.children.length, `fragment has ${fragmentChildCount} child`).to.equal(fragmentChildCount);
        expect(fragmentView.children[0].id, "fragment has reference to child view").to.equal(textInputId);
        expect(textInputView.parentView.id, "text input has reference to parent panel view").to.equal(fragmentId);

        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });
    })

    it.skip(" model's changes are reflected in the html ", () => {
        const fragmentId = formContainer._model.items[0].items[0].id;
        const model = formContainer._model.getElement(fragmentId);
        checkHTML(model.id, model.getState()).then(() => {
            model.visible = false;
            return checkHTML(model.id, model.getState());
        }).then(() => {
            model.enable = false;
            return checkHTML(model.id, model.getState());
        });
    });

    it.skip("responsive component in fragment", () => {
        const responsiveTextInputId = formContainer._model.items[0].items[0].items[1].id;
        cy.get(`#${responsiveTextInputId}`).should('be.visible');
        cy.get(`#${responsiveTextInputId}`).parent()
            .should('have.class', 'aem-GridColumn')
            .should('have.class', 'aem-GridColumn--default--9')
            .should('have.class', 'aem-GridColumn--offset--default--1');
    })

    it(" add instance and remove instance of model is reflected in html ", () => {

        const fragmentId = formContainer._model.items[0].items[0].id;
        const fragmentModel = formContainer._model.getElement(fragmentId);
        const fragmentView = formContainer.getAllFields()[fragmentId];
        const instanceManager = fragmentView.getInstanceManager();

        fragmentModel.visible = true;
        fragmentModel.enable = true;


        checkInstanceHTML(instanceManager, 1)
            .then(() => {
                checkAddRemoveInstance(instanceManager, 2, true)
                    .then(() => {
                        checkAddRemoveInstance(instanceManager, 3, true)
                            .then(() => {
                                checkAddRemoveInstance(instanceManager, 4, true)
                                    .then(() => {
                                        //max is 4
                                        instanceManager.addInstance();
                                        checkInstanceHTML(instanceManager, 4);
                                        checkAddRemoveInstance(instanceManager, 3)
                                            .then(() => {
                                                checkAddRemoveInstance(instanceManager, 2)
                                                    .then(() => {
                                                        checkAddRemoveInstance(instanceManager, 1)
                                                            .then(() => {
                                                                checkAddRemoveInstance(instanceManager, 0)
                                                                    .then(() => {
                                                                        //can't go below zero
                                                                        instanceManager.removeInstance();
                                                                        checkInstanceHTML(instanceManager, 0);
                                                                        //ability to add instance from zero
                                                                        checkAddRemoveInstance(instanceManager, 1, true);
                                                                    });
                                                            });
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });


    it("rules inside fragment should work when included in form", () => {
        const [idTextBox, fieldView] = Object.entries(formContainer._fields)[0];
        const [idTextBox1, fieldView1] = Object.entries(formContainer._fields)[1];
        const [idPanel, panelView] = Object.entries(formContainer._fields)[4];
        const input = "abc";
        const model = formContainer._model.getElement(idPanel);
        cy.get(`#${idTextBox}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${idTextBox1} input`).invoke('val').then(val => {
                expect(val, "rules inside fragment (when included in form) did not work").to.equal(input);
            })
        })

        cy.get(`#${model.items[0].id}`).should('have.text', 'Thanks');
    });

    it("same fragment referred twice should have unique ids", () => {
        const [idTextBox, fieldView] = Object.entries(formContainer._fields)[2];
        const [idTextBox1, fieldView1] = Object.entries(formContainer._fields)[3];
        const [idPanel, panelView] = Object.entries(formContainer._fields)[5];
        const input = "abc";
        const model = formContainer._model.getElement(idPanel);
        cy.get(`#${idTextBox}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${idTextBox1} input`).invoke('val').then(val => {
                expect(val, "rules inside fragment (when included in form) did not work").to.equal(input);
            })
        })

        cy.get(`#${model.items[0].id}`).should('have.text', 'Thanks');
    });
})
