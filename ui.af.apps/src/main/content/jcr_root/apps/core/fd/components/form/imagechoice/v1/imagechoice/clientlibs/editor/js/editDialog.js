/*******************************************************************************
 * Copyright 2024 Adobe
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

    var EDIT_DIALOG = ".cmp-adaptiveform-imagechoice__editdialog",
        IMAGECHOICE_SELECTIONTYPE = EDIT_DIALOG + " .cmp-adaptiveform-imagechoice__selectiontype",
        IMAGECHOICE_OPTIONS = EDIT_DIALOG + " .cmp-adaptiveform-imagechoice__options",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    /**
     * Handles the change event for the selection type field in the dialog.
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleSelectionTypeChange(dialog) {
        var selectionType = dialog.find(IMAGECHOICE_SELECTIONTYPE);
        var options = dialog.find(IMAGECHOICE_OPTIONS);
        var updateOptionsVisibility = function() {
            if (selectionType.val() === "single") {
                options.find("coral-checkbox").prop("checked", false).attr("disabled", true);
            } else {
                options.find("coral-checkbox").attr("disabled", false);
            }
        };
        updateOptionsVisibility();
        dialog.on("change", IMAGECHOICE_SELECTIONTYPE, function() {
            updateOptionsVisibility();
        });
    }

    /**
     * Initializes the dialog with the required event listeners.
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function initializeDialog(dialog) {
        handleSelectionTypeChange(dialog);
    }

    /**
     * Registers the initialization function to be called when the dialog is loaded.
     */
    $(document).on("dialog-loaded", function(event) {
        var $dialog = event.dialog;
        if ($dialog.length) {
            initializeDialog($dialog);
        }
    });

})(jQuery);