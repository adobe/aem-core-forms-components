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
(function($, channel, Coral) {
    "use strict";

    var EDIT_DIALOG = ".cmp-adaptiveform-textinput__editdialog",
        TEXTINPUT_ALLOWRICHTEXT = ".cmp-adaptiveform-textinput__allowrichtext",
        TEXTINPUT_MAXCHARS = ".cmp-adaptiveform-textinput__maxchars",
        TEXTINPUT_MINLENGTH = ".cmp-adaptiveform-textinput__minlength",
        BASE_PLACEHOLDER = ".cmp-adaptiveform-base__placeholder",
        TEXTINPUT_VALUE = ".cmp-adaptiveform-textinput__value",
        TEXTINPUT_RICHTEXTVALUE = ".cmp-adaptiveform-textinput__richtextvalue";


    /**
     * Toggles the display of the given element based on the actual and the expected values.
     * If the actualValue is equal to the expectedValue, then the element is shown,
     * otherwise the element is hidden.
     *
     * @param {HTMLElement} elements The html element to show/hide.
     * @param {*} expectedValue The value to test against.
     * @param {*} actualValue The value to test.
     */
    function checkAndDisplay(elements, expectedValue, actualValue) {
        var elemArray = elements instanceof Array ? elements : [elements];
        elemArray.forEach(function(elem) {
            if (expectedValue === actualValue) {
                elem.show();
            } else {
                elem.hide();
            }
        });
    }

    function manipulateElementNameAndValue(elements, newNames, newValues) {
        var elemArray = elements instanceof Array ? elements : [elements];
        elemArray.forEach(function(elem, index) {
            if (typeof newNames[index] !== 'undefined' && newNames[index] != null && elem) {
                elem.name = newNames[index];
            }
            if (typeof newValues[index] !== 'undefined' && newValues[index] != null && elem) {
                elem.value = newValues[index];
            }
        });
    }

    /**
     * Toggles the visibility of the maxChars, minLength, placeholder field based on the checked state of
     * the allowRichText checkbox
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleRichText(dialog) {
        var component = dialog.find(TEXTINPUT_ALLOWRICHTEXT)[0];
        var textInputMaxChars = dialog.find(TEXTINPUT_MAXCHARS);
        var textInputMinLength = dialog.find(TEXTINPUT_MINLENGTH);
        var basePlaceHolder = dialog.find(BASE_PLACEHOLDER);
        var textInputValue = dialog.find(TEXTINPUT_VALUE);
        var textInputRichTextValue = dialog.find(TEXTINPUT_RICHTEXTVALUE);
        var listOfElements = [textInputMaxChars, textInputMinLength, basePlaceHolder, textInputValue];
        // hide other elements
        checkAndDisplay(listOfElements,
            false,
            component.checked);
        // show rich text
        checkAndDisplay(textInputRichTextValue, true, component.checked);
        component.on("change", function() {
            checkAndDisplay(listOfElements,
                false,
                component.checked);
            checkAndDisplay(textInputRichTextValue, true, component.checked);
        });

        if (component.checked) {
            var richTextContainer = textInputRichTextValue.parent('.richtext-container');
            var richTextEditable = richTextContainer.find(".cq-RichText-editable");
            var filteredValue = $('<div>').html(textInputValue[0].value);
            richTextEditable.empty().append(filteredValue);
            manipulateElementNameAndValue([textInputValue[0], textInputRichTextValue[0]], ["./_plainTextValue@Delete", "./_value"], [null, filteredValue])
        } else {
            //Removing html tags from content and setting it to default text field
            var filteredValue =  $('<div>').html(textInputValue[0].value).text();
            manipulateElementNameAndValue([textInputValue[0], textInputRichTextValue[0]], ["./_value", "./_richTextValue@Delete"], [filteredValue, null])
        }
    }

    /**
     * Initialise the conditional display of the various elements of the dialog.
     *
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function initialise(dialog) {
        dialog = $(dialog);
        handleRichText(dialog);
    }

    channel.on("foundation-contentloaded", function(e) {
        if ($(e.target).find(EDIT_DIALOG).length > 0) {
            Coral.commons.ready(e.target, function(component) {
                initialise(component);
            });
        }
    });

})(jQuery, jQuery(document), Coral);
