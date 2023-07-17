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
(function($, Granite, ns, channel, Coral) {
    "use strict";

    var MULTIFIELD_SELECTOR = ".cmp-adaptiveform-base-customproperties__multifield",
        REMOVE_SELECTOR = '[handle="remove"]',
        ui = $(window).adaptTo('foundation-ui');


    /**
     * Binds a click handler on a multifield remove button, sets up warning prompts.
     *
     * @private
     * @ignore
     */
    function bindRemoveClick(multifieldItem, multifield) {
        var $remove = $(REMOVE_SELECTOR, multifieldItem);

        $remove.off('click').on('click', function (e) {
            e.stopPropagation();

            var message = "<p>";
            message = message + Granite.I18n.get("You are removing custom properties that might be used by one or more components on one or more forms.");
            message = message + "<br/>";
            message = message + Granite.I18n.get("This might lead to behaviour changes on applications consuming the headless JSON of forms based on templates using this policy.");
            message = message + "</p>";

            ui.prompt(Granite.I18n.get("Delete Custom Properties"), message, "notice", [{
                text: Granite.I18n.get("Cancel")
            }, {
                text   : Granite.I18n.get("Delete"),
                warning: true,
                handler: function () {
                    removeMultifieldItem(multifieldItem, multifield)
                }
            }]);
        });
    }

    /**
     * Removes a multifield item.
     *
     * @private
     * @ignore
     */
    function removeMultifieldItem(multifieldItem, multifield) {
        multifieldItem.remove();
        multifield.trigger('change');
    }


    channel.on('dialog-ready', function () {
        $(MULTIFIELD_SELECTOR).each(function (i, el) {

            Coral.commons.ready(el, function (multifield) {

                $('coral-multifield-item', multifield).each(function (i, el) {
                    Coral.commons.ready(el, function (multifieldItem) {
                        bindRemoveClick(multifieldItem, multifield);
                    });
                });

                multifield.on('change', function () {
                    $('coral-multifield-item', multifield).each(function (i, el) {
                        Coral.commons.ready(el, function (multifieldItem) {
                            bindRemoveClick(multifieldItem, multifield);
                        });
                    });
                });

            });

        });
    });

})(jQuery, Granite, Granite.author, jQuery(document), Coral);