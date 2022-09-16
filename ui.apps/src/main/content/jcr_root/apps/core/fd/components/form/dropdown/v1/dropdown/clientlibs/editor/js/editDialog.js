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
    var EDIT_DIALOG = ".cmp-adaptiveform-dropdown__editdialog",
        DROPDOWN_ALLOWMULTISELECT = EDIT_DIALOG + " .cmp-adaptiveform-dropdown__allowmultiselect",
        DROPDOWN_DEFAULTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-dropdown__defaultvalue",
        DROPDOWN_DEFAULTVALUEMULTISELCET = EDIT_DIALOG + " .cmp-adaptiveform-dropdown__defaultvaluemultiselect",
        DROPDOWN_SAVEVALUE = EDIT_DIALOG + " .cmp-adaptiveform-dropdown__savevaluetype",
        TYPE = EDIT_DIALOG + " input[name='./type']",
        DEFAULT = EDIT_DIALOG + " input[name='./default@ValueFrom']",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Updates the save value types to their array equivalents when multi-select is toggled.
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleSaveValueDropDown(dialog) {
        var multiSelect = dialog.find(DROPDOWN_ALLOWMULTISELECT)[0],
            saveValueDropdown = dialog.find(DROPDOWN_SAVEVALUE),
            type = dialog.find(TYPE),
            saveTypes = ['string', 'number', 'boolean'];

        var updateSaveValueType = function() {
            var index = parseInt(saveValueDropdown.val());
            if(multiSelect.checked) {
               type.val(saveTypes[index] + '[]');
            } else {
                type.val(saveTypes[index]);
            }
        }
        // triggered when dialog is launched
        updateSaveValueType();
        saveValueDropdown.on("change", function() {
            updateSaveValueType();
        });
        multiSelect.on("change", function() {
            updateSaveValueType();
        });
    }

    /**
     * Handles the default value field in the dialog appropriately when multi-select is toggled.
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleDefaultValue(dialog) {
        var multiSelect = dialog.find(DROPDOWN_ALLOWMULTISELECT)[0],
            defaultValue = dialog.find(DROPDOWN_DEFAULTVALUE),
            defaultValueMS = dialog.find(DROPDOWN_DEFAULTVALUEMULTISELCET),
            defaultField = dialog.find(DEFAULT);

        var isMutiSelect = function () {
            return multiSelect.checked;
        }

        var isNotMutiSelect = function () {
            return !isMutiSelect();
        }

        var hideAndShowElements = function () {
            Utils.checkAndDisplay(defaultValueMS)(isMutiSelect);
            Utils.checkAndDisplay(defaultValue)(isNotMutiSelect);
            // also assign the value to ./default
            if(isMutiSelect()) {
                defaultField.val("./defaultMultiSelect");
            } else {
                defaultField.val("./defaultSingleSelect");
            }
        }
        hideAndShowElements();
        multiSelect.on("change", function() {
            hideAndShowElements();
        });
    }


    Utils.initializeEditDialog(EDIT_DIALOG)(handleSaveValueDropDown, handleDefaultValue);
})(jQuery);
