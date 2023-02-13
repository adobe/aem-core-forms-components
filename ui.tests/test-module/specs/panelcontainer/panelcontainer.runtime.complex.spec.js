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
describe( "Form Runtime with Panel Container complex repeatability use cases ", () => {

    const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/complex.html";
    let formContainer = null;

    beforeEach(() => {
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
        });
    });

    const computeModelLength = (modelArray) => {
        let modelLength = 0;
        for (let i = 0; i < modelArray.length; i++) {
            if (modelArray[i].type != 'array') {
                modelLength++;
            }
        }
        return modelLength;
    };

    const computeViewLength = (viewArray) => {
        let viewLength = 0;
        for (let i = 0; i < viewArray.length; i++) {
            if (viewArray[i].getInstanceManager && !(viewArray[i].getInstanceManager())) {
                viewLength++;
            }
        }
        return viewLength;
    };

    const checkHTML = (id, model, view) => {
        const visible = model.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        cy.get(`#${id}`)
            .should(passVisibleCheck)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', visible.toString());
        cy.get(`#${id}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', model.enabled.toString());
        expect(computeModelLength(model.items), " model and view children should have equal count ").to.equal(computeViewLength(view.children));
        return cy.get('[data-cmp-is="adaptiveFormContainer"]');
    };

    const checkInstanceHTML = (instanceManager, count) => {
        expect(instanceManager.children.length, " instance manager view has children equal to count ").to.equal(count);
        expect(instanceManager.getModel().items.length, " instance manager model has items equal to count ").to.equal(count);
        const checkChild = (childView) => {
            checkHTML(childView.getId(), childView.getModel(), childView);
        }
        instanceManager.children.forEach(checkChild);
        return cy.get('[data-cmp-is="adaptiveFormContainer"]');
    };
    const checkInnerRepeatability = (instancesModel, index) => {
        const innerInstanceManagerModel = instancesModel[index].items[2];
        const innerInstancesModel = innerInstanceManagerModel.items;
        checkInnerInstance(innerInstancesModel, 0).then(() => {
            checkInnerInstance(innerInstancesModel, 1).then(() => {
                const allFields = formContainer.getAllFields();
                const innerInstanceManagerView = allFields[innerInstanceManagerModel.id];
                const innerInstancesView = innerInstanceManagerView.children;
                for (let i = 0; i < innerInstancesModel.length; i++) {
                    const numberInputId = innerInstancesModel[i].items[0].id;
                    const checkBoxGroupId = innerInstancesModel[i].items[1].id;
                    expect(allFields[numberInputId].getId(), " Number input box view with corresponding model Id exists  ").to.equal(numberInputId);
                    expect(innerInstancesView[i].children[0].getId(), " Number input box view Id inside inner repeatable panel to be equal to its model  ").to.equal(numberInputId);
                    expect(allFields[checkBoxGroupId].getId(), " Check box group view with corresponding model Id exists  ").to.equal(checkBoxGroupId);
                    expect(innerInstancesView[i].children[1].getId(), " Check box group  view Id inside inner repeatable panel to be equal to its model  ").to.equal(checkBoxGroupId);
                    expect(innerInstancesView[i].children.length, " Number of children inside inner repeatable panel view should be equal to its child models  ").to.equal(innerInstancesModel[i].items.length);
                }
                expect(innerInstancesView.length, " Number of inner instances view to equal Number of instances model ").to.equal(innerInstancesModel.length);
            });
        });

    };

    const checkInnerInstance = (instancesModel, index) => {
        const innerModelId = instancesModel.id;
        const numberInputId = instancesModel[index].items[0].id;
        const checkBoxGroupId = instancesModel[index].items[1].id;
        cy.get(`#${innerModelId}`).should('exist');
        cy.get(`#${innerModelId}-label`).should('exist');
        cy.get(`#${innerModelId}-label`).invoke('attr', 'for').should('eq', innerModelId);
        cy.get(`#${innerModelId}-shortDescription`).should('exist');
        cy.get(`#${innerModelId}-longDescription`).should('exist');
        cy.get(`#${numberInputId}-label`).should('exist');
        cy.get(`#${numberInputId}-label`).invoke('attr', 'for').should('eq', numberInputId);
        cy.get(`#${numberInputId}-errorMessage`).should('exist');
        cy.get(`#${checkBoxGroupId}-label`).should('exist');
        cy.get(`#${checkBoxGroupId}-label`).invoke('attr', 'for').should('eq', checkBoxGroupId);
        return cy.get(`#${checkBoxGroupId}-errorMessage`).should('exist');
    };

    const checkInstance = (instancesModel, index) => {
        const modelId = instancesModel[index].id;
        const textInputId = instancesModel[index].items[0].id;
        const numberInputId = instancesModel[index].items[1].id;
        cy.get(`#${modelId}`).should('exist');
        cy.get(`#${modelId}-label`).should('exist');
        cy.get(`#${modelId}-label`).invoke('attr', 'for').should('eq', modelId);
        cy.get(`#${modelId}-shortDescription`).should('exist');
        cy.get(`#${modelId}-longDescription`).should('exist');
        cy.get(`#${textInputId}-label`).should('exist');
        cy.get(`#${textInputId}-label`).invoke('attr', 'for').should('eq', textInputId);
        cy.get(`#${textInputId}-errorMessage`).should('exist');
        cy.get(`#${numberInputId}-label`).should('exist');
        cy.get(`#${numberInputId}-label`).invoke('attr', 'for').should('eq', numberInputId);
        return cy.get(`#${numberInputId}-errorMessage`).should('exist');
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

    it(" Repeatable inside repeatable - min occur of model should be reflected in html, and view child should be established ", () => {
        const outerInstancManagerModel = formContainer._model.items[0];
        const outerInstancesModel = outerInstancManagerModel.items;
        checkInstance(outerInstancesModel, 0).then(() => {
            // check for all three instances in HTML as per min occur
            checkInstance(outerInstancesModel, 1).then(() => {
                checkInstance(outerInstancesModel, 2).then(() => {
                    const allFields = formContainer.getAllFields();
                    const outerInstanceManagerView = allFields[outerInstancManagerModel.id];
                    const outerInstancesView = outerInstanceManagerView.children;
                    for (let i = 0; i < outerInstancesModel.length; i++) {
                        const modelId = outerInstancesModel[i].id;
                        const textInputId = outerInstancesModel[i].items[0].id;
                        const numberInputId = outerInstancesModel[i].items[1].id;
                        expect(outerInstancesView[i].getId(), " Outer Panel view Id to be equal for same index panel model Id ").to.equal(modelId);
                        expect(allFields[textInputId].getId(), " Text input box view with corresponding model Id exists  ").to.equal(textInputId);
                        expect(outerInstancesView[i].children[0].getId(), " Text input box view Id inside outer repeatable panel to be equal to its model  ").to.equal(textInputId);
                        expect(allFields[numberInputId].getId(), " Number input box view with corresponding model Id exists  ").to.equal(numberInputId);
                        expect(outerInstancesView[i].children[1].getId(), " Number input box view Id inside outer repeatable panel to be equal to its model  ").to.equal(numberInputId);
                        let outerViewChildren = computeViewLength(outerInstancesView[i].children);  //outerInstancesView[i].children.length - 2; //-2 for 2 minOccur of inside repeatable panel
                        let outerModelChildren = computeModelLength(outerInstancesModel[i].items); //outerInstancesModel[i].items.length - 1; //-1 for instance manager model of inside repeatable panel
                        expect(outerViewChildren, " Number of children inside outer repeatable panel view should be equal to its child models  ").to.equal(outerModelChildren);
                    }
                    expect(outerInstancesView.length, " Number of instances view to equal Number of instances model ").to.equal(outerInstancesModel.length);
                    checkInstanceHTML(outerInstanceManagerView, 3)
                        .then(() => {
                            checkAddRemoveInstance(outerInstanceManagerView, 4, true)
                                .then(() => {
                                    checkAddRemoveInstance(outerInstanceManagerView, 3)
                                        .then(() => {
                                            //min is 3, can't go below this
                                            checkAddRemoveInstance(outerInstanceManagerView, 3);
                                        });
                                });
                        });
                });
            });
        });
    });

})