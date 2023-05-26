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

import {Constants} from "../constants.js";
import FormFieldBase from "./FormFieldBase.js";
import InstanceManager from "./InstanceManager.js";

export default class FormPanel extends FormFieldBase {
    constructor(params) {
        super(params);
        this.children = [];
    }

    instantiateInstanceManager() {
        return new InstanceManager({
            "formContainer": this.formContainer,
            "model": this._model.parent,
            "parentElement": this.element.parentElement.parentElement
        });
    }

    setModel(model) {
        super.setModel(model);
        if (model.repeatable) {
            let instanceManager = this.formContainer.getField(model.parent.id);
            if (instanceManager == null) {
                instanceManager = this.instantiateInstanceManager();
                this.formContainer.addInstanceManager(instanceManager);
            }
            this.setInstanceManager(instanceManager);
            instanceManager.addChild(this);
        }
    }

    setFocus(id) {
        const fieldType = this.parentView?.getModel()?.fieldType;
        if (fieldType !== 'form' && this.parentView.setFocus) {
            this.parentView.setFocus(this.getId());
        }
    }

    addChild(childView) {
        this.children.push(childView);
    }

    getChild(id) {
        for (let key in this.children) {
            if (this.children[key].id === id) {
                return this.children[key];
            }
        }
    }

    handleChildAddition(childView) {
        //This needs to be handled in tabs, accordion, wizard
    }

    handleChildRemoval(childView) {
        //This needs to be handled in tabs, accordion, wizard
    }

    /**
     * applies full state of the field to the HTML. Generally done just after the model is bound to the field
     * @param state
     */
    applyState(state) {
        this.updateVisible(state.visible);
        this.updateEnabled(state.enabled);
        this.initializeHelpContent(state);
    }

    /**
     * updates the html state based on enable state of the panel
     * @param enable
     */
    updateEnabled(enable) {
        this.toggle(enable, Constants.ARIA_DISABLED, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enable);
    }

    /**
     * Updates the html state based on valid state of the panel
     * @param valid
     * @param state
     */
    updateValid(valid, state) {
        this.toggle(valid, Constants.ARIA_INVALID, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_VALID, valid);
    }

    getChildViewByIndex(index) {
        //everyLayout needs to implement this method
    }

    #getClosestFields(index) {
        var result = {};
        result["closestRepeatableFieldInstanceManagerIds"] = [];
        for (let i = index - 1; i >= 0; i--) {
            var fieldView = this.getChildViewByIndex(i);
            if (fieldView.getInstanceManager() == null) {
                result["closestNonRepeatableFieldId"] = fieldView.getId();
                break;
            } else {
                result["closestRepeatableFieldInstanceManagerIds"].push(fieldView.getInstanceManager().getId());
                if (fieldView.getInstanceManager().getModel().minOccur != 0) {
                    break;
                }
            }
        }
        return result;
    }

    cacheClosestFieldsInView() {
        for (let i = 0; i < this.children.length; i++) {
            var fieldView = this.getChildViewByIndex(i);
            if (fieldView.getInstanceManager() != null && fieldView.getInstanceManager().getModel().minOccur == 0) {
                var instanceManagerId = fieldView.getInstanceManager().getId();
                if (this._templateHTML[instanceManagerId] == null) {
                    this._templateHTML[instanceManagerId] = {};
                }
                if (this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'] == null &&
                    this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'] == null) {
                    var result = this.#getClosestFields(i);
                    this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'] = result["closestNonRepeatableFieldId"];
                    this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'] = result["closestRepeatableFieldInstanceManagerIds"];
                }
            }
        }
    }

    getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds) {
        var resultIndex = -1;
        for (let i = this.children.length - 1; i >= 0; i--) {
            var fieldView = this.getChildViewByIndex(i);
            if (closestNonRepeatableFieldId === fieldView.getId()) {
                resultIndex = i;
                break;
            } else {
                if (fieldView.getInstanceManager() != null && closestRepeatableFieldInstanceManagerIds.includes(fieldView.getInstanceManager().getId())) {
                    resultIndex = i;
                    break;
                }
            }
        }
        return resultIndex + 1;
    }

    updateChildVisibility(visible, state) {
        // implement in individual layouts
    }

    handleHiddenChildrenVisibility() {
        for (let i = 0; i < this.children.length; i++) {
            let isVisible = this.children[i].element.getAttribute(Constants.DATA_ATTRIBUTE_VISIBLE);
            if (isVisible === 'false') {
                this.updateChildVisibility(false, this.children[i].getModel().getState());
            }
        }
    }

    findFirstVisibleChild(children) {
        for (let i = 0; i < children.length; i++) {
            let isVisible = children[i].getAttribute(Constants.DATA_ATTRIBUTE_VISIBLE);
            if (isVisible != 'false') {
                return children[i];
            }
        }
    }

    updateVisibilityOfNavigationElement(navigationTabElement, visible) {
        if (navigationTabElement) {
            if (visible === false) {
                navigationTabElement.setAttribute(Constants.ARIA_HIDDEN, true);
            } else {
                navigationTabElement.removeAttribute(Constants.ARIA_HIDDEN);
            }
            navigationTabElement.setAttribute(Constants.DATA_ATTRIBUTE_VISIBLE, visible);
        }
    }

}
