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
 * This class is responsible for interacting with the file input widget. It implements the file preview,
 * file list, handling invalid file size, file name, file mime type functionality
 */

if (typeof window.FileInputWidget === 'undefined') {
    window.FileInputWidget = class extends FormView.FormFileInputWidget {

        constructor(params) {
            super(params);
        }

        attachEventHandlers(widget, dragArea, model) {
            super.attachEventHandlers(widget, model)
            dragArea?.addEventListener("dragover", (event)=>{
                event.preventDefault();
            });
            dragArea?.addEventListener("drop", (event)=>{
            event.preventDefault(); 
            this.handleChange(event?.dataTransfer?.files);
            });
            dragArea?.addEventListener("paste", (event)=>{
                event.preventDefault();
                this.handleChange(event?.clipboardData?.files);
            });
        }
        /**
         * This event listener gets called on click of close button in file upload
         *
         * @param event
         */
        handleClick (event){
            let elem = event.target,
                text = elem.parentElement.previousSibling.textContent,
                index = this.getIndexOfText(text, elem),
                url = elem.parentElement.previousSibling.dataset.key,
                objectUrl = elem.parentElement.previousSibling.dataset.objectUrl;
            if (index !== -1) {
                this.values.splice(index, 1);
                this.fileArr.splice(index, 1);
                // set the model with the new value
                this.model.value = this.fileArr;
                // value and fileArr contains items of both URL and file types, hence while removing from DOM
                // get the correct index as per this.#widget.files
                let domIndex = Array.from(this.widget.files).findIndex(function(file) {
                return file.name === text;
                });
                this.deleteFilesFromInputDom([domIndex]);
                if (url != null) {
                    // remove the data so that others don't use this url
                    delete elem.parentElement.previousSibling.dataset.key;
                }
                if(objectUrl) {
                    // revoke the object URL to avoid memory leaks in browser
                    // since file is anyways getting deleted, remove the object URL's too
                    window.URL.revokeObjectURL(objectUrl);
                }
            }
            // Remove the dom from view
            //All bound events and jQuery data associated with the element are also removed
            elem.parentElement.parentElement.remove();
            // Set the focus on file upload button after click of close
            this.widget.focus();

        }

        formatBytes(bytes, decimals = 0) {
            if (!+bytes) return '0 Bytes'
            const k = 1024
            const dm = decimals < 0 ? 0 : decimals
            const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
        
            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
        }

        setValue(value) {
            let isValueSame = false;
            if (value != null) {
                // change to array since we store array internally
                value = Array.isArray(value) ? value : [value];
            }
            // check if current values and new values are same
            if (this.fileArr != null && value != null) {
                isValueSame = JSON.stringify(FormView.FileAttachmentUtils.extractFileInfo(this.fileArr)) === JSON.stringify(value);
            }
            // if new values, update the DOM
            if (!isValueSame) {
                let oldUrls = {};
                // Cache the url before deletion
                this.fileList.querySelectorAll(".cmp-adaptiveform-fileinput__filename").forEach(function (elem) {
                    let url = elem.dataset.key;
                    if (typeof url !== "undefined") {
                        let fileName = url.substring(url.lastIndexOf("/") + 1);
                        oldUrls[fileName] = url;
                    }
                });
                // empty the file list
                while (this.fileList.lastElementChild) {
                    this.fileList.removeChild(this.fileList.lastElementChild);
                }
                // set the new value
                if (value != null) {
                    let self = this;
                    // Update the value array with the file
                    this.values = value.map(function (file, index) {
                        // Check if file Name is a path, if yes get the last part after "/"
                        let isFileObject= window.File ? file.data instanceof window.File : false,
                            fileName = typeof file === "string" ? file : file.name,
                            fileUrl = typeof file === "string" ? file : (isFileObject ? "" : file.data),
                            fileSize = file.size,
                            fileUploadUrl = fileUrl;
                        if (oldUrls[fileName]) {
                            fileUploadUrl = oldUrls[fileName];
                        }
                        self.showFileList(fileName, fileSize, null, fileUploadUrl);
                        return fileName;
                    });
                    this.fileArr = [...value];
                }
            }
        }

        fileItem(fileName, fileSize, comment, fileUrl) {
            let self = this;
            let fileItem = document.createElement('li');
            fileItem.setAttribute("class", "cmp-adaptiveform-fileinput__fileitem");
            let fileNameDom = document.createElement('span');
            let fileSizeDom = document.createElement('span');

            fileSizeDom.setAttribute('class', "cmp-adaptiveform-fileinput__filesize");
            fileSizeDom.textContent = this.formatBytes(fileSize);

            fileNameDom.setAttribute('tabindex', '0');
            fileNameDom.setAttribute('class', "cmp-adaptiveform-fileinput__filename");
            fileNameDom.setAttribute('aria-label', fileName);
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
            let fileClose = document.createElement('span');
            fileEndContainer.setAttribute('class', "cmp-adaptiveform-fileinput__fileendcontainer");
            fileClose.setAttribute('tabindex', '0');
            fileClose.setAttribute('class', "cmp-adaptiveform-fileinput__filedelete");
            fileClose.setAttribute('aria-label', FormView.LanguageUtils.getTranslatedString(this.lang, "FileCloseAccessText") + fileName);
            fileClose.setAttribute('role', 'button');
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

        showFileList(fileName, fileSize, comment, fileUrl) {
            if(!this.isMultiSelect() || fileName === null || typeof fileName === "undefined") {
                // if not multiselect, remove all the children of file list
                while (this.fileList.lastElementChild) {
                    this.fileList.removeChild(this.fileList.lastElementChild);
                }
            }

            // Add the file item
            // On click of close, remove the element and update the model
            // handle on click of preview button
            if(fileName != null) {
            this.fileList.append(this.fileItem(fileName, fileSize, comment, fileUrl));
            }
        }

    }
}