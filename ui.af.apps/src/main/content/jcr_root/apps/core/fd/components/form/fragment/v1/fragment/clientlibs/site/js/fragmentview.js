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
    class Fragment extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormFragment";
        static bemBlock = 'cmp-adaptiveform-fragment'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${Fragment.bemBlock}__widget`,
            label: `.${Fragment.bemBlock}__label`,
            description: `.${Fragment.bemBlock}__longdescription`,
            qm: `.${Fragment.bemBlock}__questionmark`,
            errorDiv: `.${Fragment.bemBlock}__errormessage`,
            tooltipDiv: `.${Fragment.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
        }

        getWidget() {
            return this.element.querySelector(Fragment.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(Fragment.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(Fragment.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(Fragment.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(Fragment.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Fragment.selectors.qm);
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Fragment({element, formContainer})
    }, Fragment.selectors.self);

})();
