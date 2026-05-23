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
(function($, channel, Coral) {
    "use strict";

    var SELECTORS = {
        esignTab: ".cmp-adaptiveform-container__esign-tab",
        enableCheckbox: ".cmp-adaptiveform-container__esign-enable",
        signingConfig: ".cmp-adaptiveform-container__esign-config",
        signerItem: ".cmp-adaptiveform-container__signer-item",
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

    /**
     * Returns the native checked state of a Coral.Checkbox or checkbox input.
     */
    function isChecked(el) {
        var checkbox = el instanceof $ ? el[0] : el;
        if (checkbox && checkbox.tagName && checkbox.tagName.toLowerCase() === "coral-checkbox") {
            return checkbox.checked;
        }
        return $(checkbox).is(":checked");
    }

    /**
     * Show or hide an element (wrapper approach compatible with Coral UI).
     */
    function setVisible($el, visible) {
        $el.closest(".coral-Form-fieldwrapper, .coral-Form-field, [data-granite-ui-component-id]")
            .addBack()
            .toggle(visible);
    }

    /**
     * Toggles the main signing config section based on the enable checkbox.
     */
    function toggleSigningConfig(dialog) {
        var $dialog = $(dialog);
        var $enable = $dialog.find(SELECTORS.enableCheckbox);
        var enabled = isChecked($enable);
        $dialog.find(SELECTORS.signingConfig).toggle(enabled);
    }

    /**
     * Applies email source visibility rules within a signer item.
     */
    function applyEmailSourceRules($item) {
        var $source = $item.find(SELECTORS.emailSource);
        var val = $source.length ? $source[0].value : "";
        setVisible($item.find(SELECTORS.emailAutocomplete), val === "form");
        setVisible($item.find(SELECTORS.email), val === "typed");
    }

    /**
     * Applies security option visibility rules within a signer item.
     */
    function applySecurityOptionRules($item) {
        var $option = $item.find(SELECTORS.securityOption);
        var val = $option.length ? $option[0].value : "";
        var isPhone = val === "PHONE";
        setVisible($item.find(SELECTORS.phoneContainer), isPhone);
        if (isPhone) {
            applyCountryCodeSourceRules($item);
            applyPhoneSourceRules($item);
        }
    }

    /**
     * Applies country code source visibility rules within a signer item.
     */
    function applyCountryCodeSourceRules($item) {
        var $source = $item.find(SELECTORS.countryCodeSource);
        var val = $source.length ? $source[0].value : "";
        setVisible($item.find(SELECTORS.countryCodeAutocomplete), val === "form");
        setVisible($item.find(SELECTORS.countryCode), val === "typed");
    }

    /**
     * Applies phone source visibility rules within a signer item.
     */
    function applyPhoneSourceRules($item) {
        var $source = $item.find(SELECTORS.phoneSource);
        var val = $source.length ? $source[0].value : "";
        setVisible($item.find(SELECTORS.phoneAutocomplete), val === "form");
        setVisible($item.find(SELECTORS.phone), val === "typed");
    }

    /**
     * Initialises conditional visibility for all signer items currently in the DOM.
     */
    function initAllSignerItems(dialog) {
        $(dialog).find(SELECTORS.signerItem).each(function() {
            applyEmailSourceRules($(this));
            applySecurityOptionRules($(this));
        });
    }

    /**
     * Wires change listeners for a single signer item using event delegation
     * on its nearest stable ancestor (the multifield).
     */
    function wireSignerItemListeners(dialog) {
        var $dialog = $(dialog);

        // Email source change
        $dialog.on("change", SELECTORS.emailSource, function(e) {
            var $item = $(e.target).closest(SELECTORS.signerItem);
            applyEmailSourceRules($item);
        });

        // Security option change
        $dialog.on("change", SELECTORS.securityOption, function(e) {
            var $item = $(e.target).closest(SELECTORS.signerItem);
            applySecurityOptionRules($item);
        });

        // Country code source change
        $dialog.on("change", SELECTORS.countryCodeSource, function(e) {
            var $item = $(e.target).closest(SELECTORS.signerItem);
            applyCountryCodeSourceRules($item);
        });

        // Phone source change
        $dialog.on("change", SELECTORS.phoneSource, function(e) {
            var $item = $(e.target).closest(SELECTORS.signerItem);
            applyPhoneSourceRules($item);
        });
    }

    /**
     * Re-initialise conditional visibility when a new signer item is added via
     * the multifield "Add" button.
     */
    function wireMultifieldAddListener(dialog) {
        var $dialog = $(dialog);
        $dialog.on("coral-collection:add", "coral-multifield", function(e) {
            var $newItem = $(e.detail.item).find(SELECTORS.signerItem);
            if ($newItem.length) {
                applyEmailSourceRules($newItem);
                applySecurityOptionRules($newItem);
            }
        });
    }

    /**
     * Entry point — called once the dialog is ready.
     */
    function initElectronicSignatureDialog(dialog) {
        var $dialog = $(dialog);
        if (!$dialog.find(SELECTORS.esignTab).length) {
            return;
        }

        // Initial state
        toggleSigningConfig(dialog);
        initAllSignerItems(dialog);

        // Enable / disable signing config section
        $dialog.on("change", SELECTORS.enableCheckbox, function() {
            toggleSigningConfig(dialog);
        });

        // Per-signer conditional fields
        wireSignerItemListeners(dialog);
        wireMultifieldAddListener(dialog);
    }

    // Hook into the dialog ready event
    channel.on("dialog-ready", function() {
        var dialog = $(".cq-dialog")[0];
        if (dialog) {
            Coral.commons.ready(dialog, function() {
                initElectronicSignatureDialog(dialog);
            });
        }
    });

})(jQuery, jQuery(document), Coral);
