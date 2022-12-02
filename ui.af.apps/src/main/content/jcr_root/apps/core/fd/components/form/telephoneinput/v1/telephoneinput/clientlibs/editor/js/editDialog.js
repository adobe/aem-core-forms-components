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

    var EDIT_DIALOG = ".cmp-adaptiveform-telephoneinput__editdialog",
        TELEPHONEINPUT_ALLOWRICHTEXT = EDIT_DIALOG + " .cmp-adaptiveform-telephoneinput__allowrichtext",
        TELEPHONEINPUT_MAXLENGTH = EDIT_DIALOG + " .cmp-adaptiveform-telephoneinput__maxlength",
        TELEPHONEINPUT_MINLENGTH = EDIT_DIALOG + " .cmp-adaptiveform-telephoneinput__minlength",
        BASE_PLACEHOLDER = EDIT_DIALOG + " .cmp-adaptiveform-base__placeholder",
        TELEPHONEINPUT_VALUE = EDIT_DIALOG + " .cmp-adaptiveform-telephoneinput__value",
        TELEPHONEINPUT_RICHTEXTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-telephoneinput__richtextvalue",
        TELEPHONEINPUT_VALIDATIONPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-telephoneinput__validationpattern",
        TELEPHONEINPUT_VALIDATIONFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-telephoneinput__validationformat",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Toggles the visibility of the maxLength, minLength, placeholder field based on the checked state of
     * the allowRichText checkbox
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleRichText(dialog) {
        var component = dialog.find(TELEPHONEINPUT_ALLOWRICHTEXT)[0];
        var telephoneInputMaxLength = dialog.find(TELEPHONEINPUT_MAXLENGTH);
        var telephoneInputMinLength = dialog.find(TELEPHONEINPUT_MINLENGTH);
        var basePlaceHolder = dialog.find(BASE_PLACEHOLDER).parent('div');
        var telephoneInputValue = dialog.find(TELEPHONEINPUT_VALUE);
        var telephoneInputRichTextValue = dialog.find(TELEPHONEINPUT_RICHTEXTVALUE);
        var listOfElements = [telephoneInputMaxLength, telephoneInputMinLength, basePlaceHolder, telephoneInputValue];

        var isNotChecked = function() {return !isChecked()};
        var isChecked = function() {return component.checked};
        var hideAndShowElements = function() {
            // hide other elements
            Utils.checkAndDisplay(listOfElements)(isNotChecked);
            // show rich text
            Utils.checkAndDisplay(telephoneInputRichTextValue)(isChecked);
        };
        hideAndShowElements();
        component.on("change", function() {
            hideAndShowElements();
        });
        var changeFormFields = Utils.manipulateNameAndValue([telephoneInputValue[0], telephoneInputRichTextValue[0]]);
        if (isChecked()) {
            var richTextContainer = telephoneInputRichTextValue.parent('.richtext-container');
            var richTextEditable = richTextContainer.find(".cq-RichText-editable");
            var filteredValue = Utils.encodeScriptableTags(telephoneInputValue[0].value);
            richTextEditable.empty().append(filteredValue);
            changeFormFields(["./_plainTextValue@Delete", "./_value"], [null, filteredValue]);
        } else {
            //Removing html tags from content and setting it to default telephone input field
            var filteredValue =  $('<div>').html(telephoneInputValue[0].value).text();
            changeFormFields(["./_value", "./_richTextValue@Delete"], [filteredValue, null]);
        }
    }

    function handleValidationPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,TELEPHONEINPUT_VALIDATIONPATTERN,TELEPHONEINPUT_VALIDATIONFORMAT);
    }

    function handleValidationFormat(dialog){
        Utils.handlePatternFormat(dialog,TELEPHONEINPUT_VALIDATIONPATTERN,TELEPHONEINPUT_VALIDATIONFORMAT);
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleRichText,handleValidationPatternDropDown,handleValidationFormat);

})(jQuery);
