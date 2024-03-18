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
    class TelephoneDropdown extends FormView.FormFieldBase {
        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormTelephoneDropdown";
        static bemBlock = 'cmp-adaptiveform-telephonedropdown'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${TelephoneDropdown.bemBlock}__widget`,
            label: `.${TelephoneDropdown.bemBlock}__label`,
            description: `.${TelephoneDropdown.bemBlock}__longdescription`,
            qm: `.${TelephoneDropdown.bemBlock}__questionmark`,
            errorDiv: `.${TelephoneDropdown.bemBlock}__errormessage`,
            tooltipDiv: `.${TelephoneDropdown.bemBlock}__shortdescription`,
            countryCode: `.${TelephoneDropdown.bemBlock}__countrycode`
        };

        constructor(params) {
            super(params);
        }

        getWidget() {
            return this.element.querySelector(TelephoneDropdown.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(TelephoneDropdown.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(TelephoneDropdown.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(TelephoneDropdown.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(TelephoneDropdown.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(TelephoneDropdown.selectors.qm);
        }

        getCountryCodeSelect() {
            return this.element.querySelector(TelephoneDropdown.selectors.countryCode);
        }

        getPhoneNumber() {
            return this.element.querySelector(TelephoneDropdown.selectors.widget)
        }

        #parsePhoneNumber(value) {
            // Find the country code and the rest of the phone number
            var  countryCodes = ['+567', '+91'];
            let countryCode = '';
            let number = value;

            if (!number.startsWith('+')) {
                number = '+' + number;
            }

            for (var i = 0; i < countryCodes.length; i++) {
                let code = countryCodes[i];
                if (number.startsWith(code)) {
                    countryCode = code;
                    number = number.slice(code.length);
                    break;
                }
            }
            if (countryCode === '') {
                throw new Error('Country code not found');
            }
            return {countryCode, number};
        }
        updateValue(value) {
            let parsedPhoneNumber;
            let form = document.getElementsByClassName('cmp-adaptiveform-telephonedropdown')[0];
            let oldErrorMessage = form.querySelector('.errormessage');

            if (oldErrorMessage)
                form.removeChild(oldErrorMessage);

            try {
                parsedPhoneNumber = this.#parsePhoneNumber(value);
                this.getPhoneNumber().value = parsedPhoneNumber.number;
                this.getCountryCodeSelect().value = parsedPhoneNumber.countryCode;
            } catch (error) {
                console.error('An error occurred:', error);
                let errorMessage = document.createElement('div');
                errorMessage.textContent = 'Please enter a valid country code in rules';
                errorMessage.className = 'errormessage';
                form.appendChild(errorMessage);
            }
        }

        setModel(model) {
            super.setModel(model);
            if (this.widget.value !== '') {
                this._model.value = this.getCountryCodeSelect().value + this.widget.value;
            }
            this.widget.addEventListener('blur', (e) => {
                this._model.value = this.getCountryCodeSelect().value + this.widget.value;
                this.setInactive();
            });
            this.getCountryCodeSelect().addEventListener('blur', (e) => {
                this._model.value = this.getCountryCodeSelect().value + this.widget.value;
                this.setInactive();
            });
            this.getCountryCodeSelect().addEventListener('focus', (e) => {
                this.setActive();
            });

            this.widget.addEventListener('focus', (e) => {
                this.setActive();
            });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new TelephoneDropdown({element, formContainer})
    }, TelephoneDropdown.selectors.self);

})();