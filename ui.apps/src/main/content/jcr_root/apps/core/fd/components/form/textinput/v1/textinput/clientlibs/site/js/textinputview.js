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
    class TextInput extends FormView.FormField {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormTextInput";
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            textElement: ".cmp-adaptiveform-textinput__widget"
        };

        constructor(params) {
            super(params);
        }

        getClass() {
            return TextInput.IS;
        }

        setValue(value) {
            let textInput = this.element.querySelector(TextInput.selectors.textElement);
            textInput.value = value;
        }
    }

    function onFormContainerInitialised(e) {
        console.log("FormContainerInitialised Received", e.detail);
        let formContainer =  e.detail;
        let fieldElements = document.querySelectorAll(TextInput.selectors.self);
        for (let i = 0; i < fieldElements.length; i++) {
            let textInputField = new TextInput({element: fieldElements[i]});
            formContainer.addField(textInputField);
        }
        FormView.Utils.registerMutationObserver(TextInput);
    }
    document.addEventListener(FormView.Constants.FORM_CONTAINER_INITIALISED, onFormContainerInitialised);
})();
