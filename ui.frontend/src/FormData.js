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
    data;  // keeping public as per AF v1
    contentType;
    attachments;

    constructor(params) {
        this.data = params.data;
        this.contentType = "application/json";
        this.attachments = params.attachments;
    }

    /**
     * Returns actual form data
     */
    getData() {
        return this.data;
    }

    /**
     * Returns Content type of form data
     */
    getContentType() {
        return this.contentType;
    }

    /**
     * Returns list of attachments
     */
    getAttachments() {
        return this.attachments;
    }

    /**
     * This returns the html form data representation of adaptive form data. This could be used to submit the adaptive form data to
     * external end point from the client. The HTML form data contains the following the key / value pairs:
     * 1. data -> contains form data represented as string
     * 2. contentType -> contains content type of form data (it would be application/xml or application/json)
     * 2. fileAttachments -> list of blobs containing the file (in case of fileUrl's the type of blob would be application/json)
     * 3. fileAttachmentBindRefs -> list of string containing file bindRef's, this has one to one mapping with fileAttachments
     * @returns {*}
     */
    toHTMLFormData() {
        let formData = new FormData();
        if (this.contentType) {
            formData.append("contentType", this.contentType);
        }
        formData.append("data", this.data);
        for (let index = 0; index < this.attachments.length; index++) {
            let fileAttachmentWrapper = this.attachments[index];
            // 2nd parameter should be of blob type, hence adding an explicit check here
            // we could have created dataURL for all the files in the client, but this would cause the browser
            // to slow down since it would serialize the binary, hence following the below approach
            if (typeof File !== 'undefined' && fileAttachmentWrapper.data instanceof File) {
                formData.append("fileAttachments", fileAttachmentWrapper.data, fileAttachmentWrapper.name);
            } else {
                // blob is supported on all major browsers
                let urlBlob = new Blob([
                    JSON.stringify({
                        "data" : fileAttachmentWrapper.data,
                        "name" : fileAttachmentWrapper.name,
                        "contentType" : fileAttachmentWrapper.contentType
                    })
                ], { type: 'application/json' });
                formData.append("fileAttachments", urlBlob);
            }
            // af v2 new property name for bindRef is dataRef
            formData.append("fileAttachmentBindRefs", fileAttachmentWrapper.dataRef);
        }
        return formData;
    }

    toJsObject() {
        return {
            "data" : this.data,
            "contentType" : this.contentType,
            "attachments" : this.attachments
        }
    }

}