/*******************************************************************************
 * Copyright 2024 Adobe
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


(function () {

    const AccordionMixin = window.Forms.CoreComponentsCommons.AccordionMixin;

    class Accordion extends AccordionMixin(class {}) {

        constructor(params) {
            super(params);
            const { element } = params;
            this.cacheElements(element);
            if (this.getCachedItems()) {
                var expandedItems = this.getExpandedItems();
                // multiple expanded items annotated, display the last item open.
                if (expandedItems.length > 1) {
                    var lastExpandedItem = expandedItems[expandedItems.length - 1]
                    this.expandItem(lastExpandedItem);
                    this.collapseAllOtherItems(lastExpandedItem.id);
                }
                this.refreshItems();
            }
            element.removeAttribute("data-" + this.constructor.NS + "-is");

            if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                /*
                 * Editor message handling:
                 * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                 * - check that the message data panel container type is correct and that the id (path) matches this specific Accordion component
                 * - if so, route the "navigate" operation to enact a navigation of the Accordion based on index data
                 */
                window.CQ.CoreComponents.MESSAGE_CHANNEL = window.CQ.CoreComponents.MESSAGE_CHANNEL || new window.Granite.author.MessageChannel("cqauthor", window);
                var _self = this;
                window.CQ.CoreComponents.MESSAGE_CHANNEL.subscribeRequestMessage("cmp.panelcontainer", function (message) {
                    if (message.data && message.data.type === "cmp-accordion" && message.data.id === _self._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate" && _self.getCachedItems()[message.data.index] !== undefined) {
                            _self.toggle(_self.getCachedItems()[message.data.index].id);
                            _self.collapseAllOtherItems(_self.getCachedItems()[message.data.index].id);
                        }
                    }
                });
            }
        }
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Tabs components as necessary.
     *
     * @private
     */
    function onDocumentReady() {

        var elements = document.querySelectorAll(Accordion.selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Accordion({ element: elements[i] });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(Accordion.selectors.self));
                            elementsArray.forEach(function(element) {
                                new Accordion({ element: element });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }
}());
