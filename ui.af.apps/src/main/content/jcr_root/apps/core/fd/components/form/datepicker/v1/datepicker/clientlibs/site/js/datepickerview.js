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

        setModel(model) {
            super.setModel(model);
            this._model.value = this.widget.value;
            this.widget.addEventListener('blur', (e) => {
                this._model.value = e.target.value;
                this.setInactive();
            });
            this.widget.addEventListener('focus', (e) => {
                this.setActive();
            });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new DatePicker({element, formContainer})
    }, DatePicker.selectors.self);
})();
