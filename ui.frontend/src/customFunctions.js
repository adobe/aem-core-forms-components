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

import * as customfunctions from "@aemforms/af-custom-functions";

// creating proxy to custom functions, since these were already exposed in the SDK

/**
 * @module FormView
 */

/**
 * Converts a JSON string to an object.
 * @param {string} str - The JSON string to convert to an object.
 * @returns {object} - The parsed JSON object. Returns an empty object if an exception occurs.
 * @memberof module:FormView~customFunctions
 */
function toObject(str) {
    return customfunctions.toObject(str);
}

/**
 * Prefixes the URL with the context path.
 * @param {string} url - The URL to externalize.
 * @returns {string} - The externalized URL.
 * @memberof module:FormView~customFunctions
 */
function externalize(url) {
    if (window?.Granite?.HTTP && typeof (window.Granite.HTTP.externalize === "function")) {
        return window.Granite.HTTP.externalize(url);
    } else {
        return url;
    }
}

/**
 * Validates if the given URL is correct.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 * @memberof module:FormView~customFunctions
 */
function validateURL(url) {
    return customfunctions.validateURL(url);
}


/**
 * Navigates to the specified URL.
 * @param {string} destinationURL - The URL to navigate to. If not specified, a new blank window will be opened.
 * @param {string} destinationType - The type of destination. Supports the following values: "_newwindow", "_blank", "_parent", "_self", "_top", or the name of the window.
 * @returns {Window} - The newly opened window.
 * @memberof module:FormView~customFunctions
 */
function navigateTo(destinationURL, destinationType) {
    customfunctions.navigateTo(externalize(destinationURL), destinationType);
}

/**
 * Default error handler for the invoke service API.
 * @param {object} response - The response body of the invoke service API.
 * @param {object} headers - The response headers of the invoke service API.
 * @param {object} globals - An object containing form instance and invoke method to call other custom functions.
 * @returns {void}
 * @memberof module:FormView~customFunctions
 */
function defaultErrorHandler(response, headers, globals) {
    customfunctions.defaultInvokeServiceErrorHandler(response, headers, globals);
}

/**
 * Namespace for custom functions.
 * @description Contains custom functions which can be used in the rule editor
 * @exports FormView/customFunctions
 * @namespace customFunctions
 */
export const customFunctions = {
    toObject,
    externalize,
    navigateTo,
    defaultErrorHandler
};
