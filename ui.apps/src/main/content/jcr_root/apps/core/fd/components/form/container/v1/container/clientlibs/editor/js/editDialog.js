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
        CONTAINER_SUBMITACTION = ".cmp-adaptiveform-container__submitaction",
        CONTAINER_SUBMITACTION_SETTINGS = ".cmp-adaptiveform-container__submitactionsettings",
        CONTAINER_SUBMITACTION_SETTINGS_WRAPPER = ".cmp-adaptiveform-container__submitactionsettingswrapper",
        CONTAINER_THANKYOUMESSAGE = ".cmp-adaptiveform-container__thankyoumessage",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    function handleAsyncSubmissionAndThankYouOption(dialog) {
        var containerAsyncSubmission = dialog.find(CONTAINER_ENABLEASYNCSUBMISSION)[0];
        var containerThankYouOption = dialog.find(CONTAINER_THANKYOUOPTION);
        var containerRedirect = dialog.find(CONTAINER_REDIRECT);
        var containerThankYouMessage = dialog.find(CONTAINER_THANKYOUMESSAGE);
        if (containerAsyncSubmission) {
            var isNotChecked = function() {return !isChecked()};
            var isChecked = function() {return containerAsyncSubmission.checked};
            var hideAndShowElements = function() {
                // hide other elements
                Utils.checkAndDisplay(containerThankYouOption)(isChecked);
                // show rich text
                Utils.checkAndDisplay(containerRedirect)(isNotChecked);
            };
            containerAsyncSubmission.on("change", function() {
                hideAndShowElements();
            });
            hideAndShowElements();
        }
        if (containerThankYouOption.length > 0) {
            var isThankYouOptionAMessage = function() {return (Utils.getSelectedRadioGroupOption(containerThankYouOption) === "message");};
            var isThankYouOptionPage = function() {return !isThankYouOptionAMessage();};
            // show thank you message if async submission and thank you option is set to "message"
            channel.on("change", EDIT_DIALOG + " " + CONTAINER_THANKYOUOPTION, function(e) {
                Utils.checkAndDisplay(containerThankYouMessage)(isThankYouOptionAMessage);
                Utils.checkAndDisplay(containerRedirect)(isThankYouOptionPage);
            });
            Utils.checkAndDisplay(containerThankYouMessage)(isThankYouOptionAMessage);
            Utils.checkAndDisplay(containerRedirect)(isThankYouOptionPage);
        }
    }

    function handleSubmitAction(dialog) {
        var containerSubmitAction = dialog.find(CONTAINER_SUBMITACTION),
            containerSubmitActionSettings = dialog.find(CONTAINER_SUBMITACTION_SETTINGS),
            containerSubmitActionSettingsWrapper = dialog.find(CONTAINER_SUBMITACTION_SETTINGS_WRAPPER);
        if (containerSubmitAction.length > 0) {
            // remove the deprecated submit action
            // this is done in client so that deprecated submit action could still work if configured in form
            containerSubmitAction.find('coral-select-item[data-deprecated="true"]').filter(function () {
                return $(this).prop('selected') === false;
            }).remove();
            // render the sub dialog
            var renderSubDialog = Utils.renderSubDialog(containerSubmitActionSettings[0]);
            var showHideWrapper = function(show){if (show){containerSubmitActionSettingsWrapper.show()} else{containerSubmitActionSettingsWrapper.hide()}};
            renderSubDialog(containerSubmitAction[0].value, showHideWrapper);
            containerSubmitAction[0].on("change", function(){
                renderSubDialog(containerSubmitAction[0].value, showHideWrapper);
            });
        }
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleAsyncSubmissionAndThankYouOption, handleSubmitAction);

})(jQuery, jQuery(document), Coral);
