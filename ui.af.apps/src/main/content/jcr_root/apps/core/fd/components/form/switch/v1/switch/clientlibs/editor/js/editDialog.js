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

    var EDIT_DIALOG = ".cmp-adaptiveform-switch__editdialog",
        SWITCH_TYPE = EDIT_DIALOG + " .cmp-adaptiveform-switch__type",
        SWITCH_LEADDIGITS = EDIT_DIALOG + " .cmp-adaptiveform-switch__leaddigits",
        SWITCH_FRACDIGITS = EDIT_DIALOG + " .cmp-adaptiveform-switch__fracdigits",
        SWITCH_EDITFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-switch__editFormat",
        SWITCH_MAXIMUM = EDIT_DIALOG + " .cmp-adaptiveform-switch__maximum",
        SWITCH_EXCLUDEMAXCHECK = EDIT_DIALOG + " .cmp-adaptiveform-switch__excludeMaximumCheck",
        SWITCH_EXCLUSIVEMAX = EDIT_DIALOG + " .cmp-adaptiveform-switch__exclusiveMaximum",
        SWITCH_MINIMUM = EDIT_DIALOG + " .cmp-adaptiveform-switch__minimum",
        SWITCH_EXCLUDEMINCHECK = EDIT_DIALOG + " .cmp-adaptiveform-switch__excludeMinimumCheck",
        SWITCH_EXCLUSIVEMIN = EDIT_DIALOG + " .cmp-adaptiveform-switch__exclusiveMinimum",
        SWITCH_DISPLAYPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-switch__displaypattern",
        SWITCH_DISPLAYFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-switch__displayformat",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    function handleTypeDropdown(dialog) {
        var typeDropdownComponent = dialog.find(SWITCH_TYPE)[0];
        _manageLeadDigitsAndFracDigits();
        typeDropdownComponent.addEventListener("change", _manageLeadDigitsAndFracDigits );

        function _manageLeadDigitsAndFracDigits(){
            var typeDropdownComponent = dialog.find(SWITCH_TYPE)[0];
            let selectedValue=typeDropdownComponent.value;
            let fracDigitsElement = dialog.find(SWITCH_FRACDIGITS);
            let leadDigitsElement = dialog.find(SWITCH_LEADDIGITS);
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

    function handleDialogSubmit(dialog){
        var submitButton=dialog.find(".cq-dialog-submit")[0];
        submitButton.addEventListener("click",_manageDialogSubmit);
        function _manageDialogSubmit(){
            var leadDigitsElement = dialog.find(SWITCH_LEADDIGITS)[0];
            var fracDigitsElement = dialog.find(SWITCH_FRACDIGITS)[0];
            var editFormatElement = dialog.find(SWITCH_EDITFORMAT)[0];
            var leadDigits=leadDigitsElement.value;
            var fracDigits=fracDigitsElement.value;
            var editFormat="";
            var maximum = dialog.find(SWITCH_MAXIMUM)[0];
            var excludeMaxCheck = dialog.find(SWITCH_EXCLUDEMAXCHECK)[0];
            var exclusiveMaximum = dialog.find(SWITCH_EXCLUSIVEMAX)[0];
            var minimum = dialog.find(SWITCH_MINIMUM)[0];
            var excludeMinCheck = dialog.find(SWITCH_EXCLUDEMINCHECK)[0];
            var exclusiveMinimum = dialog.find(SWITCH_EXCLUSIVEMIN)[0];

            editFormatElement.value=editFormat;
            if (leadDigits || fracDigits) {
                for (var i = 0; i < leadDigits; i++) {
                    editFormat += "9";
                }
                editFormat += ".";
                for (var i = 0; i < fracDigits; i++) {
                    editFormat += "9";
                }
                editFormatElement.value="{"+editFormat+"}";
            }
            exclusiveMaximum.value = excludeMaxCheck.checked ? maximum.value : null;
            exclusiveMinimum.value = excludeMinCheck.checked ? minimum.value : null;
        }
    }

    function handleDialogReadyForSwitch(dialog){
        _manageDialogReady();
        document.addEventListener("dialog-ready",_manageDialogReady);
        function _manageDialogReady() {
            var editDialogClassName = EDIT_DIALOG.substring(1);
            var switchDialog=document.getElementsByClassName(editDialogClassName)[0];
            if (switchDialog !== null && switchDialog !== undefined) {
                var leadDigitsElement = switchDialog.querySelector(SWITCH_LEADDIGITS);
                var fracDigitsElement = switchDialog.querySelector(SWITCH_FRACDIGITS);
                var editFormatElement = switchDialog.querySelector(SWITCH_EDITFORMAT);
                if (editFormatElement.value != null && editFormatElement.value.length > 0) {
                    var editFormatValue = editFormatElement.value;
                    var arr = editFormatValue.split(".");
                    leadDigitsElement.value = (arr[0].length - 1>0)?arr[0].length - 1:null;
                    fracDigitsElement.value = (arr[1].length - 1 > 0)?arr[1].length - 1:null;
                }
            }
        }
    }

    function handleDisplayPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,SWITCH_DISPLAYPATTERN,SWITCH_DISPLAYFORMAT);
    }

    function handleDisplayFormat(dialog){
        Utils.handlePatternFormat(dialog,SWITCH_DISPLAYPATTERN,SWITCH_DISPLAYFORMAT);
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleTypeDropdown,handleDialogSubmit,handleDialogReadyForSwitch,handleDisplayPatternDropDown,handleDisplayFormat);
})(jQuery);
