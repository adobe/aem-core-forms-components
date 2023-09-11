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
import Utils from "../utils.js";

/**
 * @module FormView
 */


/**
 * Represents a FormField class.
 */
class FormField {

    /**
     * Creates a new instance of the FormField class.
     * @param {object} params - The parameters for initializing the FormField.
     * @param {object} params.formContainer - The form container that the field belongs to.
     * @param {HTMLElement} params.element - The HTML element of the field.
     */
    constructor(params) {
        this.formContainer = params.formContainer;
        this.element = params.element; //html element of field
        this.options = Utils.readData(this.element, this.getClass());  //dataset of field
        this.setId(this.element.id);
        this.active = false;
    }

    /**
     * Sets the ID of the form field.
     * @param {string} id - The ID to set for the form field.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Sets the parent view of the form field.
     * @param {object} parentView - The parent view to set for the form field.
     */
    setParent(parentView) {
        this.parentView = parentView;
        if (this.parentView.addChild) {
            this.parentView.addChild(this);
        }
        if (this.getInstanceManager() && !(this.getInstanceManager().getRepeatableParentView())) {
            this.getInstanceManager().setRepeatableParentView(parentView);
        }
    }

    /**
     * Sets the instance manager for the form field.
     * @param {object} instanceManager - The instance manager to set for the form field.
     */
    setInstanceManager(instanceManager) {
        this.instanceManager = instanceManager;
    }

    /**
     * Sets the form field as active.
     */
    setActive() {
        if (!this.isActive()) {
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_ACTIVE, true);
        }
        if (this.parentView && this.parentView.setActive) {
            this.parentView.setActive(this);
        } 

        if(this.parentView) { 
            this.parentView._model.activeChild = this._model; // updating the activeChild of the model when view is changed
        }
    }

    /**
     * Sets the form field as inactive.
     */
    setInactive() {
        if (this.isActive()) {
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_ACTIVE, false);
        }
        if (this.parentView && this.parentView.setInactive) {
            this.parentView.setInactive();
        }
    }

    /**
     * Checks if the form field is active.
     * @returns {boolean} True if the form field is active, false otherwise.
     */
    isActive() {
        return this.active;
    }

    /**
     * Returns the form container path of the form field.
     * @returns {string} The form container path.
     */
    getFormContainerPath() {
        return this.options["adaptiveformcontainerPath"];
    }

    /**
     * Returns the ID of the form field.
     * @returns {string} The form field ID.
     */
    getId() {
        return this.id;
    }

    /**
     * Sets the model for the form field.
     * @param {object} model - The model to set for the form field.
     * @throws {string} Throws an error if the model is already initialized.
     */
    setModel(model) {
        if (typeof this._model === "undefined" || this._model === null) {
            this._model = model;
        } else {
            throw "Re-initializing model is not permitted"
        }
    }

    /**
     * Updates the HTML with the respective model.
     * This is for the markup that is generated on the client-side (e.g., repeatable panel).
     * @throws {string} Throws an error if the method is not implemented.
     */
    syncMarkupWithModel() {
        throw "method not implemented";
    }

    /**
     * Toggles the HTML element based on the property. If the property is false, then adds the data-attribute and CSS class.
     * @param {boolean} property - The property to toggle.
     * @param {string} dataAttribute - The data attribute to set or remove.
     * @param {string} value - The value to set for the data attribute.
     */
    toggle(property, dataAttribute, value) {
       this.toggleAttribute(this.element, property, dataAttribute, value);
    }

    /**
     * Toggles the given element based on the property. If the property is false, then adds the data-attribute and CSS class.
     * @param {HTMLElement} element - The element to toggle.
     * @param {boolean} property - The property to toggle.
     * @param {string} dataAttribute - The data attribute to set or remove.
     * @param {string} value - The value to set for the data attribute.
     */
    toggleAttribute(element, property, dataAttribute, value) {
        if (element) {
            if (property === false) {
                element.setAttribute(dataAttribute, value);
            } else {
                element.removeAttribute(dataAttribute);
            }
        }
    }

    /**
     * Returns the 'afs:layout' properties. Empty object if no layout property is present.
     * @returns {object} The 'afs:layout' properties.
     */
    getLayoutProperties() {
        let layoutProperties = {};
        const state = this.getModel().getState();
        if (state && state.properties && state.properties['afs:layout']) {
            layoutProperties =  state.properties['afs:layout'];
        }
        return layoutProperties;
    }

    /**
     * Returns the model of the form field.
     * @returns {object} The model of the form field.
     */
    getModel() {
        return this._model;
    }

    /**
     * Subscribes the field to the model.
     * @throws {string} Throws an error if the field does not subscribe to the model.
     */
    subscribe() {
        throw "the field does not subscribe to the model"
    }

    /**
     * Initializes the help content based on the state.
     * @throws {string} Throws an error if the method is not implemented.
     */
    initializeHelpContent(state) {
        throw "method not implemented";
    }

    /**
     * Returns the instance manager of the form field.
     * @returns {object} The instance manager of the form field.
     */
    getInstanceManager() {
        return this.instanceManager;
    }
}

export default FormField;
