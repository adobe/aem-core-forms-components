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

    var EDIT_DIALOG = ".cmp-adaptiveform-numberstepper__editdialog",
        NUMERICINPUT_MAXIMUM = EDIT_DIALOG + " .cmp-adaptiveform-numberstepper__maximum",
        NUMERICINPUT_EXCLUDEMAXCHECK = EDIT_DIALOG + " .cmp-adaptiveform-numberstepper__excludeMaximumCheck",
        NUMERICINPUT_EXCLUSIVEMAX = EDIT_DIALOG + " .cmp-adaptiveform-numberstepper__exclusiveMaximum",
        NUMERICINPUT_MINIMUM = EDIT_DIALOG + " .cmp-adaptiveform-numberstepper__minimum",
        NUMERICINPUT_EXCLUDEMINCHECK = EDIT_DIALOG + " .cmp-adaptiveform-numberstepper__excludeMinimumCheck",
        NUMERICINPUT_EXCLUSIVEMIN = EDIT_DIALOG + " .cmp-adaptiveform-numberstepper__exclusiveMinimum",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    function handleDialogSubmit(dialog){
        var submitButton=dialog.find(".cq-dialog-submit")[0];
        submitButton.addEventListener("click",_manageDialogSubmit);
        function _manageDialogSubmit(){
            var maximum = dialog.find(NUMERICINPUT_MAXIMUM)[0];
            var excludeMaxCheck = dialog.find(NUMERICINPUT_EXCLUDEMAXCHECK)[0];
            var exclusiveMaximum = dialog.find(NUMERICINPUT_EXCLUSIVEMAX)[0];
            var minimum = dialog.find(NUMERICINPUT_MINIMUM)[0];
            var excludeMinCheck = dialog.find(NUMERICINPUT_EXCLUDEMINCHECK)[0];
            var exclusiveMinimum = dialog.find(NUMERICINPUT_EXCLUSIVEMIN)[0];
            exclusiveMaximum.value = excludeMaxCheck.checked ? maximum.value : null;
            exclusiveMinimum.value = excludeMinCheck.checked ? minimum.value : null;
        }
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleDialogSubmit);
})(jQuery);
