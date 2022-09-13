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

    class Footer extends FormView.FormFieldBase {

            static NS = FormView.Constants.NS;
            static IS = "adaptiveFormFooter";
            static bemBlock = 'cmp-adaptiveform-footer';

            static selectors  = {
                self: "[data-" + this.NS + '-is="' + this.IS + '"]',
                widget: `.${Footer.bemBlock}__widget`
            };

            constructor(params) {
                super(params);
            }

           getWidget() {
                return this.element.querySelector(Footer.selectors.widget);
           }

            getClass() {
                return Footer.IS;
            }

            setFocus() {
                this.setActive();
            }
        }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Footer({element, formContainer})
    }, Footer.selectors.self);
})();
