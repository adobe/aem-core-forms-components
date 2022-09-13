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
        NUMERICINPUT_DISPLAYPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__displaypattern",
        NUMERICINPUT_DISPLAYFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__displayformat",
        NUMERICINPUT_VALIDATIONPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__validationpattern",
        NUMERICINPUT_VALIDATIONFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__validationpictureclause",
        NUMERICINPUT_EDITFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-numberinput__editFormat",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;



    function handleDisplayPatternDropDown(dialog) {
        var displayPatternComponent = dialog.find(NUMERICINPUT_DISPLAYPATTERN)[0];
        var displayFormatComponent = dialog.find(NUMERICINPUT_DISPLAYFORMAT)[0];
        var validationPatternComponent=dialog.find(NUMERICINPUT_VALIDATIONPATTERN)[0];
        var validationFormatComponent=dialog.find(NUMERICINPUT_VALIDATIONFORMAT)[0];

        _manageDisplayPatternDynamicBehaviour();
        displayPatternComponent.addEventListener("change", _manageDisplayPatternDynamicBehaviour );
        function _manageDisplayPatternDynamicBehaviour() {
            var displayPatternSelectedValue = displayPatternComponent.selectedItem.innerHTML;
            var displayFormatParentDiv=displayFormatComponent.closest("div");
            switch (displayPatternSelectedValue) {
                case "Select"     :
                case "No Pattern" :
                    displayFormatParentDiv.setAttribute("hidden", true);
                    break;
                default           :
                    displayFormatParentDiv.removeAttribute("hidden");
            }
            if(displayPatternSelectedValue!="Custom") {
                displayFormatComponent.value = displayPatternComponent.value;
            }
        }

    }



    function handleValidationPatternDropdown(dialog){
        var validationPatternComponent=dialog.find(NUMERICINPUT_VALIDATIONPATTERN)[0];
        var validationFormatComponent=dialog.find(NUMERICINPUT_VALIDATIONFORMAT)[0];
        _manageValidationPatternChange();
        validationPatternComponent.addEventListener("change",_manageValidationPatternChange);
        function _manageValidationPatternChange(){
            var validationPatternValue=validationPatternComponent.value;
            var validationPatternSelectedValue = validationPatternComponent.selectedItem.innerHTML;
            var validationFormatParentDiv=validationFormatComponent.closest("div");
            switch (validationPatternSelectedValue) {
                case "Select"     :
                case "No Pattern" :
                    validationFormatParentDiv.setAttribute("hidden", true);
                    break;
                default           :
                    validationFormatParentDiv.removeAttribute("hidden");
            }
            if(validationPatternSelectedValue!="Custom") {
                validationFormatComponent.value = validationPatternValue;
            }
        }
    }

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

            if(selectedValue=='decimal'){
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

    function handleDisplayFormat(dialog){
        var displayPatternComponent = dialog.find(NUMERICINPUT_DISPLAYPATTERN)[0];
        var displayFormatComponent = dialog.find(NUMERICINPUT_DISPLAYFORMAT)[0];
        var validationPatternComponent=dialog.find(NUMERICINPUT_VALIDATIONPATTERN)[0];
        var validationFormatComponent=dialog.find(NUMERICINPUT_VALIDATIONFORMAT)[0];

        _manageDisplayFormatChange()
        displayFormatComponent.addEventListener("change", _manageDisplayFormatChange );
        function _manageDisplayFormatChange(){
            var itemFound=false;
            if(displayFormatComponent.value!=displayPatternComponent.value){
                displayPatternComponent.items.getAll().forEach(function (item) {
                    if (item.value == displayFormatComponent.value) {
                        item.selected = true;
                        itemFound = true;
                    }
                });
               if(!itemFound){
                   displayPatternComponent.value="custom";
               }
            }

        }
    }

    function handleValidationFormat(dialog){
        var validationPatternComponent=dialog.find(NUMERICINPUT_VALIDATIONPATTERN)[0];
        var validationFormatComponent=dialog.find(NUMERICINPUT_VALIDATIONFORMAT)[0];

        _manageValidationFormatChange()
        validationFormatComponent.addEventListener("change", _manageValidationFormatChange );
        function _manageValidationFormatChange(){
            var itemFound=false;
            if(validationFormatComponent.value!=validationPatternComponent.value){
                validationPatternComponent.items.getAll().forEach(function (item) {
                    if (item.value == validationFormatComponent.value) {
                        item.selected = true;
                        itemFound = true;
                    }
                });
                if(!itemFound){
                    validationPatternComponent.value="custom";
                }
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
            if((leadDigits!=null && leadDigits!="" && leadDigits>0) ||(fracDigits!=null && fracDigits!="" && fracDigits>0)) {
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


    Utils.initializeEditDialog(EDIT_DIALOG)(handleTypeDropdown,handleDisplayPatternDropDown,handleValidationPatternDropdown,
        handleDisplayFormat,handleValidationFormat,handleDialogSubmit,handleDialogReadyForNumericInput);
})(jQuery);
