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

    class Accordion extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "accordion";
        static bemBlock = 'cmp-accordion'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            item: `.${Accordion.bemBlock}__item`,
            button: `.${Accordion.bemBlock}__button`,
            panel: `.${Accordion.bemBlock}__panel`
        };

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

        static keyCodes = {
            ENTER: 13,
            SPACE: 32,
            END: 35,
            HOME: 36,
            ARROW_LEFT: 37,
            ARROW_UP: 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN: 40
        };

        static dataAttributes = {
            item: {
                expanded: "data-cmp-expanded"
            }
        };

        constructor(params) {
            super(params);
            var that = this;
            // cache items and their buttons and panels
            this._elements = {};
            this._elements.self = this.element;
            var hooks = this._elements.self.querySelectorAll("[data-" + Accordion.NS + "-hook-" + Accordion.IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("." + Accordion.NS + "-" + Accordion.IS) === this._elements.self) { // only process own accordion elements
                    var capitalized = Accordion.IS;
                    capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                    var key = hook.dataset[Accordion.NS + "Hook" + capitalized];
                    if (this._elements[key]) {
                        this._elements[key].push(hook);
                    } else {
                        this._elements[key] = [hook];
                    }
                }
            }

            var buttons = that._elements["button"];
            if (buttons) {
                for (var i = 0; i < buttons.length; i++) {
                    (function(index) {
                        buttons[i].addEventListener("click", function(event) {
                            that.toggleItemAtIndex(index);
                            that.focusButton(index);
                        });
                        buttons[i].addEventListener("keydown", function(event) {
                            that.onButtonKeyDown(event, index);
                        });
                    })(i);
                }
            }

            if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                /*
                 * Editor message handling:
                 * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                 * - check that the message data panel container type is correct and that the id (path) matches this specific Accordion component
                 * - if so, route the "navigate" operation to enact a navigation of the Accordion based on index data
                 */
                window.CQ.CoreComponents.MESSAGE_CHANNEL = window.CQ.CoreComponents.MESSAGE_CHANNEL || new window.Granite.author.MessageChannel("cqauthor", window);
                window.CQ.CoreComponents.MESSAGE_CHANNEL.subscribeRequestMessage("cmp.panelcontainer", function(message) {
                    if (message.data && message.data.type === "cmp-accordion" && message.data.id === that.element.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate") {
                            that.toggleItemAtIndex(message.data.index);
                        }
                    }
                });
            }

            this.refreshItems();
        }

        getClass() {
            return Accordion.IS;
        }

        setFocus() {
            this.setActive();
        }

        getItemButton(item) {
            return item.querySelector(Accordion.selectors.button);
        }

        getItemPanel(item) {
            return item.querySelector(Accordion.selectors.panel);
        }

        getItems() {
            return this.element.querySelectorAll(Accordion.selectors.item);
        }

        /**
         * Handles button keydown events.
         *
         * @private
         * @param {Object} event The keydown event
         * @param {Number} index The index of the button triggering the event
         */
        onButtonKeyDown(event, index) {
            var lastIndex = this._elements["button"].length - 1;

            switch (event.keyCode) {
                case Accordion.keyCodes.ARROW_LEFT:
                case Accordion.keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        this.focusButton(index - 1);
                    }
                    break;
                case Accordion.keyCodes.ARROW_RIGHT:
                case Accordion.keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        this.focusButton(index + 1);
                    }
                    break;
                case Accordion.keyCodes.HOME:
                    event.preventDefault();
                    this.focusButton(0);
                    break;
                case Accordion.keyCodes.END:
                    event.preventDefault();
                    this.focusButton(lastIndex);
                    break;
                case Accordion.keyCodes.ENTER:
                case Accordion.keyCodes.SPACE:
                    event.preventDefault();
                    this.toggleItemAtIndex(index);
                    this.focusButton(index);
                    break;
                default:
                    return;
            }
        }

        /**
         * General handler for toggle of an item.
         *
         * @private
         * @param {Number} index The index of the item to toggle
         */
        toggleItemAtIndex(index) {
            var item = this._elements["item"][index];
            if (item) {
                // ensure only a single item is expanded
                for (var i = 0; i < this._elements["item"].length; i++) {
                    if (this._elements["item"][i] !== item) {
                        var expanded = this.getItemExpanded(this._elements["item"][i]);
                        if (expanded) {
                            this.setItemExpanded(this._elements["item"][i], false);
                        }
                    }
                }
                this.setItemExpanded(item, !this.getItemExpanded(item));
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
            var index = this._elements["item"].indexOf(item);
            var delay = 100;
            if (index > -1) {
                var button = this._elements["button"][index];
                var panel = this._elements["panel"][index];
                button.classList.add(Accordion.cssClasses.button.expanded);
                // used to fix some known screen readers issues in reading the correct state of the 'aria-expanded' attribute
                // e.g. https://bugs.webkit.org/show_bug.cgi?id=210934
                setTimeout(function() {
                    button.setAttribute("aria-expanded", true);
                }, delay);
                panel.classList.add(Accordion.cssClasses.panel.expanded);
                panel.classList.remove(Accordion.cssClasses.panel.hidden);
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
            var index = this._elements["item"].indexOf(item);
            var delay = 100;
            if (index > -1) {
                var button = this._elements["button"][index];
                var panel = this._elements["panel"][index];
                button.classList.remove(Accordion.cssClasses.button.expanded);
                // used to fix some known screen readers issues in reading the correct state of the 'aria-expanded' attribute
                // e.g. https://bugs.webkit.org/show_bug.cgi?id=210934
                setTimeout(function() {
                    button.setAttribute("aria-expanded", false);
                }, delay);
                panel.classList.add(Accordion.cssClasses.panel.hidden);
                panel.classList.remove(Accordion.cssClasses.panel.expanded);
                panel.setAttribute("aria-hidden", true);
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

            for (var i = 0; i < this._elements["item"].length; i++) {
                var item = this._elements["item"][i];
                var expanded = this.getItemExpanded(item);
                if (expanded) {
                    expandedItems.push(item);
                }
            }

            return expandedItems;
        }

        /**
         * Focuses the button at the provided index.
         *
         * @private
         * @param {Number} index The index of the button to focus
         */
        focusButton(index) {
            var button = this._elements["button"][index];
            button.focus();
        }

        /**
         * Refreshes an item based on its expanded state.
         *
         * @private
         * @param {HTMLElement} item The item to refresh
         */
        refreshItem(item) {
            var expanded = this.getItemExpanded(item);
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
            for (var i = 0; i < this._elements["item"].length; i++) {
                this.refreshItem(this._elements["item"][i]);
            }
        }

        /**
         * Gets an item's expanded state.
         *
         * @private
         * @param {HTMLElement} item The item for checking its expanded state
         * @returns {Boolean} true if the item is expanded, false otherwise
         */
        getItemExpanded(item) {
            return item && item.dataset && item.dataset["cmpExpanded"] !== undefined;
        }

        /**
         * Sets an item's expanded state based on the provided flag and refreshes its internals.
         *
         * @private
         * @param {HTMLElement} item The item to mark as expanded, or not expanded
         * @param {Boolean} expanded true to mark the item expanded, false otherwise
         * @param {Boolean} keepHash true to keep the hash in the URL, false to update it
         */
        setItemExpanded(item, expanded) {
            if (expanded) {
                item.setAttribute(Accordion.dataAttributes.item.expanded, "");
            } else {
                item.removeAttribute(Accordion.dataAttributes.item.expanded);
            }
            this.refreshItem(item);
        }


        setModel(model) {
            super.setModel(model);
        }

    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Accordion({element, formContainer})
    }, Accordion.selectors.self);
})();
