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
        signerMultifieldClass: ".cmp-adaptiveform-container__signer-multifield",
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
    var firstSignerMultifieldItem = null;

    function getSignerMultifield(dialog) {
        return $(dialog).find(SELECTORS.signerMultifield)[0];
    }

    function ensureDefaultSigner(dialog) {
        var mf = getSignerMultifield(dialog);
        if (!mf) {
            return;
        }
        // NOTE: Do NOT call addBtn.click() here. Clicking the multifield add button
        // fires foundation-contentloaded on the parent dialog, which re-triggers
        // DataModel.initialiseDataModel and writes formmodel to #formmodelparameters
        // a second time, resulting in formmodel=['none','none'] on the DAM asset.
        // The min=1 validation on the multifield ensures the user adds at least one
        // signer when Adobe Sign is enabled.
        Coral.commons.ready(mf, function() {
            captureFirstSignerMultifieldItem(dialog);
            updateMultifieldItemChrome(dialog);
            updateFirstSignerState(dialog);
        });
    }

    function captureFirstSignerMultifieldItem(dialog) {
        var mf = getSignerMultifield(dialog);
        if (!mf || mf.items.length === 0) {
            return;
        }
        if (!firstSignerMultifieldItem) {
            firstSignerMultifieldItem = mf.items.getAll()[0];
        }
    }

    function setMultifieldControlVisible(item, selector, visible) {
        var control = item.querySelector(selector);
        if (control) {
            control.hidden = !visible;
            control.style.display = visible ? "" : "none";
        }
    }

    /**
     * First signer: hide delete and drag controls. Additional signers: show both.
     */
    function updateMultifieldItemChrome(dialog) {
        var mf = getSignerMultifield(dialog);
        if (!mf) {
            return;
        }
        captureFirstSignerMultifieldItem(dialog);
        mf.items.getAll().forEach(function(item, index) {
            var isFirst = index === 0;
            setMultifieldControlVisible(item, "button[coral-multifield-remove]", !isFirst);
            setMultifieldControlVisible(item, "button[coral-multifield-move]", !isFirst);
            setMultifieldControlVisible(item, "coral-handle", !isFirst);
        });
        enforceFirstSignerPosition(dialog);
    }

    function enforceFirstSignerPosition(dialog) {
        var mf = getSignerMultifield(dialog);
        if (!mf || !firstSignerMultifieldItem || mf.items.length < 2) {
            return;
        }
        var items = mf.items.getAll();
        if (items[0] !== firstSignerMultifieldItem) {
            mf.items.remove(firstSignerMultifieldItem);
            mf.items.add(firstSignerMultifieldItem, 0);
        }
    }

    function setFirstSignerRadiogroupValue(rg, value) {
        if (!rg) {
            return;
        }
        rg.value = value;
        if (rg.items && rg.items.getAll) {
            rg.items.getAll().forEach(function(item) {
                item.checked = item.value === value;
            });
        }
    }

    /**
     * First signer: "Is form filler first signer?" is editable.
     * Other signers: visible, locked to "No", disabled.
     */
    function updateFirstSignerState(dialog) {
        $(dialog).find(SELECTORS.signerMultifield)
            .find("coral-multifield-item")
            .each(function(index) {
                var $item = $(this).find(SELECTORS.signerItem);
                var rg = $item.find(SELECTORS.firstSignerRadiogroup)[0];
                if (!rg) {
                    return;
                }
                if (index === 0) {
                    rg.disabled = false;
                    rg.readOnly = false;
                } else {
                    setFirstSignerRadiogroupValue(rg, "false");
                    rg.disabled = true;
                    rg.readOnly = true;
                }
            });
    }

    var DEFAULT_EMAIL_SOURCE = "form";
    var DEFAULT_SECURITY_OPTION = "NONE";
    var DEFAULT_FIELD_SOURCE = "form";

    function normalizeEmailSource(val) {
        return val || DEFAULT_EMAIL_SOURCE;
    }

    function normalizeSecurityOption(val) {
        return val || DEFAULT_SECURITY_OPTION;
    }

    function hidePhoneFields($item) {
        setVisible($item.find(SELECTORS.phoneContainer), false);
    }

    function applyEmailSourceRules($item) {
        var val = normalizeEmailSource(getSelectValue($item.find(SELECTORS.emailSource)));
        setVisible($item.find(SELECTORS.emailAutocomplete), val === "form");
        setVisible($item.find(SELECTORS.email), val === "typed");
    }

    function applySecurityOptionRules($item) {
        var val = normalizeSecurityOption(getSelectValue($item.find(SELECTORS.securityOption)));
        if (val !== "PHONE") {
            hidePhoneFields($item);
            return;
        }
        setVisible($item.find(SELECTORS.phoneContainer), true);
        applyCountryCodeSourceRules($item);
        applyPhoneSourceRules($item);
    }

    function applyCountryCodeSourceRules($item) {
        var val = getSelectValue($item.find(SELECTORS.countryCodeSource)) || DEFAULT_FIELD_SOURCE;
        setVisible($item.find(SELECTORS.countryCodeSource), true);
        setVisible($item.find(SELECTORS.countryCodeAutocomplete), val === "form");
        setVisible($item.find(SELECTORS.countryCode), val === "typed");
    }

    function applyPhoneSourceRules($item) {
        var val = getSelectValue($item.find(SELECTORS.phoneSource)) || DEFAULT_FIELD_SOURCE;
        setVisible($item.find(SELECTORS.phoneSource), true);
        setVisible($item.find(SELECTORS.phoneAutocomplete), val === "form");
        setVisible($item.find(SELECTORS.phone), val === "typed");
    }

    function applySignerItemRules($item) {
        applyEmailSourceRules($item);
        applySecurityOptionRules($item);
    }

    function initSignerItem(signerItemEl) {
        var $item = $(signerItemEl);
        if (!$item.length) {
            return;
        }
        Coral.commons.ready($item[0], function() {
            applySignerItemRules($item);
        });
    }

    function initAllSignerItems(dialog) {
        $(dialog).find(SELECTORS.signerItem).each(function() {
            initSignerItem(this);
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
        var mf = getSignerMultifield(dialog);

        $dialog.on("coral-collection:add", SELECTORS.signerMultifield, function(e) {
            var newItem = e.detail.item;
            Coral.commons.ready(newItem, function() {
                var $newItem = $(newItem).find(SELECTORS.signerItem);
                if ($newItem.length) {
                    initSignerItem($newItem[0]);
                }
                updateMultifieldItemChrome(dialog);
                updateFirstSignerState(dialog);
            });
        });

        $dialog.on("coral-collection:remove", SELECTORS.signerMultifield, function() {
            captureFirstSignerMultifieldItem(dialog);
            updateMultifieldItemChrome(dialog);
            updateFirstSignerState(dialog);
        });

        if (mf && !mf.dataset.esignReorderGuard) {
            mf.dataset.esignReorderGuard = "true";
            mf.addEventListener("coral-collection:reorder", function() {
                enforceFirstSignerPosition(dialog);
                updateMultifieldItemChrome(dialog);
                updateFirstSignerState(dialog);
            });
        }
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

        firstSignerMultifieldItem = null;

        // Register listeners before toggleSigningConfig so the coral-collection:add
        // handler is in place before ensureDefaultSigner potentially fires synchronously.
        $dialog.on("change", SELECTORS.enableCheckbox, function() {
            toggleSigningConfig(dialog);
        });
        wireSignerItemListeners(dialog);
        wireMultifieldListeners(dialog);
        wireSubmitValidation(dialog);

        initAllSignerItems(dialog);
        captureFirstSignerMultifieldItem(dialog);
        updateMultifieldItemChrome(dialog);
        updateFirstSignerState(dialog);
        toggleSigningConfig(dialog);

        var tabView = dialog.querySelector("coral-tabview");
        if (tabView) {
            tabView.addEventListener("coral-tabview:change", function() {
                initAllSignerItems(dialog);
                updateMultifieldItemChrome(dialog);
                updateFirstSignerState(dialog);
            });
        }
    }

    function onDialogContentLoaded(e) {
        var $target = $(e.target);
        var dialog = $target.closest(".cq-dialog")[0] || $(".cq-dialog:visible")[0];
        if (!dialog || !$(dialog).find(SELECTORS.esignTab).length) {
            return;
        }
        initAllSignerItems(dialog);
        captureFirstSignerMultifieldItem(dialog);
        updateMultifieldItemChrome(dialog);
        updateFirstSignerState(dialog);
        ensureDefaultSigner(dialog);
    }

    channel.on("foundation-contentloaded", onDialogContentLoaded);

    channel.on("dialog-ready", function() {
        var dialog = $(".cq-dialog")[0];
        if (dialog) {
            Coral.commons.ready(dialog, function() {
                initElectronicSignatureDialog(dialog);
            });
        }
    });

})(jQuery, jQuery(document), Coral);