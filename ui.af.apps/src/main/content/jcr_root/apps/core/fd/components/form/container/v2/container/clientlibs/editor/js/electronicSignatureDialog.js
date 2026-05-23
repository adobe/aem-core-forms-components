/*******************************************************************************
 * Copyright 2026 Adobe
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

    var SELECTORS = {
        esignTab: ".cmp-adaptiveform-container__esign-tab",
        enableCheckbox: ".cmp-adaptiveform-container__esign-enable",
        signingConfig: ".cmp-adaptiveform-container__esign-config",
        signerMultifield: "coral-multifield[name='./signerInfo/signer']",
        signerItem: ".cmp-adaptiveform-container__signer-item",
        firstSignerRadiogroup: ".cmp-adaptiveform-container__signer-firstsigner",
        signConfigPath: "coral-select[name='./signerInfo/signConfigPath']",
        emailSource: ".cmp-adaptiveform-container__signer-emailsource",
        emailAutocomplete: ".cmp-adaptiveform-container__signer-emailautocomplete",
        email: ".cmp-adaptiveform-container__signer-email",
        securityOption: ".cmp-adaptiveform-container__signer-securityoption",
        phoneContainer: ".cmp-adaptiveform-container__signer-phonecontainer",
        countryCodeSource: ".cmp-adaptiveform-container__signer-countrycodesource",
        countryCodeAutocomplete: ".cmp-adaptiveform-container__signer-countrycodeautocomplete",
        countryCode: ".cmp-adaptiveform-container__signer-countrycode",
        phoneSource: ".cmp-adaptiveform-container__signer-phonesource",
        phoneAutocomplete: ".cmp-adaptiveform-container__signer-phoneautocomplete",
        phone: ".cmp-adaptiveform-container__signer-phone"
    };

    function isChecked(el) {
        var checkbox = el instanceof $ ? el[0] : el;
        if (checkbox && checkbox.tagName && checkbox.tagName.toLowerCase() === "coral-checkbox") {
            return checkbox.checked;
        }
        return $(checkbox).is(":checked");
    }

    /**
     * Returns the selected value from a coral-select, whether $el is the
     * coral-select itself or a containing wrapper (granite:class on wrapper).
     */
    function getSelectValue($el) {
        var coralSelect = $el.is("coral-select") ? $el[0] : $el.find("coral-select")[0];
        return coralSelect ? (coralSelect.value || "") : "";
    }

    /**
     * Show or hide a field wrapper or plain container.
     * Caps the closest(".coral-Form-fieldwrapper") search at the signer-item
     * boundary so the multifield itself is never accidentally hidden.
     */
    function setVisible($el, visible) {
        var $signerItem = $el.closest(SELECTORS.signerItem);
        var $candidate = $el.closest(".coral-Form-fieldwrapper");
        var useWrapper = $candidate.length && (
            !$signerItem.length || $.contains($signerItem[0], $candidate[0])
        );
        (useWrapper ? $candidate : $el).toggle(visible);
    }

    function toggleSigningConfig(dialog) {
        var $dialog = $(dialog);
        var enabled = isChecked($dialog.find(SELECTORS.enableCheckbox));
        $dialog.find(SELECTORS.signingConfig).toggle(enabled);
        if (enabled) {
            ensureDefaultSigner(dialog);
        }
    }

    /**
     * Adds one signer item if the multifield is empty.
     * Called whenever Adobe Sign is enabled (dialog open or checkbox checked).
     */
    function ensureDefaultSigner(dialog) {
        var $mf = $(dialog).find(SELECTORS.signerMultifield);
        if (!$mf.length) return;
        Coral.commons.ready($mf[0], function() {
            if ($mf[0].items.length === 0) {
                var addBtn = $mf[0].querySelector("[coral-multifield-add]");
                if (addBtn) addBtn.click();
            }
        });
    }

    /**
     * Enables the "Is form filler first signer?" radiogroup on the first signer item;
     * locks it to "No" and disables it on all subsequent items.
     */
    function updateFirstSignerState(dialog) {
        $(dialog).find(SELECTORS.signerMultifield)
            .find("coral-multifield-item")
            .each(function(index) {
                var $item = $(this).find(SELECTORS.signerItem);
                var rg = $item.find(SELECTORS.firstSignerRadiogroup)[0];
                if (!rg) return;
                if (index === 0) {
                    rg.disabled = false;
                } else {
                    rg.value = "false";
                    rg.disabled = true;
                }
            });
    }

    function applyEmailSourceRules($item) {
        var val = getSelectValue($item.find(SELECTORS.emailSource));
        setVisible($item.find(SELECTORS.emailAutocomplete), val === "form");
        setVisible($item.find(SELECTORS.email), val === "typed");
    }

    function applySecurityOptionRules($item) {
        var val = getSelectValue($item.find(SELECTORS.securityOption));
        var isPhone = val === "PHONE";
        setVisible($item.find(SELECTORS.phoneContainer), isPhone);
        if (isPhone) {
            applyCountryCodeSourceRules($item);
            applyPhoneSourceRules($item);
        }
    }

    function applyCountryCodeSourceRules($item) {
        var val = getSelectValue($item.find(SELECTORS.countryCodeSource));
        setVisible($item.find(SELECTORS.countryCodeAutocomplete), val === "form");
        setVisible($item.find(SELECTORS.countryCode), val === "typed");
    }

    function applyPhoneSourceRules($item) {
        var val = getSelectValue($item.find(SELECTORS.phoneSource));
        setVisible($item.find(SELECTORS.phoneAutocomplete), val === "form");
        setVisible($item.find(SELECTORS.phone), val === "typed");
    }

    function initAllSignerItems(dialog) {
        $(dialog).find(SELECTORS.signerItem).each(function() {
            applyEmailSourceRules($(this));
            applySecurityOptionRules($(this));
        });
    }

    function wireSignerItemListeners(dialog) {
        var $dialog = $(dialog);

        $dialog.on("change", SELECTORS.emailSource, function(e) {
            applyEmailSourceRules($(e.target).closest(SELECTORS.signerItem));
        });
        $dialog.on("change", SELECTORS.securityOption, function(e) {
            applySecurityOptionRules($(e.target).closest(SELECTORS.signerItem));
        });
        $dialog.on("change", SELECTORS.countryCodeSource, function(e) {
            applyCountryCodeSourceRules($(e.target).closest(SELECTORS.signerItem));
        });
        $dialog.on("change", SELECTORS.phoneSource, function(e) {
            applyPhoneSourceRules($(e.target).closest(SELECTORS.signerItem));
        });
    }

    function wireMultifieldListeners(dialog) {
        var $dialog = $(dialog);

        $dialog.on("coral-collection:add", SELECTORS.signerMultifield, function(e) {
            var $newItem = $(e.detail.item).find(SELECTORS.signerItem);
            if ($newItem.length) {
                applyEmailSourceRules($newItem);
                applySecurityOptionRules($newItem);
            }
            updateFirstSignerState(dialog);
        });

        $dialog.on("coral-collection:remove", SELECTORS.signerMultifield, function() {
            updateFirstSignerState(dialog);
        });
    }

    /**
     * Validates required signing config fields when Adobe Sign is enabled.
     * Returns true if valid.
     */
    function validateSigningConfig(dialog) {
        if (!isChecked($(dialog).find(SELECTORS.enableCheckbox))) {
            return true;
        }
        var $configSelect = $(dialog).find(SELECTORS.signConfigPath);
        if (!$configSelect.length || !getSelectValue($configSelect)) {
            markFieldInvalid($configSelect, "Adobe Sign cloud configuration is required.");
            return false;
        }
        clearFieldInvalid($configSelect);
        return true;
    }

    function markFieldInvalid($coralSelect, message) {
        var el = $coralSelect[0];
        if (!el) return;
        el.invalid = true;
        var $wrapper = $coralSelect.closest(".coral-Form-fieldwrapper");
        $wrapper.find(".cmp-esign-field-error").remove();
        $wrapper.append('<span class="cmp-esign-field-error coral-Form-errorlabel">' + message + "</span>");
    }

    function clearFieldInvalid($coralSelect) {
        var el = $coralSelect[0];
        if (el) el.invalid = false;
        $coralSelect.closest(".coral-Form-fieldwrapper").find(".cmp-esign-field-error").remove();
    }

    function wireSubmitValidation(dialog) {
        channel.on("cq-dialog-submit.esign", function(e) {
            if (!$(dialog).is(":visible")) return;
            if (!validateSigningConfig(dialog)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });
    }

    function initElectronicSignatureDialog(dialog) {
        var $dialog = $(dialog);
        if (!$dialog.find(SELECTORS.esignTab).length) {
            return;
        }

        toggleSigningConfig(dialog);
        initAllSignerItems(dialog);
        updateFirstSignerState(dialog);

        $dialog.on("change", SELECTORS.enableCheckbox, function() {
            toggleSigningConfig(dialog);
        });

        wireSignerItemListeners(dialog);
        wireMultifieldListeners(dialog);
        wireSubmitValidation(dialog);
    }

    channel.on("dialog-ready", function() {
        var dialog = $(".cq-dialog")[0];
        if (dialog) {
            Coral.commons.ready(dialog, function() {
                initElectronicSignatureDialog(dialog);
            });
        }
    });

})(jQuery, jQuery(document), Coral);
