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

    var EDIT_DIALOG = ".cmp-adaptiveform-text__editdialog",
        BASE_PLACEHOLDER = EDIT_DIALOG + " .cmp-adaptiveform-base__placeholder",
        TEXTINPUT_VALUE = EDIT_DIALOG + " .cmp-adaptiveform-textinput__value",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Toggles the visibility of the maxLength, minLength, placeholder field based on the checked state of
     * the allowRichText checkbox
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleRichText(dialog) {
        var basePlaceHolder = dialog.find(BASE_PLACEHOLDER).parent('div');
        var textInputValue = dialog.find(TEXTINPUT_VALUE);
        var listOfElements = [basePlaceHolder, textInputValue];

        var changeFormFields = Utils.manipulateNameAndValue([textInputValue[0], textInputRichTextValue[0]]);
        if (isChecked()) {
            var filteredValue = Utils.encodeScriptableTags(textInputValue[0].value);
            changeFormFields(["./_plainTextValue@Delete", "./_value"], [null, filteredValue]);
        } else {
            //Removing html tags from content and setting it to default text field
            var filteredValue =  $('<div>').html(textInputValue[0].value).text();
            changeFormFields(["./_value", "./_richTextValue@Delete"], [filteredValue, null]);
        }
    }
    Utils.initializeEditDialog(EDIT_DIALOG)(handleRichText);

})(jQuery);
