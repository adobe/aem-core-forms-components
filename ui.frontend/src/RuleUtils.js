/*******************************************************************************
 * Copyright 2025 Adobe
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

import HTTPAPILayer from "./HTTPAPILayer.js";
import {FunctionRuntime} from '@aemforms/af-core';

/**
 * @module FormView
 */

/**
 * Utility class with various helper functions related to rules.
 */
class RuleUtils {
    /**
     * @deprecated Use `registerCustomFunctionsV2` instead.
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
     * Registers custom functions from clientlibs.
     * @param {object} formJson - The Sling model exporter representation of the form
     */
    static async registerCustomFunctionsV2(formJson) {
        let funcConfig;
        let customFunctions = [];
        const customFunctionsUrl = formJson.properties['fd:customFunctionsUrl'];
        if (customFunctionsUrl) {
            funcConfig = await HTTPAPILayer.getJson(customFunctionsUrl);
        } else {
            funcConfig = await HTTPAPILayer.getCustomFunctionConfig(formJson.id);
        }
        console.debug("Fetched custom functions: " + JSON.stringify(funcConfig));
        
        if (funcConfig && funcConfig.clientSideParsingEnabled) {
            customFunctions = this.extractFunctionNames(formJson);
        } else if (funcConfig && funcConfig.customFunction) {
            customFunctions = funcConfig.customFunction;
        }

        const funcObj = customFunctions.reduce((accumulator, func) => {
            if (Object.prototype.hasOwnProperty.call(window, func.id) && typeof window[func.id] === 'function') {
                accumulator[func.id] = window[func.id];
            }
            return accumulator;
        }, {});
        console.debug("Registering custom functions:", funcObj);
        FunctionRuntime.registerFunctions(funcObj);
    }
    
    /**
     * Extract custom functions from form json and return them in the required format.
     * @param {object} formJson - The Sling model exporter representation of the form
     * @returns {Array<{id: string}>} - Array of objects with function names as ids
     */
    static extractFunctionNames = (formJson) => {
        const functionNames = new Set();
        
        // Helper function to extract function names from rule expressions
        const extractFunctionNamesFromRuleExpression = (ruleExpression) => {
            // Match patterns like functionName() with optional parameters
            const functionPattern = /(\w+)\s*\(/g;
            let match;
            
            while ((match = functionPattern.exec(ruleExpression)) !== null) {
                // Add the function name to our set
                functionNames.add(match[1]);
            }
        };
        
        // Process events at the form level
        if (formJson.events) {
            Object.values(formJson.events).forEach(eventArray => {
                eventArray.forEach(eventString => {
                    extractFunctionNamesFromRuleExpression(eventString);
                });
            });
        }

        // Process rules at the form level
        if (formJson.rules) {
            Object.values(formJson.rules).forEach(ruleExpression => {
                extractFunctionNamesFromRuleExpression(ruleExpression);
            });
        }
        
        // Recursively process events and rules in form items
        const processItems = (items) => {
            if (!items) return;
            
            Object.values(items).forEach(item => {
                
                if (item.validationExpression) {
                    extractFunctionNamesFromRuleExpression(item.validationExpression);
                }
                if (item.displayValueExpression) {
                    extractFunctionNamesFromRuleExpression(item.displayValueExpression);
                }

                if (item.events) {
                    Object.values(item.events).forEach(eventArray => {
                        eventArray.forEach(eventString => {
                            extractFunctionNamesFromRuleExpression(eventString);
                        });
                    });
                }

                // Process rules within items
                if (item.rules) {
                    Object.values(item.rules).forEach(ruleExpression => {
                        extractFunctionNamesFromRuleExpression(ruleExpression);
                    });
                }
                
                // Process nested items if they exist
                if (item[':items']) {
                    processItems(item[':items']);
                }
            });
        };
        
        if (formJson[':items']) {
            processItems(formJson[':items']);
        }

        console.debug("Extracted function names from form JSON:", functionNames);

        return Array.from(functionNames).map(functionName => ({
            id: functionName
        }));
    };

    /**
     * Registers exported custom functions from a given script URL.
     * @param {string} url - The script URL to load custom functions from.
     * @throws {Error} - If there's an error loading the custom functions from the URL.
     * @returns {Promise<void>} - A promise that resolves when the functions are registered.
     */
    static async registerCustomFunctionsByUrl(url) {
        try {
            if (url != null && url.trim().length > 0) {
                // webpack ignore is added because webpack was converting this to a static import upon bundling resulting in error.
                //This Url should whitelist the AEM author/publish domain in the Cross Origin Resource Sharing (CORS) configuration.
                const customFunctionModule = await import(/*webpackIgnore: true*/ url);
                const keys = Object.keys(customFunctionModule);
                const functions = [];
                for (const name of keys) {
                    const funcDef = customFunctionModule[name];
                    if (typeof funcDef === 'function') {
                        functions[name] = funcDef;
                    }
                }
                FunctionRuntime.registerFunctions(functions);
            }
        } catch (e) {
            if(window.console){
                console.error("error in loading custom functions from url "+url+" with message "+e.message);
            }
        }
    }
}

export default RuleUtils;
