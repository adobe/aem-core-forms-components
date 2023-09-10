/*******************************************************************************
 * Copyright 2023 Adobe
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

    var EDIT_DIALOG = ".cmp-adaptiveform-switch__editdialog",
        SWITCH_ASSISTPRIORITY = EDIT_DIALOG + " .cmp-adaptiveform-switch__assistprioritycustom",
        SWITCH_CUSTOMTEXT = EDIT_DIALOG + " .cmp-adaptiveform-switch__customtext",
        SWITCH_TYPE = EDIT_DIALOG + " .cmp-adaptiveform-switch__type",
        SWITCH_DEFAULTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-switch__value",
        SWITCH_ENUM = EDIT_DIALOG + " .cmp-adaptiveform-base__enum",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Shows custom text box depending on the value of assist priority of radio button
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleAssistPriorityChange(dialog) {
        var assistpriority = dialog.find(SWITCH_ASSISTPRIORITY);
        var customtext = dialog.find(SWITCH_CUSTOMTEXT);
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
        SWITCH_DEFAULTVALUE,
        SWITCH_ENUM,
        function (dialog) {
            var selectedValue = '';
            var switchSaveValue = dialog.find(SWITCH_TYPE);
            if (switchSaveValue && switchSaveValue.length > 0) {
                selectedValue = switchSaveValue[0].selectedItem ? switchSaveValue[0].selectedItem.value : '';
            }
            return selectedValue.toLowerCase();
        }
    );

    Utils.initializeEditDialog(EDIT_DIALOG)(handleAssistPriorityChange, registerDialogValidator);

})(jQuery);
