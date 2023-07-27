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

  var EDIT_DIALOG = ".cmp-adaptiveform-checkbox__editdialog",
      CHECKBOX_ASSISTPRIORITY = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__assistprioritycustom",
      CHECKBOX_CUSTOMTEXT = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__customtext",
      UNCHECKED_VALUE_WRAPPER = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__uncheckedvalue",
      CHECKBOX_DATATYPE = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__type",
      Utils = window.CQ.FormsCoreComponents.Utils.v1;


  /**
   * Shows custom text box depending on the value of assist priority of radio button
   * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
   */
  function handleAssistPriorityChange(dialog) {
    var assistpriority = dialog.find(CHECKBOX_ASSISTPRIORITY);
    var customtext = dialog.find(CHECKBOX_CUSTOMTEXT);
    var hideAndShowElements = function() {
      if(assistpriority[0].value === "custom"){
        customtext.show();
      } else {
        customtext.hide();
      }
    };
    hideAndShowElements();
    dialog.on("change", assistpriority, function() {
      hideAndShowElements();
    });
  }

  function handleUncheckedValue(dialog) {
    var enabledCheckedValueSwitch = $('coral-switch[name="./enableUncheckedValue"]')[0];
    var isChecked = enabledCheckedValueSwitch.hasAttribute('checked');
    var uncheckedValueBox = $('.cmp-adaptiveform-checkbox__uncheckedvalue');

    var enableCheckedValueInput = $('input[name="./enableUncheckedValue"]')[0];

    enableCheckedValueInput.addEventListener("click", function() {
      isChecked = !isChecked;
      if (isChecked) {
        uncheckedValueBox.show();
      } else {
        uncheckedValueBox.hide();
      }
    })

    if (!isChecked) {
      uncheckedValueBox.hide();
    }


  }

  function handleLayout(dialog) {
    var switchWrapper =  dialog.find('.cmp-adaptiveform-checkbox__disable_unchecked_value')[0];

    $(switchWrapper).css({"display":"flex", "margin-bottom":"1px"});
    var label = $(switchWrapper).find('label[class="coral-Form-fieldlabel"]')[0];
    $(label).css('padding-right', '20px');

    var switchBtn = dialog.find('coral-switch[name="./enableUncheckedValue"]')[0];
    $(switchBtn).css({"width":"40px"});
  }

  Utils.initializeEditDialog(EDIT_DIALOG)(handleAssistPriorityChange, handleUncheckedValue, handleLayout);

})(jQuery);
