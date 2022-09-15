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

export default class HTTPAPILayer {

    static async getFormDefinition(formId) {
        return await this.#getJson("/adobe/forms/af/v1/" + formId);
    }

    static async getPrefillData(formId, dataRef) {
        return await this.#getJson("/adobe/forms/af/v1/data/" + formId + "?dataRef=" + dataRef);
    }

    static async getFormsList() {
        return await this.#getJson("/adobe/forms/af/v1/listforms");
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