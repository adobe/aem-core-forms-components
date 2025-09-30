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
(function($, Granite) {
    "use strict";

    var EDIT_DIALOG = ".cmp-adaptiveform-container__editdialog",
        DOR_SELECTOR = EDIT_DIALOG + " .cmp-adaptiveform-container__dortypeselector",
        DOR_TEMPLATE_REF_FIELD = EDIT_DIALOG + " .cmp-adaptiveform-container__dortemplateref",
        DOR_DOWNLOAD_BUTTON = EDIT_DIALOG + " .cmp-adaptiveform-container__downloaddor",
        DOR_TYPE_FIELD = "[name='./dorType']",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    // Constants for DOR selection types
    var DOR_NONE = "none";
    var DOR_SELECT = "select";
    var DOR_GENERATE = "generate";

    function handleDorTypeSelection(dialog) {
        var dorTypeSelector = dialog.find(DOR_SELECTOR)[0];
        var dorTemplateRefField = dialog.find(DOR_TEMPLATE_REF_FIELD);
        var dorDownloadButton = dialog.find(DOR_DOWNLOAD_BUTTON);
        
        if (!dorTypeSelector) {
            return;
        }

        // Initialize DOR type from stored value
        var dorTypeField = dialog.find(DOR_TYPE_FIELD)[0];
        if (dorTypeField && dorTypeField.value) {
            var radioButton = dorTypeSelector.querySelector('input[value="' + dorTypeField.value + '"]');
            if (radioButton) {
                radioButton.checked = true;
            }
        }

        // Handle DOR type selection change
        dorTypeSelector.addEventListener("change", function(event) {
            var selectedValue = event.target.value;
            var dorTypeField = dialog.find(DOR_TYPE_FIELD)[0];
            if (dorTypeField) {
                dorTypeField.value = selectedValue;
            }

            // Show/hide DOR template ref based on selection
            if (selectedValue === DOR_SELECT) {
                dorTemplateRefField.show();
            } else {
                dorTemplateRefField.hide();
            }

            // Show/hide download button based on selection
            if (selectedValue === DOR_NONE) {
                dorDownloadButton.hide();
            } else {
                dorDownloadButton.show();
            }
        });

            // Initialize visibility based on current selection
            var selectedRadio = dorTypeSelector.querySelector('input:checked');
            if (selectedRadio) {
                var selectedValue = selectedRadio.value;
                if (selectedValue === DOR_SELECT) {
                    dorTemplateRefField.show();
                } else {
                    dorTemplateRefField.hide();
                }

            // Initialize download button visibility
            if (selectedValue === DOR_NONE) {
                Utils.hideComponent(dorDownloadButton, 'div');
            } else {
                Utils.showComponent(dorDownloadButton, 'div');
            }
        }
    }

    function handleDownloadDor(dialog) {
        var downloadButton = dialog.find(DOR_DOWNLOAD_BUTTON)[0];
        if (downloadButton) {
            downloadButton.addEventListener("click", function(event) {
                event.preventDefault();
                var formPath = dialog.find("form").attr("action").replace("_jcr_content", "jcr:content");
                // AJAX implementation
                var downloadUrl = Granite.HTTP.externalize('/libs/fd/fm/content/basemanage.json?func=downloadDOR&formPath=' + encodeURIComponent(formPath));
                var onDownloadDoRSuccess = function(result) {
                    if (result && result.doRPath) {
                        // Download the blob directly
                        var url = result.doRPath;
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = 'dorTemplate.xdp';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    } else {
                        // Show error modal
                        var errorModal = new Coral.Alert();
                        errorModal.variant = "error";
                        errorModal.innerHTML = Granite.I18n.get("Error in downloading the Document of Record Template");
                        document.body.appendChild(errorModal);
                        errorModal.show();
                    }
                };
                var onDownloadDorFailure = function(error) {
                    // Show error message
                    var errorAlert = new Coral.Alert();
                    errorAlert.variant = "error";
                    errorAlert.innerHTML = Granite.I18n.get("Download Document of Record") + ": " + (error.message || error);
                    document.body.appendChild(errorAlert);
                    errorAlert.show();
                };
                $.ajax({
                    type: 'POST',
                    url: downloadUrl,
                    data: {_charset_: "UTF-8"},
                    success: onDownloadDoRSuccess,
                    error: onDownloadDorFailure
                });
            });
        }
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleDorTypeSelection, handleDownloadDor);

})(jQuery, Granite);