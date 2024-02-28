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

    var EDIT_DIALOG = ".cmp-adaptiveform-starrating__editdialog",
        STARRATING_ASSISTPRIORITY = EDIT_DIALOG + " .cmp-adaptiveform-starrating__assistprioritycustom",
        STARRATING_CUSTOMTEXT = EDIT_DIALOG + " .cmp-adaptiveform-starrating__customtext",
        STARRATING_DATATYPE = EDIT_DIALOG + " .cmp-adaptiveform-starrating__type",
        STARRATING_DEFAULTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-starrating__value",
        STARRATING_ENUM = EDIT_DIALOG + " .cmp-adaptiveform-base__enum",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Shows custom text box depending on the value of assist priority of radio button
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleAssistPriorityChange(dialog) {
        var assistpriority = dialog.find(STARRATING_ASSISTPRIORITY);
        var customtext = dialog.find(STARRATING_CUSTOMTEXT);
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
        STARRATING_DEFAULTVALUE + " input",
        STARRATING_ENUM,
        function (dialog) {
            var selectedValue = '';
            var starratingSaveValue = dialog.find(STARRATING_DATATYPE + " coral-select");
            if (starratingSaveValue && starratingSaveValue.length > 0) {
                selectedValue = starratingSaveValue[0].selectedItem ? starratingSaveValue[0].selectedItem.value : '';
            }
            var dataType = '';
            switch (selectedValue) {
                case 'string[]':
                    dataType = 'string';
                    break;
                case 'number[]':
                    dataType = 'number';
                    break;
                case 'boolean[]':
                    dataType = 'boolean';
                    break;
            }
            return dataType;
        }
    );

    Utils.initializeEditDialog(EDIT_DIALOG)(handleAssistPriorityChange, registerDialogValidator);

})(jQuery);