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
    class CheckBox extends FormView.FormCheckBox {

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
    }
    FormView.Utils.setupField(({element, formContainer}) => {
        return new CheckBox({element, formContainer})
    }, CheckBox.selectors.self);

})();
