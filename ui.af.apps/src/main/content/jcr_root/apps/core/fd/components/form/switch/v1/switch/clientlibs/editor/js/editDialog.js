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
        CHECKBOX_ASSISTPRIORITY = EDIT_DIALOG + " .cmp-adaptiveform-switch__assistprioritycustom",
        CHECKBOX_CUSTOMTEXT = EDIT_DIALOG + " .cmp-adaptiveform-switch__customtext",
        ENUMS = EDIT_DIALOG + " .cmp-adaptiveform-switch__enums",
        DATA_TYPE = EDIT_DIALOG + " .cmp-adaptiveform-switch__type",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Shows custom text box depending on the value of assist priority of radio button
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleAssistPriorityChange(dialog) {
        var assistpriority = dialog.find(CHECKBOX_ASSISTPRIORITY);
        var customtext = dialog.find(CHECKBOX_CUSTOMTEXT);
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

    /**
     * A checkbox can specify enum implicitly by setting type property to boolean.
     * @param dialog
     */
    function handleDataTypeSelectionAndValidation(dialog) {
        var dataTypeSelect = dialog.find(DATA_TYPE + " coral-select");
        var preselectedDataType = dataTypeSelect[0].selectedItem ? dataTypeSelect[0].selectedItem.value : '';
        if (preselectedDataType == 'boolean') {
            dialog.find(ENUMS).hide();
        }

        dataTypeSelect.on('change', function() {
            var selectedDataType = dataTypeSelect[0].selectedItem ? dataTypeSelect[0].selectedItem.value : '';
            if (selectedDataType == 'boolean') {
                dialog.find(ENUMS).hide();
            } else {
                dialog.find(ENUMS).show();
            }
        });

        var registerValidator = function(selector) {
                let validate = function() {
                    var isValid = true;
                    var selectedDataType = dataTypeSelect[0].selectedItem ? dataTypeSelect[0].selectedItem.value : '';
                    var value = document.querySelector(selector).value;
                    if (selectedDataType === 'number') {
                        if (isNaN(value)) {
                            isValid = false;
                        }
                    }
                    if (!isValid) {
                        return Granite.I18n.getMessage('Value Type Mismatch');
                    }
                }
            $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
                selector: selector,
                validate: validate
            });
        }

        registerValidator('input[name="./onValue"]');
        registerValidator('input[name="./default"]');
        registerValidator('input[name="./offValue"]')
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleAssistPriorityChange, handleDataTypeSelectionAndValidation);

})(jQuery);
