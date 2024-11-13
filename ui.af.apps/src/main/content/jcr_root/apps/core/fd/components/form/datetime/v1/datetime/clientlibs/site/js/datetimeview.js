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
    class Datetime extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormDatetime";
        static bemBlock = 'cmp-adaptiveform-datetime'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${Datetime.bemBlock}__widget`,
            label: `.${Datetime.bemBlock}__label`,
            description: `.${Datetime.bemBlock}__longdescription`,
            qm: `.${Datetime.bemBlock}__questionmark`,
            errorDiv: `.${Datetime.bemBlock}__errormessage`,
            tooltipDiv: `.${Datetime.bemBlock}__shortdescription`,
            eyeIcon: `.${Datetime.bemBlock}__eyeicon`
        };

        constructor(params) {
            super(params);
        }

        getWidget() {
            return this.element.querySelector(Datetime.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(Datetime.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(Datetime.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(Datetime.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(Datetime.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Datetime.selectors.qm);
        }

        setModel(model) {
            super.setModel(model);
            if (this.widget.value !== '') {
                this._model.value = this.widget.value;
            }
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
        return new Datetime({element, formContainer})
    }, Datetime.selectors.self);

})();
