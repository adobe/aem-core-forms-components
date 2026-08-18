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
(function($, ns, channel) {
    "use strict";

    let EDIT_DIALOG = ".cmp-adaptiveform-adobesignblock__editdialog",
        ADOBESIGNBLOCK_FIELD_SETTINGS = ".cmp-adaptiveform-adobesignblock__fieldsettings",
        ADOBESIGNBLOCK_FIELD_TAG = "[name='./adobeSignFieldTag']",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    /**
     * plugin.js#setup() calls "new CUI.Autocomplete(...)" for the Date Format field - a classic
     * (pre-Coral3) widget class that this modern Core Components authoring context may not load.
     * If it's missing, that call throws and setup() aborts before it ever reaches the lines that
     * wire up type-change handling, which is why every field stays visible regardless of Type.
     * Stub it out defensively rather than touching plugin.js itself (integration-adobesign code).
     */
    function ensureCuiAutocompleteStub() {
        window.CUI = window.CUI || {};
        if (typeof window.CUI.Autocomplete !== "function") {
            window.CUI.Autocomplete = function() {};
        }
    }

    /**
     * Returns just the first {{...}} merge-tag occurrence in value. extractModel()'s own regex
     * (FIELD_REGEX) only expects to see one tag - Radio stores one tag per option (see
     * extractRadioOptions() below), so feeding it the full multi-tag value makes it match
     * garbage across all of them instead.
     */
    function extractFirstTag(value) {
        let match = value.match(/\{\{[^}]*\}\}/);
        return match ? match[0] : value;
    }

    /**
     * Radio is the one type where getDomContent() (utils.js) writes a separate {{...}} tag per
     * option, rather than one tag with an embedded options list the way Dropdown does
     * (dropdown(options="A,B,C") in a single tag). extractModel()'s own Radio case reads
     * adobesignOptions.options directly - supplying that was always meant to be the CALLER's
     * job (in the original RTE flow, populateAdobeSignOptions()/getReplaceRadioOptions() build
     * it by scanning the surrounding rich text for every sibling radio(...) span). We don't have
     * scattered sibling spans in a larger document - our stored value already holds exactly
     * this one field's own tags - so build the same array by scanning it directly.
     */
    function extractRadioOptions(value) {
        let options = [],
            re = /radio\(([^)]*)\)/g,
            match;
        while ((match = re.exec(value)) !== null) {
            options.push(match[1]);
        }
        return options;
    }

    /**
     * Safely (re)populates the Options multifield and syncs its Default Value dropdown.
     * populateFields()'s own multifield handling calls $(item).find(...).value = ... on a row
     * immediately after items.add() - before Coral has necessarily finished upgrading that
     * freshly-cloned row - which throws "Cannot set properties of undefined". We call this only
     * after populateFields() has already safely handled every other field (with as_options left
     * empty so populateFields()'s own multifield branch has nothing to add and can't hit that
     * same crash), then give each newly-added row one tick to settle before reading it back.
     */
    function populateOptionsMultifield(adobesigndialog, csvValue) {
        let multifield = adobesigndialog.optionsMultifield;
        if (!multifield) {
            return;
        }
        multifield.items.clear();
        let values = csvValue ? csvValue.split(",") : [];
        values.forEach(function() {
            multifield.items.add();
        });
        if (values.length === 0) {
            return;
        }
        window.setTimeout(function() {
            try {
                let name = $(multifield).data("name"),
                    rows = multifield.items.getAll();
                rows.forEach(function(row, index) {
                    let itemField = $(row).find('[name="' + name + '"]')[0];
                    if (itemField) {
                        itemField.value = values[index] || "";
                    }
                });
                adobesigndialog.handleOptionsChanged($.Event("change"));
            } catch (e) {
                window.console.error("adobesignblock: failed to populate Adobe Sign field Options", e);
            }
        }, 1);
    }

    /**
     * Bootstraps integration-adobesign's own RTE-dialog plugin (constants/types/utils/plugin.js,
     * loaded via the aem.adobesign.rtedialogplugin clientlib dependency) against the field set we
     * pulled in via <include> from /libs/adobesign/components/rte/dialogcontainer, instead of
     * re-implementing its per-type show/hide, Options-multifield sync, and tag-string generation.
     *
     * @param {HTMLElement} dialog the dialog on which the operation is to be performed.
     * @returns {Object|null} the adobesigndialog plugin instance, or null if the included markup,
     *          the aem.adobesign.rtedialogplugin clientlib, or setup() itself is unavailable/fails.
     */
    function bootstrapAdobeSignFieldSettings(dialog) {
        let fieldSettings = dialog.find(ADOBESIGNBLOCK_FIELD_SETTINGS).first();
        if (fieldSettings.length === 0 || typeof fieldSettings.adobesigndialog !== "function") {
            return null;
        }
        ensureCuiAutocompleteStub();
        let adobesigndialog = fieldSettings.adobesigndialog();
        try {
            adobesigndialog.setup();
        } catch (e) {
            window.console.error("adobesignblock: failed to set up Adobe Sign field settings", e);
            return null;
        }
        let optionsCsv = "";
        try {
            let fieldTag = dialog.find(ADOBESIGNBLOCK_FIELD_TAG)[0];
            if (fieldTag && fieldTag.value) {
                let rawValue = fieldTag.value,
                    model = window.adobesign.utils.extractModel({
                        fieldText : extractFirstTag(rawValue),
                        options : extractRadioOptions(rawValue)
                    });
                // Leave Options out of what populateFields() itself touches (see
                // populateOptionsMultifield() above for why), and populate it ourselves after.
                optionsCsv = model.as_options;
                model.as_options = "";
                adobesigndialog.populateFields(model);
            } else {
                adobesigndialog.clear();
            }
        } catch (e) {
            window.console.error("adobesignblock: failed to populate Adobe Sign field settings", e);
        }
        // Mirrors CUI.rte.ui.cui.AdobeSignDialog.js's own onShow handler, which also defers the
        // typeChangeHandler() call by a tick after populating fields, rather than calling it
        // inline - matching that same sequencing here instead of assuming the plugin needs no
        // settling time at all.
        window.setTimeout(function() {
            try {
                adobesigndialog.typeChangeHandler();
            } catch (e) {
                window.console.error("adobesignblock: failed to apply Adobe Sign field type visibility", e);
            }
        }, 1);
        populateOptionsMultifield(adobesigndialog, optionsCsv);
        return adobesigndialog;
    }

    /**
     * Computes the Adobe Sign merge-tag markup from the current field-settings state and stores it
     * into the hidden ./adobeSignFieldTag field, right before the dialog's own submit proceeds -
     * mirroring the existing handleDialogSubmit pattern in base/v1/base's editDialog.js.
     */
    function handleDialogSubmit(dialog, adobesigndialog) {
        let submitButton = dialog.find(".cq-dialog-submit")[0];
        if (!submitButton) {
            return;
        }
        submitButton.addEventListener("click", function() {
            let fieldTag = dialog.find(ADOBESIGNBLOCK_FIELD_TAG)[0];
            if (fieldTag && adobesigndialog) {
                fieldTag.value = adobesigndialog.getDomContentFromDialog();
            }
        });
    }

    function initialise(dialog) {
        dialog = $(dialog);
        let adobesigndialog = bootstrapAdobeSignFieldSettings(dialog);
        handleDialogSubmit(dialog, adobesigndialog);
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(initialise);

})(jQuery, Granite.author, jQuery(document));
