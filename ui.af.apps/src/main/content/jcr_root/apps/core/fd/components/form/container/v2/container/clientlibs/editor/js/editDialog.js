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
    let EDIT_DIALOG = ".cmp-adaptiveform-container__editdialog",
    CONTAINER_HAMBURGERMENUSUPPORT = EDIT_DIALOG + ' .cmp-adaptiveform-container__hamburgerMenuSupport',
    CONTAINER_HAMBURGERMENUNESTINGLEVEL = EDIT_DIALOG + " .cmp-adaptiveform-container__hamburgerMenuNestingLevel",
    Utils = window.CQ.FormsCoreComponents.Utils.v1;

/**
 * Toggles the support of hamburger menu, value of type on the checked state of
 * the hamburger menu support checkbox
 * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
 */
function handleHamburgerMenuNestingSelection(dialog) {
    let component = dialog.find(CONTAINER_HAMBURGERMENUSUPPORT)[0];
    let hamburgerMenuLevelSupport=dialog.find(CONTAINER_HAMBURGERMENUNESTINGLEVEL);
    let listOfElements = [hamburgerMenuLevelSupport];
    let isNotChecked = function() {return isChecked()};
    let isChecked = function() {return component.checked};
    let hideAndShowElements = function() {
         // hide minItems elements
        Utils.checkAndDisplay(listOfElements)(isNotChecked);
    };
    hideAndShowElements();
    component.on("change", function() {
        hideAndShowElements();
    });
}
Utils.initializeEditDialog(EDIT_DIALOG)(handleHamburgerMenuNestingSelection);

})(jQuery);
