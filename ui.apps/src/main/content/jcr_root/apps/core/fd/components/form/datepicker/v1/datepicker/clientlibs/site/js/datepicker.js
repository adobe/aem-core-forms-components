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
    var NS = "cmp";
    var IS = "datepicker";
    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };
    var tagName = "input";

    function onFormContainerInitialised(e) {
        console.log("FormContainerInitialised Received", e.detail);
        window.af.formsRuntime.view.formContainer[e.detail].initialiseFormFields(selectors.self, tagName, IS);
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                let dataset = window.af.formsRuntime.view.utils.readData(element, IS);
                                let formContainerPath = dataset["formcontainer"];
                                window.af.formsRuntime.view.formContainer[formContainerPath].initialiseElementView(element, tagName, IS);
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
