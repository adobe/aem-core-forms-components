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
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Toggles the visibility of the maxLength, minLength, placeholder field based on the checked state of
     * the allowRichText checkbox
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleRichText(dialog) {
        var component = dialog.find(TEXTINPUT_ALLOWRICHTEXT)[0];
        var textInputMaxLength = dialog.find(TEXTINPUT_MAXLENGTH);
        var textInputMinLength = dialog.find(TEXTINPUT_MINLENGTH);
        var basePlaceHolder = dialog.find(BASE_PLACEHOLDER).parent('div');
        var textInputValue = dialog.find(TEXTINPUT_VALUE);
        var textInputRichTextValue = dialog.find(TEXTINPUT_RICHTEXTVALUE);
        var listOfElements = [textInputMaxLength, textInputMinLength, basePlaceHolder, textInputValue];

        var isNotChecked = function() {return !isChecked()};
        var isChecked = function() {return component.checked};
        var hideAndShowElements = function() {
            // hide other elements
            Utils.checkAndDisplay(listOfElements)(isNotChecked);
            // show rich text
            Utils.checkAndDisplay(textInputRichTextValue)(isChecked);
        };
        hideAndShowElements();
        component.on("change", function() {
            hideAndShowElements();
        });
        var changeFormFields = Utils.manipulateNameAndValue([textInputValue[0], textInputRichTextValue[0]]);
        if (isChecked()) {
            var richTextContainer = textInputRichTextValue.parent('.richtext-container');
            var richTextEditable = richTextContainer.find(".cq-RichText-editable");
            var filteredValue = Utils.encodeScriptableTags(textInputValue[0].value);
            richTextEditable.empty().append(filteredValue);
            changeFormFields(["./_plainTextValue@Delete", "./_value"], [null, filteredValue]);
        } else {
            //Removing html tags from content and setting it to default text field
            var filteredValue =  $('<div>').html(textInputValue[0].value).text();
            changeFormFields(["./_value", "./_richTextValue@Delete"], [filteredValue, null]);
        }
    }

    function handleValidationPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,TEXTINPUT_VALIDATIONPATTERN,TEXTINPUT_VALIDATIONFORMAT);
    }

    function handleValidationFormat(dialog){
        Utils.handlePatternFormat(dialog,TEXTINPUT_VALIDATIONPATTERN,TEXTINPUT_VALIDATIONFORMAT);
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleRichText,handleValidationPatternDropDown,handleValidationFormat);

})(jQuery);
