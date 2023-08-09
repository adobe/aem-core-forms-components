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
import {createFormInstance} from "@aemforms/af-core";

/**
 * @module FormView
 */

/**
 * Represents a FormContainer class.
 */
class FormContainer {
    /**
     * Creates an instance of the FormContainer class.
     * @param {object} params - The parameters for constructing the FormContainer instance.
     */
    constructor(params) {
        // bug in af-core, if data is set to empty object, model is not created correctly
        let prefillData = ((params._prefillData.data && Object.keys(params._prefillData.data).length === 0) ? null: params._prefillData.data);
        this._model = createFormInstance({...params._formJson, data: prefillData});
        this._path = params._path;
        this._fields = {};
        this._deferredParents = {};
        this._element = params._element;
    }

    /**
     * Adds an instance manager view to the fields of the formContainer.
     * @param {object} instanceManager - The instance manager view to be added.
     */
    addInstanceManager(instanceManager) {
        this._fields[instanceManager.id] = instanceManager;
    }

    /**
     * Returns the form field view with the specified field ID.
     * @param {string} fieldId - The ID of the form field.
     * @returns {object|null} The form field view, or null if not found.
     */
    getField(fieldId) {
        if (this._fields.hasOwnProperty(fieldId)) {
            return this._fields[fieldId];
        }
        return null;
    }

    /**
     * Returns the model with the specified ID. If no ID is provided, returns the entire model.
     * @param {string} [id] - The ID of the model element.
     * @returns {object} The model element or the entire model.
     */
    getModel(id) {
        return id ? this._model.getElement(id) : this._model;
    }

    // todo: fix this once exposed in af-core
    /**
     * Returns the language code of the form.
     * @returns {string} The language code (e.g., "en").
     */
    getLang() {
        return this._model._jsonModel.lang || "en";
    }

    /**
     * Returns the ID of the form element's parent in the HTML structure.
     * @param {object} model - The form element model.
     * @returns {string} The parent ID.
     */
    getParentFormElementId(model) {
        const parentModel = (model.fieldType && model.repeatable) ? model.parent.parent : model.parent;
        return parentModel.id;
    }

    /**
     * Adds a field view to the form container.
     * @param {object} fieldView - The field view to be added.
     */
    addField(fieldView) {
        if (fieldView.getFormContainerPath() === this._path) {
            let fieldId = fieldView.getId();
            this._fields[fieldId] = fieldView;
            let model = this.getModel(fieldId);
            fieldView.setModel(model);
            fieldView.syncMarkupWithModel();
            const parentId = this.getParentFormElementId(model);
            if (parentId != '$form') {
                let parentView = this._fields[parentId];
                //if parent view has been initialized then add parent relationship, otherwise add it to deferred parent-child relationship
                if (parentView) {
                    fieldView.setParent(parentView);
                } else {
                    if (!this._deferredParents[parentId]) {
                        this._deferredParents[parentId] = [];
                    }
                    this._deferredParents[parentId].push(fieldView);
                }
            } else {
                fieldView.setParent(this);
            }

            // check if field id is in deferred relationship, if it is add parent child relationships
            if (this._deferredParents[fieldId]) {
                let childList = this._deferredParents[fieldId];
                for (let index = 0; index < childList.length; index++) {
                    childList[index].setParent(fieldView);
                }
                // remove the parent from deferred parents, once child-parent relationship is established
                delete this._deferredParents[fieldId];
            }
            fieldView.subscribe();
        }
    }

    /**
     * Sets the focus on the specified field ID.
     * @param {string} id - The ID of the field to set the focus on.
     */
    setFocus(id) {
        if (id) {
            let fieldView = this._fields[id];
            if (fieldView && fieldView.setFocus) {
                fieldView.setFocus();
            } else {
                // todo proper error handling, for AF 2.0 model exceptions as well
                // logging the error right now.
                console.log("View on which focus is to be set, not initialized.");
            }
        } else {
            //todo
            // if id is not defined, focus on the first field of the form
            // should be governed by a configuration to be done later on
        }
    }

    /**
     * Returns the ID of the form.
     * @returns {string} The form ID.
     */
    getFormId() {
        return this._model._jsonModel.id;
    }

    /**
     * Returns the title of the form.
     * @returns {string} The form title.
     */
    getFormTitle() {
        return this._model._jsonModel.title;
    }

    /**
     * Returns the path of the form container.
     * @returns {string} The form container path.
     */
    getPath() {
        return this._path;
    }

    /**
     * Returns the form element associated with the form container.
     * @returns {HTMLElement} The form element.
     */
    getFormElement() {
        return this._element;
    }

    /**
     * Returns all fields of the form container.
     * @returns {object} An object containing all fields of the form container.
     */
    getAllFields() {
        return this._fields;
    }

    /**
       * Updates the active child of the form container.
       * @param {Object} activeChild - The active child.
    */
    updateActiveChild(activeChild) {
      this.setFocus(activeChild?._activeChild?.id || activeChild?.id);
    }

    /**
       * Subscribes to model changes and updates the corresponding properties in the view.
       * @override
     */
    subscribe() {
        const changeHandlerName = (propName) => `update${propName[0].toUpperCase() + propName.slice(1)}`
        this._model.subscribe((action) => {
            let state = action.target.getState();
            const changes = action.payload.changes;
            changes.forEach(change => {
                const fn = changeHandlerName(change.propertyName);
                if (typeof this[fn] === "function") {
                    this[fn](change.currentValue, state);
                } else {
                    console.warn(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                }
            })
        });
    }
}

export default FormContainer;
