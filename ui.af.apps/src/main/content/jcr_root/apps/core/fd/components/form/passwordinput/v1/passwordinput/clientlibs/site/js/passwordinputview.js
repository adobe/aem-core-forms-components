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
    class PasswordInput extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormPasswordInput";
        static bemBlock = 'cmp-adaptiveform-passwordinput'
        static selectors  = {
            self: `[data-${this.NS}-is="${this.IS}"]`,
            widget: `.${PasswordInput.bemBlock}__widget`,
            label: `.${PasswordInput.bemBlock}__label`,
            description: `.${PasswordInput.bemBlock}__longdescription`,
            qm: `.${PasswordInput.bemBlock}__questionmark`,
            errorDiv: `.${PasswordInput.bemBlock}__errormessage`,
            tooltipDiv: `.${PasswordInput.bemBlock}__shortdescription`,
            showPasswordButton: `.${PasswordInput.bemBlock}__showpassword` // Selector for the show password button
        };

        constructor(params) {
            super(params);
            this.showPassword = false; // State to track visibility of password
        }

        getWidget() {
            return this.element.querySelector(PasswordInput.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(PasswordInput.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(PasswordInput.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(PasswordInput.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(PasswordInput.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(PasswordInput.selectors.qm);
        }

        getShowPasswordButton() {
            return this.element.querySelector(PasswordInput.selectors.showPasswordButton);
        }

        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
            this.getWidget().type = this.showPassword ? 'text' : 'password';
            this.getShowPasswordButton().setAttribute('aria-pressed', this.showPassword.toString());
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
            this.getShowPasswordButton().addEventListener('click', (e) => {
                this.togglePasswordVisibility();
            });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new PasswordInput({element, formContainer})
    }, PasswordInput.selectors.self);

})();
