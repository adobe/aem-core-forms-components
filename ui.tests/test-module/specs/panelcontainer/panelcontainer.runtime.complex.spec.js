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
    let formContainer = null;
    const selectMap = {
        "OK": "yes",
        "I don't think so": "no"
    };
    const data = [
        {
            "textInput": "Green",
            "numInput": 70,
            "panel1": ["OK", "I don't think so", "OK"],
            "panel2": [
                {
                    "date" : "2023-02-24",
                    "email" : "test@test.com"
                },
                {
                    "date" : "2023-02-25",
                    "email" : "blue@blue.com"
                },
                {
                    "date" : "2023-02-14",
                    "email" : "qw@qw.com"
                }
            ]
        },
        {
            "textInput": "Orange",
            "numInput": 98,
            "panel1": ["I don't think so", "OK", "I don't think so"],
            "panel2": [
                {
                    "date" : "2023-02-28",
                    "email" : "ty@ty.com"
                },
                {
                    "date" : "2023-03-04",
                    "email" : "p@p.com"
                }
            ]
        },
        {
            "textInput": "Horse",
            "numInput": 54,
            "panel1": ["OK", "I don't think so"],
            "panel2": [
                {
                    "date" : "2023-03-11",
                    "email" : "try@y.com"
                },
                {
                    "date" : "2023-02-28",
                    "email" : "n@n.com"
                }
            ]
        }
    ];

    const fillInput = (fieldModel, fillValue) => {
        cy.get(`#${fieldModel.id}`).find("input").type(fillValue).blur().then(x => {
            expect(fieldModel.getState().value.toString()).to.equal(fillValue.toString());
        });
    };

    const fillSelect = (fieldModel, fillValue) => {
        cy.get(`#${fieldModel.id} select`).select(fillValue).then(x => {
            let val = selectMap[fillValue] ? selectMap[fillValue] : fillValue;
            expect(fieldModel.getState().value).to.equal(val);
        });
    };

    const fillFields = (outerInstanceManager, index) => {
        let instanceData = data[index];
        const instanceModel = outerInstanceManager.children[index].getModel();
        fillInput(instanceModel.items[0], instanceData['textInput']);
        fillInput(instanceModel.items[1], instanceData['numInput']);

        const panel1IM = instanceModel.items[2];
        fillSelect(panel1IM.items[0].items[0], instanceData['panel1'][0]);
        fillSelect(panel1IM.items[1].items[0], instanceData['panel1'][1]);
        if (instanceData['panel1'].length > 2) {
            const allFields = formContainer.getAllFields();
            const panel1IMView = allFields[panel1IM.id];
            checkAddRemoveInstance(panel1IMView, 3, true).then(() => {
                fillSelect(panel1IM.items[2].items[0], instanceData['panel1'][2]);
            });
        }

        const panel2IM = instanceModel.items[3];
        let panelData = instanceData['panel2'][0];
        fillInput(panel2IM.items[0].items[0], panelData["date"]);
        fillInput(panel2IM.items[0].items[1], panelData["email"]);

        panelData = instanceData['panel2'][1];
        fillInput(panel2IM.items[1].items[0], panelData["date"]);
        fillInput(panel2IM.items[1].items[1], panelData["email"]);

        if (instanceData['panel2'].length > 2) {
            const allFields = formContainer.getAllFields();
            const panel2IMView = allFields[panel2IM.id];
            checkAddRemoveInstance(panel2IMView, 3, true).then(() => {
                const panelData = instanceData['panel2'][2];
                fillInput(panel2IM.items[2].items[0], panelData["date"]);
                fillInput(panel2IM.items[2].items[1], panelData["email"]);
            });
        }

        return cy.get(`#${panel2IM.items[1].items[1].id}`);
    };

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
                return cy.get(`#${innerInstancesModel[(innerInstancesModel.length - 1)].items[1].id}`).should('exist');
            }).then(() => {
                const allFields = formContainer.getAllFields();
                const innerInstanceManager = allFields[innerInstanceManagerModel.id];
                checkInstanceHTML(innerInstanceManager, 2)
                .then(() => {
                    checkAddRemoveInstance(innerInstanceManager, 3, true)
                    .then(() => {
                        checkAddRemoveInstance(innerInstanceManager, 2)
                        .then(() => {
                            //min is 2, can't go below this
                            checkAddRemoveInstance(innerInstanceManager, 2);
                        });
                    });
                });
            });
        });

    };

    const checkInnerInstance = (instancesModel, index) => {
        const allFields = formContainer.getAllFields();
        const instanceModel = instancesModel[index];
        const innerModelId = instanceModel.id;
        const innerView=allFields[innerModelId];
        const numberInputId = instanceModel.items[0].id;
        const numberInputView = allFields[numberInputId];
        const checkBoxGroupId = instanceModel.items[1].id;
        const checkBoxGroupView = allFields[checkBoxGroupId];
        const innerLabelClass = innerView.getLabel().className;
        const innerTooltipClass = innerView.getTooltipDiv().className;
        const innerDescriptionClass = innerView.getDescription().className;
        const numberInputLabelClass = numberInputView.getLabel().className;
        const numberInputErrorClass = numberInputView.getErrorDiv().className;
        const checkBoxGroupLabelClass = checkBoxGroupView.getLabel().className;
        const checkBoxGroupViewErrorClass = checkBoxGroupView.getErrorDiv().className;

        cy.get(`#${innerModelId}`).should('exist');
        cy.get(`#${innerModelId}`).find(`.${innerLabelClass}`).should('exist');
        cy.get(`#${innerModelId}`).find('label[for="'+innerModelId+'"]').should('exist');
        cy.get(`#${innerModelId}`).find(`.${innerTooltipClass}`).should('exist');
        cy.get(`#${innerModelId}`).find(`.${innerDescriptionClass}`).should('exist');
        cy.get(`#${numberInputId}`).find(`.${numberInputLabelClass}`).should('exist');
        cy.get(`#${numberInputId}`).find('label[for="'+numberInputId+'-widget"]').should('exist');
        cy.get(`#${numberInputId}`).find(`.${numberInputErrorClass}`).should('exist');
        cy.get(`#${checkBoxGroupId}`).find(`.${checkBoxGroupLabelClass}`).should('exist');
        cy.get(`#${checkBoxGroupId}`).find('label[for="'+checkBoxGroupId+'-widget"]').should('exist');
        return cy.get(`#${checkBoxGroupId}`).find(`.${checkBoxGroupViewErrorClass}`).should('exist');
    };

    const checkInstance = (instancesModel, index) => {
        const allFields = formContainer.getAllFields();
        const modelId = instancesModel[index].id;
        const parentView=allFields[modelId];
        const textInputId = instancesModel[index].items[0].id;
        const textInputView = allFields[textInputId];
        const numberInputId = instancesModel[index].items[1].id;
        const numberInputView = allFields[numberInputId];
        cy.get(`#${modelId}`).should('exist');
        const parentLabelClass = parentView.getLabel().className;
        const parentTooltipClass = parentView.getTooltipDiv().className;
        const parentDescriptionClass = parentView.getDescription().className;
        const textInputLabelClass = textInputView.getLabel().className;
        const textInputErrorClass = textInputView.getErrorDiv().className;
        const numberInputLabelClass = numberInputView.getLabel().className;
        const numberInputErrorClass = numberInputView.getErrorDiv().className;
        cy.get(`#${modelId}`).find(`.${parentLabelClass}`).should('exist');
        cy.get(`#${modelId}`).find('label[for="'+modelId+'"]').should('exist');
        cy.get(`#${modelId}`).find(`.${parentTooltipClass}`).should('exist');
        cy.get(`#${modelId}`).find(`.${parentDescriptionClass}`).should('exist');
        cy.get(`#${textInputId}`).find(`.${textInputLabelClass}`).should('exist');
        cy.get(`#${textInputId}`).find('label[for="'+textInputId+'-widget"]').should('exist');
        cy.get(`#${textInputId}`).find(`.${textInputErrorClass}`).should('exist');
        cy.get(`#${numberInputId}`).find(`.${numberInputLabelClass}`).should('exist');
        cy.get(`#${numberInputId}`).find('label[for="'+numberInputId+'-widget"]').should('exist');
        return cy.get(`#${numberInputId}`).find(`.${numberInputErrorClass}`).should('exist');
    };

    const checkAddRemoveInstance = (instanceManager, count, isAdd) => {
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
                const e = checkInstanceHTML(instanceManager, count);
                innerResolution(e);
            });
        });

        return innerPromise;
    };

    const checkAddRemoveButton = (instanceManager, count, buttonId) => {
        let resolution = undefined;
        const promise = new Cypress.Promise((resolve, reject) => {resolution = resolve;});
        cy.get(`#${buttonId} button`).click().then(() => {
            const e = checkInstanceHTML(instanceManager, count);
            resolution(e);
        });
        return promise;
    };

    const checkSiteInnerRepeatableInstance = (innerInstanceManagerModel, label) => {
        const allFields = formContainer.getAllFields();
        const innerInstanceManagerChildrenModel = innerInstanceManagerModel.items;
        cy.get(`#${innerInstanceManagerChildrenModel[0].id}`).should('exist');
        cy.get(`#${innerInstanceManagerChildrenModel[1].id}`).should('exist').then(() => {
            const innerInstanceManager = allFields[innerInstanceManagerModel.id];
            expect(innerInstanceManager.children.length, label + " Number of children inside inner repeatable panel view should be equal to its child models  ").to.equal(innerInstanceManagerChildrenModel.length);
            for (let i = 0; i < innerInstanceManagerChildrenModel.length; i++) {
                expect(innerInstanceManager.children[i].getId(), label + " Inner Repeatable Panel children view Id to be equal for same index panel model Id ").to.equal(innerInstanceManagerChildrenModel[i].id);
            }
        });
    };

    const checkSiteOuterRepeatableInstance = (outerInstancManagerModel, index, label) => {
        const outerInstanceModel = outerInstancManagerModel.items[index];
        //4 children, out of which 2 are instance manager
        const outerInstanceChildrenModel = outerInstanceModel.items;
        cy.get(`#${outerInstanceChildrenModel[0].id}`).should('exist');
        cy.get(`#${outerInstanceChildrenModel[1].id}`).should('exist');
        cy.get(`#${outerInstanceChildrenModel[2].items[0].id}`).should('exist');
        cy.get(`#${outerInstanceChildrenModel[2].items[1].id}`).should('exist');
        cy.get(`#${outerInstanceChildrenModel[3].items[0].id}`).should('exist')
        cy.get(`#${outerInstanceChildrenModel[3].items[1].id}`).should('exist').then(() => {
            const allFields = formContainer.getAllFields();
            const outerInstanceManager = allFields[outerInstancManagerModel.id];
            const outerInstanceView = outerInstanceManager.children[index];
            const outerInstanceChildrenView = outerInstanceView.children;
            expect(outerInstanceView.getId(), label + " Outer Repeatable Panel instance view Id to be equal for panel model Id ").to.equal(outerInstanceModel.id);
            let viewLength = computeViewLength(outerInstanceView.children);
            let modelLength = computeModelLength(outerInstanceModel.items);
            expect(viewLength, label + " Number of children inside outer repeatable panel view should be equal to its child models  ").to.equal(modelLength);
            for (let i = 0; i < modelLength; i++) {
                expect(outerInstanceChildrenView[i].getId(), label + " Outer Repeatable Panel children view Id to be equal for same index panel model Id ").to.equal(outerInstanceChildrenModel[i].id);
            }
            const innerInstanceManagerModel1 = outerInstanceChildrenModel[2];
            checkSiteInnerRepeatableInstance(innerInstanceManagerModel1, "First: ");
            const innerInstanceManagerModel2 = outerInstanceChildrenModel[3];
            checkSiteInnerRepeatableInstance(innerInstanceManagerModel2, "Second: ");
        });
        return cy.get(`#${outerInstanceChildrenModel[3].items[1].id}`);
    };

    it(" Repeatable inside repeatable - min occur of model should be reflected in html, and view child should be established ", () => {
        const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/complex.html";
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
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
                            checkInnerRepeatability(outerInstancesModel, i);
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
    });

    it(" Site container inside and outside Repeatable inside repeatable - min occur of model should be reflected in html, and view child should be established ", () => {
        const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/site-container-repeatability.html";
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
            const outerInstanceManagerModel = formContainer._model.items[0];
            checkSiteOuterRepeatableInstance(outerInstanceManagerModel, 0, "First Outer : ").then(() => {
                const allFields = formContainer.getAllFields();
                const outerInstanceManager = allFields[outerInstanceManagerModel.id];
                checkAddRemoveInstance(outerInstanceManager, 2, true).then(() => {
                    checkSiteOuterRepeatableInstance(outerInstanceManagerModel, 1, "Second Outer : ");
                });
            });
        });
    });

    it("Check submission data: Without schema, Repeatable inside repeatable panel, with site container", () =>{
        const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/site-container-repeatability.html";
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
            const outerInstanceManagerModel = formContainer._model.items[0];
            checkSiteOuterRepeatableInstance(outerInstanceManagerModel, 0, "First Outer : ").then(() => {
                const allFields = formContainer.getAllFields();
                const outerInstanceManager = allFields[outerInstanceManagerModel.id];
                checkAddRemoveInstance(outerInstanceManager, 2, true).then(() => {
                    checkAddRemoveInstance(outerInstanceManager, 3, true).then(() => {
                        checkSiteOuterRepeatableInstance(outerInstanceManagerModel, 0, "First Outer : ");
                        checkSiteOuterRepeatableInstance(outerInstanceManagerModel, 1, "Second Outer : ");
                        checkSiteOuterRepeatableInstance(outerInstanceManagerModel, 2, "Third Outer : ").then(() => {
                            fillFields(outerInstanceManager, 0).then(() => {
                                fillFields(outerInstanceManager, 1).then(() => {
                                    fillFields(outerInstanceManager, 2).then(() => {
                                        cy.getFormData().then((result) => {
                                            cy.fixture('panelcontainer/siteContainerSubmissionAdd.json').then((outputData) => {
                                                expect(result.data.data).to.equal(JSON.stringify(outputData));
                                            });
                                            //check data after removing instance
                                            checkAddRemoveInstance(outerInstanceManager, 2).then(() => {
                                                cy.getFormData().then((result) => {
                                                    cy.fixture('panelcontainer/siteContainerSubmissionRemove.json').then((outputData) => {
                                                        expect(result.data.data).to.equal(JSON.stringify(outputData));
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("Check submission data: With Bank schema, Repeatable inside repeatable panel", () =>{
        const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/bank-form.html";
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
            const formContainerModelItems = formContainer._model.items;
            const offerModelItems = formContainerModelItems[0].items;
            fillSelect(offerModelItems[0], "1 Check");
            fillInput(offerModelItems[1], 78);
            const personalLoanModelItems = formContainerModelItems[3].items;
            const witnessIMModel = personalLoanModelItems[7];
            const allFields = formContainer.getAllFields();
            const witnessIM = allFields[witnessIMModel.id];
            checkAddRemoveInstance(witnessIM, 2, true).then(() => {
                checkAddRemoveInstance(witnessIM, 3, true).then(() => {
                    //Fill Instances
                    const firstInstanceModelItems = witnessIMModel.items[0].items;
                    fillInput(firstInstanceModelItems[0], "w1");
                    fillInput(firstInstanceModelItems[1], "w11");
                    fillSelect(firstInstanceModelItems[3], "Female");

                    const secondInstanceModelItems = witnessIMModel.items[1].items;
                    fillInput(secondInstanceModelItems[0], "w2");
                    fillInput(secondInstanceModelItems[1], "w22");
                    fillSelect(secondInstanceModelItems[3], "Male");

                    const thirdInstanceModelItems = witnessIMModel.items[2].items;
                    fillInput(thirdInstanceModelItems[0], "w3");
                    fillInput(thirdInstanceModelItems[1], "w33");
                    fillSelect(thirdInstanceModelItems[3], "Female");

                    const firstEducationIMModel = firstInstanceModelItems[2];
                    const firstEducationIM = allFields[firstEducationIMModel.id];
                    checkAddRemoveInstance(firstEducationIM, 2, true).then(() => {
                        //Fill education instances
                        const firstEducationIMModelItems = firstEducationIMModel.items;
                        const edu11 = firstEducationIMModelItems[0].items;
                        fillInput(edu11[0], "ssn");
                        fillInput(edu11[1], "B");
                        fillInput(edu11[2], "phd");
                        fillInput(edu11[7], "science");
                        fillInput(edu11[9], "dce");

                        const edu12 = firstEducationIMModelItems[1].items;
                        fillInput(edu12[0], "ss2");
                        fillInput(edu12[1], "A");
                        fillInput(edu12[2], "b.tech");
                        fillInput(edu12[7], "computer");

                        const secondEducationIMModelItems = secondInstanceModelItems[2].items;
                        const secondEdu = secondEducationIMModelItems[0].items;
                        fillInput(secondEdu[0], "ss3");
                        fillInput(secondEdu[1], "C");
                        fillInput(secondEdu[2], "PGCCL");
                        fillInput(secondEdu[7], "Law");

                        const thirdEducationIMModelItems = thirdInstanceModelItems[2].items;
                        const thirdEdu = thirdEducationIMModelItems[0].items;
                        fillInput(thirdEdu[9], "DU");

                        return cy.get(`#${edu12[9].id}`);
                    }).then(() => {
                        cy.getFormData().then((result) => {
                            cy.fixture('panelcontainer/bankSubmissionAll.json').then((outputData) => {
                                expect(result.data.data).to.equal(JSON.stringify(outputData));
                            });
                            //check data after removing instance
                            checkAddRemoveInstance(witnessIM, 2).then(() => {
                                cy.getFormData().then((result) => {
                                    cy.fixture('panelcontainer/bankSubmissionOuterInstanceRemoved.json').then((outputData) => {
                                        expect(result.data.data).to.equal(JSON.stringify(outputData));
                                    });
                                    const secondEducationIMModel = secondInstanceModelItems[2];
                                    const secondEducationIM = allFields[secondEducationIMModel.id];
                                    checkAddRemoveInstance(secondEducationIM, 0).then(() => {
                                        cy.getFormData().then((result) => {
                                            cy.fixture('panelcontainer/bankSubmissionInnerInstanceRemoved.json').then((outputData) => {
                                                expect(result.data.data).to.equal(JSON.stringify(outputData));
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("Reset, Add and Remove Button: With Bank schema, Repeatable inside repeatable panel", () =>{
        const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/reset-repeatability.html";
        cy.previewFormWithPanel(pagePath).then(p => {
            //check initial data
            cy.getFormData().then((result) => {
                cy.fixture('panelcontainer/initialResetBank.json').then((outputData) => {
                    expect(result.data.data).to.equal(JSON.stringify(outputData));
                });
            });
            formContainer = p;
            const formContainerModelItems = formContainer._model.items;
            fillSelect(formContainerModelItems[0], "1 Check");
            fillInput(formContainerModelItems[1], 101);
            const personalLoanModelItems = formContainerModelItems[2].items;
            const witnessIMModel = personalLoanModelItems[1];
            const allFields = formContainer.getAllFields();
            const witnessIM = allFields[witnessIMModel.id];
            const addWitnessButtonId = personalLoanModelItems[2].id;
            const removeWitnessButtonId = personalLoanModelItems[3].id;
            const resetButtonId = formContainerModelItems[3].id;
            checkAddRemoveButton(witnessIM, 3, addWitnessButtonId).then(() => {
                checkAddRemoveButton(witnessIM, 2, removeWitnessButtonId).then(() => {
                    checkAddRemoveButton(witnessIM, 3, addWitnessButtonId).then(() => {
                        //Fill Instances
                        const firstInstanceModelItems = witnessIMModel.items[0].items;
                        fillInput(firstInstanceModelItems[0], "w1");
                        fillInput(firstInstanceModelItems[1], "w11");
                        fillSelect(firstInstanceModelItems[3], "Female");

                        const secondInstanceModelItems = witnessIMModel.items[1].items;
                        fillInput(secondInstanceModelItems[0], "w2");
                        fillInput(secondInstanceModelItems[1], "w22");
                        fillSelect(secondInstanceModelItems[3], "Male");

                        const thirdInstanceModelItems = witnessIMModel.items[2].items;
                        fillInput(thirdInstanceModelItems[0], "w3");
                        fillInput(thirdInstanceModelItems[1], "w33");
                        fillSelect(thirdInstanceModelItems[3], "Female");

                        const firstEducationIMModel = firstInstanceModelItems[2];
                        const firstEducationIM = allFields[firstEducationIMModel.id];
                        checkAddRemoveInstance(firstEducationIM, 3, true).then(() => {
                            //Fill education instances
                            const firstEducationIMModelItems = firstEducationIMModel.items;
                            const edu11 = firstEducationIMModelItems[0].items;
                            fillInput(edu11[0], "ssn");
                            fillInput(edu11[1], "B");
                            fillInput(edu11[2], "phd");
                            fillInput(edu11[7], "science");
                            fillInput(edu11[9], "dce");

                            const edu12 = firstEducationIMModelItems[1].items;
                            fillInput(edu12[0], "ss2");
                            fillInput(edu12[1], "A");
                            fillInput(edu12[2], "b.tech");
                            fillInput(edu12[7], "computer");

                            const edu13 = firstEducationIMModelItems[2].items;
                            fillInput(edu13[9], "DU");

                            const secondEducationIMModelItems = secondInstanceModelItems[2].items;
                            const secondEdu = secondEducationIMModelItems[0].items;
                            fillInput(secondEdu[0], "ss3");
                            fillInput(secondEdu[1], "C");
                            fillInput(secondEdu[2], "PGCCL");
                            fillInput(secondEdu[7], "Law");

                            const secondEdu1 = secondEducationIMModelItems[1].items;
                            fillInput(secondEdu1[0], "ss5");
                            fillInput(secondEdu1[1], "A+");
                            fillInput(secondEdu1[2], "ME");
                            fillInput(secondEdu1[7], "CA");

                            const thirdEducationIMModelItems = thirdInstanceModelItems[2].items;
                            const thirdEdu = thirdEducationIMModelItems[0].items;
                            fillInput(thirdEdu[9], "DU");

                            return cy.get(`#${edu12[9].id}`);
                        }).then(() => {
                            cy.getFormData().then((result) => {
                                cy.fixture('panelcontainer/beforeResetBank.json').then((outputData) => {
                                    expect(result.data.data).to.equal(JSON.stringify(outputData));
                                });
                                //check reset button
                                cy.get(`#${resetButtonId} button`).click().then(() => {

                                    //check instances with min occur
                                    checkInstanceHTML(witnessIM, 2);
                                    const allFields = formContainer.getAllFields();
                                    const firstEducationIM = allFields[witnessIMModel.items[0].items[2].id];
                                    checkInstanceHTML(firstEducationIM, 2);
                                    const secondEducationIM = allFields[witnessIMModel.items[1].items[2].id];
                                    checkInstanceHTML(secondEducationIM, 2);

                                    //check data
                                    cy.getFormData().then((result) => {
                                        cy.fixture('panelcontainer/initialResetBank.json').then((outputData) => {
                                            expect(result.data.data).to.equal(JSON.stringify(outputData));
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("Repeatable with prefill data removing repeatable instance.", () => {
        const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/prefillrepeatability.html";
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
            const outerPanel = formContainer._model.items[0];
            cy.get(`#${outerPanel.id}`).then((outerPanelElement) => {
                expect(outerPanelElement[0], "Outer panel should be defined").not.be.null;
            });

            cy.get(`#${outerPanel.items[0].id}`).then((textBoxElement) => {
                expect(textBoxElement[0], "Text box inside Outer Panel will be defined").not.be.null;
            });

            const instanceManager = outerPanel.items[1];
            //Instance Manager doesn't have presence in HTML
            cy.get(`#${instanceManager.id}`).should('not.exist');

            expect(instanceManager.items.length, " Repeatable panel has zero instances ").to.equal(0);

            //Repeatable panel should not be present as it has zero instances
            cy.get(`#${outerPanel.id} .panelcontainer`).should('not.exist');

            const allFields = formContainer.getAllFields();
            const instanceManagerView = allFields[instanceManager.id];
            //Now check, that you can add and remove instances post this
            checkAddRemoveInstance(instanceManagerView, 1, true).then(() => {
                cy.get(`#${outerPanel.id} .panelcontainer`).should('exist');
                checkAddRemoveInstance(instanceManagerView, 0).then(() => {
                    checkAddRemoveInstance(instanceManagerView, 1, true);
                });
            });
        });
    });
})
