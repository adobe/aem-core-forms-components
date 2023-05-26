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
(function () {

    class Accordion extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormAccordion";
        static bemBlock = 'cmp-accordion';
        static DATA_ATTRIBUTE_VISIBLE = 'data-cmp-visible';
        _templateHTML = {};
        static selectors = {
            self: `.${Accordion.bemBlock}`,
            description: `.${Accordion.bemBlock}__longdescription`,
            qm: `.${Accordion.bemBlock}__questionmark`,
            tooltipDiv: `.${Accordion.bemBlock}__shortdescription`,
            label: `.${Accordion.bemBlock}__label`,
            item: `.${Accordion.bemBlock}__item`
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

        static delay = 100;

        static dataAttributes = {
            item: {
                expanded: "data-cmp-expanded"
            }
        };

        constructor(params) {
            super(params);
            const {element} = params;
            this.#cacheElements(element);
            if (this.#getCachedItems()) {
                var expandedItems = this.#getExpandedItems();
                // multiple expanded items annotated, display the last item open.
                if (expandedItems.length > 1) {
                    var lastExpandedItem = expandedItems[expandedItems.length - 1]
                    this.#expandItem(lastExpandedItem);
                    this.#collapseAllOtherItems(lastExpandedItem.id);
                }
                this.#refreshItems();
                this.#bindEvents();
            }
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
                        if (message.data.operation === "navigate") {
                            _self.#toggle(_self.#getCachedItems()[message.data.index].id);
                            _self.#collapseAllOtherItems(_self.#getCachedItems()[message.data.index].id);
                        }
                    }
                });
            }
        }

        getClass() {
            return Accordion.IS;
        }

        getWidget() {
            return null;
        }

        getDescription() {
            return this.element.querySelector(Accordion.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(Accordion.selectors.label);
        }

        getErrorDiv() {
            return null;
        }

        getTooltipDiv() {
            return this.element.querySelector(Accordion.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Accordion.selectors.qm);
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
            this.#collapseAllItems();
            const item = this.#getItemById(id + '-item');
            this.#expandItem(item)
        }

        #collapseAllItems() {
            var items = this.#getCachedItems();
            if (items) {
                for (var i = 0; i < items.length; i++) {
                    if (this.#isItemExpanded(items[i])) {
                        this.#collapseItem(items[i])
                    }
                }
            }
        }

        /**
         * Caches the Accordion elements as defined via the {@code data-accordion-hook="ELEMENT_NAME"} markup API.
         *
         * @private
         * @param {HTMLElement} wrapper The Accordion wrapper element
         */
        #cacheElements(wrapper) {
            this._elements = {};
            this._elements.self = wrapper;
            var hooks = this._elements.self.querySelectorAll("[data-" + Accordion.NS + "-hook-" + Accordion.IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("[data-cmp-is=" + Accordion.IS + "]") === this._elements.self) { // only process own accordion elements
                    var lowerCased = Accordion.IS.toLowerCase();
                    var capitalized = lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
                    var key = hook.dataset[Accordion.NS + "Hook" + capitalized];
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
         * Returns all expanded items.
         *
         * @private
         * @returns {HTMLElement[]} The expanded items
         */
        #getExpandedItems() {
            var expandedItems = [];

            for (var i = 0; i < this.#getCachedItems().length; i++) {
                var item = this.#getCachedItems()[i];
                var expanded = this.#isItemExpanded(item);
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
        #isItemExpanded(item) {
            return item && item.dataset && item.dataset["cmpExpanded"] !== undefined;
        }

        /**
         * Binds Accordion event handling.
         *
         * @private
         */
        #bindEvents() {
            var buttons = this.#getCachedButtons();
            if (buttons) {
                var _self = this;
                for (var i = 0; i < buttons.length; i++) {
                    (function (index) {
                        buttons[index].addEventListener("click", function (event) {
                            var itemDivId = _self.#convertToItemDivId(buttons[index].id);
                            _self.#toggle(itemDivId);
                            _self.#collapseAllOtherItems(itemDivId);
                            _self.#focusButton(buttons[index].id);
                        });
                        buttons[index].addEventListener("keydown", function (event) {
                            _self.#onButtonKeyDown(event, buttons[index].id);
                        });
                    })(i);
                }
            }
        }

        /**
         * Binds Accordion event handling.
         *
         * @private
         */
        #bindEventsToAddedChild(addedChildId) {
            var _self = this;
            var buttonId = addedChildId + Accordion.idSuffixes.button;
            var button = this.#getButtonById(buttonId);
            button.addEventListener("click", function (event) {
                var itemDivId = _self.#convertToItemDivId(buttonId);
                _self.#toggle(itemDivId);
                _self.#collapseAllOtherItems(itemDivId);
                _self.#focusButton(buttonId);
            });
            button.addEventListener("keydown", function (event) {
                _self.#onButtonKeyDown(event, buttonId);
            });
        }

        /**
         * Handles button keydown events.
         *
         * @private
         * @param {Object} event The keydown event
         * @param {Number} id The id of the button triggering the event
         */
        #onButtonKeyDown(event, id) {
            var buttons = this.#getCachedButtons();
            var lastIndex = buttons.length - 1;
            var index = this.#getButtonIndexById(id);

            switch (event.keyCode) {
                case Accordion.keyCodes.ARROW_LEFT:
                case Accordion.keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        this.#focusButton(buttons[index - 1].id);
                    }
                    break;
                case Accordion.keyCodes.ARROW_RIGHT:
                case Accordion.keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        this.#focusButton(buttons[index + 1].id);
                    }
                    break;
                case Accordion.keyCodes.HOME:
                    event.preventDefault();
                    this.#focusButton(buttons[0].id);
                    break;
                case Accordion.keyCodes.END:
                    event.preventDefault();
                    this.#focusButton(buttons[lastIndex].id);
                    break;
                case Accordion.keyCodes.ENTER:
                case Accordion.keyCodes.SPACE:
                    event.preventDefault();
                    var itemDivId = this.#convertToItemDivId(buttons[index].id);
                    this.#toggle(itemDivId);
                    this.#collapseAllOtherItems(itemDivId);
                    this.#focusButton(buttons[index].id);
                    break;
                default:
                    return;
            }
        }

        /**
         * General handler for toggle of an item.
         *
         * @private
         * @param {Number} id The id of the item to toggle
         */
        #toggle(id) {
            var itemToToggle = this.#getItemById(id);
            if (itemToToggle) {
                (this.#isItemExpanded(itemToToggle) === false) ? this.#expandItem(itemToToggle) : this.#collapseItem(itemToToggle);
            }
        }

        /**
         * Refreshes an item based on its expanded state.
         *
         * @private
         * @param {HTMLElement} item The item to refresh
         */
        #refreshItem(item) {
            var expanded = this.#isItemExpanded(item);
            if (expanded) {
                this.#expandItem(item);
            } else {
                this.#collapseItem(item);
            }
        }

        /**
         * Refreshes all items based on their expanded state.
         *
         * @private
         */
        #refreshItems() {
            for (var i = 0; i < this.#getCachedItems().length; i++) {
                this.#refreshItem(this.#getCachedItems()[i]);
            }
        }


        /**
         * Annotates the item and its internals with
         * the necessary style and accessibility attributes to indicate it is expanded.
         *
         * @private
         * @param {HTMLElement} item The item to annotate as expanded
         */
        #expandItem(item) {
            var index = this.#getCachedItems().indexOf(item);
            if (index > -1) {
                item.setAttribute(Accordion.dataAttributes.item.expanded, "");
                var button = this.#getCachedButtons()[index];
                var panel = this.#getCachedPanels()[index];
                button.classList.add(Accordion.cssClasses.button.expanded);
                // used to fix some known screen readers issues in reading the correct state of the 'aria-expanded' attribute
                // e.g. https://bugs.webkit.org/show_bug.cgi?id=210934
                setTimeout(function () {
                    button.setAttribute("aria-expanded", true);
                }, Accordion.delay);
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
        #collapseItem(item) {
            var index = this.#getCachedItems().indexOf(item);
            if (index > -1) {
                item.removeAttribute(Accordion.dataAttributes.item.expanded);
                var button = this.#getCachedButtons()[index];
                var panel = this.#getCachedPanels()[index];
                button.classList.remove(Accordion.cssClasses.button.expanded);
                // used to fix some known screen readers issues in reading the correct state of the 'aria-expanded' attribute
                // e.g. https://bugs.webkit.org/show_bug.cgi?id=210934
                setTimeout(function () {
                    button.setAttribute("aria-expanded", false);
                }, Accordion.delay);
                panel.classList.add(Accordion.cssClasses.panel.hidden);
                panel.classList.remove(Accordion.cssClasses.panel.expanded);
                panel.setAttribute("aria-hidden", true);
            }
        }

        /**
         * Focuses the button at the provided index.
         *
         * @private
         * @param {Number} id The id of the button to focus
         */
        #focusButton(id) {
            var button = this.#getButtonById(id);
            button.focus();
        }

        addChild(childView) {
            super.addChild(childView);
            this.#cacheTemplateHTML(childView);
            if (this.getModel()._children.length === this.children.length) {
                this.cacheClosestFieldsInView();
                this.handleHiddenChildrenVisibility();
            }
        }

        /**
         * Adds unique HTML for added instance corresponding to requirements of different types of repeatableParent
         * @param instanceManager of the repeated component
         * @param addedModel of the repeated component
         * @param htmlElement of the repeated component
         */
        addRepeatableMarkup(instanceManager, addedModel, htmlElement) {
            var accordionItemDivToBeRepeated = this.#prepareAccordionMarkupToBeAdded(instanceManager, addedModel, htmlElement);
            let result = this.#getBeforeViewElement(instanceManager, addedModel.index);
            if (result.beforeViewElement != null) {
                result.beforeViewElement.after(accordionItemDivToBeRepeated);
            } else if (result.parentElement != null) {
                var firstChildAccordionItem = result.parentElement.querySelector(Accordion.selectors.item);
                if (firstChildAccordionItem != null) {
                    result.parentElement.insertBefore(accordionItemDivToBeRepeated, firstChildAccordionItem);
                } else {
                    result.parentElement.append(accordionItemDivToBeRepeated);
                }
            }
        }

        handleChildAddition(childView) {
            this.#cacheElements(this._elements.self);
            var addedItemDiv = this.#getItemById(childView.id + Accordion.idSuffixes.item);
            this.#bindEventsToAddedChild(childView.id);
            this.#expandItem(addedItemDiv);
            this.#collapseAllOtherItems(addedItemDiv.id);
        }

        handleChildRemoval(removedInstanceView) {
            var removedAccordionItemDivId = removedInstanceView.element.id + Accordion.idSuffixes.item;
            var removedAccordionItemDiv = this.#getItemById(removedAccordionItemDivId);
            removedAccordionItemDiv.remove();
            this.children.splice(this.children.indexOf(removedInstanceView), 1);
            this.#cacheElements(this._elements.self);
            var cachedItems = this.#getCachedItems();
            if (cachedItems && cachedItems.length > 0) {
                var firstItem = cachedItems[0];
                this.#expandItem(firstItem);
                this.#collapseAllOtherItems(firstItem.id);
            }
        }

        syncMarkupWithModel() {
            super.syncMarkupWithModel();
            for (var itemDiv of this.#getCachedItems()) {
                this.#syncAccordionMarkup(itemDiv);
            }
        }

        getChildViewByIndex(index) {
            var accordionPanels = this.#getCachedPanels();
            var fieldId = accordionPanels[index].id.substring(0, accordionPanels[index].id.lastIndexOf("-"));
            return this.getChild(fieldId);
        }

        #getBeforeViewElement(instanceManager, instanceIndex) {
            var result = {};
            var instanceManagerId = instanceManager.getId();
            if (instanceIndex == 0) {
                var closestNonRepeatableFieldId = this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'];
                var closestRepeatableFieldInstanceManagerIds = this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'];
                var indexToInsert = this.getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds);
                if (indexToInsert > 0) {
                    result.beforeViewElement = this.#getCachedItems()[indexToInsert - 1];
                } else {
                    result.parentElement = this.element;
                }
            } else {
                var previousInstanceElement = instanceManager.children[instanceIndex - 1].element;
                var previousInstanceItemDiv = this.#getItemById(previousInstanceElement.id + Accordion.idSuffixes.item);
                result.beforeViewElement = previousInstanceItemDiv;
            }
            return result;
        }

        #prepareAccordionMarkupToBeAdded(instanceManager, addedModel, htmlElement) {
            var accordionItemDivToBeRepeated = this._templateHTML[instanceManager.getId()]['accordionItemDiv'].cloneNode(true);
            var itemDivId = accordionItemDivToBeRepeated.id;
            var accordionPanelId = this.#convertToPanelId(itemDivId);
            var accordionPanelToBeRepeated = accordionItemDivToBeRepeated.querySelector('#' + accordionPanelId);
            while (accordionPanelToBeRepeated.hasChildNodes()) {
                accordionPanelToBeRepeated.removeChild(accordionPanelToBeRepeated.firstChild);
            }
            accordionPanelToBeRepeated.append(htmlElement);
            this.#syncAccordionMarkup(accordionItemDivToBeRepeated);
            return accordionItemDivToBeRepeated;
        }

        #syncAccordionMarkup(accordionItemDiv) {
            var accordionItemDivId = accordionItemDiv.id;
            var accordionPanelId = this.#convertToPanelId(accordionItemDivId);
            var accordionButtonId = this.#convertToButtonId(accordionItemDivId);
            var accordionButton = accordionItemDiv.querySelector('#' + accordionButtonId);
            var accordionPanelDiv = accordionItemDiv.querySelector('#' + accordionPanelId);
            var childViewId = accordionItemDiv.querySelector("[data-cmp-is]").id;
            accordionItemDiv.id = childViewId + Accordion.idSuffixes.item;
            accordionButton.id = childViewId + Accordion.idSuffixes.button;
            accordionPanelDiv.id = childViewId + Accordion.idSuffixes.panel;
            accordionButton.setAttribute("aria-controls", childViewId + Accordion.idSuffixes.panel);
            accordionPanelDiv.setAttribute("aria-labelledby", childViewId + Accordion.idSuffixes.button);
        }

        #cacheTemplateHTML(childView) {
            if (childView.getInstanceManager() != null && (this._templateHTML == null || this._templateHTML[childView.getInstanceManager().getId()] == null)) {
                var accordionItemDivId = childView.element.id + Accordion.idSuffixes.item;
                var instanceManagerId = childView.getInstanceManager().getId();
                var accordionItemDiv = this.#getItemById(accordionItemDivId);
                this._templateHTML[instanceManagerId] = {};
                this._templateHTML[instanceManagerId]['accordionItemDiv'] = accordionItemDiv;
            }
        }

        #collapseAllOtherItems(itemId) {
            var itemToToggle = this.#getItemById(itemId);
            var itemList = this.#getCachedItems();
            for (var i = 0; i < itemList.length; i++) {
                if (itemList[i] !== itemToToggle) {
                    var expanded = this.#isItemExpanded(itemList[i]);
                    if (expanded) {
                        this.#collapseItem(this.#getCachedItems()[i]);
                    }
                }
            }
        }


        #getCachedItems() {
            return (this._elements[Accordion.cacheKeys.itemKey] != null) ? this._elements[Accordion.cacheKeys.itemKey] : [];
        }

        #getCachedPanels() {
            return this._elements[Accordion.cacheKeys.panelKey];
        }

        #getCachedButtons() {
            return this._elements[Accordion.cacheKeys.buttonKey]
        }

        #getItemById(itemId) {
            var items = this.#getCachedItems();
            if (items) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].id === itemId) {
                        return items[i];
                    }
                }
            }
        }

        #getButtonById(buttonId) {
            var buttons = this.#getCachedButtons();
            if (buttons) {
                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i].id === buttonId) {
                        return buttons[i];
                    }
                }
            }
        }

        #getButtonIndexById(buttonId) {
            var buttons = this.#getCachedButtons();
            if (buttons) {
                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i].id === buttonId) {
                        return i;
                    }
                }
            }
            return -1;
        }

        /**
         * Changes provided panel or buttonId to ItemId
         *
         * @private
         * @param {Number} id The id of the panel/button to convert to corresponding item div
         */
        #convertToItemDivId(idToConvert) {
            return idToConvert.substring(0, idToConvert.lastIndexOf("-")) + Accordion.idSuffixes.item;
        }

        /**
         * Changes provided panel or item id to Button Id
         *
         * @private
         * @param {Number} id The id of the panel/item to convert to corresponding button id
         */
        #convertToButtonId(idToConvert) {
            return idToConvert.substring(0, idToConvert.lastIndexOf("-")) + Accordion.idSuffixes.button;
        }

        /**
         * Changes provided button or item id to Panel Id
         *
         * @private
         * @param {Number} id The id of the button/item to convert to corresponding button id
         */
        #convertToPanelId(idToConvert) {
            return idToConvert.substring(0, idToConvert.lastIndexOf("-")) + Accordion.idSuffixes.panel;
        }

        updateChildVisibility(visible, state) {
            this.updateVisibilityOfNavigationElement(this.#getItemById(state.id + Accordion.idSuffixes.item), visible);
            if (!visible) {
                var expandedItems = this.#getExpandedItems();
                for (let i = 0; i < expandedItems.length; i++) {
                    if (expandedItems[i].getAttribute(Accordion.DATA_ATTRIBUTE_VISIBLE) === 'false') {
                        this.#collapseItem(expandedItems[i]);
                    }
                }
                let child = this.findFirstVisibleChild(this.#getCachedItems());
                if (child) {
                    this.#expandItem(child);
                }
            }
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Accordion({element, formContainer})
    }, Accordion.selectors.self);
})();
