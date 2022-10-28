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
    class DropDown extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormDropDown";
        static bemBlock = 'cmp-adaptiveform-dropdown';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${DropDown.bemBlock}__widget`,
            options: `.${DropDown.bemBlock}__option`,
            label: `.${DropDown.bemBlock}__label`,
            description: `.${DropDown.bemBlock}__longdescription`,
            qm: `.${DropDown.bemBlock}__questionmark`,
            errorDiv: `.${DropDown.bemBlock}__errormessage`
        };

        constructor(params) {
            super(params);
            this.qm = this.element.querySelector(DropDown.selectors.qm);
        }

        getWidget() {
            return this.element.querySelector(DropDown.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(DropDown.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(DropDown.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(DropDown.selectors.errorDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(DropDown.selectors.qm);
        }

        getTooltipDiv() {
            return this.element.querySelector(DropDown.selectors.tooltipDiv);
        }

         #checkIfEqual = function(value, optionValue, multiSelect) {
            if(multiSelect) {
                let isPresent = false;
                value.forEach((saveValue) => {
                    if(String(saveValue) === optionValue)  // save value can be number and boolean also.
                        isPresent = true;
                })
                return isPresent;
            }
            return String(value) === optionValue;
        }

        _updateValue(value) {
            // value is set to null for clearing the dropdown.
            if(value === null) {
                $('option:selected', this.widget).removeAttr('selected');
            }
            let isMultiSelect = this._model.isArrayType();
            [...this.widget].forEach((option) => {
                    if(this.#checkIfEqual(value, option.value, isMultiSelect)) {
                        option.setAttribute('selected', 'selected')
                    } else {
                        option.removeAttribute('selected');
                    }
            });
        }


        setModel(model) {
            super.setModel(model);
            this.widget.addEventListener('blur', (e) => {
                if(this._model.isArrayType()) {
                    let valueArray = [];
                    [...this.widget].forEach((option) => {
                        if(option.selected) {
                            valueArray.push(option.value);
                        }
                    });
                    this._model.value = valueArray;
                } else {
                    this._model.value = e.target.value;
                }
            });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new DropDown({element})
    }, DropDown.selectors.self);

})();
