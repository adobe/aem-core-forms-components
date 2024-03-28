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
import {Constants} from "../constants.js";

/**
 * Class containing common view code for dropdown, checkboxgroup and radiobutton
 * @extends module:FormView~FormOptionFieldBase
 */
class FormOptionFieldBase extends FormFieldBase {
    constructor(params) {
        super(params);
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

    updateValidityForRadioButtonAndCheckbox(validity) {
        const valid = validity.valid;
            let widgets = this.widget;
            widgets.forEach(widget => {
                if (valid) {
                     widget.setAttribute(Constants.ARIA_INVALID, !valid);
                } else {
                    widget.setAttribute(Constants.ARIA_INVALID, 'true');
                }
            });
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
                if(index < newEnumNames.length) {
                    span.textContent = newEnumNames[index];
                } else {
                    span.textContent = input.value;
                }
            });
        } else {
            [...this.getOptions()].forEach((option, index) => {
                let span = option.querySelector('span');
                span.textContent = newEnumNames[index];
            });
        }
    }

}

export default FormOptionFieldBase;