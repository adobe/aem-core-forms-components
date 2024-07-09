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
(function($) {
    "use strict";
    let EDIT_DIALOG = ".cmp-adaptiveform-fileinput__editdialog",
        FILEINPUT_MULTISELECTION = EDIT_DIALOG + " .cmp-adaptiveform-fileinput__multiselection",
        FILEINPUT_MINITEMS = EDIT_DIALOG + " .cmp-adaptiveform-fileinput__minimumFiles",
        FILEINPUT_MINITEMS_ERRMSG = EDIT_DIALOG + " .cmp-adaptiveform-fileinput__minimumFilesMessage",
        FILEINPUT_MAXITEMS = EDIT_DIALOG + " .cmp-adaptiveform-fileinput__maximumFiles",
        FILEINPUT_MAXITEMS_ERRMSG = EDIT_DIALOG + " .cmp-adaptiveform-fileinput__maximumFilesMessage",
    Utils = window.CQ.FormsCoreComponents.Utils.v1;

    /**
     * Toggles the addition of multi selection, value of type on the checked state of
     * the multiSelection checkbox
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleMultiSelection(dialog) {
        let component = dialog.find(FILEINPUT_MULTISELECTION)[0];
        let fileinputMinItems=dialog.find(FILEINPUT_MINITEMS);
        let fileinputMinItemsMessage = dialog.find(FILEINPUT_MINITEMS_ERRMSG);
        let fileinputMaxItems=dialog.find(FILEINPUT_MAXITEMS);
        let fileinputMaxItemsMessage = dialog.find(FILEINPUT_MAXITEMS_ERRMSG);
        let listOfElements = [fileinputMinItems,fileinputMaxItems, fileinputMinItemsMessage, fileinputMaxItemsMessage];
        let isNotChecked = function() {return isChecked()};
        let isChecked = function() {return component.checked};
        let hideAndShowElements = function() {
             // hide minItems elements
            Utils.checkAndDisplay(listOfElements)(isNotChecked);
        };
        hideAndShowElements();
        component.on("change", function() {
            hideAndShowElements();
        });
    }
    Utils.initializeEditDialog(EDIT_DIALOG)(handleMultiSelection);

})(jQuery);
