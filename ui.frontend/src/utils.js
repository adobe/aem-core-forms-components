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
import HTTPAPILayer from "./HTTPAPILayer.js";
import {customFunctions} from "./customFunctions.js";
import {FunctionRuntime} from '@aemforms/af-core'


/**
 * @module FormView
 */

/**
 * Utility class with various helper functions.
 * These functions provide various utility operations related to form model creation and management.
 */
class Utils {
    /**
     * The context path.
     * @private
     * @type {string}
     */
    static #contextPath = "";
    /**
     * The array of field creator sets.
     * @private
     * @type {Object[]}
     */
    static #fieldCreatorSets = [];

    /**
     * Returns the data attributes of the specific element.
     * Ignores "data-cmp-is-*" and "data-cmp-hook-*" attributes.
     * @param {Element} element - The element to read data attributes from.
     * @param {string} clazz - The class name.
     * @returns {Object} The data attributes.
     */
    static readData(element, clazz) {
        const data = element.dataset;
        let options = {};
        const reserved = ["is"];
        //clazz is never passed, do we need this?
        if (clazz) {
            const capitalized = clazz.charAt(0).toUpperCase() + clazz.substring(1);
            reserved.push("hook" + capitalized);
        }

        for (let key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                let value = data[key];
                if (key.indexOf(Constants.NS) === 0) {
                    key = key.slice(Constants.NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);
                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }
        return options;
    }

    /**
     * Registers the mutation observer for a form component.
     * @param {module:FormView~FormContainer} formContainer - The form container.
     * @param {Function} fieldCreator - The function to create a field.
     * @param {string} fieldSelector - The field selector.
     * @param {string} dataAttributeClass - The data attribute class.
     */
    static registerMutationObserver(formContainer, fieldCreator, fieldSelector, dataAttributeClass) {
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function (addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(fieldSelector));
                            Utils.#createFormContainerFields(elementsArray, fieldCreator, formContainer);
                        }
                    });
                }
            });
        });

        const pathAttr = '[data-cmp-path="' + formContainer.getPath() + '"]';
        const formContainerElement = document.querySelector(pathAttr);
        observer.observe(formContainerElement, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    /**
     * Creates fields from given elements of fieldCreator, for given form container.
     * @private
     * @param {Element[]} fieldElements - The field elements.
     * @param {Function} fieldCreator - The function to create a field.
     * @param {module:FormView~FormContainer} formContainer - The form container.
     */
    static #createFormContainerFields(fieldElements, fieldCreator, formContainer) {
        for (let i = 0; i < fieldElements.length; i++) {
            const elementId = fieldElements[i].id;
            //check if field is already created, to avoid creating a new field for same id
            if (formContainer.getField(elementId) == null) {
                let field = fieldCreator({
                    "element" : fieldElements[i],
                    "formContainer" : formContainer
                });
                formContainer.addField(field);
            }
        }
    }

    /**
     * Creates fields from all registered fieldCreators present inside addedElement, for given form container.
     * @param {Element} addedElement - The added element.
     * @param {module:FormView~FormContainer} formContainer - The form container.
     */
    static createFieldsForAddedElement(addedElement, formContainer) {
        Utils.#fieldCreatorSets.forEach(function (fieldCreatorSet) {
            const fieldElements = addedElement.querySelectorAll(fieldCreatorSet['fieldSelector']);
            Utils.#createFormContainerFields(fieldElements, fieldCreatorSet['fieldCreator'], formContainer);
        });
    }

    /**
     * Execute a callback after the Form Container is initialized.
     * @param {Function} fieldCreator - The function to return an instance of FormField.
     * @param {string} fieldSelector - The CSS selector to identify the HTML element.
     * @param {string} fieldClass - The data attribute to read the field data from.
     */
    static setupField(fieldCreator, fieldSelector, fieldClass) {
        const onInit = (e) => {
            console.debug("FormContainerInitialised Received", e.detail);
            let formContainer =  e.detail;
            let fieldElements = document.querySelectorAll(fieldSelector);
            Utils.#createFormContainerFields(fieldElements, fieldCreator, formContainer);
            Utils.registerMutationObserver(formContainer, fieldCreator, fieldSelector, fieldClass);
        }
        Utils.#fieldCreatorSets.push({
            fieldCreator,
            fieldSelector,
            fieldClass
        });
        document.addEventListener(Constants.FORM_CONTAINER_INITIALISED, onInit);
    }

    /**
     * Removes field reference from form container.
     * @private
     * @param {module:FormView~FormContainer} formContainer - The form container.
     * @param {string} fieldId - The field ID.
     */
    static #removeFieldId(formContainer, fieldId) {
        if (formContainer && formContainer.getAllFields()) {
            delete formContainer.getAllFields()[fieldId];
        }
    }

    /**
     * Removes all child references (including instance manager) of field from views, Form Container.
     * @private
     * @param {Object} fieldView - The field view.
     * @param {module:FormView~FormContainer} formContainer - The form container.
     */
    static #removeChildReferences(fieldView, formContainer) {
        let childViewList = fieldView.children;
        if (childViewList) {
            for (let index = 0; index < childViewList.length; index++) {
                Utils.#removeChildReferences(childViewList[index]);
            }
        }
        //remove instanceManger for child repeatable panel
        if (fieldView.getInstanceManager && fieldView.getInstanceManager()) {
            Utils.#removeFieldId(formContainer, fieldView.getInstanceManager().id);
        }
        Utils.#removeFieldId(formContainer, fieldView.id);
    }

    /**
     * Removes all references of field from views, Form Container.
     * @param {Object} fieldView - The field view.
     * @param {module:FormView~FormContainer} formContainer - The form container.
     */
    static removeFieldReferences(fieldView, formContainer) {
        let childViewList = fieldView.children;
        if (childViewList) {
            for (let index = 0; index < childViewList.length; index++) {
                Utils.#removeChildReferences(childViewList[index]);
            }
        }
        Utils.#removeFieldId(formContainer, fieldView.id);
    }

    /**
     * Update the id inside the given html element.
     * @param {Element} htmlElement - The HTML element.
     * @param {string} oldId - The old ID.
     * @param {string} newId - The new ID.
     */
    static updateId(htmlElement, oldId, newId) {
        let elementWithId = htmlElement.querySelectorAll("#" + oldId)[0];
        if (elementWithId) {
            elementWithId.id = newId;
        }
    }

    /**
     * API to set the context path. All external HTTP API calls would by default prefix with this context path.
     * @param {string} contextPath - The context path of the system.
     */
    static setContextPath(contextPath) {
        if (Utils.#contextPath == null || Utils.#contextPath.length === 0) {
            Utils.#contextPath = contextPath;
        }
    }

    /**
     * API to get the context path.
     * @returns {string} - The context path of the system.
     */
    static getContextPath() {
        return Utils.#contextPath;
    }

    /**
     * Registers handler on elements on hook.
     * @param {Element} parentElement - The parent element.
     * @param {string} hook - The hook.
     * @param {Function} handler - The event handler.
     */
    static registerClickHandler(parentElement, hook, handler) {
        const dataAttr = "[" + hook + "]";
        const buttons = parentElement.querySelectorAll(dataAttr);
        buttons.forEach(
          (button) => button.addEventListener('click', handler));
    }

    /**
     * Registers custom functions from clientlibs.
     * @param {string} formId - The form ID.
     */
    static async registerCustomFunctions(formId) {
        const funcConfig = await HTTPAPILayer.getCustomFunctionConfig(formId);
        console.debug("Fetched custom functions: " + JSON.stringify(funcConfig));
        if (funcConfig && funcConfig.customFunction) {
            const funcObj = funcConfig.customFunction.reduce((accumulator, func) => {
                if (window[func.id]) {
                    accumulator[func.id] = window[func.id];
                }
                return accumulator;
            }, {});
            FunctionRuntime.registerFunctions(funcObj);
        }
    }

    /**
     * Sets up the Form Container.
     * @param {Function} createFormContainer - The function to create a form container.
     * @param {string} formContainerSelector - The CSS selector to identify the form container.
     * @param {string} formContainerClass - The form container class.
     * @fires module:FormView~Constants#FORM_CONTAINER_INITIALISED
     */
    static async setupFormContainer(createFormContainer, formContainerSelector, formContainerClass) {
        FunctionRuntime.registerFunctions(customFunctions);
        let elements = document.querySelectorAll(formContainerSelector);
        for (let i = 0; i < elements.length; i++) {
            const dataset = Utils.readData(elements[i], formContainerClass);
            const _path = dataset["path"];
            if ('contextPath' in dataset) {
                Utils.setContextPath(dataset['contextPath']);
            }
            if (_path == null) {
                console.error(`data-${Constants.NS}-${formContainerClass}-path attribute is not present in the HTML element. Form cannot be initialized` )
            } else {
                const _formJson = await HTTPAPILayer.getFormDefinition(_path);
                console.debug("fetched model json", _formJson);
                await this.registerCustomFunctions(_formJson.id);
                const urlSearchParams = new URLSearchParams(window.location.search);
                const params = Object.fromEntries(urlSearchParams.entries());
                let _prefillData = {};
                if (_formJson?.properties?.['fd:formDataEnabled'] === true) {
                    // only execute when fd:formDataEnabled is present and set to true
                    _prefillData = await HTTPAPILayer.getPrefillData(_formJson.id, params) || {};
                    _prefillData = Utils.stripIfWrapped(_prefillData);
                }
                const formContainer = createFormContainer({
                    _formJson,
                    _prefillData,
                    _path,
                    _element: elements[i]
                });
                const event = new CustomEvent(Constants.FORM_CONTAINER_INITIALISED, { "detail": formContainer });
                document.dispatchEvent(event);
            }
        }
    }

    /**
     * For backward compatibility with older data formats of prefill services like FDM.
     * @param {object} prefillJson - The prefill JSON object.
     * @returns {object} - The stripped prefill JSON object.
     */
    static stripIfWrapped(prefillJson) {
        if (prefillJson && prefillJson.hasOwnProperty("data")) {
            const data = prefillJson.data;
            if (data && data.hasOwnProperty("afData")) {
                const afData = data.afData;
                if (afData && afData.hasOwnProperty("afBoundData")) {
                    return afData.afBoundData;
                }
            }
        }
        return prefillJson;
    }

    /**
     * Checks if the current browser matches with the agentName passed.
     * @param {string} agentName - The agent name to match with the browser's user agent.
     * @returns {boolean} - True if the browser's user agent matches the agentName, otherwise false.
     */
    static isUserAgent(agentName) {
        if(navigator.userAgent) {
            let regex = "^((?!chrome|android).)*" + agentName;
            const re = new RegExp(regex, 'i');
            return re.test(navigator.userAgent);
        }
    }
}

export default Utils;
