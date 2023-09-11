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
(function() {

    "use strict";
    class Switch extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormSwitch";
        static bemBlock = 'cmp-adaptiveform-switch';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${Switch.bemBlock}__widget`,
            label: `.${Switch.bemBlock}__label`,
            description: `.${Switch.bemBlock}__longdescription`,
            errorDiv: `.${Switch.bemBlock}__errormessage`,
            qm: `.${Switch.bemBlock}__questionmark`,
            tooltipDiv: `.${Switch.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
        }

        getClass() {
            return Switch.IS;
        }

        getWidget() {
            return this.element.querySelector(Switch.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(Switch.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(Switch.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(Switch.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(Switch.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Switch.selectors.qm);
        }

        initializeWidget() {
            this.widgetObject = new SwitchWidget(this.getWidget(), this._model);
            this.getWidget().addEventListener('blur', (e) => {
                if(this.element) {
                    this.setActive(this.element, false);
                }
            });
        }

        updateValue(modelValue) {
            if (modelValue === this._model._jsonModel.enum[0]) {
                this.widget.checked = true
                this.widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.HTML_ATTRS.CHECKED)
                this.widget.setAttribute(FormView.Constants.ARIA_CHECKED, true);
            } else {
                this.widget.checked = false
                this.widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
                this.widget.setAttribute(FormView.Constants.ARIA_CHECKED, false);
            }
            this.widget.value = modelValue;
        }

        setModel(model) {
            super.setModel(model);
            this._onValue = this._model._jsonModel.enum[0];
            this._offValue = this._model._jsonModel.enum[1];
            this.widget.addEventListener('change', (e) => {
                if (this.widget.checked) {
                    this._model.value = this._onValue;
                } else {
                    this._model.value = this._offValue;
                }
            })

        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Switch({element,formContainer})
    }, Switch.selectors.self);
})();
