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


/**
 * @module FormView
 */

/**
 * Class representing an instance manager to manage repeatable instances.
 */
class InstanceManager {

    /**
     * Creates an instance of the InstanceManager.
     * @param {object} params - The parameters for the InstanceManager.
     * @param {module:FormView~FormContainer} params.formContainer - The form container object
     * @param {object} params.model - The model associated with the instance manager.
     * @param {HTMLElement} params.parentElement - The parent element of the instance manager.
     */
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
            Utils.createFieldsForAddedElement(addedHtmlElement, this.formContainer);
        } else if (instanceModel == null) {
            this.#removeChildInstance(instanceView.getModel());
        } else if (instanceView.getId() != instanceModel.id) {
            addedHtmlElement = this.#addChildInstance(instanceModel, beforeElement);
            Utils.createFieldsForAddedElement(addedHtmlElement, this.formContainer);
            this.#removeChildInstance(instanceView.getModel());
        }
        return addedHtmlElement;
    }

    /**
     * Syncs instanceManager model items with HTML
     * @private
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
            const instanceModel = (index < modelInstancesLength) ? models[index] : null;
            addedHtmlElement = this.#syncViewModel(instanceView, instanceModel, addedHtmlElement);            
        }
    }

    /**
     * Updates template IDs in the HTML based on the model
     * @param html {HTMLElement} The HTML element to update
     * @param model {object} The model associated with the HTML element
     * @param newId {string} The new ID to assign to the HTML element
     * @private
     */
    #updateTemplateIds(html, model, newId) {
        //In case of instance manager, type is an array, which doesn't have presence in HTML
        if (model.type != 'array') {
            Utils.updateId(html, model.id, newId);
        }
        if (model.fieldType == 'panel' && model.items) {
            for (let i = 0; i < model.items.length; i++) {
                this.#updateTemplateIds(html, model.items[i], newId + "_" + i);
            }
        }
    }

    /**
     * Updates clone IDs in the HTML based on the old ID and new model
     * @param html {HTMLElement} The HTML element to update
     * @param oldId {string} The old ID to replace
     * @param newModel {object} The new model associated with the HTML element
     */
    updateCloneIds(html, oldId, newModel) {
        //In case of instance manager, type is an array, which doesn't have presence in HTML
        if (newModel.type != 'array') {
            Utils.updateId(html, oldId, newModel.id);
        }
        if (newModel.fieldType == 'panel' && newModel.items) {
            for (let i = 0; i < newModel.items.length; i++) {
                this.updateCloneIds(html, oldId + "_" + i, newModel.items[i]);
            }
        }
    }

    /**
     * Updates the template with the given child view
     * @param childView {object} The child view to update the template with
     */
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
        let childModel = childView.getModel();
        // In case of removed instance by prefill, that is index is -1, model is not associated with view
        if (!childModel) {
            childModel = this.formContainer.getModel(childView.getId());
        }
        this.#updateTemplateIds(this._templateHTML, childModel, 'temp_0');
    }

    /**
     * Dispatches a model event with the given event name and payload
     * @param event {object} The event object
     * @param eventName {string} The name of the event to dispatch
     * @param payload {object} The payload to include in the event
     * @private
     */
    #dispatchModelEvent(event, eventName, payload) {
        const customEvent = new CustomEvent(eventName);
        if (payload) {
            customEvent.payload = payload;
        }
        // todo else derive the index and count from event
        this.getModel().dispatch(customEvent);
    }

    /**
     * Adds a child instance based on the added model and position before the element
     * @param addedModel {object} The model of the added instance
     * @param beforeElement {HTMLElement} The element before which the instance should be added
     * @returns {HTMLElement} The added HTML element
     * @private
     */
    #addChildInstance(addedModel, beforeElement) {
        if (!(this._templateHTML)) {
            console.error('Panel needs to have templateHTML to support repeatability.');
            return;
        }
        return this.handleAddition(addedModel, beforeElement);
    }

    /**
     * Removes a child instance based on the removed model
     * @param removedModel {object} The model of the removed instance
     * @private
     */
    #removeChildInstance(removedModel) {
        const removedIndex = removedModel.index;
        let removedChildView = this.children[removedIndex];
        if (removedIndex == -1) {
            //That is, model was removed by prefill, and instance manager was synced with child already removed
            removedChildView = this.formContainer.getField(removedModel.id);
        }
        Utils.removeFieldReferences(removedChildView, this.formContainer);
        this.handleRemoval(removedChildView);
        this.children.splice(removedIndex, 1);

        const event = new CustomEvent(Constants.PANEL_INSTANCE_REMOVED, {"detail": removedChildView});
        this.formContainer.getFormElement().dispatchEvent(event);
    }

    /**
     * Adds an instance based on the event and payload
     * @param event {object} The event object
     * @param payload {object} The payload associated with the event
     */
    addInstance(event, payload) {
        this.#dispatchModelEvent(event, "addInstance", payload);
    }

    /**
     * Removes an instance based on the event and payload
     * @param event {object} The event object
     * @param payload {object} The payload associated with the event
     */
    removeInstance(event, payload) {
        this.#dispatchModelEvent(event, "removeInstance", payload);
    }

    /**
     * Adds or removes an instance based on the ID, event name, index, and event
     * @param id {string} The ID of the instance
     * @param eventName {string} The name of the event
     * @param index {number} The index of the instance
     * @param event {object} The event object
     * @private
     */
    #addRemoveInstance(id, eventName, index, event){
      const model = this.formContainer.getModel(id);
      const customEvent = new CustomEvent(eventName);
      customEvent.payload = model.index + index;
      model.parent.dispatch(customEvent);
      event.stopPropagation();
    }

    /**
     * Registers instance handlers for the child view
     * @param childView {object} The child view to register handlers for
     * @private
     */
    #registerInstanceHandlers(childView) {
        if(typeof this?.repeatableParentView?.getRepeatableRootElement === "function"){
          const parentElement = this.repeatableParentView.getRepeatableRootElement(childView);
          Utils.registerClickHandler(parentElement, Constants.DATA_HOOK_ADD_INSTANCE, (event) => {
              const id = event.currentTarget.getAttribute(Constants.DATA_HOOK_ADD_INSTANCE);
              if(!id){
                this.addInstance(event);
              }else {
                this.#addRemoveInstance(id, 'addInstance', 1, event);
              }
          });
          Utils.registerClickHandler(parentElement, Constants.DATA_HOOK_REMOVE_INSTANCE, (event) => {
              const id = event.currentTarget.getAttribute(Constants.DATA_HOOK_REMOVE_INSTANCE);
              if(!id){
                this.removeInstance(event);
              }else {
                this.#addRemoveInstance(id, 'removeInstance', 0, event);
              }
          });
        }
    }

    /**
     * Inserts HTML for the added instance
     * @param addedInstanceJson {object} The JSON representation of the added instance
     * @param beforeElement {HTMLElement} The element before which the instance should be added
     * @returns {HTMLElement} The added HTML element
     */
    handleAddition(addedInstanceJson, beforeElement) {
        const instanceIndex = addedInstanceJson.index;
        let htmlElement = this._templateHTML.cloneNode(true);
        //get the model from added instance state
        let addedModel = this.formContainer.getModel(addedInstanceJson.id);
        this.updateCloneIds(htmlElement, 'temp_0', addedModel);
        if (this.repeatableParentView && (typeof this.repeatableParentView.addRepeatableMarkup === "function")) {
            htmlElement = this.repeatableParentView.addRepeatableMarkup(this, addedModel, htmlElement);
        } else {
            // this is required if repeatableParentView is the formContainer.
            //no child exist in the view
            if (this.children.length == 0) {
                this.parentElement.append(htmlElement);
                //this.markerElement.after(htmlElement);
            } else if (addedModel.index == 0) {
                //special case for first element
                let afterElement = this.children[0].element.parentElement;
                this.parentElement.insertBefore(htmlElement, afterElement);
            } else {
                let beforeViewElement = (beforeElement != null) ? beforeElement : this.children[instanceIndex - 1].element.parentElement;
                beforeViewElement.after(htmlElement);
            }
        }
        return htmlElement;
    }

    /**
     * Removes HTML for the removed instance
     * @param removedInstanceView {object} The view of the removed instance
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
     * Adds a repeatable instance view
     * @param childView {object} The child view to add
     * @fires module:FormView~Constants#PANEL_INSTANCE_ADDED
     */
    addChild(childView) {
        //Add template when first view is added
        if (!(this._templateHTML)) {
            this.updateTemplate(childView);
        }
        //adding view post mutation observer has added view for repeatable instance
        this.children.splice(childView.getModel().index, 0, childView);
        this.#registerInstanceHandlers(childView);
        const event = new CustomEvent(Constants.PANEL_INSTANCE_ADDED, {"detail": childView});
        if (this.repeatableParentView && (typeof this.repeatableParentView.handleChildAddition === "function")) {
            //give parentView chance to adjust to added instance
            this.repeatableParentView.handleChildAddition(childView);
        }
        this.formContainer.getFormElement().dispatchEvent(event);
    }

    /**
     * Adds or removes repeatable children
     * @param {object} prevValue - The previous value (removed instance) or null
     * @param {object} currentValue - The current value (added instance) or null
     * @param {object} state - The state object
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

    /**
     * Gets the ID of the instance manager
     * @returns {string} The ID
     */
    getId() {
        return this.id;
    }

    /**
     * Gets the model associated with the instance manager
     * @returns {object} The model
     */
    getModel() {
        return this._model;
    }

    /**
     * Sets the repeatable parent view
     * @param {object} parentView - The repeatable parent view
     */
    setRepeatableParentView(parentView) {
        //adding repeatable parent view
        this.repeatableParentView = parentView;
        //setting parent view ensures view is now fully functional,
        // so proceed with syncing instanceManager model items with HTML
        this.#syncInstancesHTML();
        if(this.children.length > 0) {
          this.#registerInstanceHandlers(this.children[0]);
        }
    }

    /**
     * Gets the repeatable parent view
     * @returns {object} The repeatable parent view
     */
    getRepeatableParentView() {
        return this.repeatableParentView;
    }
}

export default InstanceManager;
