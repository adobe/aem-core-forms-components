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

    function onFormContainerInitialised(e) {
        console.log("FormContainerInitialised Received", e.detail);
        let formContainer =  window.af.formsRuntime.view.formContainer[e.detail];
        let fieldElements = document.querySelectorAll(FormView.DatePicker.selectors.self);
        for (let i = 0; i < fieldElements.length; i++) {
            let datePickerField = new FormView.DatePicker({element: fieldElements[i]}); //element and dataset will be set here
            formContainer.addField(datePickerField); //model will be set here
        }
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(FormView.DatePicker.selectors.self));
                            elementsArray.forEach(function(element) {
                                let dataset = FormView.readData(element, IS);
                                let formContainerPath = dataset["formcontainer"];
                                let formContainer = window.af.formsRuntime.view.formContainer[formContainerPath];
                                let datePickerField = new FormView.DatePicker({element: element});
                                formContainer.addField(datePickerField);
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }
    document.addEventListener("FormContainerInitialised", onFormContainerInitialised);
})(jQuery);
