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
(function(document) {

    "use strict";
     class Image extends FormView.FormFieldBase {

            static NS = FormView.Constants.NS;
            static IS = "adaptiveFormImage";
            static bemBlock = 'cmp-image';

            static selectors  = {
                self: "[data-" + this.NS + '-is="' + this.IS + '"]'
            };

            constructor(params) {
                super(params);
            }

            getClass() {
                return Image.IS;
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

            setFocus() {
                this.setActive();
            }
        }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Image({element, formContainer})
    }, Image.selectors.self);
})();
