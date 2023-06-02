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
    static #fieldCreatorSets = [];

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
     * Creates fields from given elements of fieldCreator, for given form container
     * @param fieldElements
     * @param fieldCreator
     * @param formContainer
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
     * Creates fields from all registered fieldCreators present inside addedElement, for given form container
     * @param addedElement
     * @param formContainer
     */
    static createFieldsForAddedElement(addedElement, formContainer) {
        Utils.#fieldCreatorSets.forEach(function (fieldCreatorSet) {
            const fieldElements = addedElement.querySelectorAll(fieldCreatorSet['fieldSelector']);
            Utils.#createFormContainerFields(fieldElements, fieldCreatorSet['fieldCreator'], formContainer);
        });
    }

    /**
     * Execute a callback after the Form Container is initialized
     * @param fieldCreator a function to return an instance of FormField
     * @param fieldSelector {string} a css selector to identify the HTML Element.
     * @param fieldClass data attribute to read the field data from
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
     * Removes field reference from form container
     * @param formContainer
     * @param fieldId
     */
    static #removeFieldId(formContainer, fieldId) {
        if (formContainer && formContainer.getAllFields()) {
            delete formContainer.getAllFields()[fieldId];
        }
    }

    /**
     * Removes all child references (including instance manager) of field from views, Form Container
     * @param fieldView
     * @param formContainer
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
     * Removes all references of field from views, Form Container
     * @param fieldView
     * @param formContainer
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
        if (Utils.#contextPath == null || Utils.#contextPath.length === 0) {
            Utils.#contextPath = contextPath;
        }
    }

    /**
     * API to get the context path
     * @returns context path of the system
     */
    static getContextPath() {
        return Utils.#contextPath;
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
