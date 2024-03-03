/*******************************************************************************
 * Copyright 2023 Adobe
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
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    function handleValidationPatternDropDown(dialog) {
        Utils.handlePatternDropDown(dialog,TELEPHONEDROPDOWN_VALIDATIONPATTERN,TELEPHONEDROPDOWN_VALIDATIONFORMAT);
    }

    function handleValidationFormat(dialog){
        Utils.handlePatternFormat(dialog,TELEPHONEDROPDOWN_VALIDATIONPATTERN,TELEPHONEDROPDOWN_VALIDATIONFORMAT);
    }


    Utils.initializeEditDialog(EDIT_DIALOG)(handleValidationPatternDropDown,handleValidationFormat);
})(jQuery);
