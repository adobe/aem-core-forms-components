/*******************************************************************************
 * Copyright 2023 Adobe
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

    var EDIT_DIALOG = ".cmp-adaptiveform-scribblesignature__editdialog",
        SCRIBBLESIGNATURE_READONLY = EDIT_DIALOG + " .cmp-adaptiveform-scribblesignature__readonly",
        SCRIBBLESIGNATURE_REQUIRED = EDIT_DIALOG + " .cmp-adaptiveform-scribblesignature__required",
        SCRIBBLESIGNATURE_VISIBLE = EDIT_DIALOG + " .cmp-adaptiveform-scribblesignature__visible",
        SCRIBBLESIGNATURE_ENABLED = EDIT_DIALOG + " .cmp-adaptiveform-scribblesignature__enabled",
        SCRIBBLESIGNATURE_LABEL = EDIT_DIALOG + " .cmp-adaptiveform-scribblesignature__label",
        SCRIBBLESIGNATURE_DESCRIPTION = EDIT_DIALOG + " .cmp-adaptiveform-scribblesignature__description",
        SCRIBBLESIGNATURE_NAME = EDIT_DIALOG + " .cmp-adaptiveform-scribblesignature__name";

    function toggleReadOnly(dialog) {
        var readOnlyCheckbox = dialog.querySelector(SCRIBBLESIGNATURE_READONLY);
        readOnlyCheckbox.on("change", function() {
            // Additional logic for handling read-only state changes can be added here
        });
    }

    function toggleRequired(dialog) {
        var requiredCheckbox = dialog.querySelector(SCRIBBLESIGNATURE_REQUIRED);
        requiredCheckbox.on("change", function() {
            // Additional logic for handling required state changes can be added here
        });
    }

    function toggleVisibility(dialog) {
        var visibleCheckbox = dialog.querySelector(SCRIBBLESIGNATURE_VISIBLE);
        visibleCheckbox.on("change", function() {
            // Additional logic for handling visibility changes can be added here
        });
    }

    function toggleEnabled(dialog) {
        var enabledCheckbox = dialog.querySelector(SCRIBBLESIGNATURE_ENABLED);
        enabledCheckbox.on("change", function() {
            // Additional logic for handling enabled state changes can be added here
        });
    }

    function updateLabel(dialog) {
        var labelField = dialog.querySelector(SCRIBBLESIGNATURE_LABEL);
        labelField.on("input", function() {
            // Additional logic for handling label updates can be added here
        });
    }

    function updateDescription(dialog) {
        var descriptionField = dialog.querySelector(SCRIBBLESIGNATURE_DESCRIPTION);
        descriptionField.on("input", function() {
            // Additional logic for handling description updates can be added here
        });
    }

    function updateName(dialog) {
        var nameField = dialog.querySelector(SCRIBBLESIGNATURE_NAME);
        nameField.on("input", function() {
            // Additional logic for handling name updates can be added here
        });
    }

    $(document).on("dialog-ready", function() {
        var dialog = document.querySelector(EDIT_DIALOG);
        if (dialog) {
            toggleReadOnly(dialog);
            toggleRequired(dialog);
            toggleVisibility(dialog);
            toggleEnabled(dialog);
            updateLabel(dialog);
            updateDescription(dialog);
            updateName(dialog);
        }
    });

})(jQuery);
