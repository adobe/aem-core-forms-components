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
(function() {

    "use strict";
    class NumberStepper extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormNumberStepper";
        static bemBlock = 'cmp-adaptiveform-numberstepper';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${NumberStepper.bemBlock}__widget`,
            label: `.${NumberStepper.bemBlock}__label`,
            description: `.${NumberStepper.bemBlock}__longdescription`,
            errorDiv: `.${NumberStepper.bemBlock}__errormessage`,
            qm: `.${NumberStepper.bemBlock}__questionmark`,
            tooltipDiv: `.${NumberStepper.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
        }

        getClass() {
            return NumberStepper.IS;
        }

        getWidget() {
            return this.element.querySelector(NumberStepper.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(NumberStepper.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(NumberStepper.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(NumberStepper.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(NumberStepper.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(NumberStepper.selectors.qm);
        }

        initializeWidget() {
            this.widgetObject = new NumericInputWidget(this.getWidget(), this._model);
            this.getWidget().addEventListener('blur', (e) => {
                if(this.element) {
                    this.setInactive();
                }
            });
        }

        updateValue(value) {
            if (this.widgetObject == null && (this._model._jsonModel.editFormat || this._model._jsonModel.displayFormat || FormView.Utils.isUserAgent('safari'))) {
                this.initializeWidget();
            }
            if (this.widgetObject) {
                this.widgetObject.setValue(value);
                super.updateEmptyStatus();
            } else {
                super.updateValue(value);
            }
        }

        setModel(model) {
            super.setModel(model);
            // only initialize if patterns are set
            if (this._model._jsonModel.editFormat || this._model._jsonModel.displayFormat
                || this._model._jsonModel.type === 'integer' || FormView.Utils.isUserAgent('safari')) {
                if (this.widgetObject == null) {
                    this.initializeWidget();
                }
            } else {
                if (this.widget.value !== '') {
                    this._model.value = this.widget.value;
                }
                this.getWidget().addEventListener('blur', (e) => {
                    this._model.value = e.target.value;
                    if(this.element) {
                        this.setInactive();
                    }
                });
            }
            this.getWidget().addEventListener('focus', (e) => {
                if (this.element) {
                    this.setActive();
                }
            });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new NumberStepper({element,formContainer})
    }, NumberStepper.selectors.self);
})();
