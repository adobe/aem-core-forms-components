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

(function($) {

    class FormContainer {
        constructor(params) {
            this._model = FormView.createFormInstance(params._formJson);
            this._path = params._path;
            this._fields = {};
        }
        /**
         * returns the form field view
         * @param fieldId
         */
        getField(fieldId) {
            if (this._fields.hasOwnProperty(fieldId)) {
                return this._fields[fieldId];
            }
            return null;
        }

        getModel(id) {
            return id ? this._model.getElement(id) : this._model;
        }

        addField(fieldView) {
            if (fieldView.getFormContainerPath() === this._path) {
                this._fields[fieldView.getId()] = fieldView;
                fieldView.setModel(this.getModel(fieldView.getId()));
                fieldView.subscribe();
            }
        }

    }

    "use strict";
    const NS = "cmp";
    const IS = "adaptiveFormContainer";
    const selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };
    async function onDocumentReady() {
        let elements = document.querySelectorAll(selectors.self);
        for (let i = 0; i < elements.length; i++) {
            const dataset = FormView.readData(elements[i], IS);
            const containerPath = dataset["path"];
            const formJson = await $.getJSON(containerPath + ".model.json");
            console.log("model json from server ", formJson);
            let formContainer =  new FormContainer({_formJson: formJson, _path: containerPath});
            const event = new CustomEvent("FormContainerInitialised", { "detail": formContainer });
            document.dispatchEvent(event);
        }
    }
    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

})(jQuery);
