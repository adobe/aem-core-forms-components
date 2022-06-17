import $ from "jquery";
import {createFormInstance} from '@aemforms/af-core';
import FormContainer from "./view/FormContainer";
import readData from "./utils";

window.af = {
    formsRuntime: {
        model: {
            form: {}
        },
        view: {
            formContainer: {},
            utils: {}
        },
        event: {}
    }
}
var NS = "cmp";
var IS = "formcontainer";
var selectors = {
    self: "[data-" + NS + '-is="' + IS + '"]'
};

function onDocumentReady() {
    var elements = document.querySelectorAll(selectors.self);
    for (let i = 0; i < elements.length; i++) {
        let dataset = readData(elements[i], IS);
        let containerPath = dataset["path"];
        $.getJSON(containerPath + ".model.json", function(formJson) {
            console.log("model json from server ", formJson);
            createFormInstance(formJson, function (formModel) {
                console.log("AF2.0 model initialised", formModel);
                window.af.formsRuntime.view.formContainer[containerPath]  = new FormContainer({_model: formModel, path: containerPath});
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
