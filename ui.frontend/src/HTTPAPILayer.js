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
import {Constants} from "./constants";

export default class HTTPAPILayer {

    static async getForm(formContainerPath) {
        const _formPath = formContainerPath.substring(0, formContainerPath.indexOf("/jcr:content/guideContainer"));
        const _formsList =  await this.#getFormsList();
        if (_formsList) {
            return await this.#findForm(_formPath, _formsList);
        } else {
            throw new Error("Error in fetching form");
        }
    }

    static async getFormDefinition(formId) {
        return await this.#getJson(Constants.API_PATH_PREFIX + "/" + formId);
    }

    static async #findForm(formPath, formsList) {
        const _form = formsList.items.find((form) => {return form.path === formPath});
        if (_form) {
            return _form;
        } else if (formsList._links && formsList._links.next) {
            const _nextList = await this.#getJson(formsList._links.next);
            await this.#findForm(formPath, _nextList);
        } else {
            throw new Error("Form at " + formPath +  " Not Found");
        }
    }

    static async #getFormsList() {
        return await this.#getJson(Constants.API_PATH_PREFIX + "/listforms");
    }

    static async getPrefillData(formId, dataRef) {
        return await this.#getJson(Constants.API_PATH_PREFIX + "/data/" + formId + "?dataRef=" + dataRef);
    }

    static #getJson(url) {
        return new Promise(resolve => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
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
}