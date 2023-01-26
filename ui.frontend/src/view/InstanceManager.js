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

import Utils from "../utils.js";
import {Constants} from "../constants.js";

export default class InstanceManager {

    constructor(params) {
        this.formContainer = params.formContainer;
        this._model = params.model;
        this.parentElement = params.parentElement;
        this.id = this._model.id;
        this.children = [];
        this.subscribe();
    }

    /**
     * Syncs Instance View HTML with Instance Model
     * @param instanceView
     * @param instanceModel
     * @param beforeElement
     * @returns addedHtmlElement, if HTML is added, otherwise null
     */
    #syncViewModel(instanceView, instanceModel, beforeElement) {
        //todo can be optimized if the instance model has shifted to a new index - complex
        let addedHtmlElement = null;
        if (instanceView == null) {
            addedHtmlElement = this.#addChildInstance(instanceModel, beforeElement);
        } else if (instanceModel == null) {
            this.#removeChildInstance(instanceView.getModel());
        } else if (instanceView.getId() != instanceModel.id) {
            addedHtmlElement = this.#addChildInstance(instanceModel, beforeElement);
            this.#removeChildInstance(instanceView.getModel());
        }
        return addedHtmlElement;
    }

    /**
     * Syncs instanceManager model items with HTML
     */
    #syncInstancesHTML() {
        const views = this.children;
        const models = this._model.items;
        const viewInstancesLength = views.length;
        const modelInstancesLength = models.length;
        const maxLength = viewInstancesLength > modelInstancesLength ? viewInstancesLength : modelInstancesLength;
        let addedHtmlElement = null;
        for (let index = 0; index < maxLength; index++) {
            const instanceView = (index < viewInstancesLength) ? views[index] : null;
            const instanceModel = (index < modelInstancesLength) ? models[index]: null;
            addedHtmlElement = this.#syncViewModel(instanceView, instanceModel, addedHtmlElement);
        }
    }

    #updateTemplateIds(html, model, newId) {
        Utils.updateId(html, model.id, newId);
        if ((model.type == 'array' || model.type == 'object') && model.items) {
            for (let i = 0; i < model.items.length; i++) {
                this.#updateTemplateIds(html, model.items[i], newId + "_" + i);
            }
        }
    }

    updateCloneIds(html, oldId, newModel) {
        Utils.updateId(html, oldId, newModel.id);
        if ((newModel.type == 'array' || newModel.type == 'object') && newModel.items) {
            for (let i = 0; i < newModel.items.length; i++) {
                this.updateCloneIds(html, oldId + "_" + i, newModel.items[i]);
            }
        }
    }

    updateTemplate(childView) {
        const repeatableElement = childView.element.parentElement;
        /**
        //inserting marker
        let markerElement = document.createElement('div');
        markerElement.setAttribute("id", this.getId());
        markerElement.classList.add("form-instance-marker");
        this.parentElement.insertBefore(markerElement, repeatableElement);
        this.markerElement = markerElement;
         **/
        //adding template
        this._templateHTML = repeatableElement.cloneNode(true);
        this.#updateTemplateIds(this._templateHTML, childView.getModel(), 'temp_0');
    }

    #dispatchModelEvent(event, eventName, payload) {
        const customEvent = new CustomEvent(eventName);
        if (payload) {
            customEvent.payload = payload;
        }
        // todo else derive the index and count from event
        this.getModel().dispatch(customEvent);
    }

    #addChildInstance(addedModel, beforeElement) {
        if (!(this._templateHTML)) {
            console.error('Panel needs to have templateHTML to support repeatability.');
            return;
        }
        return this.handleAddition(addedModel, beforeElement);
    }

    #removeChildInstance(removedModel) {
        const removedIndex = removedModel.index;
        const removedChildView = this.children[removedIndex];
        Utils.removeFieldReferences(removedChildView);
        this.handleRemoval(removedChildView);
        this.children.splice(removedIndex, 1);
        const event = new CustomEvent(Constants.PANEL_INSTANCE_REMOVED, {"detail": removedChildView});
        this.formContainer.getFormElement().dispatchEvent(event);
    }

    addInstance(event, payload) {
        this.#dispatchModelEvent(event,"addInstance", payload);
    }

    removeInstance(event, payload) {
        this.#dispatchModelEvent(event,"removeInstance", payload);
    }

    #registerInstanceHandlers(childView) {
        //doesn't support repeatable panel inside repeatable panel
        Utils.registerClickHandler(childView.element.parentElement, Constants.DATA_HOOK_ADD_INSTANCE, (event) => {this.addInstance(event)});
        Utils.registerClickHandler(childView.element.parentElement, Constants.DATA_HOOK_REMOVE_INSTANCE, (event) => {this.removeInstance(event)});
    }

    /**
     * Inserts HTML for added instance
     * @param addedInstanceModel
     * @param beforeElement
     * @returns added htmlElement
     */
    handleAddition(addedInstanceModel, beforeElement) {
        const instanceIndex = addedInstanceModel.index;
        let htmlElement = this._templateHTML.cloneNode(true);
        this.updateCloneIds(htmlElement, 'temp_0', addedInstanceModel);

        //no child exist in the view
        if (this.children.length == 0) {
            this.parentElement.append(htmlElement);
            //this.markerElement.after(htmlElement);
        } else if (instanceIndex == 0) {
            //special case for first element
            let afterElement = this.children[0].element.parentElement;
            this.parentElement.insertBefore(htmlElement, afterElement);
        } else {
            let beforeViewElement = (beforeElement != null) ? beforeElement : this.children[instanceIndex - 1].element.parentElement;
            beforeViewElement.after(htmlElement);
        }
        return htmlElement;
    }

    /**
     * Removes HTML for removed instance
     * @param removedInstanceView
     */
    handleRemoval(removedInstanceView) {
        if (this.repeatableParentView && (typeof this.repeatableParentView.handleChildRemoval === "function")) {
            //give parentView chance to adjust to removed instance
            this.repeatableParentView.handleChildRemoval(removedInstanceView);
        }
        //removing just the parent view HTML child instance, to avoid repainting of UI for removal of each child HTML
        removedInstanceView.element.parentElement.remove();
    }

    /**
     * Add repeatable instance view
     * @param childView
     */
    addChild(childView) {
        //Add template when first view is added
        if (!(this._templateHTML)) {
            this.updateTemplate(childView);
        }
        //adding view post mutation observer has added view for repeatable instance
        this.children.splice(childView.getModel().index, 0, childView);
        this.#registerInstanceHandlers(childView);
        const event = new CustomEvent(Constants.PANEL_INSTANCE_ADDED, { "detail": childView });
        if (this.repeatableParentView && (typeof this.repeatableParentView.handleChildAddition === "function")) {
            //give parentView chance to adjust to added instance
            this.repeatableParentView.handleChildAddition(childView);
        }
        this.formContainer.getFormElement().dispatchEvent(event);
    }

    /**
     * Adds or remove repeatable children
     * @param prevValue will have removed instances, for removeItem otherwise its null
     * @param currentValue will have added instance, for addItem otherwise its null
     * @param state
     */
    updateItems(prevValue, currentValue, state) {
        //if previous value exists it means remove item is invoked
        if (prevValue) {
            this.#removeChildInstance(prevValue);
        } else if (currentValue) {
            this.#addChildInstance(currentValue);
        }
    }

    /**
     * Subscribes model for change handler
     */
    subscribe() {
        this.getModel().subscribe((action) => {
            let state = action.target.getState();
            const changes = action.payload.changes;
            changes.forEach(change => {
                if ("items" === change.propertyName) {
                    this.updateItems(change.prevValue, change.currentValue, state);
                } else {
                    console.error(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                }
            })
        });
    }

    getId() {
        return this.id;
    }

    getModel() {
        return this._model;
    }

    setRepeatableParentView(parentView) {
        //adding repeatable parent view
        this.repeatableParentView = parentView;
        //setting parent view ensures view is now fully functional,
        // so proceed with syncing instanceManager model items with HTML
        this.#syncInstancesHTML();
    }

    getRepeatableParentView() {
        return this.repeatableParentView;
    }
}