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
    class FormContainerV2 extends FormView.FormContainer {

    }
    const NS = "cmp";
    const IS = "adaptiveFormContainer";
    const selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };

    async function onDocumentReady() {
        const formContainer = FormView.Utils.setupFormContainer(({
            _formJson, _prefillData, _path
        }) => {
            return new FormContainerV2({_formJson, _prefillData, _path});
        }, selectors.self, IS)
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

})();
