/*******************************************************************************
 * Copyright 2025 Adobe
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
    class DatePicker extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormDatePicker";
        static bemBlock = 'cmp-adaptiveform-datepicker';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${DatePicker.bemBlock}__widget`,
            label: `.${DatePicker.bemBlock}__label`,
            description: `.${DatePicker.bemBlock}__longdescription`,
            qm: `.${DatePicker.bemBlock}__questionmark`,
            errorDiv: `.${DatePicker.bemBlock}__errormessage`,
            tooltipDiv: `.${DatePicker.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
        }

        getWidget() {
            return this.element.querySelector(DatePicker.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(DatePicker.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(DatePicker.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(DatePicker.selectors.errorDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(DatePicker.selectors.qm);
        }

        getTooltipDiv() {
            return this.element.querySelector(DatePicker.selectors.tooltipDiv);
        }

        updateValue(value) {
            if (this.widgetObject) {
                if (this.isActive()) {
                    // Replacing undefined / null with empty string on reset
                    this.widgetObject.setValue(value || '');
                } else {
                    // Replacing undefined / null with empty string on reset
                    this.widgetObject.setDisplayValue(value || '');
                }
            } else {
                // Replacing undefined / null with empty string on reset
                super.updateValue(value || '');
            }
        }

        updateReadOnly(readOnly, state) {
            super.updateReadOnly(readOnly, state);
            if (this.widgetObject != null) {
                this.widgetObject.markAsReadOnly(readOnly);
            }
        }


        setModel(model) {
            super.setModel(model);
            if (!this.#noFormats()) {
                if (this.widgetObject == null) {
                    this.widgetObject = new DatePickerWidget(this, this.getWidget(), model);
                }
                if (this.isActive()) {
                    this.widgetObject.setValue(model.value);
                } else {
                    this.widgetObject.setDisplayValue(model.value);
                }
                this.widgetObject.addEventListener('blur', (e) => {
                    this.setModelValue(this.widgetObject.getValue())
                    //setDisplayValue is required for cases where value remains same while focussing in and out.
                    this.widgetObject.setDisplayValue(this._model.value);
                    this.widgetObject.setCalendarWidgetValue(this._model.value);
                    this.setInactive();
                    this.triggerExit();
                }, this.getWidget());
                this.widgetObject.addEventListener('focus', (e) => {
                    this.widgetObject.setValue(e.target.value);
                    this.setActive();
                    this.triggerEnter();
                }, this.getWidget());
                this.widgetObject.addEventListener('input', (e) => {
                    if( e.target.value === '') {
                        // clear the value if user manually empties the value in date input box
                        this.setModelValue("");
                    }
                }, this.getWidget());
            } else {
                if (this.widget.value !== '') {
                    this.setModelValue(this.widget.value);
                }
                this.widget.addEventListener('blur', (e) => {
                    this.setModelValue(e.target.value);
                    this.setInactive();
                    this.triggerExit();
                });
                this.widget.addEventListener('focus', (e) => {
                    this.setActive();
                    this.triggerEnter();
                });
            }
        }

        #noFormats() {
            return (this._model.editFormat == null || this._model.editFormat === 'date|short') &&
                (this._model.displayFormat == null || this._model.displayFormat === 'date|short') && (this._model.displayValueExpression == null)
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new DatePicker({element, formContainer})
    }, DatePicker.selectors.self);
})();
