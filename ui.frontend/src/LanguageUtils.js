/*******************************************************************************
 * Copyright 2023 Adobe
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
import {setCustomDefaultConstraintTypeMessages} from "@aemforms/af-core";

/**
 * @module FormView
 */

/**
 * Utility class for language-related operations.
 */
class LanguageUtils {
    /**
     * Internal map to store loaded language data.
     * @type {Object.<string, Object>}
     * @private
     */
    static #langData = {};

    /**
     * Load language data from the given URL.
     * @param {string} lang - The language.
     * @param {string} url - The URL of the language strings.
     * @returns {Promise<void>} A promise that resolves when the language data is loaded.
     * @fires module:FormView~Constants#FORM_LANGUAGE_INITIALIZED
     */
    static async loadLang(lang, url, executeConfigsAndFireEvent = false) {
        if (!(lang in this.#langData)) {
            // todo: avoid doing this call in product json if locale not found
            // todo: can't find a condition today, since language client library can be overlaid too
            const _langData = await HTTPAPILayer.getJson(url);
            if(_langData) {
                console.debug("fetched language data", _langData);
                this.#langData[lang] = _langData;
                setCustomDefaultConstraintTypeMessages(_langData);
            }
            if (executeConfigsAndFireEvent) {
                await this.#executeLanguageConfigs(lang);
                const event = new CustomEvent(Constants.FORM_LANGUAGE_INITIALIZED, {"detail": lang});
                document.dispatchEvent(event);
            }
        }
    }

    /**
     * Execute language-specific configuration functions for the given language.
     * @param {string} lang - The language code for which to execute configurations.
     * @private
     * @static
     * @async
     */
    static async #executeLanguageConfigs(lang) {
        let functionConfigs = guideBridge.getConfigsForKey(guideBridge.ConfigKeys.LOCALE_CONFIG) || [];
        functionConfigs = functionConfigs.map(configEntry => configEntry.fn).filter(fn => typeof fn === 'function');
        for (const fn of functionConfigs) {
            await fn(lang);
        }
    }



    /**
     * Returns the translated string for the given language and key.
     * @param {string} lang - The language.
     * @param {string} key - The key for which the translation needs to be fetched.
     * @param {string[]} snippets - An array of template values.
     * @returns {string} The translated string.
     */
    static getTranslatedString(lang, key, snippets) {
        let translatedText = "";
        if (lang in this.#langData)
        {
            translatedText = this.#langData[lang][key];
            if (snippets) {
                //resolve message with snippet
                translatedText = translatedText.replace(/{(\d+)}/g, function (match, number) {
                    return typeof snippets[number] != 'undefined'
                        ? snippets[number]
                        : match;
                });
            }
        }
        return translatedText;
    }

}

export default LanguageUtils;
