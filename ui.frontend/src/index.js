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
const NS = "cmp";
const IS = "formcontainer";
const selectors = {
    self: "[data-" + NS + '-is="' + IS + '"]'
};


async function onDocumentReady() {
    let elements = document.querySelectorAll(selectors.self);
    for (let i = 0; i < elements.length; i++) {
        const dataset = readData(elements[i], IS);
        const containerPath = dataset["path"];
        const formJson = await $.getJSON(containerPath + ".model.json");
        console.log("model json from server ", formJson);
        let formModel = await createFormInstance(formJson);
        console.log("AF2.0 model initialised", formModel);
        window.af.formsRuntime.view.formContainer[containerPath]  = new FormContainer({_model: formModel, path: containerPath});
        const event = new CustomEvent("FormContainerInitialised", { "detail": containerPath });
        document.dispatchEvent(event);
    }
}

if (document.readyState !== "loading") {
    onDocumentReady();
} else {
    document.addEventListener("DOMContentLoaded", onDocumentReady);
}
