/*******************************************************************************
 * Copyright 2026 Adobe
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
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${PasswordInput.bemBlock}__widget`,
            toggle: `[data-cmp-hook-adaptiveformpasswordinput="toggleVisibility"]`,
            label: `.${PasswordInput.bemBlock}__label`,
            description: `.${PasswordInput.bemBlock}__longdescription`,
            qm: `.${PasswordInput.bemBlock}__questionmark`,
            errorDiv: `.${PasswordInput.bemBlock}__errormessage`,
            tooltipDiv: `.${PasswordInput.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
            this.#setupVisibilityToggle();
        }

        getWidget() {
            return this.element.querySelector(PasswordInput.selectors.widget);
        }

        getToggleButton() {
            return this.element.querySelector(PasswordInput.selectors.toggle);
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

        /**
         * Wires the eye button so it toggles the widget between masked (type=password) and
         * revealed (type=text). No-op when the button is absent, i.e. the toggle was disabled
         * by the author (showHidePassword=false), so the field stays masked with no control.
         */
        #setupVisibilityToggle() {
            const toggle = this.getToggleButton();
            const widget = this.getWidget();
            if (!toggle || !widget) {
                return;
            }
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                const reveal = widget.getAttribute('type') === 'password';
                widget.setAttribute('type', reveal ? 'text' : 'password');
                toggle.setAttribute('aria-pressed', reveal ? 'true' : 'false');
                const key = reveal ? 'hidePassword' : 'showPassword';
                const fallback = reveal ? 'Hide password' : 'Show password';
                const label = FormView.LanguageUtils.getTranslatedString(this.lang, key) || fallback;
                toggle.setAttribute('aria-label', label);
                toggle.setAttribute('title', label);
            });
        }

        setModel(model) {
            super.setModel(model);
            this.lang = model.lang;
            if (this.widget.value !== '') {
                this.setModelValue(this.widget.value);
            }
            this.widget.addEventListener('blur', (e) => {
                this.setModelValue(e.target.value);
                this.setWidgetValueToDisplayValue();
                this.setInactive();
                this.triggerExit();
            });
            this.widget.addEventListener('focus', (e) => {
                this.setActive();
                this.setWidgetValueToModelValue();
                this.triggerEnter();
            });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new PasswordInput({element, formContainer})
    }, PasswordInput.selectors.self);

})();
