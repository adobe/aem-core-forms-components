/*******************************************************************************
 * Copyright 2024 Adobe
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

    var EDIT_DIALOG = ".cmp-adaptiveform-telephonedropdown__editdialog",
        TELEPHONEDROPDOWN_VALIDATIONPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-telephonedropdown__validationpattern",
        TELEPHONEDROPDOWN_VALIDATIONFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-telephonedropdown__validationformat",

        DROPDOWN_ALLOWMULTISELECT = EDIT_DIALOG + " .cmp-adaptiveform-telephonedropdown__allowmultiselect",
        DROPDOWN_DEFAULTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-telephonedropdown__defaultvalue",
        DROPDOWN_DEFAULTVALUEMULTISELCET = EDIT_DIALOG + " .cmp-adaptiveform-telephonedropdown__defaultvaluemultiselect",
        DROPDOWN_SAVEVALUE = EDIT_DIALOG + " .cmp-adaptiveform-telephonedropdown__savevaluetype",
        DROPDOWN_ENUM = EDIT_DIALOG + " .cmp-adaptiveform-base__enum",
        TYPE = EDIT_DIALOG + " input[name='./type']",
        DEFAULTINPUT = DROPDOWN_DEFAULTVALUE + " input",
        DEFAULTMUTIINPUT = DROPDOWN_DEFAULTVALUEMULTISELCET + " input[type='text']",
        DEFAULTENUM = ".cmp-adaptiveform-telephonedropdown__enums",
        DEFAULTCOUNTRYCODES = ".cmp-adaptiveform-telephonedropdown__countrycodes",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    function handlecheckbox() {
        var enumsInclude = document.querySelector(DEFAULTENUM);
        var checkbox = document.querySelector(DEFAULTCOUNTRYCODES);
        var isChecked = checkbox.checked;

        if(isChecked){
            enumsInclude.style.display = 'none';
        }
        else {
            enumsInclude.style.display = 'block';
        }

        if(checkbox){
            checkbox.addEventListener('change', handlecheckbox);
        }
    }

    function handleValidationPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,TELEPHONEDROPDOWN_VALIDATIONPATTERN,TELEPHONEDROPDOWN_VALIDATIONFORMAT);
    }

    function handleValidationFormat(dialog){
        Utils.handlePatternFormat(dialog,TELEPHONEDROPDOWN_VALIDATIONPATTERN,TELEPHONEDROPDOWN_VALIDATIONFORMAT);
    }


    Utils.initializeEditDialog(EDIT_DIALOG)(handleValidationPatternDropDown, handleValidationFormat, handlecheckbox);
})(jQuery);
