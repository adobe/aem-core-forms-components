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
    class Password extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormPassword";
        static bemBlock = 'cmp-adaptiveform-password'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${Password.bemBlock}__widget`,
            label: `.${Password.bemBlock}__label`,
            description: `.${Password.bemBlock}__longdescription`,
            qm: `.${Password.bemBlock}__questionmark`,
            errorDiv: `.${Password.bemBlock}__errormessage`,
            tooltipDiv: `.${Password.bemBlock}__shortdescription`,
            eyeIcon: `.${Password.bemBlock}__eyeicon`
        };

        constructor(params) {
            super(params);
        }

        getWidget() {
            return this.element.querySelector(Password.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(Password.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(Password.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(Password.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(Password.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Password.selectors.qm);
        }

        getEyeIcon(){
            return this.element.querySelector(Password.selectors.eyeIcon);
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
            this.getEyeIcon().addEventListener('click', (e) => {
                this.#togglePasswordType();
            });
        }

        #togglePasswordType(){
            const widget = this.getWidget();
            if(widget.value){
                const widget = this.getWidget();
                if (widget.type === FormView.Constants.HTML_INPUT_TYPE_PASSWORD) {
                    widget.type = FormView.Constants.HTML_INPUT_TYPE_TEXT;
                    } else {
                     widget.type = FormView.Constants.HTML_INPUT_TYPE_PASSWORD;
                    }
                }            
        }       
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Password({element, formContainer})
    }, Password.selectors.self);

})();
