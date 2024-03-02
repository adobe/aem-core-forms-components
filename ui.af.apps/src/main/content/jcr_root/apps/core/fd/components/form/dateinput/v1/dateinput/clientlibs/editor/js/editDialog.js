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

    Utils.initializeEditDialog(EDIT_DIALOG)(handleDisplayPatternDropDown,handleDisplayFormat,handleEditPatternDropDown,handleEditFormat);
})(jQuery);
