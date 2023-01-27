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

export default class LanguageUtils {
    static #langData = {};

    /**
     * Load language data from the given URL
     * @param lang language
     * @param url  url of the language strings
     */
    static async loadLang(lang, url) {
        if (!(lang in this.#langData))
        {
            const _langData = await HTTPAPILayer.getJson(url);
            console.debug("fetched language data", _langData);
            this.#langData[lang] = _langData;
        }
    }

    /**
     * Returns the translated string for the given language
     * @param lang      language
     * @param key       key for which translation needs to be fetched
     * @param snippets  comma separated list of template value
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
