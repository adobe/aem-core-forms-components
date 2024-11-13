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

    var EDIT_DIALOG = ".cmp-adaptiveform-datetime__editdialog",
        DATETIME_MAXLENGTH = EDIT_DIALOG + " .cmp-adaptiveform-datetime__maxlength",
        DATETIME_MINLENGTH = EDIT_DIALOG + " .cmp-adaptiveform-datetime__minlength",
        BASE_PLACEHOLDER = EDIT_DIALOG + " .cmp-adaptiveform-base__placeholder",
        DATETIME_VALUE = EDIT_DIALOG + " .cmp-adaptiveform-datetime__value",
        DATETIME_RICHTEXTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-datetime__richtextvalue",
        DATETIME_VALIDATIONPATTERN = EDIT_DIALOG + " .cmp-adaptiveform-datetime__validationpattern",
        DATETIME_VALIDATIONFORMAT = EDIT_DIALOG + " .cmp-adaptiveform-datetime__validationformat",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    function handleValidationPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,DATETIME_VALIDATIONPATTERN,DATETIME_VALIDATIONFORMAT);
    }

    function handleValidationFormat(dialog){
        Utils.handlePatternFormat(dialog,DATETIME_VALIDATIONPATTERN,DATETIME_VALIDATIONFORMAT);
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleValidationPatternDropDown,handleValidationFormat);

})(jQuery);
