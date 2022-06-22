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

import readData from "../utils";

export default class FormField {

    constructor(params) {
        this.element = params.element; //html element of field
        this.options = readData(this.element, this.getClass());  //dataset of field
        this.setId();
        this.bindEventListeners();
    }

    setId() {
        this.id = this.element.getElementsByTagName(this.getTagName())[0].id;
    }

    bindEventListeners() {
        this.element.addEventListener('change', (event) => {
            this.handleOnChange(event.target.value);
        });
    }

    getId() {
        return this.id;
    }

    setElement(element) {
        this.element = element;
    }

    setOptions(options) {
        this.options = options;
    }

    setModel(model) {
        this._model = model;
    }

    getModel() {
        return this._model;
    }

    getClass() {
        return "formfield";
    }

    getTagName() {
        return "div";
    }

    getFieldType() {
        return this._model._jsonModel.fieldType;
    }

    handleOnChange(value) {
        this._model.value = value;
    }

    subscribe() {
        this._model.subscribe((action) => {
            let state = action.target.getState();
            console.log(action.target.getState());
            if (!state.valid) {
                alert(state.errorMessage);
            }
        });
    }
}
