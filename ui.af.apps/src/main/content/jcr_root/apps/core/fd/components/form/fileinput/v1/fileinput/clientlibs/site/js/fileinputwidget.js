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
class FileInputWidget {
    #fileItemSelector='.cmp-adaptiveform-fileinput__fileitem'
    #widget=null
    #fileArr=[]
    #fileList=null
    #lang="en"
    #model=null // passed by reference
    #isFileUpdate=false // handle safari state
    #options=null // initialize options
    #regexMimeTypeList=[] // initialize
    #values=[] // initialize
    #invalidFeature={
        "SIZE":1,
        "NAME":2,
        "MIMETYPE":3
    }
    #initialFileValueFileNameMap;

    constructor(widget, fileList, model) {
        // initialize the widget and model
        this.#widget = widget;
        this.#model = model;
        this.#fileList = fileList;
        // get the current lang
        this.#lang = this.#model.form._jsonModel.lang; // todo: change this later, once API is added in af-core
        // initialize options for backward compatibility
        this.#options = Object.assign({}, {
            "contextPath" : ""
        }, this.#model._jsonModel);
        this.#attachEventHandlers(widget);
        // initialize the regex initially
        this.#regexMimeTypeList  = this.#options.accept.map(function (value, i) {
            try {
                return new RegExp(value.trim());
            } catch (e) {
                // failure during regex parsing, don't return anything specific to this value since the value contains
                // incorrect regex string
                if(window.console) {
                    console.log(e);
                }
            }
        });
    }

    #attachEventHandlers(widget, model) {
        widget.addEventListener('change', (e)=> {
            this.#handleChange(e);
        });
    }

    // checks if file name is valid or not to prevent security threats
    static isValid(fname) {
        let rg1=/^[^\\/:\*\;\$\%\?"<>\|]+$/; // forbidden characters \ / : * ? " < > | ; % $
        let rg2=/^\./; // cannot start with dot (.)
        let rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
        return rg1.test(fname) && !rg2.test(fname) && !rg3.test(fname);
    }

    /***
     * Finds the value in the array, if the value is a url then it uses the filename in the url to search for the text
     * This is done since our model stores the URL too in case of draft restore or clicking on save in guide
     * @param text          string representing the text of which the index is to be found
     * @param elem         reference to the jquery element. This is used if there are duplicate file names present in the file upload.
     * @returns {number}
     * @private
     */
    #getIndexOfText (text, elem){
        let index = -1,
            self = this,
            isDuplicatePresent = false;
        this.#values.find(function(value, iter){
            // if value is a url, then compare with last
            let tempValue = value,
                // can't use getOrElse here since value can have "." in URL and getOrElse splits based on period to find key inside object
                fileName =  (typeof self.#initialFileValueFileNameMap === "object" && typeof self.#initialFileValueFileNameMap[value] !== undefined) ? self._initialFileValueFileNameMap[value] : null;
            if(tempValue.match(/\//g) && tempValue.match(/\//g).length > 1){
                tempValue =  value.substring(value.lastIndexOf("/")+1);
            }
            // we pass file name explicity as options, if passed use that as fallback to find the URL
            if(tempValue === text || fileName === text){
                index = iter;
                isDuplicatePresent = self.#values.indexOf(value, index + 1) !== -1;
                if(elem && isDuplicatePresent){
                    // now check if duplicate present and get its correct index
                    // today all files are wrapped under .guide-fu-fileItem node
                    index = elem.closest(self.#fileItemSelector).index();
                }
                // check if there is a duplicate
                // this is to just break the loop
                return value;
            }
        });
        return index;
    }

    static previewFileUsingObjectUrl(file) {
        if (file) {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
                window.navigator.msSaveOrOpenBlob(file, file.name);
            } else {
                let url = window.URL.createObjectURL(file);
                window.open(url, '', 'scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,status=no');
                return url;
            }
        }
    }

    static previewFile (event){
        let url = arguments[1].fileUrl;
        let lastIndex = url.lastIndexOf('/');
        //to make sure url has a slash '/'
        // added check for query param since sas url contains query params & does not have file name, encoding is not required in this case
        if(lastIndex >= 0 && url.indexOf('?') === -1) {
            //encode the filename after last slash to ensure the handling of special characters
            url = url.substr(0, lastIndex) +'/'+ encodeURIComponent(url.substr(lastIndex + 1));
        }
        // this would work for dataURl or normal URL
        window.open(url, '', 'scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,status=no');

    }
    // this function maintains a map for
    #handleFilePreview (event){
        let elem = event.target,
            text = elem.textContent,
            index = this.#getIndexOfText(text, elem),
            fileDom = null,
            fileName = null,
            fileUrl = null;

        // for draft usecase, if text contains "/" in it, it means the file is already uploaded
        // text should contain the path, assuming that the fileUrl is stored in data element
        if (index !== -1) {
            // Store the url of file as data
            if(typeof elem.dataset.key !== "undefined")
                fileUrl = elem.dataset.key;

            if(fileUrl)  {
                //prepend context path if not already appended
                if (!(fileUrl.lastIndexOf(this.#options.contextPath, 0) === 0)) {
                    fileUrl =  this.#options.contextPath + fileUrl;
                }
                FileInputWidget.previewFile.apply(this, [null, {"fileUrl" : fileUrl}]);
            } else {
                // todo: add support here
                //let previewFileObjIdx = this._getFileObjIdx(index);
                let previewFile = this.#widget.files[index];
                let objectUrl = FileInputWidget.previewFileUsingObjectUrl(previewFile);
                if (objectUrl) {
                    elem.dataset.objectUrl = objectUrl;
                }
            }
        }
    }

    /**
     * This event listener gets called on click of close button in file upload
     *
     * @param event
     */
    #handleClick (event){
        let elem = event.target,
            text = elem.previousSibling.textContent,
            index = this.#getIndexOfText(text, elem),
            url = elem.previousSibling.dataset.key,
            objectUrl = elem.previousSibling.dataset.objectUrl;
        if (index !== -1) {
            this.#values.splice(index, 1);
            this.#fileArr.splice(index, 1);
            // set the model with the new value
            this.#model.value = this.#fileArr;
            // value and fileArr contains items of both URL and file types, hence while removing from DOM
            // get the correct index as per this.#widget.files
            let domIndex = Array.from(this.#widget.files).findIndex(function(file) {
               return file.name === text;
            });
            this.#deleteFilesFromInputDom([domIndex]);
            if (url != null) {
                // remove the data so that others don't use this url
                delete elem.previousSibling.dataset.key;
            }
            if(objectUrl) {
                // revoke the object URL to avoid memory leaks in browser
                // since file is anyways getting deleted, remove the object URL's too
                window.URL.revokeObjectURL(objectUrl);
            }
        }
        // Remove the dom from view
        //All bound events and jQuery data associated with the element are also removed
        elem.parentElement.remove();
        // Set the focus on file upload button after click of close
        this.#widget.focus();

    }

    #fileItem(fileName, comment, fileUrl) {
        let self = this;
        let fileItem = document.createElement('li');
        fileItem.setAttribute("class", "cmp-adaptiveform-fileinput__fileitem");
        let fileNameDom = document.createElement('span');
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
            self.#handleFilePreview(e);
        });
        fileItem.appendChild(fileNameDom);
        if(fileUrl != null){
            fileNameDom.dataset.key = fileUrl;
        }
        let fileClose = document.createElement('span');
        fileClose.setAttribute('tabindex', '0');
        fileClose.setAttribute('class', "cmp-adaptiveform-fileinput__filedelete");
        fileClose.setAttribute('aria-label', FormView.LanguageUtils.getTranslatedString(this.#lang, "FileCloseAccessText") + fileName);
        fileClose.setAttribute('role', 'button');
        fileClose.textContent = "x";
        fileClose.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.charCode === 32) {
                e.target.click();
            }
        });
        fileClose.addEventListener('click', function(e) {
            self.#handleClick(e);
        });
        fileItem.appendChild(fileClose);
        return fileItem;
    }

    #isMultiSelect() {
        return this.#options.type === "file[]" || this.#options.type === "string[]";
    }

    #showFileList(fileName, comment, fileUrl) {
        if(!this.#isMultiSelect() || fileName === null || typeof fileName === "undefined") {
            // if not multiselect, remove all the children of file list
            while (this.#fileList.lastElementChild) {
                this.#fileList.removeChild(this.#fileList.lastElementChild);
            }
        }

        // Add the file item
        // On click of close, remove the element and update the model
        // handle on click of preview button
        if(fileName != null) {
           this.#fileList.append(this.#fileItem(fileName, comment, fileUrl));
        }
    }

    #showInvalidMessage(fileName, invalidFeature){
        let that = this;
        let IS_IPAD = navigator.userAgent.match(/iPad/i) !== null,
            IS_IPHONE = (navigator.userAgent.match(/iPhone/i) !== null);
        if(IS_IPAD || IS_IPHONE){
            setTimeout(function() {
                that.#invalidMessage(that,fileName, invalidFeature);
            }, 0);
        }
        else {
            this.#invalidMessage(fileName, invalidFeature);
        }
    }

    #invalidMessage(fileName, invalidFeature){
        // todo: have add localization here
        if(invalidFeature === this.#invalidFeature.SIZE) {
            alert(FormView.LanguageUtils.getTranslatedString(this.#lang, "FileSizeGreater", [fileName, this.#options.maxFileSize]));
        } else if (invalidFeature === this.#invalidFeature.NAME) {
            alert(FormView.LanguageUtils.getTranslatedString(this.#lang, "FileNameInvalid", [fileName]));
        } else if (invalidFeature === this.#invalidFeature.MIMETYPE) {
            alert(FormView.LanguageUtils.getTranslatedString(this.#lang, "FileMimeTypeInvalid", [fileName]));
        }
    }

    /*
     * This function returns FileList object of the passed file array
     */
    #getFileListItem(files) {
        try {
            let dataContainer = new DataTransfer() || (new ClipboardEvent("")).clipboardData;
            files.forEach(function (file) {
                dataContainer.items.add(file);
            });
            return dataContainer.files;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

    #updateFilesInDom(files) {
        // in safari, a change event is trigged if files property is changed dynamically
        // hence adding this check to clear existing state only for safari browsers
        this.#isFileUpdate = true;
        this.#widget.files = this.#getFileListItem(files);
        this.#isFileUpdate = false;
    }

    /*
     * This function deletes files at specified indexes from input dom elt
     */
    #deleteFilesFromInputDom(deletedIndexes) {
        let remainingFiles = [];
        Array.from(this.#widget.files).forEach(function(file,idx){
            if(!deletedIndexes.includes(idx)){
                remainingFiles.push(file);
            }
        });
        try {
            // in safari, a change event is trigged if files property is changed dynamically
            // hence adding this check to clear existing state only for safari browsers
            this.#updateFilesInDom(remainingFiles);
        } catch(err){
            console.error("Deleting files is not supported in your browser");
        }
    }

    setValue(value) {
        let isValueSame = false;
        if (value != null) {
            // change to array since we store array internally
            value = Array.isArray(value) ? value : [value];
        }
        // check if current values and new values are same
        if (this.#fileArr != null && value != null) {
            isValueSame = JSON.stringify(FormView.FileAttachmentUtils.extractFileInfo(this.#fileArr)) === JSON.stringify(value);
        }
        // if new values, update the DOM
        if (!isValueSame) {
            let oldUrls = {};
            // Cache the url before deletion
            this.#fileList.querySelectorAll(".cmp-adaptiveform-fileinput__filename").forEach(function (elem) {
                let url = elem.dataset.key;
                if (typeof url !== "undefined") {
                    let fileName = url.substring(url.lastIndexOf("/") + 1);
                    oldUrls[fileName] = url;
                }
            });
            // empty the file list
            while (this.#fileList.lastElementChild) {
                this.#fileList.removeChild(this.#fileList.lastElementChild);
            }
            // set the new value
            if (value != null) {
                let self = this;
                // Update the value array with the file
                this.#values = value.map(function (file, index) {
                    // Check if file Name is a path, if yes get the last part after "/"
                    let isFileObject= window.File ? file.data instanceof window.File : false,
                        fileName = typeof file === "string" ? file : file.name,
                        fileUrl = typeof file === "string" ? file : (isFileObject ? "" : file.data),
                        fileUploadUrl = fileUrl;
                    if (oldUrls[fileName]) {
                        fileUploadUrl = oldUrls[fileName];
                    }
                    self.#showFileList(fileName, null, fileUploadUrl);
                    return fileName;
                });
                this.#fileArr = [...value];
            }
        }
    }

    #handleChange(evnt) {
        if (!this.#isFileUpdate) {
            let currFileName = '',
                inValidSizefileNames = '',
                inValidNamefileNames = '',
                inValidMimeTypefileNames = '',
                elem = evnt.target,
                files = elem.files;
            // Initially set the invalid flag to false
            let isInvalidSize = false,
                isInvalidFileName = false,
                isInvalidMimeType = false;
            //this.resetIfNotMultiSelect();
            if (typeof files !== "undefined") {
                let invalidFilesIndexes = [];
                Array.from(files).forEach(function (file, fileIndex) {
                    let isCurrentInvalidFileSize = false,
                        isCurrentInvalidFileName = false,
                        isCurrentInvalidMimeType = false;
                    currFileName = file.name.split("\\").pop();
                    // Now size is in MB
                    let size = file.size / 1024 / 1024;
                    // check if file size limit is within limits
                    if ((size > parseFloat(this.#options.maxFileSize))) {
                        isInvalidSize = isCurrentInvalidFileSize = true;
                        inValidSizefileNames = currFileName + "," + inValidSizefileNames;
                    } else if (!FileInputWidget.isValid(currFileName)) {
                        // check if file names are valid (ie) there are no control characters in file names
                        isInvalidFileName = isCurrentInvalidFileName = true;
                        inValidNamefileNames = currFileName + "," + inValidNamefileNames;
                    } else if (file.type) {
                        let isMatch = this.#regexMimeTypeList.some(function (rx) {
                            return rx.test(file.type);
                        });
                        if (!isMatch) {
                            isInvalidMimeType = isCurrentInvalidMimeType = true;
                            inValidMimeTypefileNames = currFileName + "," + inValidMimeTypefileNames;
                        }
                    }

                    // if the file is not invalid, show it and push it to internal array
                    if (!isCurrentInvalidFileSize && !isCurrentInvalidFileName && !isCurrentInvalidMimeType) {
                        this.#showFileList(currFileName);
                        this.#values.push(currFileName);
                        this.#fileArr.push(file);
                    } else {
                        invalidFilesIndexes.push(fileIndex);
                    }


                }, this);

                if (invalidFilesIndexes.length > 0 && this.#widget !== null) {
                    this.#deleteFilesFromInputDom(invalidFilesIndexes);
                }
            }

            // set the new model value
            this.#model.value = this.#fileArr;

            if (isInvalidSize) {
                this.#showInvalidMessage(inValidSizefileNames.substring(0, inValidSizefileNames.lastIndexOf(',')), this.#invalidFeature.SIZE);
            } else if (isInvalidFileName) {
                this.#showInvalidMessage(inValidNamefileNames.substring(0, inValidNamefileNames.lastIndexOf(',')), this.#invalidFeature.NAME);
            } else if (isInvalidMimeType) {
                this.#showInvalidMessage(inValidMimeTypefileNames.substring(0, inValidMimeTypefileNames.lastIndexOf(',')), this.#invalidFeature.MIMETYPE);
            }
        }
    }
}