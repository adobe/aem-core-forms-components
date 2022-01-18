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

    var EDIT_DIALOG = ".cmp-adaptiveform-container__editdialog",
        CONTAINER_ENABLEASYNCSUBMISSION = ".cmp-adaptiveform-container__enableasyncsubmission",
        CONTAINER_THANKYOUOPTION = ".cmp-adaptiveform-container__thankyouoption",
        CONTAINER_REDIRECT = ".cmp-adaptiveform-container__redirect",
        CONTAINER_THANKYOUMESSAGE = ".cmp-adaptiveform-container__thankyoumessage";


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

    /**
     * Get selected radio option helper
     * @param component The radio option component
     * @returns {String} Value of the selected radio option
     */
    function getSelectedRadioGroupOption(component) {
        var radioComp = component.find('[type="radio"]');
        for (var i = 0; i < radioComp.length; i++) {
            if ($(radioComp[i]).prop("checked")) {
                return $(radioComp[i]).val();
            }
        }
        return undefined;
    }

    function handleAsyncSubmissionAndThankYouOption(dialog) {
        var containerAsyncSubmission = dialog.find(CONTAINER_ENABLEASYNCSUBMISSION)[0];
        var containerThankYouOption = dialog.find(CONTAINER_THANKYOUOPTION);
        var containerRedirect = dialog.find(CONTAINER_REDIRECT);
        var containerThankYouMessage = dialog.find(CONTAINER_THANKYOUMESSAGE);
        if (containerAsyncSubmission) {
            var wrapperCheckAndDisplay = function() {
                checkAndDisplay(containerThankYouOption,
                    true,
                    containerAsyncSubmission.checked);
                checkAndDisplay(containerRedirect,
                    false,
                    containerAsyncSubmission.checked);
            };
            containerAsyncSubmission.on("change", function() {
                wrapperCheckAndDisplay();
            });
            wrapperCheckAndDisplay();
        }
        if (containerThankYouOption.length > 0) {
            // show thank you message if async submission and thank you option is set to "message"
            channel.on("change", EDIT_DIALOG + " " + CONTAINER_THANKYOUOPTION, function(e) {
                checkAndDisplay(containerThankYouMessage,
                    "message",
                    getSelectedRadioGroupOption(containerThankYouOption));
            });
            checkAndDisplay(containerThankYouMessage,
                "message",
                getSelectedRadioGroupOption(containerThankYouOption));
        }
    }

    /**
     * Initialise the conditional display of the various elements of the dialog.
     *
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function initialise(dialog) {
        dialog = $(dialog);
        handleAsyncSubmissionAndThankYouOption(dialog);
    }

    channel.on("foundation-contentloaded", function(e) {
        if ($(e.target).find(EDIT_DIALOG).length > 0) {
            Coral.commons.ready(e.target, function(component) {
                initialise(component);
            });
        }
    });

})(jQuery, jQuery(document), Coral);
