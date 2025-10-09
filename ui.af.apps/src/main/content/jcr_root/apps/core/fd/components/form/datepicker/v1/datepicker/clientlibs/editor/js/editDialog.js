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
(function($) {
    "use strict";

    var EDIT_DIALOG = ".cmp-adaptiveform-datepicker__editdialog",
        DATEPICKER_DISPLAYPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__displaypattern",
        DATEPICKER_DISPLAYFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__displayformat",
        DATEPICKER_EDITPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__editpattern",
        DATEPICKER_EDITFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__editformat",
        DATEPICKER_LANG = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__lang",
        DATEPICKER_LANGDISPLAYVALUE = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__langdisplayvalue",
        DATEPICKER_DEFAULTDATE = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__defaultdate",
        DATEPICKER_MINDATE = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__mindate",
        DATEPICKER_MAXDATE = EDIT_DIALOG + " .cmp-adaptiveform-datepicker__maxdate",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    function handleDisplayPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,DATEPICKER_DISPLAYPATTERN,DATEPICKER_DISPLAYFORMAT);
    }

    function handleDisplayFormat(dialog){
        Utils.handlePatternFormat(dialog,DATEPICKER_DISPLAYPATTERN,DATEPICKER_DISPLAYFORMAT);
    }

    function handleEditPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,DATEPICKER_EDITPATTERN,DATEPICKER_EDITFORMAT);
    }

    function handleEditFormat(dialog){
        Utils.handlePatternFormat(dialog,DATEPICKER_EDITPATTERN,DATEPICKER_EDITFORMAT);
    }

    function handleLang(dialog){
        Utils.handlePatternDropDown(dialog,DATEPICKER_LANGDISPLAYVALUE,DATEPICKER_LANG);
        Utils.handlePatternFormat(dialog,DATEPICKER_LANGDISPLAYVALUE,DATEPICKER_LANG);
    }

    function handleDatePlaceholders(dialog){
        var defaultDateInput = dialog.find(DATEPICKER_DEFAULTDATE + " input")[0],
            minDateInput = dialog.find(DATEPICKER_MINDATE + " coral-datepicker")[0],
            maxDateInput = dialog.find(DATEPICKER_MAXDATE + " coral-datepicker")[0],
            defaultDateTooltip = dialog.find(DATEPICKER_DEFAULTDATE + " coral-tooltip")[0],
            minDateTooltip = dialog.find(DATEPICKER_MINDATE + " coral-tooltip")[0],
            maxDateTooltip = dialog.find(DATEPICKER_MAXDATE + " coral-tooltip")[0],
            emptyText = Granite.I18n.get('YYYY-MM-DD', null, 'placeholder text to retain format across locale'),
            fieldDescription = Granite.I18n.get('Please enter the date in the required format "yyyy-mm-dd".', null, 'placeholder text to retain format across locale');

        defaultDateInput.placeholder = emptyText;
        defaultDateInput.setAttribute('aria-label', emptyText);
        minDateInput.placeholder = emptyText;
        maxDateInput.placeholder = emptyText;
        defaultDateTooltip.innerHTML = fieldDescription;
        minDateTooltip.innerHTML = fieldDescription;
        maxDateTooltip.innerHTML = fieldDescription;
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleDisplayPatternDropDown,handleDisplayFormat,handleEditPatternDropDown,handleEditFormat,handleLang,handleDatePlaceholders);
})(jQuery);
