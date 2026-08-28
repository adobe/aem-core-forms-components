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
 * Fetches the captcha token for the form.
 *
 * Delegates to @aemforms/af-custom-functions for turnstile and reCAPTCHA Enterprise (unchanged
 * behavior). reCAPTCHA v3 is handled locally: the upstream package's fetchCaptchaToken only knows
 * about the grecaptcha.enterprise namespace, but v3 site keys use the classic (non-enterprise)
 * namespace and endpoint.
 *
 * @async
 * @param {object} globals - An object containing read-only form instance, read-only target field instance and methods for form modifications.
 * @returns {string} - The captcha token.
 */
function fetchCaptchaToken(globals) {
    var captcha = globals.form.$captcha;
    var config = captcha && captcha.$properties && captcha.$properties['fd:captcha'] && captcha.$properties['fd:captcha'].config;
    if (!config || config.version !== 'v3') {
        return cf.fetchCaptchaToken(globals);
    }
    return new Promise(function (resolve, reject) {
        try {
            var siteKey = config.siteKey;
            var captchaElementName = captcha.$name.replaceAll('-', '_');
            var captchaPath = captcha.$properties['fd:path'];
            var formName = '';
            var index = captchaPath ? captchaPath.indexOf('/jcr:content') : -1;
            if (index > 0) {
                captchaPath = captchaPath.substring(0, index);
                formName = captchaPath.substring(captchaPath.lastIndexOf('/') + 1).replaceAll('-', '_');
            }
            var actionName = 'submit_' + formName + '_' + captchaElementName;
            grecaptcha.ready(function () {
                grecaptcha.execute(siteKey, {action: actionName})
                    .then(function (token) { resolve(token); })
                    .catch(function (error) { reject(error); });
            });
        } catch (error) {
            reject(error);
        }
    });
}

function isArrayValue(obj) {
    return obj !== null && Object.prototype.toString.call(obj) === '[object Array]';
}

function valueOf(a) {
    if (a === null || a === undefined) {
        return a;
    }
    if (isArrayValue(a)) {
        return a.map(function (i) { return valueOf(i); });
    }
    return a.valueOf();
}

function toStringOrEmpty(a) {
    if (a === null || a === undefined) {
        return '';
    }
    return a.toString();
}

/**
 * Overrides @aemforms/af-core's built-in submitForm() rule action.
 *
 * Faithfully reimplements the original (both its current and deprecated call signatures - see
 * @aemforms/af-core's afb-runtime.js), but extends the auto-fetch-captcha-token-before-submit
 * condition to also cover reCAPTCHA v3 (the upstream implementation only checks
 * `captchaDisplayMode === "invisible"` (turnstile) or `version === "enterprise" && keyType ===
 * "score"` - v3 matches neither, so its token never got fetched and the required field stayed
 * empty at submit time). Registering a function under an existing name via
 * FunctionRuntime.registerFunctions is the same mechanism @aemforms/af-core itself relies on host
 * apps for (it has no default `fetchCaptchaToken` at all), so this is not a hack - custom
 * function-table entries are looked up dynamically by name and always take precedence over
 * defaults.
 *
 * @param {...*} args - Author-supplied arguments (payload/validateForm/contentType, or the
 *  deprecated success/error/contentType/data/validateForm form), followed by the globals object
 *  the framework always appends last.
 * @returns {object} - Empty object, matching the original's return value.
 */
function submitForm() {
    var allArgs = Array.prototype.slice.call(arguments);
    var globals = allArgs.pop();
    var args = allArgs;

    var success = null, error = null, submit_data, validate_form, submit_as;
    if (args.length > 0 && typeof valueOf(args[0]) === 'object') {
        submit_data = args.length > 0 ? valueOf(args[0]) : null;
        validate_form = args.length > 1 ? valueOf(args[1]) : true;
        submit_as = args.length > 2 ? toStringOrEmpty(args[2]) : 'multipart/form-data';
    } else {
        success = toStringOrEmpty(args[0]);
        error = toStringOrEmpty(args[1]);
        submit_as = args.length > 2 ? toStringOrEmpty(args[2]) : 'multipart/form-data';
        submit_data = args.length > 3 ? valueOf(args[3]) : null;
        validate_form = args.length > 4 ? valueOf(args[4]) : true;
    }

    // globals.form is the rule-node proxy - nested field access requires the $-prefixed
    // convention (matching fetchCaptchaToken's globals.form.$captcha above), unlike af-core's
    // original implementation which operates on the raw (non-proxy) interpreter.globals.form.
    //
    // XFA-rendered forms use a separate npm package (@aemforms/af-core-xfa) whose rule-node
    // proxy only defines a `get` trap (af-core's proxy also defines a `set` trap). Assigning
    // captcha.value = token therefore falls through to the default Proxy set behaviour, which
    // invokes Field's real `value` setter with `this` bound to the proxy instead of the raw
    // field instance; the setter's own `this.parent.uniqueItems` lookup then goes through the
    // same get trap, which has no case for bare (non-`$`, non-own-property) accessors like
    // `parent` and returns undefined, so the setter throws. Routing the same update through
    // globals.functions.dispatchEvent(captcha, 'custom:setProperty', {value}) instead - the same
    // mechanism af-core's own working `set` trap uses internally - looks the field up by id on
    // the raw (non-proxy) form and dispatches directly on it, so the setter runs with a real
    // `this` and never touches the proxy.
    var form = globals.form;
    var captcha = form.$captcha;
    var captchaConfig = captcha && captcha.$properties && captcha.$properties['fd:captcha'] &&
        captcha.$properties['fd:captcha'].config;
    var needsCaptchaToken = captcha && (
        captcha.$captchaDisplayMode === 'invisible' ||
        (captchaConfig && captchaConfig.version === 'enterprise' && captchaConfig.keyType === 'score') ||
        (captchaConfig && captchaConfig.version === 'v3')
    );
    var submitPayload = {success: success, error: error, submit_as: submit_as, validate_form: validate_form, data: submit_data};

    if (!needsCaptchaToken) {
        globals.functions.dispatchEvent('submit', submitPayload);
        return {};
    }

    return fetchCaptchaToken(globals).then(function (token) {
        globals.functions.dispatchEvent(captcha, 'custom:setProperty', {value: token});
        globals.functions.dispatchEvent('submit', submitPayload);
        return {};
    }).catch(function () {
        globals.functions.dispatchEvent('submitError', {type: 'FetchCaptchaTokenFailed'});
        return {};
    });
}

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
    externalize: cf.externalize,

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
     * When the error originates from Server-Side Validation (SSV), field-level errors
     * are shown inline under each affected field. All other failures fall back to the
     * default alert behaviour.
     *
     * @param {string} defaultSubmitErrorMessage - Localised fallback error message.
     * @param {object} globals - An object containing form instance and invoke method to call other custom functions.
     * @returns {void}
     */
    defaultSubmitErrorHandler: function (defaultSubmitErrorMessage, globals) {
        var payload = globals && globals.event && globals.event.payload;
        var body = payload && payload.body;

        if (body && body.errorType === 'SSV_VALIDATION_ERROR' &&
                Array.isArray(body.errors) && body.errors.length > 0) {

            var fieldErrors = body.errors.filter(function (e) { return e.qualifiedName; });
            var formErrors  = body.errors.filter(function (e) { return !e.qualifiedName; });

            // Mark each named field invalid inline.
            // globals.formModel is the actual FormModel (not the rule-node proxy) so
            // resolveQualifiedName() and markAsInvalid() work without proxy restrictions.
            // qualifiedName (e.g. "$form.panel.email") is the canonical AF form field identifier
            // and is unique even when multiple panels share the same field name.
            var formModel = globals.formModel;
            fieldErrors.forEach(function (error) {
                var field = formModel && typeof formModel.resolveQualifiedName === 'function'
                    ? formModel.resolveQualifiedName(error.qualifiedName)
                    : null;
                if (field) {
                    field.markAsInvalid(error.message);
                } else {
                    console.warn('[SSV] No field found for qualifiedName "' + error.qualifiedName + '" — error not shown inline: ' + error.message);
                }
            });

            // Show form-level errors (no specific field) as an alert
            if (formErrors.length > 0) {
                window.alert(formErrors.map(function (e) { return e.message; }).join('\n'));
            }

        } else {
            // Normal submit failure — show the generic localised message
            cf.defaultSubmitErrorHandler(defaultSubmitErrorMessage, globals);
        }
    },

    /**
     * Fetches the captcha token for the form.
     *
     * Supports turnstile, reCAPTCHA Enterprise (via @aemforms/af-custom-functions), and
     * reCAPTCHA v3 (handled locally - see fetchCaptchaToken above).
     *
     * @async
     * @param {object} globals - An object containing read-only form instance, read-only target field instance and methods for form modifications.
     * @returns {string} - The captcha token.
     */
    fetchCaptchaToken: fetchCaptchaToken,

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
    dateToDaysSinceEpoch: cf.dateToDaysSinceEpoch,

    /**
     * Downloads the Document of Record (DoR) for the form.
     *
     * @param {string=} fileName - The name of the file to be downloaded. Defaults to "Downloaded_DoR.pdf" if 
     *  not specified.
     * @param {scope} globals - An object containing read-only form instance, read-only target field instance, 
     *  and methods for form modifications.
     * @returns {void}
     */
    downloadDoR: cf.downloadDoR,

    /**
    * Export form data as a JSON string
    * @param {boolean} [stringify] - Convert the form data to a JSON string, defaults to true
    * @param {string} [key] - The key to get the value for (supports dot notation and array brackets e.g. 'address.city' or 'items[0].name'), defaults to all form data
    * @param {scope} globals - Global scope object containing form context
    * @returns {string|object} The complete form data as a JSON string
    */
    exportFormData: cf.exportFormData,

    /**
     * Submits the form.
     *
     * Overrides @aemforms/af-core's built-in submitForm() so that reCAPTCHA v3 also gets its
     * token auto-fetched before submit (see submitForm above for why this is needed and why
     * overriding by name is safe).
     *
     * @param {*} [payload] - Data to submit, or (deprecated usage) a success-redirect URL.
     * @param {boolean} [validateForm] - Whether to validate the form before submitting, or
     *  (deprecated usage) an error-redirect URL.
     * @param {string} [contentType] - The content type to submit as.
     * @returns {object} - Empty object.
     */
    submitForm: submitForm
};
