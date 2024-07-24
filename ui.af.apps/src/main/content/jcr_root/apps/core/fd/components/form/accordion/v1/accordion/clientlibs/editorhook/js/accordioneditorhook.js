/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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
(function(channel) {
    "use strict";

    channel.on("cq-editor-loaded", function(event) {
        if (window.CQ && window.CQ.CoreComponents && window.CQ.CoreComponents.panelcontainer &&
            window.CQ.CoreComponents.panelcontainer.v1 && window.CQ.CoreComponents.panelcontainer.v1.registry) {
            window.CQ.CoreComponents.panelcontainer.v1.registry.register({
                name: "cmp-adaptiveform-accordion",
                selector: ".cmp-accordion",
                wrapperSelector: '[data-panelcontainer="adaptiveFormAccordion"]',
                itemSelector: "[data-cmp-hook-adaptiveFormAccordion='panel']",
                itemActiveSelector: "[data-cmp-hook-adaptiveFormAccordion='item'][data-cmp-expanded] [data-cmp-hook-adaptiveFormAccordion='panel']",
                itemSelectorWrapper: ".cmp-accordion__item"
            });
        }
    });
})(jQuery(document));
