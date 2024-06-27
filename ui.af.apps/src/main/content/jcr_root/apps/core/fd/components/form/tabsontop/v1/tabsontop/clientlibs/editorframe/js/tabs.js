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

    class Tabs  {
        static NS = "cmp";
        static IS = "adaptiveFormTabs";
        static bemBlock = "cmp-tabs";
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            active: {
                tab: "cmp-tabs__tab--active",
                tabpanel: "cmp-tabs__tabpanel--active"
            },
        };

        #_active = null;

        constructor(params) {
            const { element } = params;
            this.#cacheElements(element);
            this.#_active = this.getActiveTabId(this.#getCachedTabs());
            this.#refreshActive();

            if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                /*
                 * Editor message handling:
                 * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                 * - check that the message data panel container type is correct and that the id (path) matches this specific Tabs component
                 * - if so, route the "navigate" operation to enact a navigation of the Tabs based on index data
                 */
                CQ.CoreComponents.MESSAGE_CHANNEL = CQ.CoreComponents.MESSAGE_CHANNEL || new window.Granite.author.MessageChannel("cqauthor", window);
                var _self = this;
                CQ.CoreComponents.MESSAGE_CHANNEL.subscribeRequestMessage("cmp.panelcontainer", function (message) {
                    if (message.data && message.data.type === "cmp-tabs" && message.data.id === _self._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate" && _self._elements["tab"][message.data.index] != undefined) {
                            _self.navigate(_self._elements["tab"][message.data.index].id);
                        }
                    }
                });
            }
        }

        /**
         * Gets the cached tab panels.
         * @returns {NodeList} The cached tab panels.
         * @private
         */
        #getCachedTabPanels() {
            return this._elements["tabpanel"]
        }

        /**
         * Gets the cached tabs.
         * @returns {NodeList} The cached tabs.
         * @private
         */
        #getCachedTabs() {
            return this._elements["tab"];
        }

        /**
         * Caches the Tabs elements as defined via the {@code data-tabs-hook="ELEMENT_NAME"} markup API.
         * @private
         * @param {HTMLElement} wrapper - The Tabs wrapper element.
         */
        #cacheElements(wrapper) {
            this._elements = {};
            this._elements.self = wrapper;
            var hooks = this._elements.self.querySelectorAll("[data-" + Tabs.NS + "-hook-" + Tabs.IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("[data-cmp-is=" + Tabs.IS  + "]") === this._elements.self) { // only process own tab elements
                    var lowerCased = Tabs.IS.toLowerCase();
                    var capitalized = lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
                    var key = hook.dataset[Tabs.NS + "Hook" + capitalized];
                    if (this._elements[key]) {
                        if (!Array.isArray(this._elements[key])) {
                            var tmp = this._elements[key];
                            this._elements[key] = [tmp];
                        }
                        this._elements[key].push(hook);
                    } else {
                        this._elements[key] = [hook];
                    }
                }
            }
        }

        /**
         * Refreshes the tab markup based on the current active index.
         * @private
         */
        #refreshActive() {
            var tabpanels = this.#getCachedTabPanels();
            var tabs = this.#getCachedTabs();
            if (tabpanels) {
                for (var i = 0; i < tabpanels.length; i++) {
                    if (tabs[i].id === this.#_active) {
                        tabpanels[i].classList.add(Tabs.selectors.active.tabpanel);
                        tabpanels[i].removeAttribute("aria-hidden");
                        tabs[i].classList.add(Tabs.selectors.active.tab);
                        tabs[i].setAttribute("aria-selected", true);
                        tabs[i].setAttribute("tabindex", "0");
                        tabs[i].setAttribute("aria-current", "true");
                    } else {
                        tabpanels[i].classList.remove(Tabs.selectors.active.tabpanel);
                        tabpanels[i].setAttribute("aria-hidden", true);
                        tabs[i].classList.remove(Tabs.selectors.active.tab);
                        tabs[i].setAttribute("aria-selected", false);
                        tabs[i].setAttribute("tabindex", "-1");
                        tabs[i].setAttribute("aria-current", "false");
                    }
                }
            }
        }

        /**
         * Returns the id of the active tab, if no tab is active returns 0th element id
         *
         * @param {Array} tabs Tab elements
         * @returns {Number} Id of the active tab, 0th element id if none is active
         */
        getActiveTabId(tabs) {
            if (tabs) {
                var result = tabs[0].id;
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].classList.contains(Tabs.selectors.active.tab)) {
                        result = tabs[i].id;
                        break;
                    }
                }
                return result;
            }
        }

        /**
         * Navigates to the tab at the provided index
         *
         * @private
         * @param {Number} index The index of the tab to navigate to
         */
        navigate(index) {
            this.#_active = index;
            this.#refreshActive();
        }



    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Tabs components as necessary.
     *
     * @private
     */
    function onDocumentReady() {

        var elements = document.querySelectorAll(Tabs.selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Tabs({ element: elements[i] });
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
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(Tabs.selectors.self));
                            elementsArray.forEach(function(element) {
                                new Tabs({ element: element });
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
