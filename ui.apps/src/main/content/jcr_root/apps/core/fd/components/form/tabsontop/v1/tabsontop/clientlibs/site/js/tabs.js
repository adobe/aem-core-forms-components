/*******************************************************************************
 * Copyright 2022 Adobe
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

(function() {

    var NS = "cmp";
    var IS = "adaptiveFormTabs";

    var keyCodes = {
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]',
        active: {
            tab: "cmp-adaptiveFormTabs__tab--active",
            tabpanel: "cmp-adaptiveFormTabs__tabpanel--active"
        }
    };

    class Tabs extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormTabs";

        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]'
        };

        constructor(params) {
            super(params);
            const {element} = params;
            this.cacheElements(element);
            this._active = this.getActiveIndex(this._elements["tab"]);
            this.refreshActive();
            this.bindEvents();
        }

        /**
         * Caches the Tabs elements as defined via the {@code data-tabs-hook="ELEMENT_NAME"} markup API
         *
         * @private
         * @param {HTMLElement} wrapper The Tabs wrapper element
         */
        cacheElements(wrapper) {
            this._elements = {};
            this._elements.self = wrapper;
            var hooks = this._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("." + NS + "-" + IS) === this._elements.self) { // only process own tab elements
                   var key = hook.dataset[NS + "Hook" + "Adaptiveformtabs"];
                    if (this._elements[key]) {
                        if (!Array.isArray(this._elements[key])) {
                            var tmp = this._elements[key];
                            this._elements[key] = [tmp];
                        }
                        this._elements[key].push(hook);
                    } else {
                        this._elements[key] = hook;
                    }
                }
            }
        }

        getClass() {
            return Tabs.IS;
        }

        setFocus() {
            this.setActive();
        }

        /**
         * Binds Tabs event handling
         *
         * @private
         */
        bindEvents() {
            var tabs = this._elements["tab"];
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    var _self = this;
                    (function(index){
                        tabs[index].addEventListener("click", function(event) {
                            _self.navigateAndFocusTab(index);
                        });
                    }(i));
                    
                    tabs[i].addEventListener("keydown", function(event) {
                        _self.onKeyDown(event);
                    });
                };
            }
        }

         /**
         * Returns the index of the active tab, if no tab is active returns 0
         *
         * @param {Array} tabs Tab elements
         * @returns {Number} Index of the active tab, 0 if none is active
         */
        getActiveIndex(tabs) {
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].classList.contains(selectors.active.tab)) {
                        return i;
                    }
                }
            }
            return 0;
        }

         /**
         * Handles tab keydown events
         *
         * @private
         * @param {Object} event The keydown event
         */
        onKeyDown(event) {
            var index = this._active;
            //TODO this needs to be done
            var lastIndex = this._elements["tab"].length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        this.navigateAndFocusTab(index - 1);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        this.navigateAndFocusTab(index + 1);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    this.navigateAndFocusTab(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    this.navigateAndFocusTab(lastIndex);
                    break;
                default:
                    return;
            }
        }

         /**
         * Refreshes the tab markup based on the current {@code Tabs#_active} index
         *
         * @private
         */
        refreshActive() {
            var tabpanels = this._elements["tabpanel"];
            var tabs = this._elements["tab"];

            if (tabpanels) {
                if (Array.isArray(tabpanels)) {
                    for (var i = 0; i < tabpanels.length; i++) {
                        if (i === parseInt(this._active)) {
                            tabpanels[i].classList.add(selectors.active.tabpanel);
                            tabpanels[i].removeAttribute("aria-hidden");
                            tabs[i].classList.add(selectors.active.tab);
                            tabs[i].setAttribute("aria-selected", true);
                            tabs[i].setAttribute("tabindex", "0");
                        } else {
                            tabpanels[i].classList.remove(selectors.active.tabpanel);
                            tabpanels[i].setAttribute("aria-hidden", true);
                            tabs[i].classList.remove(selectors.active.tab);
                            tabs[i].setAttribute("aria-selected", false);
                            tabs[i].setAttribute("tabindex", "-1");
                        }
                    }
                } else {
                    // only one tab
                    tabpanels.classList.add(selectors.active.tabpanel);
                    tabs.classList.add(selectors.active.tab);
                }
            }
        }

        /**
         * Focuses the element and prevents scrolling the element into view
         *
         * @param {HTMLElement} element Element to focus
         */
        focusWithoutScroll(element) {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            element.focus();
            window.scrollTo(x, y);
        }

        /**
         * Navigates to the tab at the provided index
         *
         * @private
         * @param {Number} index The index of the tab to navigate to
         */
        navigate(index) {
            this._active = index;
            this.refreshActive();
        }

        /**
         * Navigates to the item at the provided index and ensures the active tab gains focus
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         */
        navigateAndFocusTab(index) {
            var exActive = this._active;
            this.navigate(index);
            this.focusWithoutScroll(this._elements["tab"][index]);
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Tabs({element, formContainer})
    }, Tabs.selectors.self);

}());
