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

const NS = "cmp";

export default function readData(element, clazz) {
    const data = element.dataset;
    let options = [];
    let capitalized = clazz;
    capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
    const reserved = ["is", "hook" + capitalized];

    for (let key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            let value = data[key];
            if (key.indexOf(NS) === 0) {
                key = key.slice(NS.length);
                key = key.charAt(0).toLowerCase() + key.substring(1);
                if (reserved.indexOf(key) === -1) {
                    options[key] = value;
                }
            }
        }
    }
    return options;
}
