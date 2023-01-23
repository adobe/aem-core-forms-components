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
import Utils from "../src/utils.js";

test('readData test', () => {
    let element = {
        dataset: {
            "cmpIs" : "datepicker",
            "cmpFormcontainer": "/apps/mysite/container"
        }
    }
    let expected = {
        formcontainer: element.dataset.cmpFormcontainer
    }
    let result = Utils.readData(element, "cmp");
    expect(result.formcontainer).toBe(expected.formcontainer);
});

test('strip wrapped prefill json test', () => {
    let prefillJson = {
        "data": {
            "afData": {
                "afBoundData": {
                    "data": {
                        "Pet": {
                            "name": "ex cu_updated",
                            "id": 100
                        }
                    }
                },
                "afUnboundData": {
                    "data": {}
                }
            }
        }
    }
    let expected = prefillJson.data.afData.afBoundData;
    let result = Utils.stripIfWrapped(prefillJson);
    expect(result).toBe(expected);
});
