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

    const AccordionMixin = window.CQ.FormsCoreComponents.AccordionMixin;

    class Accordion extends AccordionMixin(FormView.FormPanel) {

        static NS = FormView.Constants.NS;
        static DATA_ATTRIBUTE_VISIBLE = 'data-cmp-visible';
        _templateHTML = {};
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${Accordion.bemBlock}__widget`,
            description: `.${Accordion.bemBlock}__longdescription`,
            qm: `.${Accordion.bemBlock}__questionmark`,
            tooltipDiv: `.${Accordion.bemBlock}__shortdescription`,
            label: `.${Accordion.bemBlock}__label`,
            item: `.${Accordion.bemBlock}__item`
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

        constructor(params) {
            super(params);
            const {element} = params;
            this._cacheElements(element);
            if (this._getCachedItems()) {
                var expandedItems = this._getExpandedItems();
                // multiple expanded items annotated, display the last item open.
                if (expandedItems.length > 1) {
                    var lastExpandedItem = expandedItems[expandedItems.length - 1]
                    this._expandItem(lastExpandedItem);
                    this._collapseAllOtherItems(lastExpandedItem.id);
                }
                this._refreshItems();
                this.#bindEvents();
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
            const item = this._getItemById(id + '-item');
            this._expandItem(item)
        }


        #collapseAllItems() {
            var items = this._getCachedItems();
            if (items) {
                for (var i = 0; i < items.length; i++) {
                    if (this._isItemExpanded(items[i])) {
                        this._collapseItem(items[i])
                    }
                }
            }
        }

        /**
         * Binds Accordion event handling.
         *
         * @private
         */
        #bindEvents() {
            var buttons = this._getCachedButtons();
            if (buttons) {
                var _self = this;
                for (var i = 0; i < buttons.length; i++) {
                    (function (index) {
                        buttons[index].addEventListener("click", function (event) {
                            var itemDivId = _self.#convertToItemDivId(buttons[index].id);
                            _self._toggle(itemDivId);
                            _self._collapseAllOtherItems(itemDivId);
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
                _self._toggle(itemDivId);
                _self._collapseAllOtherItems(itemDivId);
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
            var buttons = this._getCachedButtons();
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
                    this._toggle(itemDivId);
                    this._collapseAllOtherItems(itemDivId);
                    this.#focusButton(buttons[index].id);
                    break;
                default:
                    return;
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
            if (this.getCountOfAllChildrenInModel() === this.children.length) {
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
            this.#showHideRepeatableButtons(instanceManager);
            return accordionItemDivToBeRepeated;
        }

        handleChildAddition(childView) {
            var itemDivToExpand;
            this._cacheElements(this._elements.self);
            this.#bindEventsToAddedChild(childView.id);
            if (childView.getInstanceManager().getModel().minOccur != undefined && childView.getInstanceManager().children.length > childView.getInstanceManager().getModel().minOccur) {
                itemDivToExpand = this._getItemById(childView.id + Accordion.idSuffixes.item);
            } else {
                //this will run at initial runtime loading when the repeatable panel is being added minOccur no of times.
                // in this case we want the focus to stay at first tab
                itemDivToExpand = this.findFirstVisibleChild(this._getCachedItems());
            }
            this._expandItem(itemDivToExpand);
            this._collapseAllOtherItems(itemDivToExpand.id);
            this.#showHideRepeatableButtons(childView.getInstanceManager());
        }

        handleChildRemoval(removedInstanceView) {
            var removedAccordionItemDivId = removedInstanceView.element.id + Accordion.idSuffixes.item;
            var removedAccordionItemDiv = this._getItemById(removedAccordionItemDivId);
            removedAccordionItemDiv.remove();
            this.children.splice(this.children.indexOf(removedInstanceView), 1);
            this._cacheElements(this._elements.self);
            var cachedItems = this._getCachedItems();
            if (cachedItems && cachedItems.length > 0) {
                var firstItem = cachedItems[0];
                this._expandItem(firstItem);
                this._collapseAllOtherItems(firstItem.id);
            }
            this.#showHideRepeatableButtons(removedInstanceView.getInstanceManager());
        }

        #syncLabel() {
          let labelElement = typeof this.getLabel === 'function' ? this.getLabel() : null;
          if (labelElement) {
              labelElement.setAttribute('for', this.getId());
          }
        }

        syncMarkupWithModel() {
            super.syncMarkupWithModel();
            this.#syncLabel();
            for (var itemDiv of this._getCachedItems()) {
                this.#syncAccordionMarkup(itemDiv);
            }
        }

        getChildViewByIndex(index) {
            var accordionPanels = this._getCachedPanels();
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
                    result.beforeViewElement = this._getCachedItems()[indexToInsert - 1];
                } else {
                    result.parentElement = this.element;
                }
            } else {
                var previousInstanceElement = instanceManager.children[instanceIndex - 1].element;
                var previousInstanceItemDiv = this._getItemById(previousInstanceElement.id + Accordion.idSuffixes.item);
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
            var accordionAdd = accordionItemDiv.querySelector(".cmp-accordion__add-button");
            if(accordionAdd){
              accordionAdd.setAttribute('data-cmp-hook-add-instance', childViewId);
            }
            var accordionRemove = accordionItemDiv.querySelector(".cmp-accordion__remove-button");
            if(accordionRemove){
              accordionRemove.setAttribute('data-cmp-hook-remove-instance', childViewId);
            }
        }

        #cacheTemplateHTML(childView) {
            if (childView.getInstanceManager() != null && (this._templateHTML == null || this._templateHTML[childView.getInstanceManager().getId()] == null)) {
                var accordionItemDivId = childView.element.id + Accordion.idSuffixes.item;
                var instanceManagerId = childView.getInstanceManager().getId();
                var accordionItemDiv = this._getItemById(accordionItemDivId);
                this._templateHTML[instanceManagerId] = {};
                this._templateHTML[instanceManagerId]['accordionItemDiv'] = accordionItemDiv;
            }
        }

        #getButtonById(buttonId) {
            var buttons = this._getCachedButtons();
            if (buttons) {
                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i].id === buttonId) {
                        return buttons[i];
                    }
                }
            }
        }

        #getButtonIndexById(buttonId) {
            var buttons = this._getCachedButtons();
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
            this.updateVisibilityOfNavigationElement(this._getItemById(state.id + Accordion.idSuffixes.item), visible);
            if (!visible) {
                var expandedItems = this._getExpandedItems();
                for (let i = 0; i < expandedItems.length; i++) {
                    if (expandedItems[i].getAttribute(Accordion.DATA_ATTRIBUTE_VISIBLE) === 'false') {
                        this._collapseItem(expandedItems[i]);
                    }
                }
                let child = this.findFirstVisibleChild(this._getCachedItems());
                if (child) {
                    this._expandItem(child);
                }
            }
        }
        getRepeatableRootElement(childView){
          return this.element.querySelector('#'+childView.id+'-item div[data-cmp-hook-adaptiveFormAccordion="repeatableButton"]')
        }
        #showHideRepeatableButtons(instanceManager){
          const {_model: {minOccur, maxOccur, items = [] } = {}, children} = instanceManager;
          children.forEach(child=>{
            const addButtonElement = this.element.querySelector('#'+child.id+'-item')?.querySelector('[data-cmp-hook-add-instance]');
            const removeButtonElement = this.element.querySelector('#'+child.id+'-item')?.querySelector('[data-cmp-hook-remove-instance]');
            if(addButtonElement){
              addButtonElement.setAttribute(Accordion.DATA_ATTRIBUTE_VISIBLE, !(items.length === maxOccur && maxOccur != -1))
            }
            if(removeButtonElement){
              removeButtonElement.setAttribute(Accordion.DATA_ATTRIBUTE_VISIBLE, items.length > minOccur && minOccur != -1)
            }
          });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Accordion({element, formContainer})
    }, Accordion.selectors.self);
})();
