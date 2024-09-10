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

    class Text extends FormView.FormFieldBase {

            static NS = FormView.Constants.NS;
            static IS = "adaptiveFormText";
            static bemBlock = 'cmp-adaptiveform-text';

            static selectors  = {
                self: "[data-" + this.NS + '-is="' + this.IS + '"]'
            };

            constructor(params) {
                super(params);
            }

            getWidget() {
                return null;
            }

            getDescription() {
                return null;
            }

            getLabel() {
                return null;
            }

            getErrorDiv() {
                return null;
            }

            getTooltipDiv() {
                return null;
            }

            getQuestionMarkDiv() {
                return null;
            }

            getClass() {
                return Text.IS;
            }

            setFocus() {
                this.setActive();
                this.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            updateValue(value) {
                // html sets undefined value as undefined string in input value, hence this check is added
                let actualValue = typeof value === "undefined" ? "" :  value;
                const sanitizedValue = window.DOMPurify ? window.DOMPurify.sanitize(actualValue) : actualValue;
                // since there is no widget for textview, the innerHTML is being changed
                if (this.element.children[0]) {
                    this.element.children[0].innerHTML = sanitizedValue;
                } else {
                    this.element.innerHTML = sanitizedValue;
                }
            }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Text({element, formContainer})
    }, Text.selectors.self);
})();
