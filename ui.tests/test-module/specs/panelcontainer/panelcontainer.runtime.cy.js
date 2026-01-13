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
describe.only( "Form Runtime with Panel Container - Basic Tests", () => {

    const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/basic.html";
    const bemBlock = 'cmp-container';
    let formContainer = null;

    beforeEach(() => {
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
        });
    });

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
        expect(model.items.length, " model and view children should have equal count ").to.equal(view.children.length);
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

    const checkInstance = (instancesModel,formContainer,index) => {
        const allFields = formContainer.getAllFields();
        const modelId = instancesModel[index].id;
        const parentView=allFields[instancesModel[index].id];
        const textInputId = instancesModel[index].items[0].id;
        const textInputView = allFields[instancesModel[index].items[0].id];
        const numberInputId = instancesModel[index].items[1].id;
        const numberInputView = allFields[instancesModel[index].items[1].id];
        const parentLabelClass = parentView.getLabel().className;
        const parentTooltipClass = parentView.getTooltipDiv().className;
        const parentDescriptionClass = parentView.getDescription().className;
        const textInputLabelClass = textInputView.getLabel().className;
        const textInputErrorClass = textInputView.getErrorDiv().className;
        const numberInputLabelClass = numberInputView.getLabel().className;
        const numberInputErrorClass = numberInputView.getErrorDiv().className;
        cy.get(`#${modelId}`).should('exist');
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

    it(" should get model and view initialized properly and parent child relationship is set ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        const fields = formContainer.getAllFields();
        Object.entries(fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id);
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel());
        });

        const panelId = formContainer._model.items[0].items[0].id;
        const datepickerId = formContainer._model.items[0].items[0].items[0].id;
        const panelView = fields[panelId];
        const datepickerView = fields[datepickerId];
        expect(panelView, "panel view is created").to.not.be.null;
        expect(datepickerView, "panel child view is created").to.not.be.null;
        expect(panelView.children.length, "panel has one child").to.equal(1);
        expect(panelView.children[0].id, "panel has reference to child view").to.equal(datepickerId);
        expect(datepickerView.parentView.id, "date picker has reference to parent panel view").to.equal(panelId);
    })

    it(" model's changes are reflected in the html ", () => {
        const panelId = formContainer._model.items[0].items[0].id;
        const model = formContainer._model.getElement(panelId);
        const panelView = formContainer.getAllFields()[panelId];
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
        const panelId = formContainer._model.items[0].items[0].id;
        const panelModel = formContainer._model.getElement(panelId);
        const panelView = formContainer.getAllFields()[panelId];
        const instanceManager = panelView.getInstanceManager();

        panelModel.visible = true;
        panelModel.enable = true;


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

    it(" min occur of model should be reflected in html, and view child should be established ", () => {
        const instancManagerModel = formContainer._model.items[6];
        const instancesModel = instancManagerModel.items;
        const allFields = formContainer.getAllFields();
        const instanceManagerView = allFields[instancManagerModel.id];
        const instancesView = instanceManagerView.children;

        checkInstance(instancesModel,formContainer, 0).then(() => {
            // check for all four instances in HTML as per min occur
            checkInstance(instancesModel,formContainer, 1).then(() => {
                checkInstance(instancesModel,formContainer, 2).then(() => {
                    checkInstance(instancesModel,formContainer, 3).then(() => {
                        for (let i = 0; i < instancesModel.length; i++) {
                            const modelId = instancesModel[i].id;
                            const textInputId = instancesModel[i].items[0].id;
                            const numberInputId = instancesModel[i].items[1].id;
                            expect(instancesView[i].getId(), " Panel view Id to be equal for same index panel model Id ").to.equal(modelId);
                            expect(allFields[textInputId].getId(), " Text input box view with corresponding model Id exists  ").to.equal(textInputId);
                            expect(instancesView[i].children[0].getId(), " Text input box view Id inside repeatable panel to be equal to its model  ").to.equal(textInputId);
                            expect(allFields[numberInputId].getId(), " Number input box view with corresponding model Id exists  ").to.equal(numberInputId);
                            expect(instancesView[i].children[1].getId(), " Number input box view Id inside repeatable panel to be equal to its model  ").to.equal(numberInputId);
                            expect(instancesView[i].children.length, " Number of children inside repeatable panel view should be equal to its child models  ").to.equal(instancesModel[i].items.length);
                        }
                        expect(instancesView.length, " Number of instances view to equal Number of instances model ").to.equal(instancesModel.length);
                        checkInstanceHTML(instanceManagerView, 4)
                            .then(() => {
                                checkAddRemoveInstance(instanceManagerView, 5, true)
                                    .then(() => {
                                        checkAddRemoveInstance(instanceManagerView, 4)
                                            .then(() => {
                                                //min is 4, can't go below this
                                                checkAddRemoveInstance(instanceManagerView, 4);
                                            });
                                    });
                            });
                    });
                });
            });
        });
    });

    it("should toggle description and tooltip", () => {
        const panelId = formContainer._model.items[0].items[0].id;
        cy.toggleDescriptionTooltip(bemBlock, panelId, 'panel short', 'panel long');
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
                // this test was incorrectly written earlier
            cy.get(`#${numberInputOfPanelId}`).should('have.attr', 'data-cmp-enabled', 'true');
            cy.get(`#${textInputOfPanelId}`).should('have.attr', 'data-cmp-enabled', 'false');
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
        });
    });

    it("panel with useFieldset enabled should render as fieldset with legend", () => {
        // panelcontainerFieldset is at index 7 (after panelcontainer1 which is at index 6)
        const fieldsetPanelId = formContainer._model.items[7].id;
        
        // Verify the panel renders as a <fieldset> element
        cy.get(`#${fieldsetPanelId}`).then($el => {
            expect($el.prop('tagName')).to.eq('FIELDSET');
        });
        
        // Verify the panel has a <legend> element for accessibility
        cy.get(`#${fieldsetPanelId}`).find('legend').should('exist');
        
        // Verify the legend contains the panel title
        cy.get(`#${fieldsetPanelId}`).find('legend').should('contain.text', 'Fieldset Panel');
    });

    it("panel without useFieldset should NOT render as fieldset", () => {
        // panelcontainer2 (DisabledPanel) at index 1 does not have useFieldset
        const regularPanelId = formContainer._model.items[1].id;
        
        // Verify the panel does NOT render as a <fieldset> element
        cy.get(`#${regularPanelId}`).then($el => {
            expect($el.prop('tagName')).to.not.eq('FIELDSET');
        });
        
        // Verify the panel does NOT have a <legend> element
        cy.get(`#${regularPanelId}`).find('legend').should('not.exist');
    });
})

describe( "Form Runtime with Panel Container - Repeatability Tests", () => {
    const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/repeatability-tests/basic.html";
    let formContainer = null;
    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const zip = (a, b) => a.map((k, i) => [k, b[i]]); // same as python's zip function

    // List of IDs that need to be ignored during duplicate test
    const exceptionIDsList  = ["emptyValue"] // dropdown has a hardcoded id="emptyValue" in all of its first <option> instances
    //accordion components needs to be added once repeatability is implemented in them
    const components = ["adaptiveFormTextInput", "adaptiveFormNumberInput", "adaptiveFormDropDown", "adaptiveFormDatePicker", "adaptiveFormEmailInput", "adaptiveFormTelephoneInput", "adaptiveFormText", "adaptiveFormImage", "adaptiveFormCheckBoxGroup", "adaptiveFormRadioButton", "adaptiveFormFileInput", "adaptiveFormTabs", "adaptiveFormButton","adaptiveFormWizard"];
    //const components = ["adaptiveFormButton"]
    const repeatabilityCount = 2;

    const checkNonDuplicateIDs = (root, instance) => {
        const rootAriaDescribedby = root.getAttribute('aria-describedby');
        const instanceAriaDescribedby = instance.getAttribute('aria-describedby');
        if (rootAriaDescribedby && !exceptionIDsList.includes(rootAriaDescribedby)) {
            expect(rootAriaDescribedby).to.not.equal(instanceAriaDescribedby, 'aria-describedby IDs should be different'); // redundant but good for debugging as this will show up in the UI
            return rootAriaDescribedby !== instanceAriaDescribedby;
        }
        if(root?.id !== '' && !(exceptionIDsList.includes(root.id))) {
            expect(root?.id).to.not.equal(instance?.id, `Ids generated should be different`) // redundant but good for debugging as this will show up in the UI
            return root?.id !== instance?.id;
        }
        return true;
    };

    const testNonDuplicateIDs = (root, instance) => {
        expect(root?.children.length).to.equal(instance?.children.length, `The number of children for this component must be the same as the repeated instance`) // redundant but will make debugging easier later on
        if (root?.children.length !== instance?.children.length)
            return false;

        if(!checkNonDuplicateIDs(root, instance))
            return false;

        for(let [rootChild, instanceChild] of zip([...root.children], [...instance.children])) {
            if(!checkNonDuplicateIDs(rootChild, instanceChild))
                return false;

            // Check for nested elements
            if(rootChild.children.length > 0 && instanceChild.children.length > 0) {
                for (let [rootGrandchild, instanceGrandChild] of zip([...rootChild.children], [...instanceChild.children]))
                    if(!testNonDuplicateIDs(rootGrandchild, instanceGrandChild))
                        return false;
            }
        }
        return true;
    };

    const numberOfComponentsUsed = (component) => {
        if(component === "adaptiveFormButton")
            return 5;
        return 1;
    };

    components.forEach((coreComponent) => {
        it(`Check if ${coreComponent}'s repeated instances have non duplicate IDs`,() => {
            // Check duplicate IDs
            cy.get(`[data-cmp-is="${coreComponent}"]`).then((instances) => {
                instances = [...instances]; // Convert into normal Array to use things like .forEach()
                expect(instances.length).to.equal(repeatabilityCount * numberOfComponentsUsed(coreComponent), `Repeatability check for ${coreComponent}`); // Repeatability check
                const root = instances[0]; // main component

                // Compare IDs of main component with all its repeated instances
                instances.slice(1).forEach((instance) => expect(testNonDuplicateIDs(root, instance), `${coreComponent} repeated instance IDs must not match`).to.be.true);
            });
        });
    });
});