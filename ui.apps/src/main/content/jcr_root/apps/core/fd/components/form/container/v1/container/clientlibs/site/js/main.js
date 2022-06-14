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
    "use strict";
    console.log("[afRuntime] form container runtime main.js");

    var NS = "cmp";
    var IS = "formcontainer";
    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (let i = 0; i < elements.length; i++) {
            let dataset = window.af.formsRuntime.view.utils.readData(elements[i], IS);
            let containerPath = dataset["path"];
            $.getJSON(containerPath + ".model.json", function(formJson) {
                console.log("model json from server ", formJson);
                window.af.formsRuntime.model.createFormInstance(formJson, function (formModel) {
                    console.log("AF2.0 model initialised", formModel);
                    window.af.formsRuntime.model.form[containerPath] = formModel;
                    window.af.formsRuntime.view.formContainer[containerPath]  = new window.af.formsRuntime.view.FormContainer({_model: formModel, path: containerPath});
                    const event = new CustomEvent("FormContainerInitialised", { "detail": containerPath });
                    document.dispatchEvent(event);
                });
            });
        }
    }



    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }


})(jQuery);
