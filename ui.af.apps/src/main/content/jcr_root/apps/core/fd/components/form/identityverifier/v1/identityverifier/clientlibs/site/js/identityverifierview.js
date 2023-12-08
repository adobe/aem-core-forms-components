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
    class IdentityVerifier extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormIdentityVerifier";
        static bemBlock = 'cmp-adaptiveform-identityverifier'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${IdentityVerifier.bemBlock}__widget`,
            firstname: `.${IdentityVerifier.bemBlock}_firstname`,
            lastname: `.${IdentityVerifier.bemBlock}_lastname`,
            phone: `.${IdentityVerifier.bemBlock}_phone`,
            zipcode: `.${IdentityVerifier.bemBlock}_zip`,
            address: `.${IdentityVerifier.bemBlock}_address`,
            ssn: `.${IdentityVerifier.bemBlock}_ssn`,
            aadhar: `.${IdentityVerifier.bemBlock}_aadhar`,
            city: `.${IdentityVerifier.bemBlock}_city`,
            submit: `.${IdentityVerifier.bemBlock}_submit`,
            identityprovider: `.${IdentityVerifier.bemBlock}_identityprovider`,
            otpcontainer: `.${IdentityVerifier.bemBlock}_otpcontainer`,
            verfiedcontainer: `.${IdentityVerifier.bemBlock}_verifiedcontainer`,
            otp: `.${IdentityVerifier.bemBlock}_otp`,
            verifyotp: `.${IdentityVerifier.bemBlock}_verifyotp`,
            requiredtext: `.${IdentityVerifier.bemBlock}_required`,
            invalidtext: `.${IdentityVerifier.bemBlock}_invalididentity`,
            invalidotp: `.${IdentityVerifier.bemBlock}_invalidotp`, 
        };

        constructor(params) {
            super(params);
        }

        getIdentityVerifierElements() {
            return {
                firstName: this.element.querySelector(IdentityVerifier.selectors.firstname),
                lastName: this.element.querySelector(IdentityVerifier.selectors.lastname),
                zipCode: this.element.querySelector(IdentityVerifier.selectors.zipcode),
                address: this.element.querySelector(IdentityVerifier.selectors.address),
                phone: this.element.querySelector(IdentityVerifier.selectors.phone),
                city: this.element.querySelector(IdentityVerifier.selectors.city),
                ssn: this.element.querySelector(IdentityVerifier.selectors.ssn),
                aadhar: this.element.querySelector(IdentityVerifier.selectors.aadhar),
                submit: this.element.querySelector(IdentityVerifier.selectors.submit),
                identityProvider: this.element.querySelector(IdentityVerifier.selectors.identityprovider),
                otpContainer: this.element.querySelector(IdentityVerifier.selectors.otpcontainer),
                verifiedContainer: this.element.querySelector(IdentityVerifier.selectors.verfiedcontainer),
                otp: this.element.querySelector(IdentityVerifier.selectors.otp),
                verifyOTP: this.element.querySelector(IdentityVerifier.selectors.verifyotp),
                requiredText: this.element.querySelector(IdentityVerifier.selectors.requiredtext),
                invalidText: this.element.querySelector(IdentityVerifier.selectors.invalidtext),
                invalidOTP: this.element.querySelector(IdentityVerifier.selectors.invalidotp),
            }
        }

        getWidget() {
            return this.element;
        }
        getDescription() {
            // return this.element.querySelector(IdentityVerifier.selectors.description);
        }

        getLabel() {
            // return this.element.querySelector(IdentityVerifier.selectors.label);
        }

        getErrorDiv() {
            // return this.element.querySelector(IdentityVerifier.selectors.errorDiv);
        }

        getTooltipDiv() {
            // return this.element.querySelector(IdentityVerifier.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            // return this.element.querySelector(IdentityVerifier.selectors.qm);
        }

        setModel(model) {
            super.setModel(model);
            if (this.widgetObject == null) {
                this.widgetObject = new IdentityVerifierWidget(this.getWidget(), this.getIdentityVerifierElements())
            }
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new IdentityVerifier({element, formContainer})
    }, IdentityVerifier.selectors.self);

})();
