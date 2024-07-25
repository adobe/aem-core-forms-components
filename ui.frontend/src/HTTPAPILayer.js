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
import Utils from "./utils.js";

/**
 * @module FormView
 */

/**
 * HTTP API layer for interacting with server-side APIs.
 */
class HTTPAPILayer {

    /**
     * Retrieves the form model for the specified form container path using the open api
     * @param {string} formContainerPath - The path of the form container.
     * @returns {Promise<Object|null>} - A Promise that resolves to the form model or null if there was an error.
     * @see {@link https://opensource.adobe.com/aem-forms-af-runtime/api/#tag/Get-Form-Definition} - API documentation
     */
    static async getForm(formContainerPath) {
        const guideContainerIndex = formContainerPath.indexOf("/jcr:content/guideContainer");
        let _formPath = formContainerPath;
        if (guideContainerIndex !== -1) {
            _formPath = formContainerPath.substring(0, guideContainerIndex);
        }
        const _formsList =  await this.#getFormsList();
        if (_formsList) {
            return await this.#findForm(_formPath, _formsList);
        } else {
            //TODO: throw errors once API is available on Circle CI set up
            console.debug("Error in fetching form");
        }
    }

    /**
     * Retrieves the form definition for the specified form container path using the json exporter API
     * @param {string} formContainerPath - The path of the form container.
     * @param {string} pageLang - Language of the containing sites page
     * @returns {Promise<Object>} - A Promise that resolves to the form definition.
     */
    static async getFormDefinition(formContainerPath, pageLang) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        let lang = null;
        if ('afAcceptLang' in params) {
            lang = `${params['afAcceptLang']}`
        } else {
            // check for selector in the URL
            const parts = window.location.pathname.split('.');
            if (parts?.length >= 3) {
                lang = `${parts[parts.length - 2]}`;
            }
        }
        // If 'afAcceptLang' is not set and URL selector is not present, use sites page language
        if (lang === null && pageLang != null) {
            lang = pageLang;
        }
        return await this.getJson(`${formContainerPath}.model.${lang !== null ? `${lang}.` : ""}json`);
    }

    /**
     * Recursive function to find a specific form in the forms list.
     * @param {string} formPath - The path of the form.
     * @param {Object} formsList - The list of forms.
     * @returns {Promise<Object|null>} - A Promise that resolves to the found form or null if not found.
     * @private
     */
    static async #findForm(formPath, formsList) {
        const _form = formsList.items.find((form) => {return form.path === formPath});
        if (_form) {
            return _form;
        } else if (formsList.cursor) {
            const _nextList = await this.#getFormsList(formsList.cursor);
            return await this.#findForm(formPath, _nextList);
        } else {
            //TODO: throw errors once API is available on Circle CI set up
            console.debug("Form at " + formPath +  " Not Found");
        }
    }

    /**
     * Retrieves the list of forms.
     * @returns {Promise<Object>} - A Promise that resolves to the list of forms.
     * @private
     */
    static async #getFormsList(cursor = "") {
        return await this.getJson(`${Constants.API_PATH_PREFIX}/listforms?cursor=${cursor}`);
    }

    /**
     * Retrieves the prefill data for the specified form and parameters.
     * @param {string} formId - The ID of the form.
     * @param {Object} params - The parameters for prefilling the form.
     * @returns {Promise<Object>} - A Promise that resolves to the prefill data.
     * @see {@link https://opensource.adobe.com/aem-forms-af-runtime/api/#tag/Get-Form-Data} - API documentation
     */
    static async getPrefillData(formId, params) {
        return await this.getJson(Constants.API_PATH_PREFIX + "/data/" + formId + "?" + Object.keys(params).map(p => p+"="+params[p]).join("&"));
    }

    /**
     * Retrieves JSON data from the specified URL.
     * @param {string} url - The URL to fetch JSON data from.
     * @returns {Promise<Object|null>} - A Promise that resolves to the fetched JSON data or null if there was an error.
     */
    static async getJson(url) {
        // prefix context path in url
        let urlWithContextPath = `${Utils.getContextPath()}${url}`
        return new Promise(resolve => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', urlWithContextPath, true);
            xhr.responseType = 'json';
            xhr.onload = function () {
                let status = xhr.status;
                if (status === 200) {
                    resolve(xhr.response);
                } else {
                    resolve(null);
                }
            };
            xhr.send();
        });
    }

    /**
     * Retrieves the custom function configuration for the specified form ID.
     * @param {string} formId - The ID of the form.
     * @returns {Promise<Object>} - A Promise that resolves to the custom function configuration.
     */
    static async getCustomFunctionConfig(formId) {
        return await this.getJson(Constants.API_PATH_PREFIX + "/customfunctions/" + formId);
    }
};

export default HTTPAPILayer;
