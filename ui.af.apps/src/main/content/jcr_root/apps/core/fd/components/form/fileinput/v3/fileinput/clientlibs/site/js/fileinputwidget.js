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
        
        fileItem(fileName, fileSize, comment, fileUrl) {
            let self = this;
            let id = `${Date.now() + '_' + Math.floor(Math.random() * 10000)}_file_size`
            let fileItem = document.createElement('li');
            fileItem.setAttribute("class", "cmp-adaptiveform-fileinput__fileitem");
            let fileNameDom = document.createElement('a');
            let fileSizeDom = document.createElement('span');

            fileSizeDom.setAttribute('class', "cmp-adaptiveform-fileinput__filesize");
            fileSizeDom.setAttribute('id', id);
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

        handleClick (event){
            let elem = event.target,
                text = elem.parentElement.previousSibling.textContent,
                index = this.getIndexOfText(text, elem.parentElement),
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
    }
}