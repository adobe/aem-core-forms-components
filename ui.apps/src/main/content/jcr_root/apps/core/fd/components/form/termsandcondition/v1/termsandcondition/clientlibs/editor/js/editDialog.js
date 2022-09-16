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

    var EDIT_DIALOG = ".cmp-adaptiveform-termsandcondition__editdialog",
        SHOW_LINK = EDIT_DIALOG + " .cmp-adaptiveform-termsandcondition__showlink",
        ENUM = EDIT_DIALOG + " .cmp-adaptiveform-termsandcondition__enum",
        ENUM_NAMES = EDIT_DIALOG + " .cmp-adaptiveform-termsandcondition__enumNames",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;


    /**
     * Toggles the visibility of the maxLength, minLength, placeholder field based on the checked state of
     * the allowRichText checkbox
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleLink(dialog) {
        // var component = dialog.find(SHOW_LINK)[0];
        // var enums = dialog.find(ENUM);
        // var enumNames = dialog.find(ENUM_NAMES);
        // var listOfElements = [enums, enumNames];
        // var isChecked = function() {return component.checked};
        // var hideAndShowElements = function() {
        //     Utils.checkAndDisplay(listOfElements)(isChecked);
        // };
        // hideAndShowElements();
        // component.on("change", function() {
        //     hideAndShowElements();
        // });
    }
    Utils.initializeEditDialog(EDIT_DIALOG)(handleLink);

})(jQuery);
