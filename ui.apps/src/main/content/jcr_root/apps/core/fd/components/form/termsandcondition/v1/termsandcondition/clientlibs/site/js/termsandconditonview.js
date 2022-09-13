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
    class TermsAndConditon extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormTermsAndConditon";
        static bemBlock = 'cmp-adaptiveform-termsandcondition'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            textinput: `.${TermsAndConditon.bemBlock}__textinput`,
            label: `.${TermsAndConditon.bemBlock}__label`,
            checkbox: `.${TermsAndConditon.bemBlock}__checkbox`
        };

        constructor(params) {
            super(params);
            //this.qm = this.element.querySelector(TermsAndConditon.selectors.qm)
        }

        getWidget() {
            return this.element.querySelector(TermsAndConditon.selectors.textinput);
        }

        getLabel() {
            return this.element.querySelector(TermsAndConditon.selectors.label);
        }


        setModel(model) {
           
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new TermsAndConditon ({element})
    }, TermsAndConditon.selectors.self);

})();
