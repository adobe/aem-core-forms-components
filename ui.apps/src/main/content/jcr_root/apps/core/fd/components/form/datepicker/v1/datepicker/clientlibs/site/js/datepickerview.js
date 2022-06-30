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
(function() {

    "use strict";
    class DatePicker extends FormView.FormField {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormDatePicker";
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            dateElement: "input[type=date]"
        };

        constructor(params) {
            super(params);
        }

        getClass() {
            return DatePicker.IS;
        }

        getTagName() {
            return "input";
        }

        setValue(value) {
            let dateInput = this.element.querySelector(DatePicker.selectors.dateElement);
            dateInput.value = value;
        }
    }

    function onFormContainerInitialised(e) {
        console.log("FormContainerInitialised Received", e.detail);
        let formContainer =  e.detail;
        let fieldElements = document.querySelectorAll(DatePicker.selectors.self);
        for (let i = 0; i < fieldElements.length; i++) {
            let datePickerField = new DatePicker({element: fieldElements[i]});
            formContainer.addField(datePickerField);
        }
        FormView.Utils.registerMutationObserver(DatePicker);
    }
    document.addEventListener(FormView.Constants.FORM_CONTAINER_INITIALISED, onFormContainerInitialised);
})();
