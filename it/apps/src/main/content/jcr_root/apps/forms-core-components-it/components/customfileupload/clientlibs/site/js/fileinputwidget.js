/*******************************************************************************
 * Copyright 2026 Adobe
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
 * This class is responsible for interacting with the file input widget. It implements the file preview,
 * file list, handling invalid file size, file name, file mime type functionality
 */

if (typeof window.CustomFileInputWidget === 'undefined') {
    /**
     * Custom file widget that validates selected files, uploads them to the presign endpoint,
     * and persists the resulting URL(s) in the form model data for export.
     */
    window.CustomFileInputWidget = class extends FormView.FormFileInputWidget {

        /**
         * Constructor for CustomFileInputWidget
         * @param {Object} params - The parameters for initializing the widget
         */
        constructor(params) {
            super(params);
        }

        /**
         * Attaches event handlers to the widget and drag area
         * @param {HTMLElement} widget - The file input element
         * @param {HTMLElement} dragArea - The drag and drop area element
         * @param {Object} model - The form model
         */
        attachEventHandlers(widget, dragArea, model) {
            super.attachEventHandlers(widget, dragArea, model)
            const customBtn = dragArea?.querySelector(".cmp-adaptiveform-fileinput__widgetlabel")
            customBtn?.addEventListener("click", () => {
                widget.click();
            });
            customBtn?.addEventListener('keydown', function(event) {
                // Check if the Enter key is pressed
                if (event.key === 'Enter' || event.keyCode === 13) {
                    // Trigger the click event of the file input
                    widget.click();
                }
            });
        }

        /**
         * Creates a file list item DOM element
         * @param {string} fileName - The name of the file
         * @param {number} fileSize - The size of the file in bytes
         * @param {string} comment - Optional comment for the file
         * @param {string} fileUrl - The URL of the uploaded file
         * @returns {HTMLElement} The file item DOM element
         */
        fileItem(fileName, fileSize, comment, fileUrl) {
            let self = this;
            let id = `${Date.now() + '_' + Math.floor(Math.random() * 10000)}_file_size`
            let fileItem = document.createElement('li');
            fileItem.setAttribute("class", "cmp-adaptiveform-fileinput__fileitem");
            let fileNameDom = document.createElement('a');
            let fileSizeDom = document.createElement('span');

            fileSizeDom.setAttribute('class', "cmp-adaptiveform-fileinput__filesize");
            fileSizeDom.setAttribute('id', id);
            fileSizeDom.setAttribute('hidden', true);
            fileSizeDom.textContent = this.formatBytes(fileSize);

            fileNameDom.setAttribute('tabindex', '0');
            fileNameDom.setAttribute('class', "cmp-adaptiveform-fileinput__filename");
            fileNameDom.setAttribute('aria-describedby', id);
            fileNameDom.textContent = fileName;
            fileNameDom.addEventListener('keypress', function(e) {
                if (e.keyCode === 13 || e.charCode === 32) {
                    e.target.click();
                }
            });
            fileNameDom.addEventListener('click', function(e) {
                self.handleFilePreview(e);
            });
            fileItem.appendChild(fileNameDom);
            if(fileUrl != null){
                fileNameDom.dataset.key = fileUrl;
            }
            let fileEndContainer = document.createElement('span');
            let fileClose = document.createElement('button');
            fileEndContainer.setAttribute('class', "cmp-adaptiveform-fileinput__fileendcontainer");
            fileClose.setAttribute('tabindex', '0');
            fileClose.setAttribute('class', "cmp-adaptiveform-fileinput__filedelete");
            fileClose.setAttribute('aria-label', FormView.LanguageUtils.getTranslatedString(this.lang, "FileCloseAccessText") + fileName);
            fileClose.textContent = "x";
            fileClose.addEventListener('keypress', function(e) {
                if (e.keyCode === 13 || e.charCode === 32) {
                    e.target.click();
                }
            });
            fileClose.addEventListener('click', function(e) {
                self.handleClick(e);
            });
            fileEndContainer.appendChild(fileSizeDom);
            fileEndContainer.appendChild(fileClose);
            fileItem.appendChild(fileEndContainer);
            return fileItem;
        }

        handleChange(filesUploaded) {
            if (!this.isFileUpdate) {
                let currFileName = '',
                    inValidSizefileNames = '',
                    inValidNamefileNames = '',
                    inValidMimeTypefileNames = '',
                    self = this,
                    uris = [],
                    files = filesUploaded;
                // Initially set the invalid flag to false
                let isInvalidSize = false,
                    isInvalidFileName = false,
                    isInvalidMimeType = false;
                //this.resetIfNotMultiSelect();
                if (typeof files !== "undefined") {
                    let invalidFilesIndexes = [];
                    let validFiles = [];
                    Array.from(files).forEach(function (file, fileIndex) {
                        let isCurrentInvalidFileSize = false,
                            isCurrentInvalidFileName = false,
                            isCurrentInvalidMimeType = false;
                        currFileName = file.name.split("\\").pop();
                        // Now size is in MB
                        let size = file.size / 1024 / 1024;
                        // check if file size limit is within limits
                        if ((size > parseFloat(this.options.maxFileSize))) {
                            isInvalidSize = isCurrentInvalidFileSize = true;
                            inValidSizefileNames = currFileName + "," + inValidSizefileNames;
                        } else if (!CustomFileInputWidget.isValid(currFileName)) {
                            // check if file names are valid (ie) there are no control characters in file names
                            isInvalidFileName = isCurrentInvalidFileName = true;
                            inValidNamefileNames = currFileName + "," + inValidNamefileNames;
                        } else {
                            let isMatch = false;
                            let extension = currFileName.split('.').pop();
                            let mimeType = (file.type) ? file.type : self.extensionToMimeTypeMap[extension];
                            if (mimeType != undefined && mimeType.trim().length > 0) {
                                isMatch = this.regexMimeTypeList.some(function (rx) {
                                    return rx.test(mimeType);
                                });
                            }
                            if (!isMatch) {
                                isInvalidMimeType = isCurrentInvalidMimeType = true;
                                inValidMimeTypefileNames = currFileName + "," + inValidMimeTypefileNames;
                            }
                        }

                        // if the file is not invalid, show it and push it to internal array
                        if (!isCurrentInvalidFileSize && !isCurrentInvalidFileName && !isCurrentInvalidMimeType) {
                            // We'll update this.values with the complete URL later
                            validFiles.push(file);
                        } else {
                            invalidFilesIndexes.push(fileIndex);
                        }
                    }, this);

                    // Handle file upload for valid files
                    if (validFiles.length > 0) {
                        // Upload file and get URL
                        let fileUrl = this.uploadFile(validFiles);
                        if (this.isMultiSelect()) {
                            Array.from(validFiles).forEach(function (file, fileIndex) {
                                let completeUrl = fileUrl + "/" + file.name;
                                uris.push(completeUrl);
                                this.fileArr.push(completeUrl);
                                this.values.push(completeUrl);
                            }, this);
                        } else {
                            let completeUrl = fileUrl + "/" + validFiles[0].name;
                            this.values = [completeUrl];
                            this.fileArr = [completeUrl];
                            uris.push(completeUrl);
                        }
                    }

                    if (invalidFilesIndexes.length > 0 && this.widget !== null) {
                        this.deleteFilesFromInputDom(invalidFilesIndexes);
                    }
                }

                // set the new model value.
                this.model.value = this.fileArr;

                const filenames = this.fileList.querySelectorAll('.cmp-adaptiveform-fileinput__filename');
                const filesizes = this.fileList.querySelectorAll('.cmp-adaptiveform-fileinput__filesize');
                Array.from(uris).forEach(function (uri, fileIndex) {
                    filenames[fileIndex].dataset.key = uri;
                    filesizes[fileIndex].hidden = true;
                }, this);

                if (isInvalidSize) {
                    this.showInvalidMessage(inValidSizefileNames.substring(0, inValidSizefileNames.lastIndexOf(',')), this.invalidFeature.SIZE);
                } else if (isInvalidFileName) {
                    this.showInvalidMessage(inValidNamefileNames.substring(0, inValidNamefileNames.lastIndexOf(',')), this.invalidFeature.NAME);
                } else if (isInvalidMimeType) {
                    this.showInvalidMessage(inValidMimeTypefileNames.substring(0, inValidMimeTypefileNames.lastIndexOf(',')), this.invalidFeature.MIMETYPE);
                }
            }
            this.widget.value = null;
        }

        uploadFile (filesObject) {
            let s3UploadUrl = "/services/s3/presign", // URL for getting S3 presigned URL
                multiple = this.isMultiSelect(); // Check if multiple files can be uploaded;

            let self = this;
            if (multiple) {
                let uploadPromises = [];
                Array.from(filesObject).forEach(function (file, fileIndex) {
                    uploadPromises.push(self.uploadFileToS3(file, s3UploadUrl, file.name));
                }, this);

                // Wait for all files to upload
                Promise.all(uploadPromises).then(function(results) {
                    console.log("file uploaded successfully");
                    //self.handleMultipleFileUpload(results);
                }).catch(function(error) {
                    console.error("Error uploading files:", error);
                    //self.$element.trigger("adobeFileUploader.fileUploadFailed");
                });
            } else {
                this.uploadFileToS3(filesObject[0], s3UploadUrl, filesObject[0].name).then(function(result) {
                    console.log("file uploaded successfully");
                }).catch(function(error) {
                    console.error("Error uploading file:", error);
                    // self.$element.trigger("adobeFileUploader.fileUploadFailed");
                });
            }
            return s3UploadUrl;
        }

        // Helper method to handle file upload to S3
        uploadFileToS3(file, presignEndpoint, fileName) {
            console.log("Uploading file:", fileName);
            // Return a resolved promise with a sample URL
            // This is just for testing - replace with actual implementation
            return new Promise((resolve) => {
                // Simulate network delay
                setTimeout(() => {
                    // For testing: construct a sample URL using the fileName
                    const sampleUrl = presignEndpoint + "/" + fileName;

                    // Return an object with url and other metadata
                    resolve({
                        success: true,
                        url: sampleUrl,
                        fileName: fileName,
                        fileSize: file.size,
                        fileType: file.type,
                        lastModified: file.lastModified
                    });
                }, 500); // 500ms delay to simulate network request
            });

            /* Real implementation would look like this:
            return fetch(presignEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fileName: fileName,
                    contentType: file.type
                })
            })
            .then(response => response.json())
            .then(presignedData => {
                return fetch(presignedData.url, {
                    method: 'PUT',
                    body: file,
                    headers: presignedData.headers || {}
                });
            })
            .then(() => {
                return {
                    success: true,
                    url: this.fileUrl,
                    fileName: fileName
                };
            });
            */
        }
    }
}