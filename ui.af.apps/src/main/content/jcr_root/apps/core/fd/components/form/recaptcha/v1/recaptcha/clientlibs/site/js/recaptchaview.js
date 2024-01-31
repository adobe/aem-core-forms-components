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
    class Recaptcha extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormRecaptcha";
        static bemBlock = 'cmp-adaptiveform-recaptcha';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${Recaptcha.bemBlock}__widget`,
            label: `.${Recaptcha.bemBlock}__label`,
            errorDiv: `.${Recaptcha.bemBlock}__errormessage`
        };

        constructor(params) {
            super(params);
        }

        getWidget() {
            return this.element.querySelector(Recaptcha.selectors.widget);
        }

        getDescription() {
            return null;
        }

        getLabel() {
            return this.element.querySelector(Recaptcha.selectors.label);
        }

        getTooltipDiv() {
            return null;
        }

        getErrorDiv() {
            return this.element.querySelector(Recaptcha.selectors.errorDiv);
        }

        getQuestionMarkDiv() {
            return null;
        }

    	initializeWidget() {
            this.widgetObject = new RecaptchaWidget(this, this._model, this.getWidget());
            this.getWidget().addEventListener('blur', (e) => {
                if(this.element) {
                    this.setInactive();
                }
            });

        }

        setModel(model) {
            super.setModel(model);
            if (this.widgetObject == null) {
                    this.initializeWidget();
            } else {
                if (this.widget.value !== '') {
                    this._model.value = this.widget.value;
                }
            }
        }
}

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Recaptcha({element, formContainer})
    }, Recaptcha.selectors.self);

})();
