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

import {Constants} from "../constants";
import FormFieldBase from "./FormFieldBase";
import Utils from "../utils";

export default class FormPanel extends FormFieldBase {

    constructor(params) {
        super(params);
        this.children = [];
        this._deferredInstances = {};
    }

    updateTemplateIds(html, model, newId) {
        Utils.updateId(html, model.id, newId);
        if (model.type == 'array' || model.type == 'object') {
            const children = model.children;
            for (let i = 0; i < children.length; i++) {
                this.updateTemplateIds(html, children[i], newId + "_" + i);
            }
        }
    }

    updateCloneIds(html, oldId, newModel) {
        Utils.updateId(html, oldId, newModel.id);
        if (newModel.type == 'array' || newModel.type == 'object') {
            const children = newModel.children;
            for (let i = 0; i < children.length; i++) {
                this.updateCloneIds(html, oldId + "_" + i, children[i]);
            }
        }
    }

    updateTemplate(childView) {
        this._templateHTML = childView.element.parentElement.cloneNode(true);
        this.updateTemplateIds(this._templateHTML, childView._model, 'temp_0');
    }

    setModel(model) {
        super.setModel(model);
        this.repeatable = (this._model.type == 'array');
        if (this.repeatable) {
            this._registerInstanceHandlers();
        }
    }

    handleRepeatableChildAddition(event) {
        //childView = event.detail
        //This needs to be handled in tabs, accordion, wizard
    }

    handleRepeatableChildRemoval(event) {
        //childView = event.detail
        //This needs to be handled in tabs, accordion, wizard
    }

    addChild(childView) {
        const viewId = childView.id;
        const dispatchAddEvent = () => {
            const event = new CustomEvent(Constants.PANEL_CHILD_ADDED, { "detail": childView });
            this.element.dispatchEvent(event);
        };

        if (childView.repeatable) {
            childView.element.addEventListener(Constants.PANEL_CHILD_ADDED, this.handleRepeatableChildAddition);
            childView.element.addEventListener(Constants.PANEL_CHILD_REMOVED, this.handleRepeatableChildRemoval);
        }

        if (this.repeatable) {
            if (!this._templateHTML) {
                this.updateTemplate(childView);
            }

            const instanceId = this._deferredInstances[viewId];
            if (instanceId != undefined) {
                //adding view post mutation observer has added view for repeatable instance
                this.children.splice(instanceId, 0, childView);
                //remove entry from deferred instances
                delete this._deferredInstances[viewId];
                dispatchAddEvent();
                return;
            }
        }

        this.children.push(childView);
        dispatchAddEvent();
    }

    _getInstanceArray(state) {
        let instanceArray = [];
        if (typeof state == 'array') {
            instanceArray = state;
        } else {
            instanceArray.push(state);
        }
        return instanceArray;
    }

    addChildInstance(getState, state) {
        if (!(this._templateHTML)) {
            console.error('Panel needs to have templateHTML to support repeatability.');
            return;
        }
        if (this.repeatable) {
            const instanceId = state.index;
            let addedModel = this._model._children[instanceId];
            let htmlElement = this._templateHTML.cloneNode(true);

            this.updateCloneIds(htmlElement, 'temp_0', addedModel);

            //make entry to deferred instance, as whenever a child comes to register under it, it should be placed at correct index
            this._deferredInstances[addedModel.id] = instanceId;

            //no child exist in the view
            if (this.children.length == 0) {
                this.element.append(htmlElement);
            } else if (instanceId == 0) {
                //special case for first element
                let afterElement = this.children[0].element.parentElement;
                this.element.insertBefore(htmlElement, afterElement);
            } else {
                let beforeElement = this.children[instanceId - 1].element.parentElement;
                beforeElement.after(htmlElement);
            }
        } else {
            console.error('Add child instance is only supported for repeatable panels.');
        }
    }

    removeChildInstance(removedModel, state) {
        if (this.repeatable) {
            const instanceArray = this._getInstanceArray(removedModel);
            for (let i = 0; i < instanceArray.length; i++) {
                const instanceId = instanceArray[i].index;
                let childView = this.children[instanceId];
                Utils.removeFieldReferences(childView);
                // removing just the parent view HTML child instance, to avoid repainting of UI for removal of each child HTML
                childView.element.parentElement.remove();
                this.children.splice(instanceId, 1);
                const event = new CustomEvent(Constants.PANEL_CHILD_REMOVED, { "detail": childView });
                this.element.dispatchEvent(event);
            }
        } else {
            console.error('Remove child instance is only supported for repeatable panels.');
        }
    }

    _registerInstanceHandlers() {
        Utils.registerClickHandler(this.element, Constants.DATA_HOOK_ADD_INSTANCE, this._addInstance);
        Utils.registerClickHandler(this.element, Constants.DATA_HOOK_REMOVE_INSTANCE, this._removeInstance);
    }

    _dispatchModelEvent(event, eventName, payload) {
        const customEvent = new CustomEvent(eventName);
        if (payload) {
            event.payload = payload;
        }
        // todo else derive the index and count from event
        this._model.dispatch(customEvent);
    }

    _addInstance(event, payload) {
        this._dispatchModelEvent(event,"addItem", payload);
    }

    _removeInstance(event, payload) {
        this._dispatchModelEvent(event,"removeItem", payload);
    }

    /**
     * applies full state of the field to the HTML. Generally done just after the model is bound to the field
     * @param state
     * @private
     */
    _applyState(state) {
        this._updateVisible(state.visible);
        this._updateEnable(state.enabled);
    }

    /**
     * updates the html state based on enable state of the panel
     * @param enable
     * @private
     */
    _updateEnable(enable) {
        this.toggle(enable, Constants.ARIA_DISABLED, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enable);
    }

    /**
     * Updates the html state based on valid state of the panel
     * @param valid
     * @param state
     * @private
     */
    _updateValid(valid, state) {
        this.toggle(valid, Constants.ARIA_INVALID, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_VALID, valid);
    }

    /**
     * Adds or remove repeatable children
     * @param prevValue will have removed instances, for removeItem otherwise its null
     * @param currentValue will have added instance, for addItem otherwise its null
     * @param state
     * @private
     */
    _updateItems(prevValue, currentValue, state) {
        //if previous value exists it means remove item is invoked
        if (prevValue) {
            this.removeChildInstance(prevValue, state);
        } else if (currentValue) {
            this.addChildInstance(currentValue, state);
        }
    }
}
