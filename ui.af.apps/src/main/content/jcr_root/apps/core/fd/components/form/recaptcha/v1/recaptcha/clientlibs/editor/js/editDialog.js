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

    var EDIT_DIALOG = ".cmp-adaptiveform-recaptcha__editdialog",
        RECAPTCHA_CONFIG = EDIT_DIALOG + " .cmp-adaptiveform-recaptcha__configuration",
        RECAPTCHA_SIZE = EDIT_DIALOG + " .cmp-adaptiveform-recaptcha__size",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Shows custom text box depending on the value of assist priority of radio button
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function addListenerForCaptchaConfigChange(dialog) {
        const recaptchaConfig = dialog.find(RECAPTCHA_CONFIG)[0];
        recaptchaConfig.addEventListener("change", function() {
            handleCaptchaConfigChange(recaptchaConfig, dialog);
        });
        handleCaptchaConfigChange(recaptchaConfig, dialog);
    }

    function handleCaptchaConfigChange(recaptchaConfigElement, dialog) {
        const recaptchaSize = dialog.find(RECAPTCHA_SIZE)[0];
        const selectedConfig = recaptchaConfigElement.querySelector("coral-select-item[selected]");
        const selectedVersion = selectedConfig.getAttribute("data-version");
        const selectedKeyType = selectedConfig.getAttribute("data-key.type");
        const inputs = recaptchaSize.querySelectorAll('input');
        if (selectedVersion === "enterprise" && selectedKeyType === "score") {
            inputs.forEach(input => input.setAttribute("disabled", true));
        } else {
            inputs.forEach(input => input.removeAttribute("disabled"));
        }
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(addListenerForCaptchaConfigChange);

})(jQuery);
