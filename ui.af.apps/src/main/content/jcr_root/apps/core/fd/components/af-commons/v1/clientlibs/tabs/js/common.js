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

    function TabsMixin(Base) {
        return class extends Base {

            /**
             * Private property for storing the active tab ID.
             * @type {string}
             */
            #_active;

            /**
             * Private property for storing the IS.
             * @type {string}
             */
            #_IS;
            /**
             * Private property for storing the namespace.
             * @type {string}
             */
            #_NS;
            /**
             * Private property for storing the selectors.
             * @type {object}
             */
            #_selectors;

            constructor(params, ns, is, selectors) {
                super(params);
                this.#_IS = is;
                this.#_NS = ns;
                this.#_selectors = selectors;
                const { element } = params;
                this.#cacheElements(element);
                this.#_active = this.getActiveTabId(this.#getCachedTabs());
                this.#refreshActive();
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
                var hooks = this._elements.self.querySelectorAll("[data-" + this.#_NS + "-hook-" + this.#_IS + "]");

                for (var i = 0; i < hooks.length; i++) {
                    var hook = hooks[i];
                    if (hook.closest("[data-cmp-is=" + this.#_IS  + "]") === this._elements.self) { // only process own tab elements
                        var lowerCased = this.#_IS.toLowerCase();
                        var capitalized = lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
                        var key = hook.dataset[this.#_NS + "Hook" + capitalized];
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
                        if(tabs[i]) {
                            if (tabs[i].id === this.#_active) {
                                tabpanels[i].classList.add(this.#_selectors.active.tabpanel);
                                tabpanels[i].removeAttribute("aria-hidden");
                                tabs[i].classList.add(this.#_selectors.active.tab);
                                tabs[i].setAttribute("aria-selected", true);
                                tabs[i].setAttribute("tabindex", "0");
                                tabs[i].setAttribute("aria-current", "true");
                            } else {
                                tabpanels[i].classList.remove(this.#_selectors.active.tabpanel);
                                tabpanels[i].setAttribute("aria-hidden", true);
                                tabs[i].classList.remove(this.#_selectors.active.tab);
                                tabs[i].setAttribute("aria-selected", false);
                                tabs[i].setAttribute("tabindex", "-1");
                                tabs[i].setAttribute("aria-current", "false");
                            }
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
                        if (tabs[i].classList.contains(this.#_selectors.active.tab)) {
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
    }

    window.Forms = window.Forms || {};
    window.Forms.CoreComponentsCommons = window.Forms.CoreComponentsCommons || {};
    window.Forms.CoreComponentsCommons.TabsMixin = TabsMixin;

}());
