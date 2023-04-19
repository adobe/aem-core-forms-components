/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* global jQuery */
(function($) {
    "use strict";

    var selectors = {
            dialogContent: ".cmp-adaptiveform-panelcontainer__editdialog",
            edit: {
                backgroundColorSwatchesOnly: "[data-cmp-container-v1-dialog-edit-hook='backgroundColorSwatchesOnly']"
            },
            policy: {
                backgroundColorEnabled: "[data-cmp-container-v1-dialog-policy-hook='backgroundColorEnabled']",
                backgroundColorSwatchesOnly: "[data-cmp-container-v1-dialog-policy-hook='backgroundColorSwatchesOnly']",
                backgroundColorAllowedSwatches: "[data-cmp-container-v1-dialog-policy-hook='backgroundColorAllowedSwatches']"
            }
        };

    $(document).on("dialog-loaded", function(e) {
        var $dialog = e.dialog;
        var $dialogContent = $dialog.find(selectors.dialogContent);
        var dialogContent = $dialogContent.length > 0 ? $dialogContent[0] : undefined;

        if (dialogContent) {
            if (dialogContent.querySelector("[data-cmp-container-v1-dialog-edit-hook]")) {
                handleEditDialog(dialogContent);
            } else if (dialogContent.querySelector("[data-cmp-container-v1-dialog-policy-hook]")) {
                handlePolicyDialog(dialogContent);
            }
        }

        if($dialog[0]) {
            // repeatability, For handling the case when tabs,accordion and wizard inherit panel edit-dialog
            handleRepeat($dialog[0]);
        }
    });

    /**
     * Binds edit dialog handling
     *
     * @param {HTMLElement} containerEditor The dialog wrapper
     */
    function handleEditDialog(containerEditor) {
        var backgroundColorSwatchesOnly = containerEditor.querySelector(selectors.edit.backgroundColorSwatchesOnly);
        if (backgroundColorSwatchesOnly) {
            backgroundColorSwatchesOnly.on("coral-overlay:beforeopen.cmp-container-v1-dialog-edit", function(event) {
                backgroundColorSwatchesOnly.off("coral-overlay:beforeopen.cmp-container-v1-dialog-edit");

                // ensures the swatches overlay is displayed correctly in dialog inline mode, by aligning it bottom left of the toggle button
                var target = event.target || event.srcElement;
                target.alignAt = Coral.Overlay.align.LEFT_BOTTOM;
                target.alignMy = Coral.Overlay.align.LEFT_TOP;
            });
        }
    }

    /**
     * Binds policy dialog handling
     *
     * @param {HTMLElement} containerEditor The dialog wrapper
     */
    function handlePolicyDialog(containerEditor) {
        var backgroundColorEnabled = containerEditor.querySelector(selectors.policy.backgroundColorEnabled);
        var backgroundColorSwatchesOnly = containerEditor.querySelector(selectors.policy.backgroundColorSwatchesOnly);
        var backgroundColorAllowedSwatches = containerEditor.querySelector(selectors.policy.backgroundColorAllowedSwatches);

        if (backgroundColorEnabled && backgroundColorSwatchesOnly && backgroundColorAllowedSwatches) {
            var backgroundColorSwatchesOnlyToggleable = $(backgroundColorSwatchesOnly).adaptTo("foundation-toggleable");
            var backgroundColorAllowedSwatchesToggleable = $(backgroundColorAllowedSwatches.parentNode).adaptTo("foundation-toggleable");
            toggle(backgroundColorSwatchesOnlyToggleable, backgroundColorEnabled.checked);
            toggle(backgroundColorAllowedSwatchesToggleable, backgroundColorEnabled.checked);

            backgroundColorEnabled.on("change", function(event) {
                toggle(backgroundColorSwatchesOnlyToggleable, backgroundColorEnabled.checked);
                toggle(backgroundColorAllowedSwatchesToggleable, backgroundColorEnabled.checked);
            });
        }
    }

    function toggle(toggleable, show) {
        if (show) {
            toggleable.show();
        } else {
            toggleable.hide();
        }
    }


    function handleRepeat(dialogElement) {
        const isRepeatable = function() {
                let repeat = dialogElement.querySelector("input[name='./repeatable']");
                return repeat.checked;
            };
        const makeWrapDataReadOnly = function(status) {
                let checkbox = dialogElement.querySelector(".cmp-adaptiveform-panel__wrapData");
                if(checkbox) {
                    checkbox.checked = status;
                    checkbox.disabled = status;
                }
            };
        const markMinMaxDisabled = function(status) {
                let minRepeat = dialogElement.querySelector("coral-numberinput[name='./minOccur']");
                let maxRepeat = dialogElement.querySelector("coral-numberinput[name='./maxOccur']");
                if(minRepeat) {
                    minRepeat.disabled = status;
                }
                if(maxRepeat) {
                    maxRepeat.disabled = status;
                }
            };

        const isRepeat = isRepeatable();
        const bindRef = dialogElement.querySelector("input[name='./dataRef']");
        const maxRepeat = dialogElement.querySelector("coral-numberinput[name='./maxOccur']");
        if (maxRepeat.value == -1) {
            maxRepeat.value = '';
        }
        markMinMaxDisabled(!isRepeat);

        // checking for repeatability and bindRef of panel on dialog initialisation
        if(isRepeat || bindRef.value.length > 0) {
            makeWrapDataReadOnly(true);
        }

        bindRef.addEventListener("change", function () {
            makeWrapDataReadOnly(this.value.length > 0);
        });

        const repeatSwitch = dialogElement.querySelector(".cmp-adaptiveform-panelcontainer__repeatable coral-switch");
        repeatSwitch.addEventListener("change", function () {
            const isRepeat = isRepeatable();
            makeWrapDataReadOnly(isRepeat);
            markMinMaxDisabled(!isRepeat);
        });
    }

})(jQuery);
