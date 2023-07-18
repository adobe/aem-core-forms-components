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

    var EDIT_DIALOG = ".cmp-adaptiveform-checkbox__editdialog",
        CHECKBOX_ASSISTPRIORITY = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__assistprioritycustom",
        CHECKBOX_CUSTOMTEXT = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__customtext",
        CHECKBOX_OPTIONS = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__options",
        CHECKBOX_DATATYPE = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__type",
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

    function handleEnums(dialog) {
        var optionDialog = dialog.find(CHECKBOX_OPTIONS);
        optionDialog.find('.coral-Form-fieldwrapper')[0].querySelector('input').required = true;
        var moveIcons = optionDialog.find('coral-icon[icon="moveUpDown"]');
        for (var icon of moveIcons) {
            icon.hide();
        }
        optionDialog.find('coral-multifield-item')[0].querySelector('button[handle="remove"]').hide();

        var addButton = optionDialog.find('[coral-multifield-add]');
        addButton.on('click', function() {
            addButton.hide();
        })

        var removeOffBtn = optionDialog.find('coral-multifield-item')[1].querySelector('button[handle="remove"]');

        if (!removeOffBtn) {
            addButton.hide();
        } else {
            removeOffBtn.addEventListener('click', function() {
                addButton.show();
            })
        }
    }


    function handleTypeSelection(dialog) {
        var checkboxDataType = dialog.find(CHECKBOX_DATATYPE);
        var optionDialog = dialog.find(CHECKBOX_OPTIONS);
        handle();
        function handle() {
            var selectedValue = checkboxDataType.find('coral-select')[0].selectedItem.value;
            if (selectedValue == 'boolean') {
                optionDialog.hide();
            } else {
                optionDialog.show();
            }
        }

        dialog.on("change", checkboxDataType, function() {
           handle()
        })
    }


    Utils.initializeEditDialog(EDIT_DIALOG)(handleAssistPriorityChange, handleEnums, handleTypeSelection);

})(jQuery);
