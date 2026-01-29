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

    const selectors = {
            dialogContent: ".cmp-adaptiveform-panelcontainer__editdialog",
            edit: {
                backgroundColorSwatchesOnly: "[data-cmp-container-v1-dialog-edit-hook='backgroundColorSwatchesOnly']"
            },
            policy: {
                backgroundColorEnabled: "[data-cmp-container-v1-dialog-policy-hook='backgroundColorEnabled']",
                backgroundColorSwatchesOnly: "[data-cmp-container-v1-dialog-policy-hook='backgroundColorSwatchesOnly']",
                backgroundColorAllowedSwatches: "[data-cmp-container-v1-dialog-policy-hook='backgroundColorAllowedSwatches']"
            }
        },
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    /**
     * Main handler that delegates to edit/policy dialog handlers and always handles common behaviors
     * @param {jQuery} dialog The jQuery dialog object
     */
    function handlePanelDialog(dialog) {
        const $dialogContent = dialog.find(selectors.dialogContent);
        const dialogContent = $dialogContent.length > 0 ? $dialogContent[0] : undefined;

        if (dialogContent) {
            if (dialogContent.querySelector("[data-cmp-container-v1-dialog-edit-hook]")) {
                handleEditDialog(dialogContent);
            } else if (dialogContent.querySelector("[data-cmp-container-v1-dialog-policy-hook]")) {
                handlePolicyDialog(dialogContent);
            }
            
            // Always handle useFieldset behavior for panel dialogs
            handleUseFieldsetBehavior(dialogContent);
        }

        // Handle repeatability for panels, tabs, accordion and wizard
        if (dialog[0]) {
            handleRepeat(dialog[0]);
        }
    }

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
     * Handles the interaction between useFieldset checkbox and hideTitle checkbox.
     * When useFieldset is enabled:
     * - hideTitle should be disabled and unchecked (legend must be visible)
     * - Title is recommended for accessibility, but code falls back to name if not provided
     *
     * @param {HTMLElement} containerEditor The dialog wrapper
     */
    const handleUseFieldsetBehavior = (containerEditor) => {
        const useFieldsetCheckbox = containerEditor.querySelector('[data-cmp-adaptiveform-panel-usefieldset]');
        const hideTitleCheckbox = containerEditor.querySelector('coral-checkbox[name="./hideTitle"]');
        const titleField = containerEditor.querySelector('input[name="./jcr:title"]');

        if (!useFieldsetCheckbox) {
            return;
        }

        // Function to update hideTitle state based on useFieldset
        const updateHideTitleState = () => {
            const isFieldsetEnabled = useFieldsetCheckbox.checked;
            
            if (isFieldsetEnabled) {
                // Disable and uncheck hideTitle when fieldset is enabled
                if (hideTitleCheckbox) {
                    hideTitleCheckbox.disabled = true;
                    hideTitleCheckbox.checked = false;
                }

                // Add visual indicator that title is recommended (but not strictly required since we fall back to name in the HTL template)
                if (titleField) {
                    const titleFieldWrapper = titleField.closest('.coral-Form-fieldwrapper');
                    if (titleFieldWrapper) {
                        const labelElement = titleFieldWrapper.querySelector('label.coral-Form-fieldlabel');
                        if (labelElement && !labelElement.dataset.originalText) {
                            // Store original text and append asterisk (indicating that title is recommended)
                            labelElement.dataset.originalText = labelElement.textContent;
                            labelElement.textContent = `${labelElement.textContent} *`;
                        }
                    }
                }
            } else {
                // Re-enable hideTitle when fieldset is disabled
                if (hideTitleCheckbox) {
                    hideTitleCheckbox.disabled = false;
                }

                // Remove title recommendation indicator (restore original text)
                if (titleField) {
                    const titleFieldWrapper = titleField.closest('.coral-Form-fieldwrapper');
                    if (titleFieldWrapper) {
                        const labelElement = titleFieldWrapper.querySelector('label.coral-Form-fieldlabel');
                        if (labelElement && labelElement.dataset.originalText) {
                            labelElement.textContent = labelElement.dataset.originalText;
                            delete labelElement.dataset.originalText;
                        }
                    }
                }
            }
        };

        // Initialize state on dialog load
        updateHideTitleState();
        useFieldsetCheckbox.addEventListener('change', updateHideTitleState);
    };

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
                if (repeat) {
                    return repeat.checked
                }
                return false;
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
        if (maxRepeat && maxRepeat.value == -1) {
            maxRepeat.value = '';
        }
        markMinMaxDisabled(!isRepeat);

        // checking for repeatability and bindRef of panel on dialog initialisation
        if(isRepeat || ( bindRef !== null && bindRef.value.length > 0)) {
            makeWrapDataReadOnly(true);
        }

        if(bindRef !== null) {
            bindRef.addEventListener("change", function () {
                makeWrapDataReadOnly(this.value.length > 0);
            });
        }

        const repeatSwitch = dialogElement.querySelector(".cmp-adaptiveform-panelcontainer__repeatable coral-switch");
        if (repeatSwitch) {
            repeatSwitch.addEventListener("change", function () {
                const isRepeat = isRepeatable();
                makeWrapDataReadOnly(isRepeat);
                markMinMaxDisabled(!isRepeat);
            });
        }
    }

    // Initialize dialog handlers using the common utility
    Utils.initializeEditDialog(selectors.dialogContent)(handlePanelDialog);

})(jQuery);