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
(function($, Granite, channel, Coral) {
    "use strict";

    var EDIT_DIALOG_FORM    = ".cmp-adaptiveform-formcontainer__editdialog",
        ADOBE_SIGN_CHECKBOX = "coral-checkbox[name='./_useSignedPdf']",
        ADOBE_SIGN_FIELDS   = ".cmp-adobesign-fields",
        SIGNERS_MULTIFIELD  = "coral-multifield[name='./signerInfo/signers']",
        SIGNER_TITLE_INPUT  = "input[name='./signerTitle']",
        DEFAULT_SIGNER      = "Signer One",

        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    /**
     * Reads the current value from a Coral 3 coral-select. The component
     * exposes the selection through selectedItem; .value alone is not reliable
     * when the dialog loads or after programmatic updates (same pattern as other
     * core component edit dialogs, e.g. dropdown, checkbox).
     */
    function getCoralSelectValue(selectEl) {
        if (!selectEl) {
            return "";
        }
        if (selectEl.selectedItem && selectEl.selectedItem.value !== undefined &&
                selectEl.selectedItem.value !== null) {
            return String(selectEl.selectedItem.value);
        }
        return selectEl.value ? String(selectEl.value) : "";
    }

    function onCoralSelectChange($select, handler) {
        if (!$select.length) {
            return;
        }
        var el = $select[0];
        Coral.commons.ready(el, function() {
            handler();
        });
        $select.off("change.cmpSigner coral-select:change.cmpSigner");
        $select.on("change.cmpSigner coral-select:change.cmpSigner", handler);
    }

    // ---------------------------------------------------------------------------
    // Conditionals within a single expanded signer item
    // ---------------------------------------------------------------------------

    function applySignerConditionals($item) {
        if ($item.data("cmp-signer-conditionals-bound")) {
            var refresh = $item.data("cmp-signer-conditionals-refresh");
            if (typeof refresh === "function") {
                refresh();
            }
            return;
        }
        $item.data("cmp-signer-conditionals-bound", true);

        // --- Email source toggle ---
        var $emailTypeSelect  = $item.find("coral-select[name='./signerEmailType']");
        var $emailRef         = $item.find(".cmp-signer-email-ref");
        var $emailInput       = $item.find(".cmp-signer-email-input");

        function toggleEmail() {
            var val = getCoralSelectValue($emailTypeSelect[0]) || "fromForm";
            // fromForm → show ref selector; typed → show text input; userProfile → hide both
            $emailRef.toggle(val === "fromForm");
            $emailInput.toggle(val === "typed");
        }
        onCoralSelectChange($emailTypeSelect, toggleEmail);

        // --- Auth method toggle (phone block + typed-only inputs) ---
        var $authSelect       = $item.find("coral-select[name='./authenticationMethod']");
        var $phoneAuthBlock   = $item.find(".cmp-signer-phone-auth-fields");
        var $countryTyped     = $item.find(".cmp-signer-country-typed");
        var $phoneTyped       = $item.find(".cmp-signer-phone-typed");
        var $countrySource    = $item.find("coral-select[name='./countryCodeSource']");
        var $phoneSource      = $item.find("coral-select[name='./phoneSource']");

        function togglePhone() {
            var auth = getCoralSelectValue($authSelect[0]) || "NONE";
            var showPhone = auth === "PHONE";
            if ($phoneAuthBlock.length) {
                $phoneAuthBlock.toggle(showPhone);
            } else {
                // Legacy dialog markup (per-field wrapperClass only)
                $item.find(".cmp-signer-phone-field").toggle(showPhone);
            }
            if (showPhone) {
                applyCountryTyped();
                applyPhoneTyped();
            } else {
                $countryTyped.hide();
                $phoneTyped.hide();
            }
        }

        function applyCountryTyped() {
            var auth = getCoralSelectValue($authSelect[0]) || "NONE";
            if (auth !== "PHONE") {
                return;
            }
            var src = getCoralSelectValue($countrySource[0]) || "form";
            $countryTyped.toggle(src === "typed");
        }

        function applyPhoneTyped() {
            var auth = getCoralSelectValue($authSelect[0]) || "NONE";
            if (auth !== "PHONE") {
                return;
            }
            var src = getCoralSelectValue($phoneSource[0]) || "form";
            $phoneTyped.toggle(src === "typed");
        }

        function refreshSignerConditionals() {
            toggleEmail();
            togglePhone();
        }
        $item.data("cmp-signer-conditionals-refresh", refreshSignerConditionals);

        onCoralSelectChange($authSelect, togglePhone);
        onCoralSelectChange($countrySource, function() {
            applyCountryTyped();
        });
        onCoralSelectChange($phoneSource, function() {
            applyPhoneTyped();
        });

        refreshSignerConditionals();
    }

    // ---------------------------------------------------------------------------
    // Signer rows — compact "title + edit icon" collapsed view inside the
    // coral-multifield, matching the foundation form's signer table appearance.
    // ---------------------------------------------------------------------------

    function transformSignerItem($item, startExpanded) {
        Coral.commons.ready($item[0], function() {
            var $content = $item.find("coral-multifield-item-content");
            if (!$content.length) $content = $item;

            var $wrappers = $content.children();
            if ($wrappers.length < 2) {
                // Collapse UI expects title row + detail rows; composite items often render
                // as a single wrapper — still wire email/auth visibility.
                applySignerConditionals($item);
                return;
            }

            if ($item.data("cmp-signer-decorated")) return;
            $item.data("cmp-signer-decorated", true);

            var $titleWrapper   = $wrappers.first();
            var $detailWrappers = $wrappers.slice(1);

            var $toggle = $('<button type="button" is="coral-button" variant="quiet"' +
                ' class="cmp-signer-toggle-btn">' +
                '<coral-icon icon="edit" size="S"></coral-icon>' +
                '</button>');

            var expanded = !!startExpanded;

            function applyState() {
                $detailWrappers.toggle(expanded);
                $toggle.find("coral-icon").attr("icon", expanded ? "chevronUp" : "edit");
                if (expanded) {
                    applySignerConditionals($item);
                }
            }

            $toggle.on("click", function(e) {
                e.stopPropagation();
                expanded = !expanded;
                applyState();
            });

            $titleWrapper.addClass("cmp-signer-title-row");
            $titleWrapper.append($toggle);

            applyState();
        });
    }

    function initSignerRows(dialog) {
        var multifield = dialog.find(SIGNERS_MULTIFIELD)[0];
        if (!multifield) return;

        Coral.commons.ready(multifield, function() {
            var $multifield = $(multifield);

            if (multifield.items.length === 0) {
                var item = multifield.items.add({});
                Coral.commons.ready(item, function() {
                    var titleInput = item.querySelector(SIGNER_TITLE_INPUT);
                    if (titleInput) titleInput.value = DEFAULT_SIGNER;
                    transformSignerItem($(item), false);
                });
            } else {
                $multifield.find("coral-multifield-item").each(function() {
                    transformSignerItem($(this), false);
                });
            }

            // Items added via "Add Signer" start expanded so author can fill them in
            $multifield.on("coral-multifield:itemadded", function(e) {
                transformSignerItem($(e.detail.item), true);
            });
        });
    }

    // ---------------------------------------------------------------------------
    // Adobe Sign tab — show / hide all fields except the checkbox
    // ---------------------------------------------------------------------------

    function initAdobeSign(dialog) {
        var $checkbox = dialog.find(ADOBE_SIGN_CHECKBOX);
        var $fields   = dialog.find(ADOBE_SIGN_FIELDS);

        function toggleFields() {
            $fields.toggle($checkbox.length > 0 && $checkbox[0].checked);
        }

        toggleFields();
        $checkbox.on("change", toggleFields);

        initSignerRows(dialog);
    }

    Utils.initializeEditDialog(EDIT_DIALOG_FORM)(initAdobeSign);

})(jQuery, Granite, jQuery(document), Coral);
