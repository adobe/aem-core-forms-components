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
    class RadioButton extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormRadioButton";
        static bemBlock = 'cmp-adaptiveform-radiobutton';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widgets: `.${RadioButton.bemBlock}__widget`,
            widget: `.${RadioButton.bemBlock}__option__widget`,
            label: `.${RadioButton.bemBlock}__label`,
            description: `.${RadioButton.bemBlock}__longdescription`,
            qm: `.${RadioButton.bemBlock}__questionmark`,
            errorDiv: `.${RadioButton.bemBlock}__errormessage`,
            tooltipDiv: `.${RadioButton.bemBlock}__shortdescription`,
            option: `.${RadioButton.bemBlock}__option`,
            optionLabel: `.${RadioButton.bemBlock}__option-label`
        };

        constructor(params) {
            super(params);
            this.qm = this.element.querySelector(RadioButton.selectors.qm);
        }

        getWidgets() {
            return this.element.querySelector(RadioButton.selectors.widgets);
        }

        getWidget() {
          return this.element.querySelectorAll(RadioButton.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(RadioButton.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(RadioButton.selectors.label);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(RadioButton.selectors.qm);
        }

        getTooltipDiv() {
            return this.element.querySelector(RadioButton.selectors.tooltipDiv);
        }

        getErrorDiv() {
            return this.element.querySelector(RadioButton.selectors.errorDiv);
        }

        getOptions() {
            return this.element.querySelectorAll(RadioButton.selectors.option);
        }

        setModel(model) {
            super.setModel(model);
            let widgets = this.widget;
            widgets.forEach(widget => {
                widget.addEventListener('change', (e) => {
                    this._model.value = e.target.value;
                });
            });
        }

        updateEnabled(enabled, state) {
            this.toggle(enabled, FormView.Constants.ARIA_DISABLED, true);
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_ENABLED, enabled);
            let widgets = this.widget;
            widgets.forEach(widget => {
                if (enabled === false) {
                    if(state.readOnly === false){
                        widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, "disabled");
                        widget.setAttribute(FormView.Constants.ARIA_DISABLED, true);
                    }
                } else if (state.readOnly === false) {
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
                    widget.removeAttribute(FormView.Constants.ARIA_DISABLED);
                }
            });
        }

        updateReadOnly(readonly, state) {
            let widgets = this.widget;
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_READONLY, readonly);
            widgets.forEach(widget => {
                if (readonly === true) {
                    widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, "disabled");
                    widget.setAttribute("aria-readonly", true);
                } else {
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
                    widget.removeAttribute("aria-readonly");
                }
            });
        }

        updateValue(modelValue) {
            this.widget.forEach(widget => {
                if (modelValue != null && widget.value != null && (modelValue.toString() == widget.value.toString())) {
                    widget.checked = true;
                    widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.HTML_ATTRS.CHECKED);
                    widget.setAttribute(FormView.Constants.ARIA_CHECKED, true);
                } else {
                    widget.checked = false;
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
                    widget.setAttribute(FormView.Constants.ARIA_CHECKED, false);
                }
            }, this)
            super.updateEmptyStatus();
        }

        #createRadioOption(value, itemLabel) {
            let option = document.createElement('div');
            option.classList.add(RadioButton.selectors.option.slice(1));
            let label = document.createElement('label');
            label.classList.add(RadioButton.selectors.optionLabel.slice(1));

            let input = document.createElement('input');
            input.type = 'radio';
            input.classList.add(RadioButton.selectors.widget.slice(1));
            input.value = value;

            let span = document.createElement('span');
            span.textContent = itemLabel;

            label.appendChild(input);
            label.appendChild(span);
            option.appendChild(label);
            return option;
        }

        updateEnum(newEnums) {
            let currentEnumSize = this.getWidget().length;
            if(currentEnumSize === 0) {         // case 1: create option with new enums
                newEnums.forEach(value => {
                    this.getWidgets().appendChild(this.#createRadioOption(value, value));
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
                        this.getWidgets().appendChild(this.#createRadioOption(value, value));
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

        updateEnumNames(newEnumNames) {
            let currentEnumNameSize = this.getWidget().length;
            if(currentEnumNameSize === 0) {
                newEnumNames.forEach((value) => {
                    this.getWidgets().appendChild(this.#createRadioOption(value, value));
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

    FormView.Utils.setupField(({element, formContainer}) => {
        return new RadioButton({element, formContainer});
    }, RadioButton.selectors.self);

})();
