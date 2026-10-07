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

    var EDIT_DIALOG = ".cmp-adaptiveform-textinput__editdialog",
        TEXTINPUT_ALLOWRICHTEXT = EDIT_DIALOG + " .cmp-adaptiveform-textinput__allowrichtext",
        TEXTINPUT_MAXLENGTH = EDIT_DIALOG + " .cmp-adaptiveform-textinput__maxlength",
        TEXTINPUT_MINLENGTH = EDIT_DIALOG + " .cmp-adaptiveform-textinput__minlength",
        BASE_PLACEHOLDER = EDIT_DIALOG + " .cmp-adaptiveform-base__placeholder",
        TEXTINPUT_VALUE = EDIT_DIALOG + " .cmp-adaptiveform-textinput__value",
        TEXTINPUT_RICHTEXTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-textinput__richtextvalue",
        TEXTINPUT_VALIDATIONPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-textinput__validationpattern",
        TEXTINPUT_VALIDATIONFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-textinput__validationformat",
        TEXTINPUT_DISPLAYPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-textinput__displaypattern",
        TEXTINPUT_DISPLAYFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-textinput__displayformat",
        TEXTINPUT_MULTILINE = EDIT_DIALOG + " .cmp-adaptiveform-textinput__multiline",
        TEXTINPUT_SHOWCHARACTERCOUNT = EDIT_DIALOG + " .cmp-adaptiveform-textinput__showcharactercount",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    // "Show character count" is only applicable to multi line (textarea) fields, so hide/show it
    // depending on the "Allow multiple lines" checkbox, mirroring the rich-text-title toggle in base's editDialog.js.
    function handleShowCharacterCountVisibility(dialog) {
        var multiLine = dialog.find(TEXTINPUT_MULTILINE)[0];
        var showCharacterCount = dialog.find(TEXTINPUT_SHOWCHARACTERCOUNT)[0];
        if (!multiLine || !showCharacterCount) {
            return;
        }
        var toggleVisibility = function() {
            if (multiLine.checked) {
                Utils.showComponent(showCharacterCount, "div");
            } else {
                Utils.hideComponent(showCharacterCount, "div");
            }
        };
        toggleVisibility();
        multiLine.on("change", toggleVisibility);
    }

    function handleValidationPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,TEXTINPUT_VALIDATIONPATTERN,TEXTINPUT_VALIDATIONFORMAT);
    }

    function handleValidationFormat(dialog){
        Utils.handlePatternFormat(dialog,TEXTINPUT_VALIDATIONPATTERN,TEXTINPUT_VALIDATIONFORMAT);
    }

    function handleDisplayPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,TEXTINPUT_DISPLAYPATTERN,TEXTINPUT_DISPLAYFORMAT);
    }

    function handleDisplayFormat(dialog){
        // nothing to do for text input
    }

    function handleDisplayValueExpression(dialog) {
        let patternComponent = dialog.find(TEXTINPUT_DISPLAYPATTERN)[0];
        
        function updateDisplayValueExpression() {
            let selectedPattern = patternComponent.selectedItem ? patternComponent.selectedItem.value : '';
            
            // Use the selected pattern value directly as it's already the correct format type
            let formatType = selectedPattern || '';
            
            // Set the displayValueExpression property
            let displayValueExpressionField = dialog.find('input[name="./displayValueExpression"]')[0];
            if (displayValueExpressionField) {
                if (formatType) {
                    displayValueExpressionField.value = 'formatInput($field.$value, \'' + formatType + '\')';
                } else {
                    displayValueExpressionField.value = '';
                }
            }
            
            // Also update the displayFormat field to keep it in sync
            let displayFormatField = dialog.find('input[name="./displayFormat"]')[0];
            if (displayFormatField) {
                displayFormatField.value = formatType;
            }
        }
        
        // Initialize and add event listeners
        updateDisplayValueExpression();
        patternComponent.addEventListener("change", updateDisplayValueExpression);
    }

    // registered first so it always runs even if a later handler in this list throws (Utils.initializeEditDialog
    // has no per-handler error isolation - it forEach()s this list, and one throw aborts everything after it)
    Utils.initializeEditDialog(EDIT_DIALOG)(handleShowCharacterCountVisibility,handleValidationPatternDropDown,handleValidationFormat,handleDisplayPatternDropDown,handleDisplayFormat,handleDisplayValueExpression);

})(jQuery);
