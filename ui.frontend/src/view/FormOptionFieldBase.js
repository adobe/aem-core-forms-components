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

import FormFieldBase from "./FormFieldBase.js";


/**
 * @module FormView
 */

/**
 * Class containing common view code for dropdown, checkboxgroup and radiobutton
 * @extends module:FormView~FormFieldBase
 */
class FormOptionFieldBase extends FormFieldBase {
    constructor(params) {
        super(params);
    }


    /**
     * Placeholder method for updating the saved value in the option field.
     * This method is intended to be overridden by the child class.
     * The overriding method should contain the logic for updating the 'enum' value.
     *
     * @param {Array} enums - An array of primitive values to be saved in the option field.
     */
    updateEnum(enums) {
        // Placeholder method, needs to be overridden by the child class
    }

    /**
     * Placeholder method for updating the display value in the option field.
     * This method is intended to be overridden by the child class.
     * The overriding method should contain the logic for updating the 'enumNames' value.
     *
     * @param {Array} enumNames - An array of display values for the option field.
     */
    updateEnumNames(enumNames) {
        // Placeholder method, needs to be overridden by the child class
    }


    /**
     * Applies the full state of the field to the HTML.
     * Generally done just after the model is bound to the field.
     * @param {Object} state - The state object.
     */
    applyState(state) {
        super.applyState(state);
        if (state?.enum) {
            this.updateEnum(state.enum)
        }
        if (state?.enumNames) {
            this.updateEnumNames(state.enumNames)
        }
    }

    /**
     * Common method to update the enums of checkbox and radiobutton
     * @param {Array} newEnums - updated enum values
     * @param {CallableFunction} createItemCallback - function to create options
     */
    updateEnumForRadioButtonAndCheckbox(newEnums, createItemCallback) {
        let currentEnumSize = this.getWidget().length;
        if(currentEnumSize === 0) {         // case 1: create option with new enums
            newEnums.forEach(value => {
                this.getWidgets().appendChild(createItemCallback.call(this, value, value));
            });
        } else if(currentEnumSize === newEnums.length) {    // case 2: replace existing enums
            this.widget.forEach((input, index) => {
                input.value = newEnums[index];
            })
        } else if(currentEnumSize < newEnums.length) {  // case 3: replace existing enums and create options with remaining
            this.widget.forEach((input, index) => {
                input.value = newEnums[index];
            })

            newEnums.forEach((value, index) => {
                if(index > currentEnumSize - 1) {
                    this.getWidgets().appendChild(createItemCallback.call(this, value, value));
                }
            });
        } else {
            this.widget.forEach((input, index) => {  // case 4: replace existing enums and remove extra ones
                if(index < newEnums.length){
                    input.value = newEnums[index];
                } else {
                    let optionToRemove = input.parentElement.parentElement;
                    this.getWidgets().removeChild(optionToRemove);
                }
            })
        }
    }

    /**
     * Common method to update the enums Names of checkbox and radiobutton
     * @param {Array} newEnumsNames - updated enum Names values
     * @param {CallableFunction} createItemCallback - function to create options
     */
    updateEnumNamesForRadioButtonAndCheckbox(newEnumNames, createItemCallback) {
        let currentEnumNameSize = this.getWidget().length;
        if(currentEnumNameSize === 0) {
            newEnumNames.forEach((value) => {
                this.getWidgets().appendChild(createItemCallback.call(this, value, value));
            })
        } else if(currentEnumNameSize > newEnumNames.length) {
            [...this.getOptions()].forEach((option, index) => {
                let span = option.querySelector('span');
                let input = option.querySelector('input');
                let valueToSet = index < newEnumNames.length ? newEnumNames[index] : input.value;
                let purifiedValue = window.DOMPurify ?  window.DOMPurify.sanitize(valueToSet) : valueToSet;
                span.innerHTML = purifiedValue;
                let richScreenReaderText = `${this._model.label.value}:  ${purifiedValue}`;
                let plainScreenReaderText = window.DOMPurify ? window.DOMPurify.sanitize(richScreenReaderText, { ALLOWED_TAGS: [] }) : richScreenReaderText;
                if (input.hasAttribute("aria-label")) {
                    input.setAttribute("aria-label", plainScreenReaderText);
                }
            });
        } else {
            [...this.getOptions()].forEach((option, index) => {
                let span = option.querySelector('span');
                let input = option.querySelector('input');
                let purifiedValue = window.DOMPurify ?  window.DOMPurify.sanitize(newEnumNames[index]) : newEnumNames[index];
                if(span) {
                    span.innerHTML = purifiedValue;
                }
                if (input && input.hasAttribute("aria-label")) {
                    let richScreenReaderText = `${this._model.label.value}:  ${purifiedValue}`;
                    let plainScreenReaderText = window.DOMPurify ? window.DOMPurify.sanitize(richScreenReaderText, { ALLOWED_TAGS: [] }) : richScreenReaderText;
                    input.setAttribute("aria-label", plainScreenReaderText);
                }
            });
        }
    }

}

export default FormOptionFieldBase;
