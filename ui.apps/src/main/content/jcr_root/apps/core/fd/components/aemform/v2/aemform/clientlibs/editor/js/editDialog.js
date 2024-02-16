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

    let EDIT_DIALOG = ".cmp-adaptiveform-aemform__editdialog",
        THEME_REF_DROPDOWN = ".cmp-adaptiveform-aemform__themeref",
        FORM_REF = ".cmp-adaptiveform-aemform__formref [name='./formRef'] coral-tag",
        IFRAME_CHECKBOX = ".cmp-aemform--editor-useiframe",
        TITLE_FIELD_CLASS = ".cmp-adaptiveform-aemform__title",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    function isCoreComponentForm(url) {
        var result = $.ajax({
            type: 'GET',
            async: false,
            url: Granite.HTTP.externalize(url + ".2.json"),
            cache: false,
            dataType: "json"
        });
        let version = "";
        if(result.status == 200  && result.responseJSON) {
            version = result.responseJSON['jcr:content'].guideContainer['fd:version']
        }
        return version.startsWith('2');
    }

    function invokeWhenFormPathChanged(dialog) {
        $(document).on('change', '.cmp-adaptiveform-aemform__formref', () => {
            hideThemeDropdownForV2(dialog);
        });
    }

    function hideThemeDropdownForV2(dialog) {
        let themeRefDropdown = dialog.find(THEME_REF_DROPDOWN),
            formRef = dialog.find(FORM_REF)[0];
        let url = formRef ? formRef.value.replace('dam/formsanddocuments','forms/af'): "";
        if(themeRefDropdown && isCoreComponentForm(url)) {
            themeRefDropdown.hide();
        } else {
            themeRefDropdown.show();
        }
    }

    function toggleTitleVisibility() {
        let dialog = $(EDIT_DIALOG);
        let checkbox = dialog.find(IFRAME_CHECKBOX);
        let titleField = dialog.find(TITLE_FIELD_CLASS);

        if (checkbox.prop('checked')) {
            titleField.parent().hide();
        } else {
            titleField.parent().show();
        }
    }

    function invokeWhenIframeCheckboxChanged() {
        $(document).on('change', IFRAME_CHECKBOX, toggleTitleVisibility);
    }



    Utils.initializeEditDialog(EDIT_DIALOG)(hideThemeDropdownForV2, invokeWhenFormPathChanged, toggleTitleVisibility, invokeWhenIframeCheckboxChanged);
})(jQuery);
