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
    class FileInput extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormFileInput";
        static bemBlock = 'cmp-adaptiveform-fileinput'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${FileInput.bemBlock}__widget`,
            label: `.${FileInput.bemBlock}__label`,
            description: `.${FileInput.bemBlock}__longdescription`,
            qm: `.${FileInput.bemBlock}__questionmark`,
            errorDiv: `.${FileInput.bemBlock}__errormessage`
        };

        constructor(params) {
            super(params);
            this.qm = this.element.querySelector(FileInput.selectors.qm)
        }

        getWidget() {
            return this.element.querySelector(FileInput.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(FileInput.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(FileInput.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(FileInput.selectors.errorDiv);
        }

        setModel(model) {
            super.setModel(model);
            this.widget.addEventListener('blur', (e) => {
                this._model.value = e.target.value;
            })
        }
    }
    document.getElementById("fileInput").addEventListener("change", function(event) {
        var file = event.target.files[0];
    	console.log(file);
        console.log(file.name);
        var a = document.createElement('a');
        var linkText = document.createTextNode(file.name);
        a.appendChild(linkText);
        a.title = file.name;
        a.href = "http://example.com";
        document.body.appendChild(a);
        var br = document.createElement("br");
        document.body.appendChild(br);
    },false);

    FormView.Utils.setupField(({element, formContainer}) => {
        return new FileInput({element})
    }, FileInput.selectors.self);

})();
