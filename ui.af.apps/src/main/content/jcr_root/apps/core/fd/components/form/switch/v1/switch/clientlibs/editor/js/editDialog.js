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

  const EDIT_DIALOG = ".cmp-adaptiveform-switch__editdialog",
      ENABLE_UNCHECKED_VALUE = EDIT_DIALOG + " .cmp-adaptiveform-switch__enable--unchecked--value coral-switch",
      ENUM_OPTION = ".cmp-adaptiveform-switch__enums coral-multifield-item",
      SWITCH_TYPE = EDIT_DIALOG + " .cmp-adaptiveform-switch__type",
      SWITCH_DEFAULTVALUE = EDIT_DIALOG + " .cmp-adaptiveform-switch__value",
      SWITCH_ENUM = EDIT_DIALOG + " .cmp-adaptiveform-base__enum",
      Utils = window.CQ.FormsCoreComponents.Utils.v1;

  var registerDialogValidator = Utils.registerDialogDataTypeValidators(
      SWITCH_DEFAULTVALUE,
      SWITCH_ENUM,
      function (dialog) {
        var selectedValue = '';
        var switchSaveValue = dialog.find(SWITCH_TYPE);
        if (switchSaveValue && switchSaveValue.length > 0) {
          selectedValue = switchSaveValue[0].selectedItem ? switchSaveValue[0].selectedItem.value : '';
        }
        return selectedValue.toLowerCase();
      }
  );

  /**
   * The off value of a switch is optional, if not defined then no value will be submitted when the switch is not selected.
   * To explicitly send the off value, user needs to switch the 'enableUncheckedValue' on.
   * @param dialog
   */
  function handleOffFieldVisibility(dialog) {
    const enableOffValueSwitch = $(ENABLE_UNCHECKED_VALUE)[0];
    let isChecked = enableOffValueSwitch.hasAttribute('checked');
    const offField = $($(ENUM_OPTION)[1]);

    offField.css({"display": isChecked ? "block" : "none"})
    enableOffValueSwitch.addEventListener("click", function() {
      isChecked = !isChecked;
      offField.css({"display": isChecked ? "block" : "none"})
    })
  }

    /**
     * The data value and display text for multifield is same for ON and OFF fields
     * It sets the specific field labels for the ON and OFF data text and display text
     * @param dialog
     */
    function setDataAndDisplayTextFieldLabel(dialog) {
        // For every multifield item, we have enum, enumName and richTextEnumName
        let onDataValueLabel = $($(ENUM_OPTION + ' label'))[0],
            onDisplayTextLabel = $($(ENUM_OPTION + ' label'))[1],
            offDataValueLabel = $($(ENUM_OPTION + ' label'))[3],
            offDisplayTextLabel = $($(ENUM_OPTION + ' label'))[4];
        onDataValueLabel.innerHTML = 'ON Data Value *';
        onDisplayTextLabel.innerHTML = 'ON Display text *';
        offDataValueLabel.innerHTML = 'OFF Data Value *';
        offDisplayTextLabel.innerHTML = 'OFF Display text *';
    }

  Utils.initializeEditDialog(EDIT_DIALOG)(handleOffFieldVisibility, registerDialogValidator, setDataAndDisplayTextFieldLabel);

})(jQuery);
