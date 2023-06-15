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
    class CheckBox extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormCheckBox";
        static bemBlock = 'cmp-adaptiveform-checkbox'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${CheckBox.bemBlock}__widget`,
            widgetLabel: `.${CheckBox.bemBlock}__label`,
            label: `.${CheckBox.bemBlock}__label`,
            description: `.${CheckBox.bemBlock}__longdescription`,
            qm: `.${CheckBox.bemBlock}__questionmark`,
            errorDiv: `.${CheckBox.bemBlock}__errormessage`,
            tooltipDiv: `.${CheckBox.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
            this.qm = this.element.querySelector(CheckBox.selectors.qm)
            this.widgetLabel = this.element.querySelector(CheckBox.selectors.widgetLabel)
        }

        getWidget() {
            return this.element.querySelector(CheckBox.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(CheckBox.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(CheckBox.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(CheckBox.selectors.errorDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(CheckBox.selectors.qm);
        }

        getTooltipDiv() {
            return this.element.querySelector(CheckBox.selectors.tooltipDiv);
        }

        setModel(model) {
            super.setModel(model);
            this._onValue = this._model._jsonModel.enum[0];
            this._offValue = this._model._jsonModel.enum[1];
            this._model.value = this.widget.value;
            this.widget.addEventListener('change', (e) => {
                if (this.widget.checked) {
                    console.log('setting the value to ')
                    this._model.value = this._onValue;
                } else {
                    this._model.value = this._offValue;
                }
            })

        }

        updateValue(modelValue) {
            if (modelValue === this._model._jsonModel.enum[0]) {
                this.widget.checked = true
                this.widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.HTML_ATTRS.CHECKED)
                this.widget.setAttribute(FormView.Constants.ARIA_CHECKED, true)
            } else {
                this.widget.checked = false
                this.widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
                this.widget.setAttribute(FormView.Constants.ARIA_CHECKED, false);
            }
        }
    }
    FormView.Utils.setupField(({element, formContainer}) => {
        return new CheckBox({element, formContainer})
    }, CheckBox.selectors.self);

})();
