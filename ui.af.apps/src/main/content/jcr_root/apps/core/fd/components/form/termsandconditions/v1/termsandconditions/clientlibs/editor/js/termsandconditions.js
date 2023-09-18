/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* global jQuery */
(function($) {
    "use strict";

    const Utils = window.CQ.FormsCoreComponents.Utils.v1,
        EDIT_DIALOG = ".cmp-adaptiveform-termsandconditions__editdialog";

    function handleToggleOfApprovalOptions(dialog) {
        const approvalOption = dialog.find('.cmp-adaptiveform-termsandconditions__showapprovaloption[name="./showApprovalOption"]')[0];
        const showAsPopupWidget = dialog.find('.cmp-adaptiveform-termsandconditions__showaspopup[name="./showAsPopup"]')[0];
        let showAsPopup = dialog.find('.cmp-adaptiveform-termsandconditions__showaspopup[name="./showAsPopup"]')[0]['checked'];
        function toggleApprovalOption(show) {
            if (show) {
                approvalOption.readOnly=false;
                approvalOption.style.opacity = "1";
            } else {
                approvalOption.readOnly=true;
                approvalOption.style.opacity = "0.5"
            }
        }
        if (showAsPopup) {
            if (!approvalOption.checked) {
                approvalOption['checked']=true;
            }
            toggleApprovalOption(false);
        }
        showAsPopupWidget.addEventListener('click', function() {
            showAsPopup = !showAsPopup;
            if (showAsPopup) {
                if (!approvalOption.checked) {
                    approvalOption.click();
                }
                toggleApprovalOption(false);
            } else {
                toggleApprovalOption(true);
            }
        })
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleToggleOfApprovalOptions);

})(jQuery);
