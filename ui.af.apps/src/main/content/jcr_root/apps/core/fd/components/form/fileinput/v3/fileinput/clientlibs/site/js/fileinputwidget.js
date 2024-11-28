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
            fileNameDom.setAttribute('aria-describedBY', id);
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
    }
}