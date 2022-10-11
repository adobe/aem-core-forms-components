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
 * JavaScript class to represent Adaptive Form data
 * @class AfFormData
 */
export default class AfFormData {
    #data;
    #contentType;
    #attachments;

    constructor(params) {
        this.#data = params.data;
        this.#contentType = "application/json";
        this.#attachments = params.attachments;
    }

    /**
     * Returns actual form data
     */
    getData() {
        return this.#data;
    }

    /**
     * Returns Content type of form data
     */
    getContentType() {
        return this.#contentType;
    }

    /**
     * Returns list of attachments
     */
    getAttachments() {
        return this.#attachments;
    }

    /**
     * This returns the html form data representation of adaptive form data. This could be used to submit the adaptive form data to
     * external end point from the client. The HTML form data contains the following the key / value pairs:
     * 1. data -> contains form data represented as string
     * 2. contentType -> contains content type of form data (it would be application/xml or application/json)
     * @returns {*}
     */
    toHTMLFormData() {
        let formData = new FormData();
        if (this.#contentType) {
            formData.append("contentType", this.#contentType);
        }
        formData.append("data", this.#data);
        //todo: handle attachments
        return formData;
    }

    toJsObject() {
        return {
            "data" : this.#data,
            "contentType" : this.#contentType,
            "attachments" : this.#attachments
        }
    }

}