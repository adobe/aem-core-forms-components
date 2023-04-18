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
(function ($) {
    "use strict";

    var EDIT_DIALOG = ".cmp-adaptiveform-switch__editdialog",
        SWITCH_ASSISTPRIORITY = EDIT_DIALOG + " .cmp-adaptiveform-switch__assistprioritycustom",
        SWITCH_CUSTOMTEXT = EDIT_DIALOG + " .cmp-adaptiveform-switch__customtext",
        SWITCH_DATATYPE = EDIT_DIALOG + " .cmp-adaptiveform-switch__type",
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
        var hideAndShowElements = function () {
            if (assistpriority[0].value === "custom") {
                customtext.show();
            } else {
                customtext.hide();
            }
        };
        hideAndShowElements();
        dialog.on("change", assistpriority, function () {
            hideAndShowElements();
        });
    }

    function validateItemCount(dialog){
        var multiField=dialog.find("coral-multifield[data-id=guideSwitchOptions]");
        multiField.addEventListener("click",_manageDialogSubmit);

        function _manageDialogSubmit(){
            var enums = dialog.find(BASE_ENUM);
            var visibleEnumNames = dialog.find(BASE_ENUMNAMES_VISIBLE);

            for(var i = 0; i < visibleEnumNames.length ; i++) {
                if(!visibleEnumNames[i].value) {
                    visibleEnumNames[i].value = enums[i].value;
                }
            }
        }
    }

    var registerDialogValidator = Utils.registerDialogDataTypeValidators(
        SWITCH_DEFAULTVALUE + " input",
        SWITCH_ENUM,
        function (dialog) {
            var selectedValue = '';
            var switchSaveValue = dialog.find(SWITCH_DATATYPE + " coral-select");
            if (switchSaveValue && switchSaveValue.length > 0) {
                selectedValue = switchSaveValue[0].selectedItem ? switchSaveValue[0].selectedItem.value : '';
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
