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
    class CheckBoxGroup extends FormView.FormOptionFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormCheckBoxGroup";
        static bemBlock = 'cmp-adaptiveform-checkboxgroup'
        static checkboxBemBlock = 'cmp-adaptiveform-checkbox'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widgets: `.${CheckBoxGroup.bemBlock}__widget`,
            widget: `.${CheckBoxGroup.bemBlock}__option__widget`,
            widgetLabel: `.${CheckBoxGroup.bemBlock}__label`,
            label: `.${CheckBoxGroup.bemBlock}__label`,
            description: `.${CheckBoxGroup.bemBlock}__longdescription`,
            qm: `.${CheckBoxGroup.bemBlock}__questionmark`,
            errorDiv: `.${CheckBoxGroup.bemBlock}__errormessage`,
            tooltipDiv: `.${CheckBoxGroup.bemBlock}__shortdescription`,
            item:  `.${CheckBoxGroup.bemBlock}-item`,
            optionLabel: `${CheckBoxGroup.bemBlock}__option-label`,
            optionLink: `${CheckBoxGroup.bemBlock}__links`
        };

        constructor(params) {
            super(params);
            this.qm = this.element.querySelector(CheckBoxGroup.selectors.qm)
            this.widgetLabel = this.element.querySelector(CheckBoxGroup.selectors.widgetLabel)
        }

        getWidgets() {
            return this.element.querySelector(CheckBoxGroup.selectors.widgets);
        }

        getWidget() {
          return this.element.querySelectorAll(CheckBoxGroup.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(CheckBoxGroup.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(CheckBoxGroup.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(CheckBoxGroup.selectors.errorDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(CheckBoxGroup.selectors.qm);
        }

        getTooltipDiv() {
            return this.element.querySelector(CheckBoxGroup.selectors.tooltipDiv);
        }

        getOptions() {
            return this.element.querySelectorAll(CheckBoxGroup.selectors.item);
        }

        #addWidgetListeners(optionWidget) {
            optionWidget.addEventListener('change', (e) => {
                this.#updateModelValue(optionWidget);
            });
            optionWidget.addEventListener('focus', (e) => {
                this.setActive();
            });
            optionWidget.addEventListener('blur', (e) => {
                this.setInactive();
            });
        }

        setModel(model) {
            super.setModel(model);
            this.widget.forEach(optionWidget => {
                this.#addWidgetListeners(optionWidget);
            });
            let optionLinks = this.element.querySelectorAll(`.${CheckBoxGroup.selectors.optionLink}`);
            const actionKeys = ['Enter', ' ', 'Spacebar', 'Space'];
            optionLinks.forEach(optionLink => {
                optionLink.addEventListener('keydown', (e)=>{
                    if(actionKeys.includes(e.key)) {
                        optionLink.click();
                    }
                });
            });
            this.#updateModelValue();
        }

        #updateModelValue() {
            let value = [];
            this.widget.forEach(widget => {
                if (widget.checked) {
                    value.push(widget.value)
                }
            }, this);
            if (value.length !== 0 || this._model.value != null) {
                this.setModelValue(value)
            }
        }

        updateValidity(validity) {
            if(validity.valid === undefined) {
                this.element.removeAttribute(FormView.Constants.DATA_ATTRIBUTE_VALID);
                this.widget.forEach(widget => widget.removeAttribute(FormView.Constants.ARIA_INVALID));
            } else {
                this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_VALID, validity.valid);
                this.widget.forEach(widget => widget.setAttribute(FormView.Constants.ARIA_INVALID, !validity.valid));
            }
        }

        updateValue(modelValue) {
            modelValue = [].concat(modelValue);
            let selectedWidgetValues = modelValue.map(String);
            this.widget.forEach(widget => {
                if (selectedWidgetValues.includes((widget.value))) {
                    widget.checked = true
                    widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.HTML_ATTRS.CHECKED);
                } else {
                    widget.checked = false
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
                }
            }, this)
            super.updateEmptyStatus();
        }

        #createCheckBoxItem(value, itemLabel) {
            // This doesn't cater for optionLink __links as toggelablelink component is hidden
            let richScreenReaderText = `${this._model.label.value}:  ${itemLabel}`;
            let plainScreenReaderText = window.DOMPurify ? window.DOMPurify.sanitize(richScreenReaderText, { ALLOWED_TAGS: [] }) : richScreenReaderText;
            const optionTemplate = `
            <div class="${CheckBoxGroup.selectors.item.slice(1)}">
                <label class="${CheckBoxGroup.selectors.optionLabel}">
                    <input type="checkbox" class="${CheckBoxGroup.selectors.widget.slice(1)}" name="${this._model.name}" value="${value}" tabindex="0">
                    <span>${itemLabel}</span>
                </label>
            </div>`;

            const container = document.createElement('div'); // Create a container element to hold the template
            container.innerHTML = optionTemplate;
            let addedOptionWidget = container.querySelector(CheckBoxGroup.selectors.widget);
            if(this._model.readOnly === true || this._model.enabled === false) {
                addedOptionWidget.setAttribute("disabled", true);
                if(this._model.readOnly === true) {
                    addedOptionWidget.setAttribute("aria-readonly", true);
                }
            }
            this.#addWidgetListeners(addedOptionWidget);
            return container.firstElementChild; // Return the first child, which is the created option
        }
        updateEnum(newEnums) {
            super.updateEnumForRadioButtonAndCheckbox(newEnums, this.#createCheckBoxItem);
            // refresh the widget references, to dynamically added options
            this.widget = this.getWidget();
        }

        updateEnumNames(newEnumNames) {
            super.updateEnumNamesForRadioButtonAndCheckbox(newEnumNames, this.#createCheckBoxItem);
            // refresh the widget references, to dynamically added options
            this.widget = this.getWidget();
        }

        updateEnabled(enabled, state) {
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_ENABLED, enabled);
            let widgets = this.widget;
            widgets.forEach(widget => {
                if (enabled === false) {
                    if(state.readOnly === false){
                        widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, "disabled");
                    }
                } else if (state.readOnly === false) {
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
                }
            });
        }

        updateReadOnly(readonly) {
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
        updateRequired(required, state) {
            if (this.widget) {
                this.element.toggleAttribute("required", required);
                this.element.setAttribute("data-cmp-required", required);
            }
        }

        syncMarkupWithModel() {
            super.syncMarkupWithModel();
            this.updateEnum(this._model.enum);
            this.updateEnumNames(this._model.enumNames);
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new CheckBoxGroup({element, formContainer})
    }, CheckBoxGroup.selectors.self);

})();
