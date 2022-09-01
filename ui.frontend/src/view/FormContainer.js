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
        this._model = FormView.createFormInstance(params._formJson);
        this._path = params._path;
        this._fields = {};
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

    addField(fieldView) {
        if (fieldView.getFormContainerPath() === this._path) {
            this._fields[fieldView.getId()] = fieldView;
            fieldView.setModel(this.getModel(fieldView.getId()));
            fieldView.subscribe();
        }
    }

}