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
      ENABLE_UNCHECKED_VALUE = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__enable-unchecked-value",
      ENUMS = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__enums",
      DATA_TYPE = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__type",
      UNCHECKED_VALUE = EDIT_DIALOG + " .cmp-adaptiveform-checkbox__uncheckedvalue",
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

  /**
   * The off value of a checkbox is optional, if not defined then no value will be submitted when the checkbox is not selected.
   * To explicitly send the off value, user needs to switch the 'enableUncheckedValue' on.
   * @param dialog
   */
  function handleUncheckedValue(dialog) {
    var enabledCheckedValueSwitch = $('coral-switch[name="./enableUncheckedValue"]')[0];
    var isChecked = enabledCheckedValueSwitch.hasAttribute('checked');
    var uncheckedValueBox = $(UNCHECKED_VALUE);

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

  /**
   * A checkbox can specify enum implicitly by setting type property to boolean.
   * @param dialog
   */
  function handleDataTypeSelectionAndValidation(dialog) {
    var dataTypeSelect = dialog.find(DATA_TYPE + " coral-select");
    var preselectedDataType = dataTypeSelect[0].selectedItem ? dataTypeSelect[0].selectedItem.value : '';
    if (preselectedDataType == 'boolean') {
      dialog.find(ENUMS).hide();
    }

    dataTypeSelect.on('change', function() {
      var selectedDataType = dataTypeSelect[0].selectedItem ? dataTypeSelect[0].selectedItem.value : '';
      if (selectedDataType == 'boolean') {
        dialog.find(ENUMS).hide();
      } else {
        dialog.find(ENUMS).show();
      }
    });

    var registerValidator = function(selector, validate) {
      if (!validate) {
          validate = function() {
          var isValid = true;
          var selectedDataType = dataTypeSelect[0].selectedItem ? dataTypeSelect[0].selectedItem.value : '';
          var value = document.querySelector(selector).value;
          if (selectedDataType === 'number') {
            if (isNaN(value)) {
              isValid = false;
            }
          }
          if (!isValid) {
            return Granite.I18n.getMessage('Value Type Mismatch');
          }
        }
      }
      $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
        selector: selector,
        validate: validate
      });
    }

    registerValidator('input[name="./checkedValue"]');
    registerValidator('input[name="./default"]');
    registerValidator('input[name="./uncheckedValue"]', function() {
      var isValid = true;
      var enabledCheckedValueSwitch = $('coral-switch[name="./enableUncheckedValue"]')[0];
      var isChecked = enabledCheckedValueSwitch.hasAttribute('checked');
      if (isChecked) {
        var selectedDataType = dataTypeSelect[0].selectedItem ? dataTypeSelect[0].selectedItem.value : '';
        var value = document.querySelector('input[name="./uncheckedValue"]').value;
        if (selectedDataType === 'number') {
          if (isNaN(value)) {
            isValid = false;
          }
        }
      }
      if (!isValid) {
        return Granite.I18n.getMessage('Value Type Mismatch');
      }
    })
  }

  function _handleLayout(dialog) {
    var switchWrapper =  dialog.find(ENABLE_UNCHECKED_VALUE)[0];
    $(switchWrapper).css({"display":"flex", "margin-bottom":"1px"});
    var label = $(switchWrapper).find('label[class="coral-Form-fieldlabel"]')[0];
    $(label).css('padding-right', '20px');
    var switchBtn = dialog.find('coral-switch[name="./enableUncheckedValue"]')[0];
    $(switchBtn).css({"width":"40px"});
  }

  Utils.initializeEditDialog(EDIT_DIALOG)(handleAssistPriorityChange, handleUncheckedValue, _handleLayout, handleDataTypeSelectionAndValidation);

})(jQuery);
