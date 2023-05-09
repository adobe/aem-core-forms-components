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

    var EDIT_DIALOG = ".cmp-adaptiveform-redbutter__editdialog",
        REDBUTTER_ASSISTPRIORITY = EDIT_DIALOG + " .cmp-adaptiveform-redbutter__assistprioritycustom",
        REDBUTTER_CUSTOMTEXT = EDIT_DIALOG + " .cmp-adaptiveform-redbutter__customtext",
        REDBUTTER_TYPE = EDIT_DIALOG + " .cmp-adaptiveform-redbutter__type",
        REDBUTTER_DEFAULTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-redbutter__value",
        REDBUTTER_ENUM = EDIT_DIALOG + " .cmp-adaptiveform-base__enum",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Shows custom text box depending on the value of assist priority of radio button
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleAssistPriorityChange(dialog) {
        var assistpriority = dialog.find(REDBUTTER_ASSISTPRIORITY);
        var customtext = dialog.find(REDBUTTER_CUSTOMTEXT);
        var hideAndShowElements = function() {
            if(assistpriority[0].value === "custom"){
                customtext.show();
            } else {
                customtext.hide();
            }
        };
        hideAndShowElements();
        dialog.on("change", assistpriority, function() {
            hideAndShowElements();
        });
    }

    var registerDialogValidator = Utils.registerDialogDataTypeValidators(
        REDBUTTER_DEFAULTVALUE,
        REDBUTTER_ENUM,
        function (dialog) {
            var selectedValue = '';
            var redbutterSaveValue = dialog.find(REDBUTTER_TYPE);
            if (redbutterSaveValue && redbutterSaveValue.length > 0) {
                selectedValue = redbutterSaveValue[0].selectedItem ? redbutterSaveValue[0].selectedItem.value : '';
            }
            return selectedValue.toLowerCase();
        }
    );

    Utils.initializeEditDialog(EDIT_DIALOG)(handleAssistPriorityChange, registerDialogValidator);

})(jQuery);
