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
        NUMERICINPUT_LEADDIGITS = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__leaddigits",
        NUMERICINPUT_FRACDIGITS = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__fracdigits",
        NUMERICINPUT_EDITFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__editFormat",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    function handleTypeDropdown(dialog) {
        var typeDropdownComponent = dialog.find(NUMERICINPUT_TYPE)[0];
        _manageLeadDigitsAndFracDigits();
        typeDropdownComponent.addEventListener("change", _manageLeadDigitsAndFracDigits );

        function _manageLeadDigitsAndFracDigits(){
            var typeDropdownComponent = dialog.find(NUMERICINPUT_TYPE)[0];
            let selectedValue=typeDropdownComponent.value;
            let fracDigitsElement = dialog.find(NUMERICINPUT_FRACDIGITS);
            let leadDigitsElement = dialog.find(NUMERICINPUT_LEADDIGITS);
            let fracDigitsParentDivElem = (fracDigitsElement).closest("div")[0];

            if(selectedValue === 'number'){
                var leadDigitsLabel = CQ.I18n.getMessage("Lead digits");
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
            var leadDigitsElement = dialog.find(NUMERICINPUT_LEADDIGITS)[0];
            var fracDigitsElement = dialog.find(NUMERICINPUT_FRACDIGITS)[0];
            var editFormatElement = dialog.find(NUMERICINPUT_EDITFORMAT)[0];
            var leadDigits=leadDigitsElement.value;
            var fracDigits=fracDigitsElement.value;
            var editFormat="";
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

        }
    }

    function handleDialogReadyForNumericInput(dialog){
        _manageDialogReady();
        document.addEventListener("dialog-ready",_manageDialogReady);
        function _manageDialogReady() {
            var editDialogClassName = EDIT_DIALOG.substring(1);
            var numberInputDialog=document.getElementsByClassName(editDialogClassName)[0];
            if (numberInputDialog !== null && numberInputDialog !== undefined) {
                var leadDigitsElement = numberInputDialog.querySelector(NUMERICINPUT_LEADDIGITS);
                var fracDigitsElement = numberInputDialog.querySelector(NUMERICINPUT_FRACDIGITS);
                var editFormatElement = numberInputDialog.querySelector(NUMERICINPUT_EDITFORMAT);
                if (editFormatElement.value != null && editFormatElement.value.length > 0) {
                    var editFormatValue = editFormatElement.value;
                    var arr = editFormatValue.split(".");
                    leadDigitsElement.value = (arr[0].length - 1>0)?arr[0].length - 1:null;
                    fracDigitsElement.value = (arr[1].length - 1 > 0)?arr[1].length - 1:null;
                }
            }
        }
    }
    Utils.initializeEditDialog(EDIT_DIALOG)(handleTypeDropdown,handleDialogSubmit,handleDialogReadyForNumericInput);
})(jQuery);
