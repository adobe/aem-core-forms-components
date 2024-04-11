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

    var EDIT_DIALOG = ".cmp-adaptiveform-numberinput__editdialog",
        NUMERICINPUT_TYPE = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__type",
        NUMERICINPUT_MAXIMUM = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__maximum",
        NUMERICINPUT_EXCLUDEMAXCHECK = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__excludeMaximumCheck",
        NUMERICINPUT_MINIMUM = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__minimum",
        NUMERICINPUT_EXCLUDEMINCHECK = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__excludeMinimumCheck",
        NUMERICINPUT_DISPLAYPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__displaypattern",
        NUMERICINPUT_DISPLAYFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__displayformat",
        NUMERICINPUT_LANG = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__lang",
        NUMERICINPUT_LANGDISPLAYVALUE = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__langdisplayvalue",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    /**
    function handleTypeDropdown(dialog) {
        var typeDropdownComponent = dialog.find(NUMERICINPUT_TYPE)[0];
        _manageLeadDigitsAndFracDigits();
        typeDropdownComponent.addEventListener("change", _manageLeadDigitsAndFracDigits );

        function _manageLeadDigitsAndFracDigits(){
            var typeDropdownComponent = dialog.find(NUMERICINPUT_TYPE)[0];
            let selectedValue=typeDropdownComponent.value;
            let fracDigitsParentDivElem = (fracDigitsElement).closest("div")[0];

            if(selectedValue === 'number'){
                var leadDigitsLabel = CQ.I18n.getMessage("Number of digits before the decimal separator (1234.000)");
                leadDigitsElement.siblings("label").text(leadDigitsLabel);
                fracDigitsParentDivElem.removeAttribute("hidden");
            }else{
                var totalDigitsLabel = CQ.I18n.getMessage("Maximum Number of Digits");
                leadDigitsElement.siblings("label").text(totalDigitsLabel);
                fracDigitsParentDivElem.setAttribute("hidden", true);
            }
        }
    }
     **/

    function handleDisplayPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,NUMERICINPUT_DISPLAYPATTERN,NUMERICINPUT_DISPLAYFORMAT);
    }

    function handleDisplayFormat(dialog){
        Utils.handlePatternFormat(dialog,NUMERICINPUT_DISPLAYPATTERN,NUMERICINPUT_DISPLAYFORMAT);
    }

    function handleLang(dialog){
        Utils.handlePatternDropDown(dialog,NUMERICINPUT_LANGDISPLAYVALUE,NUMERICINPUT_LANG);
        Utils.handlePatternFormat(dialog,NUMERICINPUT_LANGDISPLAYVALUE,NUMERICINPUT_LANG);
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleDisplayPatternDropDown,handleDisplayFormat,handleLang);
})(jQuery);
