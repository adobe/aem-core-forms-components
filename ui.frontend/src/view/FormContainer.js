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
        this._formJson = params._formJson;
        this._fields = {};
    }

    async initialise() {
        this._model = await createFormInstance(this._formJson);
    }
    /**
     * returns the form field view
     * @param fieldId
     */
    getField(fieldId) {
        return this._fields[fieldId];
    }

    getModel(id) {
        return id ? this._model.getElement(id) : this._model;
    }

    addField(fieldView) {
        this._fields[fieldView.getId()]  = fieldView;
        fieldView.setModel(this.getModel(fieldView.getId()));
        fieldView.subscribe();
    }

}

