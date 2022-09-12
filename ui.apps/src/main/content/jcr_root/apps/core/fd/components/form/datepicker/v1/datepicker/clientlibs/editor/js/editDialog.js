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

    var EDIT_DIALOG = ".cmp-adaptiveform-datepicker__editdialog",
        DATEPICKER_ALLOWRICHTEXT = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__allowrichtext",
        DATEPICKER_MAXCHARS = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__maxchars",
        DATEPICKER_MINLENGTH = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__minlength",
        BASE_PLACEHOLDER = EDIT_DIALOG + " .cmp-adaptiveform-base__placeholder",
        DATEPICKER_VALUE = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__value",
        DATEPICKER_RICHTEXTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__richtextvalue",
        DATEPICKER_AUTOCOMPLETE = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__autocomplete",
        DATEPICKER_AUTOFILL_FIELD_KEYWORD = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__autofillfieldkeyword",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Toggles the visibility of the maxChars, minLength, placeholder field based on the checked state of
     * the allowRichText checkbox
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleRichText(dialog) {
        var component = dialog.find(DATEPICKER_ALLOWRICHTEXT)[0];
        var datePickerMaxChars = dialog.find(DATEPICKER_MAXCHARS);
        var datePickerMinLength = dialog.find(DATEPICKER_MINLENGTH);
        var basePlaceHolder = dialog.find(BASE_PLACEHOLDER).parent('div');
        var datePickerValue = dialog.find(DATEPICKER_VALUE);
        var datePickerRichTextValue = dialog.find(DATEPICKER_RICHTEXTVALUE);
        var listOfElements = [datePickerMaxChars, datePickerMinLength, basePlaceHolder, datePickerValue];

        var isNotChecked = function() {return !isChecked()};
        var isChecked = function() {return component.checked};
        var hideAndShowElements = function() {
            // hide other elements
            Utils.checkAndDisplay(listOfElements)(isNotChecked);
            // show rich text
            Utils.checkAndDisplay(datePickerRichTextValue)(isChecked);
        };
        hideAndShowElements();
        component.on("change", function() {
            hideAndShowElements();
        });
        var changeFormFields = Utils.manipulateNameAndValue([datePickerValue[0], datePickerRichTextValue[0]]);
        if (isChecked()) {
            var richTextContainer = datePickerRichTextValue.parent('.richtext-container');
            var richTextEditable = richTextContainer.find(".cq-RichText-editable");
            var filteredValue = Utils.encodeScriptableTags(datePickerValue[0].value);
            richTextEditable.empty().append(filteredValue);
            changeFormFields(["./_plainTextValue@Delete", "./_value"], [null, filteredValue]);
        } else {
            //Removing html tags from content and setting it to default text field
            var filteredValue =  $('<div>').html(datePickerValue[0].value).text();
            changeFormFields(["./_value", "./_richTextValue@Delete"], [filteredValue, null]);
        }
    }

    function handleAutoComplete(dialog) {
        var datePickerAutoComplete = dialog.find(DATEPICKER_AUTOCOMPLETE)[0];
        var datePickerAutofill = dialog.find(DATEPICKER_AUTOFILL_FIELD_KEYWORD);
        var isChecked = function() {return datePickerAutoComplete.checked};
        var hideAndShowElements = function() {
            Utils.checkAndDisplay(datePickerAutofill)(isChecked);
        };
        hideAndShowElements();
        datePickerAutoComplete.on("change", function() {
            hideAndShowElements();
        });
    }
    Utils.initializeEditDialog(EDIT_DIALOG)(handleAutoComplete, handleRichText);

})(jQuery);
