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

import {Constants} from "./constants";
import Response from "./Response";
import FormData from "./FormData";

export default class GuideBridge {

    #guideContainerMap = {};
    #guideBridgeConnectHandlers = [];
    #formContainerPath = "";

    constructor() {
        let customEvent = document.createEvent("CustomEvent");
        customEvent.initCustomEvent(Constants.GUIDE_BRIDGE_INITIALIZE_START, true, true, {"guideBridge": this});
        window.dispatchEvent(customEvent);
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
            if (! connectHandler.formContainerPath) {
                //backward compatibility
                connectHandler.handler.call(connectHandler.context);
            }
        });
    }

    getData() {
        let formModel = this.getFormModel();
        if (!formModel) {
            throw new Error("formModel is not defined");
        }
        return formModel.exportData();
    }

    getFormDataObject(options) {
        let data = this.getData();
        let formData = new FormData({data: data});
        let resultObject = new Response({data: formData});
        if (options && typeof options.success === 'function') {
            options.success(resultObject);
        }
    }

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

    validate() {
        let formModel = this.getFormModel();
        if (!formModel) {
            throw new Error("formModel is not defined");
        }
        let validationErrors = formModel.validate();
        return !(validationErrors && validationErrors.length > 0);
    }

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

    isConnected() {
        if (this.getFormModel()) {
            return true;
        }
        return false;
    }

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

    hideSubmitButtons() {
        //TODO: implement it later. NO-OP for now.
    }

    hideSaveButtons() {
        //TODO: implement it later. NO-OP for now.
    }

    hideResetButtons() {
        //TODO: implement it later. NO-OP for now.
    }

    hideSummaryPanel() {
        //TODO: implement it later. NO-OP for now.
    }

}


