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

    function handleTypeDropdown(dialog) {
        let typeDropdownComponent = dialog.find(NUMERICINPUT_TYPE)[0];
        manageMinAndMaxValidation();
        typeDropdownComponent.addEventListener("change", manageMinAndMaxValidation );

        function manageMinAndMaxValidation() {
            let minField = dialog.find(NUMERICINPUT_MINIMUM)[0];
            let maxField = dialog.find(NUMERICINPUT_MAXIMUM)[0];
            let minInput = minField.querySelector('input');
            let maxInput = maxField.querySelector('input');
            // update step property to 0.01 for minField and maxField
            if(typeDropdownComponent.value === 'number'){
                minField.step = "0.01";
                maxField.step = "0.01";
            } else {
                minField.step = "1";
                maxField.step = "1";
                // Reset value if it is a decimal
                if (minInput.value.includes('.')) {
                    minInput.value = Math.floor(minInput.value);
                    minInput.setAttribute('value', minInput.value);
                }
                if (maxInput.value.includes('.')) {
                    maxInput.value = Math.floor(maxInput.value);
                    maxInput.setAttribute('value', maxInput.value);
                }
            }
        }

    }

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

    Utils.initializeEditDialog(EDIT_DIALOG)(handleDisplayPatternDropDown,handleDisplayFormat,handleLang, handleTypeDropdown);
})(jQuery);
