/*******************************************************************************
 * Copyright 2024 Adobe
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
import {parse , formatDate} from "@aemforms/af-formatters";

/**
 * Class representing Date picker.
 * @extends module:FormView~FormDatePicker
 */
class FormDatePicker extends FormFieldBase {

    constructor(params) {
        super(params);
    }

    updateFormattedDate(value){
        this._model.value = this.formatDate(value);
    }

    formatDate(value) {
        if(!value || value.trim() === '') {
            return '';
        }
        let editFormat = this._model.editFormat;
        if(editFormat === 'date|short') {
            editFormat = 'date|yyyy/mm/dd';
        }
        let currDate = parse(value.toString(), this._model.locale, editFormat, null, false);
        if (currDate && !isNaN(currDate) && value != null) {
            this.selectedMonth = currDate.getMonth();
            this.selectedYear = currDate.getFullYear();
            this.selectedDay = currDate.getDate();
            return this.selectedYear + "-" + (this.selectedMonth + 1) +"-"+ this.selectedDay + "";
        } else return value;
    }
}

export default FormDatePicker;