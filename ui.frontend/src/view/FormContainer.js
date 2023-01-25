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
export default class FormContainer {
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
     * Adds instance manger view to fields of formContainer
     * @param instanceManager
     */
    addInstanceManager(instanceManager) {
        this._fields[instanceManager.id] = instanceManager;
    }

    /**
     * returns the form field view
     * @param fieldId
     */
    getField(fieldId) {
        if (this._fields.hasOwnProperty(fieldId)) {
            return this._fields[fieldId];
        }
        return null;
    }

    getModel(id) {
        return id ? this._model.getElement(id) : this._model;
    }

    // todo: fix this once exposed in af-core
    getLang() {
        return this._model._jsonModel.lang || "en";
    }

    /**
     * Returns id of form element present in HTML as parent
     * @param model
     * @returns parent id
     */
    getParentFormElementId(model) {
        const parentModel = (model.fieldType && model.repeatable) ? model.parent.parent : model.parent;
        return parentModel.id;
    }

    addField(fieldView) {
        if (fieldView.getFormContainerPath() === this._path) {
            let fieldId = fieldView.getId();
            this._fields[fieldId] = fieldView;
            let model = this.getModel(fieldId);
            fieldView.setModel(model);
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

    getPath() {
        return this._path;
    }

    getFormElement() {
        return this._element;
    }

    getAllFields() {
        return this._fields;
    }
}
