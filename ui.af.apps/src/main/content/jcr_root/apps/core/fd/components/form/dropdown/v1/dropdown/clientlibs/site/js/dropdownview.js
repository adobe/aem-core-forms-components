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
    class DropDown extends FormView.FormOptionFieldBase {

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
            errorDiv: `.${DropDown.bemBlock}__errormessage`,
            tooltipDiv: `.${DropDown.bemBlock}__shortdescription`
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

        getOptions() {
            return this.element.querySelectorAll(DropDown.selectors.options);
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

        updateEnabled(enabled, state) {
            this.toggle(enabled, FormView.Constants.ARIA_DISABLED, true);
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_ENABLED, enabled);
            let widget = this.widget;
            if (enabled === false) {
                if(state.readOnly === false){
                    widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, "disabled");
                    widget.setAttribute(FormView.Constants.ARIA_DISABLED, true);
                }
            } else if (state.readOnly === false) {
                widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
                widget.removeAttribute(FormView.Constants.ARIA_DISABLED);
            }
        }

        updateReadOnly(readonly) {
            let widget = this.widget;
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_READONLY, readonly);
            if (readonly === true) {
                widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, "disabled");
                widget.setAttribute("aria-readonly", true);
            } else {
                widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
                widget.removeAttribute("aria-readonly");
            }
        }

        updateValue(value) {
            if(value == null) { // if undefined or null, reset the widget
                this.widget.selectedIndex = -1;
                return;
            }
            let isMultiSelect = this._model.isArrayType();
            [...this.widget].forEach((option) => {
                if(this.#checkIfEqual(value, option.value, isMultiSelect)) {
                    option.setAttribute('selected', 'selected');
                } else {
                    option.removeAttribute('selected');
                }
            });
            super.updateEmptyStatus();
        }

        #createDropDownOptions(value, label) {
            const optionTemplate = `<option value="${value}" class="${DropDown.selectors.options.slice(1)}">${label}</option>`;
            const container = document.createElement('div'); // Create a container element to hold the template
            container.innerHTML = optionTemplate;
            return container.firstElementChild; // Return the first child, which is the created option
        }

        #removeAllOptions() {
            while(this.getOptions().length !== 0) {
                this.getWidget().remove(this.getOptions().length) // not removing the blank option
            }
        }

        updateEnum(newEnums) {
            let options = this.getOptions();
            let currentEnumSize = options.length;

            if(currentEnumSize === 0) { // case 1: create option with new enums
                newEnums.forEach(value => {
                    this.getWidget().add(this.#createDropDownOptions(value, value));
                });
            } else if(newEnums.length === 0) {  // case 2: remove all options
                this.#removeAllOptions();
            } else if(currentEnumSize === newEnums.length) { // case 3: replace existing enums
                options.forEach((option, index) => {
                    option.value = newEnums[index];
                });
            } else if(currentEnumSize < newEnums.length) {  // case 4: replace existing enums and create new options with remaining
                options.forEach((option, index) => {
                    option.value = newEnums[index];
                });
                newEnums.forEach((value, index) => {
                    if(index > currentEnumSize - 1) {
                        this.getWidget().add(this.#createDropDownOptions(value, value));
                    }
                });
            } else {
                options.forEach((option, index) => {    // case 5: replace existing enums and remove extra options
                    if(index < newEnums.length) {
                        option.value = newEnums[index];
                    } else {
                        this.getWidget().remove(index + 1); // accounting for the blank option in dropdown
                    }
                });
            }
        }

        updateEnumNames(newEnumNames) {
            let options = this.getOptions();
            let currentEnumNameSize = options.length;
            if(currentEnumNameSize === 0) {  // case 1: Create all dropdown new options
                newEnumNames.forEach((value) => {
                    this.getWidget().add(this.#createDropDownOptions(value, value));
                })
            } else if(currentEnumNameSize > newEnumNames.length) {  // case 2: Replace existing enumNames, remaining enumNames = enums
                newEnumNames.forEach((value, index) => {
                    options[index].text = value;
                });

                options.forEach((option, index) => {
                    if(index >= newEnumNames.length) {
                        option.text = option.value;
                    }
                })
            } else {    // case 3: Replace all existing enumNames
                options.forEach((option, index) => {
                    option.text = newEnumNames[index];
                });
            }
        }

        setModel(model) {
            super.setModel(model);
            if (this.widget.value !== '') {
                this.#updateModelValue(this.widget);
            }
            this.widget.addEventListener('change', (e) => {
                this.#updateModelValue(e.target);
            });
            this.widget.addEventListener('focus', (e) => {
                this.setActive();
            });
            this.widget.addEventListener('blur', (e) => {
                this.setInactive();
            });
        }

        #updateModelValue(widget) {
            if(this._model.isArrayType()) {
                let valueArray = [];
                [...this.widget].forEach((option) => {
                    if(option.selected) {
                        valueArray.push(option.value);
                    }
                });
                if (valueArray.length !== 0 || this._model.value != null) {
                    this._model.value = valueArray;
                }
            } else {
                this._model.value = widget.value;
            }
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new DropDown({element, formContainer})
    }, DropDown.selectors.self);

})();
