/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe
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
/* global jQuery, Coral */
(function ($, Coral) {
    var iframeOptionSelector = ".cmp-aemform--editor-useiframe",
        thankYouConfigSelector = "coral-radio[name='./thankyouConfig']",
        submitTypeSelector = ".cmp-aemform--editor-submitType",
        getToggleElement = function (elementId) {
            var el = $(".cq-dialog [data-id='" + elementId + "']");
            if (el.length === 0) {
                // for pathbrowser and rich text field, granite:data attributes do not work, so we are using
                // css classes for them
                el = $(".cq-dialog ." + elementId);
            }
            return el.closest(".coral-Form-fieldwrapper").addBack(el);
        },
        toggle = function (el) {
            var showIds = $(el).attr("data-show"),
                hideIds = $(el).attr("data-hide");
            if (typeof(showIds) !== "undefined") {
                showIds.split(",").forEach(function (showId) {
                    getToggleElement(showId).show();
                });
            }
            if (typeof(hideIds) !== "undefined") {
                hideIds.split(",").forEach(function (hideId) {
                    getToggleElement(hideId).hide();
                });
            }
        },
        radioToggle = function ($el) {
            $el.each(function () {
                var $this = $(this);
                // since there is only single option, added this as a workaround to select single item
                if ($(this).attr("value") == "adaptiveForm") {
                    $this.attr("checked", "checked");
                }
                //same as onLoad so that relevant radio options is checked and works likewise.
                if ($this.attr("checked") != null) {
                    toggle($this);
                }
                if ($this.data("radio-toggle") == null) {
                    $this.data("radio-toggle", "enabled");
                } else {
                    return;
                }
                $this.change(function () {
                    toggle($this);
                });
            });
        },
        showHideRefreshOption = function (e) {
            var $el = e ? $(e.target) : $(iframeOptionSelector),
                isChecked = $el.attr("checked") === "checked" ? true : false,
                isPageSelected = false;

            $(thankYouConfigSelector).each(function (i, obj) {
                if (obj.checked && obj.value === "page") {
                    isPageSelected = true;
                }
            });

            if (isPageSelected) {
                if (isChecked) {
                    //Tick Refresh option and disable it.
                    $(submitTypeSelector)[0].checked = true;
                    $(submitTypeSelector).hide();
                } else {
                    $(submitTypeSelector).show();
                }
            }
        };

    $(document).on("foundation-contentloaded", function (e) {
        // if there is already an inital value make sure the according target element becomes visible
        radioToggle($("coral-radio[data-toggle]", e.target));
        showHideRefreshOption();
        $(iframeOptionSelector).on("change", function (e) {
            showHideRefreshOption(e);
        });
    });
}(jQuery, Coral));
