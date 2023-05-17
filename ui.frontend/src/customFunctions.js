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
 *
 * @param str {string} json string to convert custom function to object
 * @return {object} JSON Object after parsing the string as json. In case of
 * exceptions empty object is returned
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
 * prefixes the url with the context path
 * @param url {string}
 * @returns {string}
 */
function externalize(url) {
    if (window?.Granite?.HTTP && typeof (window.Granite.HTTP.externalize === "function")) {
        return window.Granite.HTTP.externalize(url);
    } else {
        return url;
    }
}

/**
 * Validates if the given URL is correct
 * @param url
 * @returns {boolean}
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
 * Navigates to the URl mentioned. By specifying the location, you can set the name of the window you are going to open
 * @param destinationURL   {string} URL complete URL. If you do not specify any URL in this function, it will open a new blank window
 * @param destinationType {string} destinationType supports the following values, "_newwindow", "_blank", "_parent", "_self", "_top" or name of the window
 * @returns newly opened window
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
 * Default Error handler for invoke service rule
 * @name defaultErrorHandler Default Error Handler Function
 * @errorHandler
 */
function defaultErrorHandler(response, headers, globals) {
    if(response && response.validationErrors) {
        response.validationErrors?.forEach(function (violation) {
            if (violation.details && (violation.fieldName || violation.dataRef)) {
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

export const customFunctions = {
    toObject,
    externalize,
    navigateTo,
    defaultErrorHandler
};
