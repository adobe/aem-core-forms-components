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

    function AccordionMixin(Base) {
        return class extends Base {
            static NS = "cmp";
            static IS = "adaptiveFormAccordion";
            static bemBlock = 'cmp-accordion';
            static selectors = {
                self: "[data-" + this.NS + '-is="' + this.IS + '"]'
            };


            static idSuffixes = {
                item: "-item",
                button: "-button",
                panel: "-panel"
            }

            static cacheKeys = {
                buttonKey: "button",
                panelKey: "panel",
                itemKey: "item"
            }

            static cssClasses = {
                button: {
                    disabled: "cmp-accordion__button--disabled",
                    expanded: "cmp-accordion__button--expanded"
                },
                panel: {
                    hidden: "cmp-accordion__panel--hidden",
                    expanded: "cmp-accordion__panel--expanded"
                }
            };

            static delay = 100;

            static dataAttributes = {
                item: {
                    expanded: "data-cmp-expanded"
                }
            };

            constructor(params) {
                super(params);
            }

            getCachedItems() {
                return (this._elements[this.constructor.cacheKeys.itemKey] != null) ? this._elements[this.constructor.cacheKeys.itemKey] : [];
            }

            getCachedPanels() {
                return this._elements[this.constructor.cacheKeys.panelKey];
            }

            getCachedButtons() {
                return this._elements[this.constructor.cacheKeys.buttonKey]
            }

            getItemById(itemId) {
                var items = this.getCachedItems();
                if (items) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].id === itemId) {
                            return items[i];
                        }
                    }
                }
            }


            /**
             * Returns all expanded items.
             *
             * @private
             * @returns {HTMLElement[]} The expanded items
             */
            getExpandedItems() {
                var expandedItems = [];

                for (var i = 0; i < this.getCachedItems().length; i++) {
                    var item = this.getCachedItems()[i];
                    var expanded = this.isItemExpanded(item);
                    if (expanded) {
                        expandedItems.push(item);
                    }
                }

                return expandedItems;
            }

            /**
             * Gets an item's expanded state.
             *
             * @private
             * @param {HTMLElement} item The item for checking its expanded state
             * @returns {Boolean} true if the item is expanded, false otherwise
             */
            isItemExpanded(item) {
                return item && item.dataset && item.dataset["cmpExpanded"] !== undefined;
            }

            /**
             * Caches the Accordion elements as defined via the {@code data-accordion-hook="ELEMENT_NAME"} markup API.
             *
             * @private
             * @param {HTMLElement} wrapper The Accordion wrapper element
             */
            cacheElements(wrapper) {
                this._elements = {};
                this._elements.self = wrapper;
                var hooks = this._elements.self.querySelectorAll("[data-" + this.constructor.NS + "-hook-" + this.constructor.IS + "]");

                for (var i = 0; i < hooks.length; i++) {
                    var hook = hooks[i];
                    if (hook.closest("[data-cmp-is=" + this.constructor.IS + "]") === this._elements.self) { // only process own accordion elements
                        var lowerCased = this.constructor.IS.toLowerCase();
                        var capitalized = lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
                        var key = hook.dataset[this.constructor.NS + "Hook" + capitalized];
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

            collapseAllOtherItems(itemId) {
                var itemToToggle = this.getItemById(itemId);
                var itemList = this.getCachedItems();
                for (var i = 0; i < itemList.length; i++) {
                    if (itemList[i] !== itemToToggle) {
                        var expanded = this.isItemExpanded(itemList[i]);
                        if (expanded) {
                            this.collapseItem(this.getCachedItems()[i]);
                        }
                    }
                }
            }

            /**
             * General handler for toggle of an item.
             *
             * @private
             * @param {Number} id The id of the item to toggle
             */
            toggle(id) {
                var itemToToggle = this.getItemById(id);
                if (itemToToggle) {
                    (this.isItemExpanded(itemToToggle) === false) ? this.expandItem(itemToToggle) : this.collapseItem(itemToToggle);
                }
            }


            /**
             * Refreshes an item based on its expanded state.
             *
             * @private
             * @param {HTMLElement} item The item to refresh
             */
            refreshItem(item) {
                var expanded = this.isItemExpanded(item);
                if (expanded) {
                    this.expandItem(item);
                } else {
                    this.collapseItem(item);
                }
            }

            /**
             * Refreshes all items based on their expanded state.
             *
             * @private
             */
            refreshItems() {
                for (var i = 0; i < this.getCachedItems().length; i++) {
                    this.refreshItem(this.getCachedItems()[i]);
                }
            }


            /**
             * Annotates the item and its internals with
             * the necessary style and accessibility attributes to indicate it is expanded.
             *
             * @private
             * @param {HTMLElement} item The item to annotate as expanded
             */
            expandItem(item) {
                var index = this.getCachedItems().indexOf(item);
                if (index > -1) {
                    item.setAttribute(this.constructor.dataAttributes.item.expanded, "");
                    var button = this.getCachedButtons()[index];
                    var panel = this.getCachedPanels()[index];
                    button.classList.add(this.constructor.cssClasses.button.expanded);
                    // used to fix some known screen readers issues in reading the correct state of the 'aria-expanded' attribute
                    // e.g. https://bugs.webkit.org/show_bug.cgi?id=210934
                    setTimeout(function () {
                        button.setAttribute("aria-expanded", true);
                    }, this.constructor.delay);
                    panel.classList.add(this.constructor.cssClasses.panel.expanded);
                    panel.classList.remove(this.constructor.cssClasses.panel.hidden);
                    panel.setAttribute("aria-hidden", false);
                }
            }

            /**
             * Annotates the item and its internals with
             * the necessary style and accessibility attributes to indicate it is not expanded.
             *
             * @private
             * @param {HTMLElement} item The item to annotate as not expanded
             */
            collapseItem(item) {
                var index = this.getCachedItems().indexOf(item);
                if (index > -1) {
                    item.removeAttribute(this.constructor.dataAttributes.item.expanded);
                    var button = this.getCachedButtons()[index];
                    var panel = this.getCachedPanels()[index];
                    button.classList.remove(this.constructor.cssClasses.button.expanded);
                    // used to fix some known screen readers issues in reading the correct state of the 'aria-expanded' attribute
                    // e.g. https://bugs.webkit.org/show_bug.cgi?id=210934
                    setTimeout(function () {
                        button.setAttribute("aria-expanded", false);
                    }, this.constructor.delay);
                    panel.classList.add(this.constructor.cssClasses.panel.hidden);
                    panel.classList.remove(this.constructor.cssClasses.panel.expanded);
                    panel.setAttribute("aria-hidden", true);
                }
            }
        }
    }

    window.Forms = window.Forms || {};
    window.Forms.CoreComponentsCommons = window.Forms.CoreComponentsCommons || {};
    window.Forms.CoreComponentsCommons.AccordionMixin = AccordionMixin;

}());
