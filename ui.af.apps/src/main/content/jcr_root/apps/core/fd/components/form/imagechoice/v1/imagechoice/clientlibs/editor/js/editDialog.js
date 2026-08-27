/*******************************************************************************
 * Copyright 2026 Adobe
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
        IMAGECHOICE_ASSISTPRIORITY = EDIT_DIALOG + " .cmp-adaptiveform-imagechoice__assistprioritycustom",
        IMAGECHOICE_CUSTOMTEXT = EDIT_DIALOG + " .cmp-adaptiveform-imagechoice__customtext",
        IMAGECHOICE_TYPE = EDIT_DIALOG + " .cmp-adaptiveform-imagechoice__type",
        IMAGECHOICE_TYPE_HIDDEN = EDIT_DIALOG + " .cmp-adaptiveform-imagechoice__typehidden",
        IMAGECHOICE_DEFAULTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-imagechoice__value",
        IMAGECHOICE_ENUM = EDIT_DIALOG + " .cmp-adaptiveform-base__enum",
        IMAGECHOICE_SELECTION_TYPE = EDIT_DIALOG + " .cmp-adaptiveform-imagechoice__selectiontype",
        IMAGECHOICE_FIELD_TYPE = EDIT_DIALOG + " .cmp-adaptiveform-imagechoice__fieldtype",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    /**
     * Syncs fieldType and the hidden type field based on selectionType and the visible type dropdown.
     *
     * selectionType=single + type select "String"  -> fieldType=radio-group,    type=string
     * selectionType=multi  + type select "String"  -> fieldType=checkbox-group, type=string[]
     * selectionType=single + type select "Number"  -> fieldType=radio-group,    type=number
     * selectionType=multi  + type select "Number"  -> fieldType=checkbox-group, type=number[]
     */
    function syncSelectionDependentFields(dialog) {
        var selectionTypeSelect = dialog.find(IMAGECHOICE_SELECTION_TYPE);
        var fieldTypeHidden = dialog.find(IMAGECHOICE_FIELD_TYPE);
        var typeSelect = dialog.find(IMAGECHOICE_TYPE);
        var typeHidden = dialog.find(IMAGECHOICE_TYPE_HIDDEN);

        function getSelectionValue() {
            if (selectionTypeSelect.length > 0 && selectionTypeSelect[0].selectedItem) {
                return selectionTypeSelect[0].selectedItem.value;
            }
            return 'single';
        }

        function getBaseType() {
            var val = '';
            if (typeSelect.length > 0 && typeSelect[0].selectedItem) {
                val = typeSelect[0].selectedItem.value;
            }
            // always return base type without []
            return val.replace('[]', '') || 'string';
        }

        // On dialog open, set the visible type select to match the saved type (strip [])
        function initTypeSelect() {
            var savedType = typeHidden.val() || 'string';
            var baseType = savedType.replace('[]', '');
            if (typeSelect.length > 0) {
                typeSelect[0].value = baseType;
            }
        }

        function update() {
            var isMulti = getSelectionValue() === 'multi';
            var baseType = getBaseType();

            // Update fieldType hidden
            fieldTypeHidden.val(isMulti ? 'checkbox-group' : 'radio-group');

            // Update type hidden: append [] for multi
            typeHidden.val(isMulti ? baseType + '[]' : baseType);
        }

        initTypeSelect();
        update();

        dialog.on("change", IMAGECHOICE_SELECTION_TYPE, function() {
            update();
        });
        dialog.on("change", IMAGECHOICE_TYPE, function() {
            update();
        });
    }

    /**
     * Shows custom text box depending on the value of assist priority
     */
    function handleAssistPriorityChange(dialog) {
        var assistpriority = dialog.find(IMAGECHOICE_ASSISTPRIORITY);
        var customtext = dialog.find(IMAGECHOICE_CUSTOMTEXT);
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
        IMAGECHOICE_DEFAULTVALUE,
        IMAGECHOICE_ENUM,
        function (dialog) {
            var selectedValue = '';
            var imagechoiceSaveValue = dialog.find(IMAGECHOICE_TYPE);
            if (imagechoiceSaveValue && imagechoiceSaveValue.length > 0) {
                selectedValue = imagechoiceSaveValue[0].selectedItem ? imagechoiceSaveValue[0].selectedItem.value : '';
            }
            return selectedValue.toLowerCase();
        }
    );

    Utils.initializeEditDialog(EDIT_DIALOG)(syncSelectionDependentFields, handleAssistPriorityChange, registerDialogValidator);

})(jQuery);
