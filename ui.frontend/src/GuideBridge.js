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

/**
 * The GuideBridge class represents the bridge between an adaptive form and JavaScript APIs.
 */
class GuideBridge {

    /**
     * Map to store the form container views.
     * @member {Object}
     * @private
     * @memberof GuideBridge
     * @instance
     */
    #formContainerViewMap = {};
    /**
     * Array to store the guide bridge connect handlers.
     * @member {Array}
     * @private
     * @memberof GuideBridge
     * @instance
     */
    #guideBridgeConnectHandlers = [];
    /**
     * Path of the form container.
     * @member {string}
     * @private
     * @memberof GuideBridge
     * @instance
     */
    #formContainerPath = "";


    /**
     * Object to store user configurations.
     * @member {Object}
     * @private
     * @memberof GuideBridge
     * @instance
     */
    #userConfig = {};


    /**
     * Predefined key values for user configurations.
     * @member {Object}
     * @memberof GuideBridge
     * @instance
     */
    ConfigKeys = {
        LOCALE_CONFIG: 'localeConfig',
        RENDER_CONFIG: 'renderConfig', // todo: needs to be added
        SUBMIT_CONFIG: 'submitConfig'  // todo: needs to be added
    };

    /**
     * Constructs a new GuideBridge instance.
     * @constructor GuideBridge
     */
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
            self.#formContainerViewMap[formContainer.getPath()] = formContainer;
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
     * Returns the string representation of the form data.
     *
     * @param {Object} options - Input options for the getFormDataString API.
     * @param {Function} [options.success] - Callback function that receives the result of the API in case of success.
     * @method
     * @memberof GuideBridge
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
     * Returns a FormData object containing form data and attachments.
     *
     * @param {Object} options - Input options for the getFormDataObject API.
     * @param {Function} [options.success] - Callback function that receives the result of the API in case of success.
     * @method
     * @memberof GuideBridge
     */
    getFormDataObject(options) {
        this.getFormDataString({success: function (resultObject) {
            if (options && typeof options.success === 'function') {
                options.success(resultObject);
            }
        }});
    }

    /**
     * Returns the Form Instance associated with the GuideBridge.
     * Can return null if no form instance is found.
     *
     * @returns {null|Object} - The Form Instance associated with the GuideBridge.
     * @method
     * @memberof GuideBridge
     */
    getFormModel() {
        if (this.#formContainerPath) {
            return this.#formContainerViewMap[this.#formContainerPath]? this.#formContainerViewMap[this.#formContainerPath].getModel() : null;
        } else {
            //choose any form container in case no formContainerPath is provided in GuideBridge#connect API
            const formContainerPath = this.#getFormContainerPath();
            this.#formContainerPath = formContainerPath;
            return this.#formContainerViewMap[formContainerPath] ? this.#formContainerViewMap[formContainerPath].getModel(): null;
        }
    }

    /**
     * Retrieves the path of the form container.
     * @returns {string} The path of the form container.
     * @method
     * @memberof GuideBridge
     * @private
     */
    #getFormContainerPath() {
        let actualFormContainerPath = this.#formContainerPath;
        if (!actualFormContainerPath) {
            for(let formContainerPath in this.#formContainerViewMap) {
                if(this.#formContainerViewMap.hasOwnProperty(formContainerPath)) {
                    actualFormContainerPath =  formContainerPath;
                }
            }
        }
        return actualFormContainerPath;
    }

    /**
     * Validates the Adaptive Form.
     *
     * @returns {boolean} - True if the form is valid, false otherwise.
     * @method
     * @memberof GuideBridge
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
     *
     * @method
     * @memberof GuideBridge
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
     * @method
     * @memberof GuideBridge
     */
    isConnected() {
        return !!this.getFormModel();
    }

    /**
     * @summary Disables the adaptive form, i.e. it disables all the fields and buttons.
     * @method
     * @memberof GuideBridge
     */
    disableForm() {
        let formModel = this.getFormModel();
        if (formModel) {
            formModel.enabled = false;
        } else {
            throw new Error("formModel is not defined");
        }
    }

    /**
     * Resets the adaptive form, clearing all entered values.
     * @method
     * @memberof GuideBridge
     */
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
     * @method
     * @memberof GuideBridge
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
     * @summary Hides all the reset buttons present in the Adaptive Form.
     * @method
     * @memberof GuideBridge
     */
    hideResetButtons() {
        if (this.isConnected()) {
            this.#hideButtons('reset');
        } else {
            throw new Error("GuideBridge is not connected");
        }
    }

    /**
     * Hides buttons of the specified type in the Adaptive Form.
     *
     * @param {string} buttonType - The type of buttons to hide (e.g., 'submit', 'reset').
     * @private
     * @method
     * @memberof GuideBridge
     */
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

    /**
     * Hides all the save buttons present in the Adaptive Form.
     * @method
     * @memberof GuideBridge
     */
    hideSaveButtons() {
        //TODO: implement it later. NO-OP for now.
    }

    /**
     * Hides the summary panel in the Adaptive Form.
     * @method
     * @memberof GuideBridge
     */
    hideSummaryPanel() {
        //TODO: implement it later. NO-OP for now.
    }

    /**
     * Triggers an event on the GuideBridge object.
     *
     * @param {string} eventName - The name of the event to trigger on GuideBridge.
     * @param {any} eventPayload - The payload to be passed with the event.
     * @param {string} [formContainerPath] - If no argument is passed, use any form container.
     *
     * @method
     * @memberof GuideBridge
     */
    trigger(eventName, eventPayload, formContainerPath) {
        let formContainer;
        if (formContainerPath) {
            formContainer = this.#formContainerViewMap[formContainerPath];
        } else {
            formContainer = this.#formContainerViewMap[this.#getFormContainerPath()];
        }
        if (formContainer && formContainer.getFormElement()) {
            const formElement = formContainer.getFormElement();
            formElement.dispatchEvent(new CustomEvent(eventName, {detail: eventPayload}));
        }
    }

    /**
     * @method
     * @memberof GuideBridge
     * @summary Adds an event listener for events triggered by the GuideBridge object.
     * The subscriber must first be connected to GuideBridge to be able to use this API.
     *
     * @param {string} eventName - The name of the event to listen for.
     * @param {Function} handler - The event handler function.
     */
    on(eventName, handler) {
        if (this.isConnected()) {
            const formContainer = this.#formContainerViewMap[this.#formContainerPath];
            if (formContainer && formContainer.getFormElement()) {
                const formElement = formContainer.getFormElement();
                formElement.addEventListener(eventName, handler);
            }
        } else {
            throw new Error("GuideBridge is not connected");
        }
    }

    /**
     * Register a configuration for a specific key.
     * @param {string} key - The key for which to register the configuration.
     * @param {Object|Function} config - The configuration object or function.
     * @param {string|null} [formContainerPath=null] - The form container path to associate with the configuration.
     * @returns {Array} - An array of configurations associated with the key.
     * @example
     *
     * // Register a function configuration for additional behavior
     * guideBridge.registerConfig(guideBridge.ConfigKeys.LOCALE_CONFIG, () => console.log('Function config'));
     */
    registerConfig(key, config, formContainerPath = null) {
        if (!this.#userConfig[key]) {
            this.#userConfig[key] = [];
        }
        const configEntry = typeof config === 'function' ? { fn: config, formContainerPath } : { ...config, formContainerPath };
        this.#userConfig[key].push(configEntry);
        return this.#userConfig[key];
    }

    /**
     * Get configurations associated with a specific key.
     * @param {string} key - The key for which to retrieve configurations.
     * @returns {Array} - An array of configurations associated with the key.
     */
    getConfigsForKey(key) {
        return this.#userConfig[key] || [];
    }
};

export default GuideBridge;


