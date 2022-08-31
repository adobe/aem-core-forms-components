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

import Utils from "../utils";

export default class FormField {

    constructor(params) {
        this.formContainer = params.formContainer;
        this.parent = params.parent || params.formContainer;
        this.element = params.element; //html element of field
        this.options = Utils.readData(this.element, this.getClass());  //dataset of field
        this.setId(this.element.id);
    }

    setId(id) {
        this.id = id;
    }

    getFormContainerPath() {
        return this.options["adaptiveformcontainerPath"];
    }

    getId() {
        return this.id;
    }

    setModel(model) {
        if (typeof this._model === "undefined" || this._model === null) {
            this._model = model;
        } else {
            throw "Re-initializing model is not permitted"
        }
    }

    /**
     * toggles the html element based on the property. If the property is false, then adds the data-attribute and
     * css class
     * @param property
     * @param dataAttribute
     * @param value
     */
    toggle(property, dataAttribute, value) {
        if (property === false) {
            this.element.setAttribute(dataAttribute, value);
        } else {
            this.element.removeAttribute(dataAttribute);
        }
    }

    getModel() {
        return this._model;
    }

    subscribe() {
        throw "the field does not subscribe to the model"
    }
}
