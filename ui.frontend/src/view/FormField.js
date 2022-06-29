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
        this.formContainer = params.formContainer;
        this.parent = params.parent || params.formContainer;
        this.element = params.element; //html element of field
        this.options = readData(this.element, this.getClass());  //dataset of field
        let el = this.element.getElementsByTagName(this.getTagName());
        if (el && el.length > 0) {
            this.setId(el[0].id);
        }
        this.bindEventListeners();
        this.formContainer.addField(this);
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    bindEventListeners() {
        this.element.addEventListener('change', (event) => {
            this._model.value = event.target.value;
        });
    }

    setModel(model) {
        this._model = model;
    }

    getModel() {
        return this._model;
    }

    getClass() {
       throw new Error ("Not Implemented");
    }

    getTagName() {
        throw new Error ("Not Implemented");
    }

    setValue(value) {
       throw new Error("Not implemented");
    }

    subscribe() {
        this._model.subscribe((action) => {
            let state = action.target.getState();
            if (!state.valid) {
                alert(state.errorMessage);
                this.setValue(null);
            } else {
                this.setValue(state.value);
            }
        });
    }
}
