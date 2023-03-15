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

import {Constants} from "./constants.js";
import Response from "./Response.js";
import AfFormData from "./FormData.js";

export default class GuideBridge {

    #guideContainerMap = {};
    #guideBridgeConnectHandlers = [];
    #formContainerPath = "";

    constructor() {
        let customEvent = document.createEvent("CustomEvent");
        customEvent.initCustomEvent(Constants.GUIDE_BRIDGE_INITIALIZE_START, true, true, {"guideBridge": this});
        window.dispatchEvent(customEvent);
        if (window !== window.parent) {
            window.parent.document.getElementById(window.name);
            window.parent.dispatchEvent(customEvent);
        }
        let self = this;
        function onFormContainerInitialised(e) {
            let formContainer = e.detail;
            self.#guideContainerMap[formContainer.getPath()] = formContainer.getModel();
            self.#invokeConnectHandlers(formContainer.getPath());
        }
        document.addEventListener(Constants.FORM_CONTAINER_INITIALISED, onFormContainerInitialised);
    }

    #invokeConnectHandlers(formContainerPath) {
        this.#guideBridgeConnectHandlers.forEach(function (connectHandler) {
            if (connectHandler.formContainerPath === formContainerPath) {
                connectHandler.handler.call(connectHandler.context);
            }
            if (!connectHandler.formContainerPath) {
                //backward compatibility
                connectHandler.handler.call(connectHandler.context);
            }
        });
    }

    /**
     * returns string representation of form data
     * @param {object} options input to the getFormDataString API
     * @param {function} [options.success] callback which receives the result of the API
     * in case of success.
     */
    getFormDataString(options) {
        let formModel = this.getFormModel();
        if (!formModel) {
            throw new Error("formModel is not defined");
        }
        let attachmentAsObj = formModel.getState().attachments;
        let attachmentAsArray = Object.keys(attachmentAsObj).flatMap((key) => attachmentAsObj[key]);
        let formData = new AfFormData({
            "data": JSON.stringify(formModel.exportData()),
            "attachments": attachmentAsArray
        });
        let resultObject = new Response({"data": formData});
        if (options && typeof options.success === 'function') {
            options.success(resultObject);
        }
    }

    /**
     * Returns FormData object {@link AfFormData} containing form data and attachments
     * @param {object} options input to the getFormDataObject API
     * @param {function} [options.success] callback which receives the result of the API
     * in case of success.
     */
    getFormDataObject(options) {
        this.getFormDataString({success: function (resultObject) {
            if (options && typeof options.success === 'function') {
                options.success(resultObject);
            }
        }});
    }

    /**
     * returns the Form Instance associated with the GuideBridge.
     * Can return null, if no form instance is found.
     * @returns {null|object}
     */
    getFormModel() {
        if (this.#formContainerPath) {
            return this.#guideContainerMap[this.#formContainerPath];
        } else {
            //choose any form container in case no formContainerPath is provided in GuideBridge#connect API
            for(let formContainerPath in this.#guideContainerMap) {
                if(this.#guideContainerMap.hasOwnProperty(formContainerPath)) {
                    this.#formContainerPath = formContainerPath;
                    return this.#guideContainerMap[formContainerPath];
                }
            }
        }
        return null;
    }

    /**
     * Validates the Adaptive Form.
     * @returns {boolean} true if the form was valid, false otherwise
     */
    validate() {
        let formModel = this.getFormModel();
        if (!formModel) {
            throw new Error("formModel is not defined");
        }
        let validationErrors = formModel.validate();
        return !(validationErrors && validationErrors.length > 0);
    }

    /**
     * Specify a callback function which is called/notified when Adaptive Form gets initialized. After Adaptive
     * Form is initialized GuideBridge is ready for interaction and one can call any API.
     *
     * The callback can also be registered after the Form gets initialized. In that case, the callback will be
     * called immediately.
     *
     * @summary Register a callback to be executed when the Adaptive Form gets initialized
     * @param handler {function} function that would be called when guideBridge is ready for interaction. The
     * signature of the callback should be
     * ```
     * function() {
     *     // app specific code here
     * }
     * ```
     * @param {object} [context] _this_ object in the callback function will point to context
     * @param formContainerPath optional param. It captures the form container you want the GuideBridge APIs to interact with.
     * @example
     * guideBridge.connect(function() {
     *    console.log("Hurrah! Guide Bridge Activated");
     * })
     */
    connect(handler, context, formContainerPath) {
        context = context || this;
        if (formContainerPath) {
            this.#formContainerPath = formContainerPath;
        }
        if (!handler) {
            throw new Error("handler arg is null");
        }
        if (this.isConnected()) {
            handler.call(context);
        } else {
            this.#guideBridgeConnectHandlers.push({
                handler,
                context,
                formContainerPath
            });
        }
    }

    /**
     * All GuideBridge APIs (except {@link GuideBridge#connect|connect}) require Adaptive Form to be initialized.
     * Checking the return value of this API is not necessary if guideBridge API is called only after the
     * <a href="#wait-form-ready">Form is initialized</a>
     * @summary Whether the Adaptive Form has been initialized or not
     *
     * @returns {boolean} true if the Adaptive Form is ready for interaction, false otherwise
     */
    isConnected() {
        return !!this.getFormModel();
    }

    /**
     * @summary Disables the adaptive form, i.e. it disables all the fields and buttons.
     */
    disableForm() {
        let formModel = this.getFormModel();
        if (formModel) {
            formModel.enabled = false;
        } else {
            throw new Error("formModel is not defined");
        }
    }

    reset() {
        let formModel = this.getFormModel();
        if (formModel) {
            formModel.dispatch({type: 'reset'});
        } else {
            throw new Error("formModel is not defined");
        }
    }

    /**
     * @summary Hides all the submit buttons present in the Adaptive Form
     *
     */
    hideSubmitButtons() {
        if (this.isConnected()) {
            this.#hideButtons('submit');
        } else {
            throw new Error("GuideBridge is not connected");
        }
    }

    /**
     * @summary Hides all the reset buttons present in the Adaptive Form
     *
     */
    hideResetButtons() {
        if (this.isConnected()) {
            this.#hideButtons('reset');
        } else {
            throw new Error("GuideBridge is not connected");
        }
    }

    #hideButtons(buttonType) {
        let formModel = this.getFormModel();
        formModel.visit((field) => {
            if (field.properties["fd:buttonType"] === buttonType) {
                field.visible = false;
                field.subscribe((action) => {
                    let state = action.target.getState();
                    const changes = action.payload.changes;
                    changes.forEach(change => {
                        if (change.propertyName === 'visible' && change.currentValue) {
                            field.visible = false;
                        }
                    })
                });
            }
        })
    }

    hideSaveButtons() {
        //TODO: implement it later. NO-OP for now.
    }

    hideSummaryPanel() {
        //TODO: implement it later. NO-OP for now.
    }

}


