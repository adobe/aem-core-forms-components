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

    var EDIT_DIALOG = ".cmp-adaptiveform-emailinput__editdialog",
        EMAILINPUT_ALLOWRICHTEXT = EDIT_DIALOG + " .cmp-adaptiveform-emailinput__allowrichtext",
        EMAILINPUT_MAXLENGTH = EDIT_DIALOG + " .cmp-adaptiveform-emailinput__maxlength",
        EMAILINPUT_MINLENGTH = EDIT_DIALOG + " .cmp-adaptiveform-emailinput__minlength",
        BASE_PLACEHOLDER = EDIT_DIALOG + " .cmp-adaptiveform-base__placeholder",
        EMAILINPUT_VALUE = EDIT_DIALOG + " .cmp-adaptiveform-emailinput__value",
        EMAILINPUT_RICHTEXTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-emailinput__richtextvalue",
        EMAILINPUT_VALIDATIONPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-emailinput__validationpattern",
        EMAILINPUT_VALIDATIONFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-emailinput__validationformat",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Toggles the visibility of the maxLength, minLength, placeholder field based on the checked state of
     * the allowRichText checkbox
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleRichText(dialog) {
        var component = dialog.find(EMAILINPUT_ALLOWRICHTEXT)[0];
        var emailInputMaxLength = dialog.find(EMAILINPUT_MAXLENGTH);
        var emailInputMinLength = dialog.find(EMAILINPUT_MINLENGTH);
        var basePlaceHolder = dialog.find(BASE_PLACEHOLDER).parent('div');
        var emailInputValue = dialog.find(EMAILINPUT_VALUE);
        var emailInputRichTextValue = dialog.find(EMAILINPUT_RICHTEXTVALUE);
        var listOfElements = [emailInputMaxLength, emailInputMinLength, basePlaceHolder, emailInputValue];

        var isNotChecked = function() {return !isChecked()};
        var isChecked = function() {return component.checked};
        var hideAndShowElements = function() {
            // hide other elements
            Utils.checkAndDisplay(listOfElements)(isNotChecked);
            // show rich text
            Utils.checkAndDisplay(emailInputRichTextValue)(isChecked);
        };
        hideAndShowElements();
        component.on("change", function() {
            hideAndShowElements();
        });
        var changeFormFields = Utils.manipulateNameAndValue([emailInputValue[0], emailInputRichTextValue[0]]);
        if (isChecked()) {
            var richTextContainer = emailInputRichTextValue.parent('.richtext-container');
            var richTextEditable = richTextContainer.find(".cq-RichText-editable");
            var filteredValue = Utils.encodeScriptableTags(emailInputValue[0].value);
            richTextEditable.empty().append(filteredValue);
            changeFormFields(["./_plainTextValue@Delete", "./_value"], [null, filteredValue]);
        } else {
            //Removing html tags from content and setting it to default email input field
            var filteredValue =  $('<div>').html(emailInputValue[0].value).text();
            changeFormFields(["./_value", "./_richTextValue@Delete"], [filteredValue, null]);
        }
    }

    function handleValidationPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,EMAILINPUT_VALIDATIONPATTERN,EMAILINPUT_VALIDATIONFORMAT);
    }

    function handleValidationFormat(dialog){
        Utils.handlePatternFormat(dialog,EMAILINPUT_VALIDATIONPATTERN,EMAILINPUT_VALIDATIONFORMAT);
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleRichText,handleValidationPatternDropDown,handleValidationFormat);

})(jQuery);
