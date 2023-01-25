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

export default class Utils {
    static #contextPath = "";
    /**
     * Returns the data attributes of the specific element.
     * Ignores "data-cmp-is-*" and "data-cmp-hook-*" attributes.
     * @param element
     * @param clazz
     * @returns {{}}
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
     * Registers the mutation observer for a form component
     * @param formContainer
     * @param fieldCreator function to create a field
     * @param fieldSelector
     * @param dataAttributeClass
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
                            elementsArray.forEach(function (element) {
                                let formField = fieldCreator({
                                    "element" : element,
                                    "formContainer" : formContainer
                                });
                                formContainer.addField(formField);
                            });
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
     * execute a callback after the Form Container is initialized
     * @param fieldCreator a function to return an instance of FormField
     * @param fieldSelector {string} a css selector to identify the HTML Element.
     * @param fieldClass data attribute to read the field data from
     */
    static setupField(fieldCreator, fieldSelector, fieldClass) {
        const onInit = (e) => {
            console.debug("FormContainerInitialised Received", e.detail);
            let formContainer =  e.detail;
            let fieldElements = document.querySelectorAll(fieldSelector);
            for (let i = 0; i < fieldElements.length; i++) {
                let field = fieldCreator({
                    "element" : fieldElements[i],
                    "formContainer" : formContainer
                });
                formContainer.addField(field);
            }
            Utils.registerMutationObserver(formContainer, fieldCreator, fieldSelector, fieldClass);
        }
        document.addEventListener(Constants.FORM_CONTAINER_INITIALISED, onInit);
    }

    /**
     * Removes all references of field from views, Form Container
     * @param fieldView
     */
    static removeFieldReferences(fieldView) {
        let childViewList = fieldView.children;
        if (childViewList) {
            for (let index = 0; index < childViewList.length; index++) {
                this.removeFieldReferences(childViewList[index]);
            }
        }
        delete fieldView.formContainer.getAllFields()[fieldView.id];
    }

    /**
     * Update the id inside the given html element
     * @param htmlElement
     * @param oldId
     * @param newId
     */
    static updateId(htmlElement, oldId, newId) {
        let elementWithId = htmlElement.querySelectorAll("#" + oldId)[0];
        if (elementWithId) {
            elementWithId.id = newId;
        }
    }

    /**
     * API to set the context path. All external HTTP API calls would by default prefix with this context path
     * @param contextPath   context path of the system
     */
    static setContextPath(contextPath) {
        if (this.#contextPath == null || this.#contextPath.length === 0) {
            this.#contextPath = contextPath;
        }
    }

    /**
     * API to get the context path
     * @returns {*}
     */
    static getContextPath() {
        return this.#contextPath;
    }

    /**
     * Registers handler on elements on hook
     * @param parentElement
     * @param hook
     * @param handler
     */
    static registerClickHandler(parentElement, hook, handler) {
        const dataAttr = "[" + hook + "]";
        const buttons = parentElement.querySelectorAll(dataAttr);
        buttons.forEach(
            (button) => button.addEventListener('click', handler));
    }

    /**
     *
     * @param createFormContainer
     * @param formContainerSelector
     */
    static async setupFormContainer(createFormContainer, formContainerSelector, formContainerClass) {
        FunctionRuntime.registerFunctions(customFunctions)
        let elements = document.querySelectorAll(formContainerSelector);
        for (let i = 0; i < elements.length; i++) {
            const dataset = Utils.readData(elements[i], formContainerClass);
            const _path = dataset["path"];
            if ('contextPath' in dataset) {
                this.setContextPath(dataset['contextPath']);
            }
            if (_path == null) {
                console.error(`data-${Constants.NS}-${formContainerClass}-path attribute is not present in the HTML element. Form cannot be initialized` )
            } else {
                const _formJson = await HTTPAPILayer.getFormDefinition(_path);
                console.debug("fetched model json", _formJson);
                const urlSearchParams = new URLSearchParams(window.location.search);
                const params = Object.fromEntries(urlSearchParams.entries());
                let _prefillData = {};
                if (_formJson) {
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
     * for backward compatibility with older data formats of prefill services like FDM
     * @param prefillJson
     * @returns {{data}|*}
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

    // Checks if the current browser matches with agentName passed
    static isUserAgent(agentName) {
        if(navigator.userAgent) {
            let regex = "^((?!chrome|android).)*" + agentName;
            const re = new RegExp(regex, 'i');
            return re.test(navigator.userAgent);
        }
    }
}
