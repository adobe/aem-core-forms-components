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
(function($) {
    "use strict";

    var EDIT_DIALOG = ".cmp-adaptiveform-dateinput__editdialog",
        DATE_INPUT_DEFAULTDATE = EDIT_DIALOG + " .cmp-adaptiveform-dateinput__defaultdate",
        DATE_INPUT_MINDATE = EDIT_DIALOG + " .cmp-adaptiveform-dateinput__mindate",
        DATE_INPUT_MAXDATE = EDIT_DIALOG + " .cmp-adaptiveform-dateinput__maxdate",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    function handleDatePlaceholders(dialog){
        var defaultDateInput = dialog.find(DATE_INPUT_DEFAULTDATE + " input")[0],
            minDateInput = dialog.find(DATE_INPUT_MINDATE + " coral-datepicker")[0],
            maxDateInput = dialog.find(DATE_INPUT_MAXDATE + " coral-datepicker")[0],
            defaultDateTooltip = dialog.find(DATE_INPUT_DEFAULTDATE + " coral-tooltip")[0],
            minDateTooltip = dialog.find(DATE_INPUT_MINDATE + " coral-tooltip")[0],
            maxDateTooltip = dialog.find(DATE_INPUT_MAXDATE + " coral-tooltip")[0],
            // The ISO format hint is locale-neutral and must never be translated, so it is a
            // plain constant rather than a Granite.I18n.get() lookup.
            emptyText = 'YYYY-MM-DD',
            fieldDescription = Granite.I18n.get('Please enter the date in the required format "yyyy-mm-dd".');

        defaultDateInput.placeholder = emptyText;
        defaultDateInput.setAttribute('aria-label', emptyText);
        minDateInput.placeholder = emptyText;
        maxDateInput.placeholder = emptyText;
        // Use textContent (not innerHTML) so the description is never interpreted as markup.
        defaultDateTooltip.textContent = fieldDescription;
        minDateTooltip.textContent = fieldDescription;
        maxDateTooltip.textContent = fieldDescription;
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleDatePlaceholders);

})(jQuery);
