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
        DROPDOWN_ENUM = EDIT_DIALOG + " .cmp-adaptiveform-base__enum",
        TYPE = EDIT_DIALOG + " input[name='./type']",
        DEFAULTINPUT = DROPDOWN_DEFAULTVALUE + " input",
        DEFAULTMUTIINPUT = DROPDOWN_DEFAULTVALUEMULTISELCET + " input[type='text']",
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
            defaultInput = dialog.find(DEFAULTINPUT),
            defaultMultiInput = dialog.find(DEFAULTMUTIINPUT);

        var isMultiSelect = function () {
            return multiSelect.checked;
        }

        var isNotMultiSelect = function () {
            return !isMultiSelect();
        }

        var changeNameForMultiSelect = function (newName) {
            [...defaultMultiInput].forEach((input) => {
                input.name = newName;
            })
        }

        var hideAndShowElements = function () {
            Utils.checkAndDisplay(defaultValueMS)(isMultiSelect);
            Utils.checkAndDisplay(defaultValue)(isNotMultiSelect);

            // making sure that ./default of the rendered component is only persisted in jcr
            if(isMultiSelect()) {
                defaultInput.attr("name","./default@Delete");
                changeNameForMultiSelect("./default");
            } else {
                defaultInput.attr("name","./default");
                changeNameForMultiSelect("./default@Delete");
            }
        }
        hideAndShowElements();
        multiSelect.on("change", function() {
            hideAndShowElements();
        });
    }

    var registerDialogValidator = Utils.registerDialogDataTypeValidators(
        DROPDOWN_DEFAULTVALUE + " input",
        DROPDOWN_ENUM,
        function (dialog) {
            var selectedValue = '';
            var dropdownSaveValue = dialog.find(DROPDOWN_SAVEVALUE);
            if (dropdownSaveValue && dropdownSaveValue.length > 0) {
                selectedValue = dropdownSaveValue[0].selectedItem ? dropdownSaveValue[0].selectedItem.value : '';
            }
            var dataType = '';
            switch (selectedValue) {
                case '0':
                    dataType = 'string';
                    break;
                case '1':
                    dataType = 'number';
                    break;
                case '2':
                    dataType = 'boolean';
                    break;
            }
            return dataType;
        }
    );

    Utils.initializeEditDialog(EDIT_DIALOG)(handleSaveValueDropDown, handleDefaultValue, registerDialogValidator);
})(jQuery);
