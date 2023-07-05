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
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return {}
    }
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
    try {
        const validatedUrl = new URL(url, window.location.href);
        return (validatedUrl.protocol === 'http:' || validatedUrl.protocol === 'https:');
    }
    catch (err) {
        return false;
    }
}


/**
 * Navigates to the specified URL.
 * @param {string} destinationURL - The URL to navigate to. If not specified, a new blank window will be opened.
 * @param {string} destinationType - The type of destination. Supports the following values: "_newwindow", "_blank", "_parent", "_self", "_top", or the name of the window.
 * @returns {Window} - The newly opened window.
 * @memberof module:FormView~customFunctions
 */
function navigateTo(destinationURL, destinationType) {
    let param = null,
        windowParam = window,
        arg = null;
    switch (destinationType){
        case "_newwindow":
            param = "_blank";
            arg = "width=1000,height=800";
            break;
    }
    if (!param) {
        if (destinationType) {
            param = destinationType;
        } else {
            param = "_blank";
        }
    }
    if (validateURL(destinationURL)){
        windowParam.open(externalize(destinationURL), param, arg);
    }
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
    if(response && response.validationErrors) {
        response.validationErrors?.forEach(function (violation) {
            if (violation.details) {
                if (violation.fieldName) {
                    globals.form.visit(function callback(f) {
                        if (f.qualifiedName === violation.fieldName) {
                            f.markAsInvalid(violation.details.join("\n"));
                        }
                    });
                } else if (violation.dataRef) {
                    globals.form.visit(function callback(f) {
                        if (f.dataRef === violation.dataRef) {
                            f.markAsInvalid(violation.details.join("\n"));
                        }
                    });
                }
            }
        });
    }
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
