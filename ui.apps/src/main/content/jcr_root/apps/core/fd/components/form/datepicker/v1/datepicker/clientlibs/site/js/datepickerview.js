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
        static VALID = FormView.Constants.VALID;
        static ENABLED = FormView.Constants.ENABLED;
        static VISIBLE = FormView.Constants.VISIBLE;
        static ACTIVE = FormView.Constants.ACTIVE;
        static ARIA_DISABLED = FormView.Constants.ARIA_DISABLED;
        static ARIA_HIDDEN = FormView.Constants.ARIA_HIDDEN;
        static ARIA_INVALID = FormView.Constants.ARIA_INVALID;

        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            dateElement: "input[type=date]"
        };

         static setters = {
            valid : function (element, value) {
                        if (value == true) {
                            element.setAttribute(DatePicker.VALID, true);
                            element.setAttribute(DatePicker.ARIA_INVALID, false);
                        } else if (value == false) {
                            element.setAttribute(DatePicker.VALID, false);
                            element.setAttribute(DatePicker.ARIA_INVALID, true);
                            DatePicker.setters.value(element, null);
                        }
                      },
            enabled : function (element, value) {
                        if (value == true) {
                            element.setAttribute(DatePicker.ENABLED, true);
                            element.setAttribute(DatePicker.ARIA_DISABLED, false);
                        } else if (value == false) {
                            element.setAttribute(DatePicker.ENABLED, false);
                            element.setAttribute(DatePicker.ARIA_DISABLED, true);
                        }
                       },
            visible : function (element, value) {
                        if (value == true) {
                            element.setAttribute(DatePicker.VISIBLE, true);
                            element.setAttribute(DatePicker.ARIA_HIDDEN, false);
                        } else if (value == false) {
                            element.setAttribute(DatePicker.VISIBLE, false);
                            element.setAttribute(DatePicker.ARIA_HIDDEN, true);
                        }
                       },
             value : function (element, value) {
                         let dateInput = element.querySelector(DatePicker.selectors.dateElement);
                         dateInput.value = value;
                     }
        }

        constructor(params) {
            super(params);
        }

        bindEventListeners() {
            super.bindEventListeners();
            let dateInput = this.element.querySelector(DatePicker.selectors.dateElement);
            dateInput.addEventListener('focus', (event) => {
                    this.setActive();
                    if (this.parentView && this.parentView.setActive) {
                        this.parentView.setActive();
                    }
                });
            dateInput.addEventListener('blur', (event) => {
                    this.setInactive();
                    if (this.parentView && this.parentView.setInactive) {
                        this.parentView.setInactive();
                    }
                });
        }

        getClass() {
            return DatePicker.IS;
        }

        // Set of functions that impact accessibility and appearance
        setFocus() {
            let el = this.element.getElementsByTagName(this.getTagName());
            if (el && el.length > 0) {
                el[0].focus();
            }
        }

        setActive() {
            this.element.setAttribute(DatePicker.ACTIVE, true);
        }

        setInactive() {
            this.element.setAttribute(DatePicker.ACTIVE, false);
        }


        setState(state) {
            //Explicit checks for true and false, to prevent tampering the initial state
            for (const prop in Object.keys(DatePicker.setters)) {
                if (prop in state) {
                    DatePicker.setters[prop](this.element, state[prop])
                }
            }
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
