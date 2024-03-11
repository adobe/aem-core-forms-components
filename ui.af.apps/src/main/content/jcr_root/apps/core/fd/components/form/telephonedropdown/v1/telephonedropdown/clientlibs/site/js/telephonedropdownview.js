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
            if (this.widget.value !== '') {
                this._model.value = this.getCountryCodeSelect().value + this.widget.value;
            }
            this.widget.addEventListener('blur', (e) => {
                this.setInactive();
            });
            this.widget.addEventListener('focus', (e) => {
                this.setActive();
            });

            var countryCodes = [];

            function populateCountryCodes() {
                var selectElement = document.querySelector(TelephoneDropdown.selectors.countryCode);
                var optionElements = selectElement.querySelectorAll('option');
                for (var i = 0; i < optionElements.length; i++) {
                    var countryCode = optionElements[i].value;
                    countryCodes.push(countryCode);
                }
            }

            if (document.readyState === 'loading') {  // Loading hasn't finished yet
                document.addEventListener('DOMContentLoaded', populateCountryCodes);
            } else {  // `DOMContentLoaded` has already fired
                populateCountryCodes();
            }

            function parsePhoneNumber(phoneNumber) {
                // Find the country code and the rest of the phone number
                let countryCode = '';
                let number = phoneNumber;
                for(var i = 0; i < countryCodes.length; i++){
                    let code = countryCodes[i];
                    if (phoneNumber.startsWith(code)) {
                        countryCode = code;
                        number = phoneNumber.slice(code.length);
                        break;
                    }
                }
                return {countryCode, number };
            }

            this.getPhoneNumber().addEventListener('change', (e) => {
                let countryCode = this.getCountryCodeSelect().value;
                this._model.value = countryCode + e.target.value;
                e.target.value = parsePhoneNumber(e.target.value).number;
                this.getCountryCodeSelect().value = countryCode;
            });

            this.getCountryCodeSelect().addEventListener('change', (e) => {
                let phoneNumber = this.getPhoneNumber().value;
                this._model.value = e.target.value + phoneNumber;
                this.getPhoneNumber().value = parsePhoneNumber(this._model.value).number;
                e.target.value = parsePhoneNumber(this._model.value).countryCode;
            });


        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new TelephoneDropdown({element, formContainer})
    }, TelephoneDropdown.selectors.self);

})();