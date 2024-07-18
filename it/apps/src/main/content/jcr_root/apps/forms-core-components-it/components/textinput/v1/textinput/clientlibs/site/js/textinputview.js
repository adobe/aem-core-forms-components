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
    class CustomTextInput extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormTextInput";
        static bemBlock = 'cmp-adaptiveform-textinput'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${CustomTextInput.bemBlock}__widget`,
            label: `.${CustomTextInput.bemBlock}__label`,
            description: `.${CustomTextInput.bemBlock}__longdescription`,
            qm: `.${CustomTextInput.bemBlock}__questionmark`,
            errorDiv: `.${CustomTextInput.bemBlock}__errormessage`,
            tooltipDiv: `.${CustomTextInput.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
        }

        getWidget() {
            return this.element.querySelector(CustomTextInput.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(CustomTextInput.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(CustomTextInput.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(CustomTextInput.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(CustomTextInput.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(CustomTextInput.selectors.qm);
        }

        setModel(model) {
            super.setModel(model);
            if (this.widget.value !== '') {
                this.setModelValue(this.widget.value)
            }
            this.widget.addEventListener('blur', (e) => {
                this.setModelValue(e.target.value);
                //this._model.value = e.target.value;
                this.setWidgetValueToDisplayValue();
                this.setInactive();
            });
            this.widget.addEventListener('focus', (e) => {
                this.setActive();
                this.setWidgetValueToModelValue();
            });
        }

        updateValidationMessage(validationMessage, state) {
            if (this.formContainer.getModel()?.properties?.enableValidationMessageOnlyOnSubmit === true) {
                super.updateValidationMessage(validationMessage, state);
            }
        }
        subscribe() {
           super.subscribe();
           // add listener for invalid event
            this._model.subscribe((action) => {
                let state = action.target.getState();
                this.updateValidationMessage(this._model.errorMessage, state);
            }, "invalid");
        }
    }


    FormView.Utils.setupField(({element, formContainer}) => {
        return new CustomTextInput({element, formContainer})
    }, CustomTextInput.selectors.self);

})();
