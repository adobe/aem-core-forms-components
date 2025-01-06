/*******************************************************************************
 * Copyright 2024 Adobe
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

    var EDIT_DIALOG = ".cmp-adaptiveform-turnstile__editdialog",
        TURNSTILE_CONFIG = EDIT_DIALOG + " .cmp-adaptiveform-turnstile__configuration",
        TURNSTILE_SIZE = EDIT_DIALOG + " .cmp-adaptiveform-turnstile__size",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    function addListenerForCaptchaConfigChange(dialog) {
        const turnstileConfigElement = dialog.find(TURNSTILE_CONFIG)[0];
        turnstileConfigElement.addEventListener("change", function() {
            handleCaptchaConfigChange(turnstileConfigElement, dialog);
        });
        handleCaptchaConfigChange(turnstileConfigElement, dialog);
    }

    function handleCaptchaConfigChange(turnstileConfigElement, dialog) {
        const turnstileSizeElement = dialog.find(TURNSTILE_SIZE)[0];
        const selectedConfig = turnstileConfigElement.querySelector("coral-select-item[selected]");
        const selectedWidgetType = selectedConfig.getAttribute("data-widget.type");
        const inputs = turnstileSizeElement.querySelectorAll('input');
        if (selectedWidgetType === "invisible") {
            inputs.forEach(input => input.setAttribute("disabled", true));
        } else {
            inputs.forEach(input => input.removeAttribute("disabled"));
        }
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(addListenerForCaptchaConfigChange);

})(jQuery);
