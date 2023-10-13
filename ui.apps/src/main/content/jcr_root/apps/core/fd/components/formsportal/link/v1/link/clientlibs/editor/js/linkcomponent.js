/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2021 Adobe
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
/* global jQuery, Coral, Granite */
(function ($, Coral, Granite) {
    var initQueryParametersTab = function () {
        var btn = $('.cmp-formsportal-link--editor-parameters > ._coral-Button')[0];
        var multifield = $('.cmp-formsportal-link--editor-parameters')[0];
        var header = $('.cmp-formsportal-link--editor-parameters__header')[0];

        if (typeof(btn) !== "undefined") {
            Coral.commons.ready(btn, function() {
                // overrides the default multi-field button
                btn.set({
                    label: {
                        innerHTML: Granite.I18n.get("Add Item")
                    },
                    icon: "add"
                });
            });
        }

        if (typeof(multifield) !== "undefined") {
            Coral.commons.ready(multifield, function() {
                // toggles hide or show of header based on whether multifield elements presence
                var toggleHeaderShowHide = function () {
                    header.hidden = !multifield.items.length;
                };
                multifield.on('change', toggleHeaderShowHide);
                toggleHeaderShowHide();
            });
        }
    };

    // wait till dialog load is complete
    $(document).on("dialog-ready", function () {
        initQueryParametersTab();
    });
}(jQuery, Coral, Granite));
