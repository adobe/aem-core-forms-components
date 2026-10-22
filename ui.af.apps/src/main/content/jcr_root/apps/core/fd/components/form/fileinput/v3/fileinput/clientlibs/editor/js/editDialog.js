/*******************************************************************************
 * Copyright 2025 Adobe
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
    let EDIT_DIALOG = ".cmp-adaptiveform-fileinput__editdialog",
        FILEINPUT_MIMETYPE = EDIT_DIALOG + " .cmp-adaptiveform-fileinput__mimeType",
        FILEINPUT_EXTENSIONS = EDIT_DIALOG + " .cmp-adaptiveform-fileinput__extensions",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    function handleMimeType(dialog) {
        let mimeTypeWrapper = dialog.find(FILEINPUT_MIMETYPE);
        let mimeTypeField = mimeTypeWrapper.find("coral-multifield");
        let extensionsField = dialog.find(FILEINPUT_EXTENSIONS + " coral-multifield");
        let mimeTypeFieldInfoIcon = mimeTypeWrapper.find('coral-icon.coral-Form-fieldinfo');
        
        function updateMimeTypeState() {
            let hasExtensions = extensionsField.find('coral-multifield-item').length > 0;
            let deleteIcons = mimeTypeField.find('coral-icon[icon="delete"]');
            
            mimeTypeField
                .prop('disabled', hasExtensions)
                .toggleClass('disabled', hasExtensions)
                .toggleClass('enabled', !hasExtensions);
            
            // Toggle delete icon classes
            deleteIcons
                .toggleClass('cmp-adaptiveform-fileinput__mimeTypeFieldDeleteIconsDisabled', hasExtensions)
                .toggleClass('cmp-adaptiveform-fileinput__mimeTypeFieldDeleteIcons', !hasExtensions);

            // Handle MIME type items if extensions exist
            if (hasExtensions) {
                // Keep first item, remove others
                let firstItem = mimeTypeField.find('coral-multifield-item').first();

                // If no first item exists, create one
                if (firstItem.length === 0) {
                    // Click the add button to create a new item
                    mimeTypeField.find('button[coral-multifield-add]').click();
                    firstItem = mimeTypeField.find('coral-multifield-item').first();
                }

                mimeTypeField.find('coral-multifield-item:not(:first)').remove();
                
                // Set value of first item to */*
                firstItem.find('input').val('*/*');
            }

            if(mimeTypeFieldInfoIcon.length > 0) {
                // show the info icon
                mimeTypeFieldInfoIcon.css({
                    'display': hasExtensions ? '' : 'none'
                });
            }
        }

        // Watch for changes in both fields
        extensionsField.on('change', updateMimeTypeState);
        mimeTypeField.on('change', updateMimeTypeState);

        // Check initial state without triggering events
        let hasExtensions = extensionsField.find('coral-multifield-item').length > 0;
        if (hasExtensions) {
            mimeTypeField
                .addClass('disabled')
                .prop('disabled', true);
            mimeTypeField.find('coral-icon[icon="delete"]')
                .addClass('cmp-adaptiveform-fileinput__mimeTypeFieldDeleteIconsDisabled');
        }
    }

    $(document).on('dialog-loaded', EDIT_DIALOG, function(e) {
        handleMimeType($(this));
    });

    Utils.initializeEditDialog(EDIT_DIALOG)(handleMimeType);

})(jQuery);
