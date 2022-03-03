/*******************************************************************************
 * Copyright 2021 Adobe
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
_tpa_helper(['jQuery'],
    function($) {
        var operationResponseHandler = function (data, itemEl) {
            var result = data.result;
            if (result.status == "success") {
                // removing the deleted draft from ui.
                itemEl.remove();
            }
        };
    
        var discardDraftOperation = {
            name: "discardDraft",
            handler: function (event, operationData) {
                var itemEl = $(event.currentTarget).parents('[data-cmp-hook-item-template="item"]');
                var queryPath = operationData.actionURL;
    
                fetch(queryPath)
                    .then(response => response.json())
                    .then(data => operationResponseHandler(data, itemEl));
            }
        };
    
        $(function() {
            $(window).trigger("core-forms-register-operation", discardDraftOperation);
        });
    }
);
