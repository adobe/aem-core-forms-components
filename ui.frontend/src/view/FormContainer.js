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

import DatePicker from "./DatePicker";
import readData from "../utils";

export default class FormContainer {
    constructor(params) {
        this._model = params._model;
        this._fields = {};
        this.#addFields();
    }

    getFieldModel(fieldId) {
        this._model.getElement(fieldId);
    }

    /**
     * returns the form field view
     * @param fieldId
     */
    getField(fieldId) {
        return this._fields[fieldId];
    }

    getModel() {
        return this._model;
    }

    setFocus(somExpression) {
        this._currentFocusItemSom = somExpression;
    }

    getFocus() {
        return this._currentFocusItemSom;
    }

    getView(somExpression) {
    }

    #addFields() {
        for (const [fieldId, fieldModel] of Object.entries(this._model._fields)) {
            this.#addField(fieldId, fieldModel);
        }
    }

    #addField(fieldId, fieldModel) {
        switch(fieldModel.fieldType) {
            case 'date-input': {
                let textView = new DatePicker({_model: fieldModel, _formContainer: this});
                this.#addViewField(fieldId, textView);
            }
        }
    }

    #addViewField(fieldId, fieldView) {
        this._fields[fieldId]  = fieldView;
    }

    initialiseElementView(element, tagName, clazz) {
        let elementId = element.getElementsByTagName(tagName)[0].id,
            formField = this.getField(elementId),
            that = this;
        formField.setElement(element);
        formField.setOptions(readData(element, clazz));
        formField.subscribe();
        element.addEventListener('change', (event) => {
            let currentFormField = that.getField(event.target.id);
            currentFormField.handleOnChange(event.target.value);
        });
    }

    initialiseFormFields(selector, tagName, clazz) {
        let fieldElements = document.querySelectorAll(selector);
        for (let i = 0; i < fieldElements.length; i++) {
            this.initialiseElementView(fieldElements[i], tagName, clazz);
        }
    }

}

