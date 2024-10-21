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

import * as cf from "@aemforms/af-custom-functions";

/**
 * @module FormView
 */

/**
 * Namespace for custom functions.
 * @description Contains custom functions which can be used in the rule editor.
 * @exports FormView/customFunctions
 * @namespace customFunctions
 */
export const customFunctions = {
    /**
     * Converts a JSON string to an object.
     * @param {string} str - The JSON string to convert to an object.
     * @returns {object} - The parsed JSON object. Returns an empty object if an exception occurs.
     */
    toObject: cf.toObject,

    /**
     * Prefixes the URL with the context path.
     * @param {string} url - The URL to externalize.
     * @returns {string} - The externalized URL.
     */
    externalize: (url) => {
        // Check if Granite.HTTP.externalize is available, otherwise return the original URL
        if (window?.Granite?.HTTP && typeof window.Granite.HTTP.externalize === "function") {
            return window.Granite.HTTP.externalize(url);
        } else {
            return url;
        }
    },

    /**
     * Validates if the given URL is correct.
     * @param {string} url - The URL to validate.
     * @returns {boolean} - True if the URL is valid, false otherwise.
     */
    validateURL: cf.validateURL,

    /**
     * Navigates to the specified URL.
     * @param {string} destinationURL - The URL to navigate to. If not specified, a new blank window will be opened.
     * @param {string} destinationType - The type of destination. Supports the following values: "_newwindow", "_blank", "_parent", "_self", "_top", or the name of the window.
     * @returns {Window} - The newly opened window.
     */
    navigateTo: (destinationURL, destinationType) => cf.navigateTo(customFunctions.externalize(destinationURL), destinationType),

    /**
     * Default error handler for the invoke service API.
     * @param {object} response - The response body of the invoke service API.
     * @param {object} headers - The response headers of the invoke service API.
     * @param {object} globals - An object containing form instance and invoke method to call other custom functions.
     * @returns {void}
     */
    defaultErrorHandler: cf.defaultErrorHandler,

    /**
     * Handles the success response after a form submission.
     *
     * @param {object} globals - An object containing form instance and invoke method to call other custom functions.
     * @returns {void}
     */
    defaultSubmitSuccessHandler: cf.defaultSubmitSuccessHandler,

    /**
     * Handles the error response after a form submission.
     *
     * @param {string} defaultSubmitErrorMessage - The default error message.
     * @param {object} globals - An object containing form instance and invoke method to call other custom functions.
     * @returns {void}
     */
    defaultSubmitErrorHandler: cf.defaultSubmitErrorHandler,

    /**
     * Fetches the captcha token for the form.
     *
     * This function uses the Google reCAPTCHA Enterprise service to fetch the captcha token.
     *
     * @async
     * @param {object} globals - An object containing read-only form instance, read-only target field instance and methods for form modifications.
     * @returns {string} - The captcha token.
     */
    fetchCaptchaToken: cf.fetchCaptchaToken,

    /**
     * Converts a date to the number of days since the Unix epoch (1970-01-01).
     *
     * If the input date is a number, it is assumed to represent the number of days since the epoch,
     * including both integer and decimal parts. In this case, only the integer part is returned as the number of days.
     *
     * @param {string|Date|number} date - The date to convert.
     * Can be:
     * - An ISO string (yyyy-mm-dd)
     * - A Date object
     * - A number representing the days since the epoch, where the integer part is the number of days and the decimal part is the fraction of the day
     *
     * @returns {number} - The number of days since the Unix epoch
     */
    dateToDaysSinceEpoch: cf.dateToDaysSinceEpoch
};
