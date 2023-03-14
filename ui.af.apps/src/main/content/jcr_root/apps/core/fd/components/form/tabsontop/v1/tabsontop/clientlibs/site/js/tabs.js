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

    var keyCodes = {
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };


    class Tabs extends FormView.FormPanel {
        #_active;
        #_templateHTML = {};
        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormTabs";
        static bemBlock = "cmp-tabs";
        static #tabIdSuffix = "__tab";
        static #tabPanelIdSuffix = "__tabpanel";
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            active: {
                tab: "cmp-tabs__tab--active",
                tabpanel: "cmp-tabs__tabpanel--active"
            },
            label: `.${Tabs.bemBlock}__label`,
            description: `.${Tabs.bemBlock}__longdescription`,
            qm: `.${Tabs.bemBlock}__questionmark`,
            tooltipDiv: `.${Tabs.bemBlock}__shortdescription`,
            olTabList: `.${Tabs.bemBlock}__tablist`
        };

        constructor(params) {
            super(params);
            const {element} = params;
            this.#cacheElements(element);
            this.#_active = this.getActiveTabId(this.#getCachedTabs());
            this.#refreshActive();
            this.#bindEvents();
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
                        if (message.data.operation === "navigate") {
                            _self.#navigate(_self._elements["tab"][message.data.index].id);
                        }
                    }
                });
            }
        }

        /**
         * Caches the Tabs elements as defined via the {@code data-tabs-hook="ELEMENT_NAME"} markup API
         *
         * @private
         * @param {HTMLElement} wrapper The Tabs wrapper element
         */
        #cacheElements(wrapper) {
            this._elements = {};
            this._elements.self = wrapper;
            var hooks = this._elements.self.querySelectorAll("[data-" + Tabs.NS + "-hook-" + Tabs.IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("[data-cmp-is=" + Tabs.IS + "]") === this._elements.self) { // only process own tab elements
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

        getClass() {
            return Tabs.IS;
        }

        setFocus() {
            this.setActive();
        }

        getWidget() {
            return this.element.querySelector(Tabs.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(Tabs.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(Tabs.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(Tabs.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(Tabs.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Tabs.selectors.qm);
        }

        #getTabListElement() {
            return this.element.querySelector(Tabs.selectors.olTabList)
        }

        #syncTabLabels() {
            var tabs = this.#getCachedTabs();
            var tabPanels = this.#getCachedTabPanels();
            if (tabPanels) {
                for (var i = 0; i < tabPanels.length; i++) {
                    var childViewId = tabPanels[i].querySelectorAll(
                        '[data-cmp-adaptiveformcontainer-path="' + this.options['adaptiveformcontainerPath'] + '"]')[0].id;
                    tabs[i].id = childViewId + Tabs.#tabIdSuffix;
                    tabs[i].setAttribute("aria-controls", childViewId + Tabs.#tabPanelIdSuffix);
                }
            }
        }

        #syncTabPanels() {
            var tabPanels = this.#getCachedTabPanels();
            if (tabPanels) {
                for (var i = 0; i < tabPanels.length; i++) {
                    var childViewId = tabPanels[i].querySelectorAll(
                        '[data-cmp-adaptiveformcontainer-path="' + this.options['adaptiveformcontainerPath'] + '"]')[0].id;
                    tabPanels[i].id = childViewId + Tabs.#tabPanelIdSuffix;
                    tabPanels[i].setAttribute("aria-labelledby", childViewId + Tabs.#tabIdSuffix);
                }
            }
        }

        syncMarkupWithModel() {
            super.syncMarkupWithModel();
            this.#syncTabLabels();
            this.#syncTabPanels();
        }

        /**
         * Binds Tabs event handling
         *
         * @private
         */
        #bindEvents() {
            var tabs = this.#getCachedTabs();
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    var _self = this;
                    (function (index) {
                        tabs[index].addEventListener("click", function (event) {
                            _self.#navigateAndFocusTab(tabs[index].id);
                        });
                    }(i));
                    tabs[i].addEventListener("keydown", function (event) {
                        _self.#onKeyDown(event);
                    });
                }
                ;
            }
        }

        #bindEventsToTab(tabId) {
            var _self = this;
            var tabs = this.#getCachedTabs();
            var index = this.#getTabIndexById(tabId);
            tabs[index].addEventListener("click", function (event) {
                _self.#navigateAndFocusTab(tabId);
            });
            tabs[index].addEventListener("keydown", function (event) {
                _self.#onKeyDown(event);
            });
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
         * Handles tab keydown events
         *
         * @private
         * @param {Object} event The keydown event
         */
        #onKeyDown(event) {
            var index = this.#getTabIndexById(this.#_active);
            var tabs = this.#getCachedTabs();
            var lastIndex = tabs.length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        this.#navigateAndFocusTab(tabs[index - 1].id);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        this.#navigateAndFocusTab(tabs[index + 1].id);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    this.#navigateAndFocusTab(tabs[0].id);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    this.#navigateAndFocusTab(tabs[lastIndex].id);
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
        #refreshActive() {
            var tabpanels = this.#getCachedTabPanels();
            var tabs = this.#getCachedTabs();
            if (tabpanels) {
                for (var i = 0; i < tabpanels.length; i++) {
                    if (tabs[i].id === this.#_active) {
                        tabpanels[i].classList.add(Tabs.selectors.active.tabpanel);
                        tabpanels[i].removeAttribute(FormView.Constants.ARIA_HIDDEN);
                        tabs[i].classList.add(Tabs.selectors.active.tab);
                        tabs[i].setAttribute(FormView.Constants.ARIA_SELECTED, true);
                        tabs[i].setAttribute(FormView.Constants.TABINDEX, "0");
                    } else {
                        tabpanels[i].classList.remove(Tabs.selectors.active.tabpanel);
                        tabpanels[i].setAttribute(FormView.Constants.ARIA_HIDDEN, true);
                        tabs[i].classList.remove(Tabs.selectors.active.tab);
                        tabs[i].setAttribute(FormView.Constants.ARIA_SELECTED, false);
                        tabs[i].setAttribute(FormView.Constants.TABINDEX, "-1");
                    }
                }
            }
        }

        #getBeforeViewElement(instanceManager, instanceIndex) {
            var result = {};
            var instanceManagerId = instanceManager.getId();
            if (instanceIndex == 0) {
                var closestNonRepeatableFieldId = this.#_templateHTML[instanceManagerId]['closestNonRepeatableFieldId'];
                var closestRepeatableFieldInstanceManagerIds = this.#_templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'];
                var indexToInsert = this.#getTabIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds);
                var tabPanels = this.#getCachedTabPanels();
                if (indexToInsert > 0) {
                    result.beforeViewElement = this.#getTabPanelElementById(tabPanels[indexToInsert - 1].id);
                } else {
                    result.beforeViewElement = this.#getTabListElement();
                }
            } else {
                var previousInstanceElement = instanceManager.children[instanceIndex - 1].element;
                var previousInstanceTabPanelIndex = this.#getTabIndexById(previousInstanceElement.id + Tabs.#tabIdSuffix);
                result.beforeViewElement = this.#getCachedTabPanels()[previousInstanceTabPanelIndex];
            }
            result.elementToEnclose = this.#_templateHTML[instanceManagerId]['targetTabPanel'].cloneNode(false);
            result.idSuffix = Tabs.#tabPanelIdSuffix;
            return result;
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
        #navigate(tabId) {
            this.#_active = tabId;
            this.#refreshActive();
        }

        /**
         * Navigates to the item at the provided index and ensures the active tab gains focus
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         */
        #navigateAndFocusTab(tabId) {
            var exActive = this.#_active;
            this.#navigate(tabId);
            this.focusWithoutScroll(this.#getTabNavElementById(tabId));
        }

        handleChildAddition(childView) {
            if (childView.getInstanceManager() != null && this.#_templateHTML[childView.getInstanceManager().getId()] != null) {
                var navigationTabToBeRepeated = this.#_templateHTML[childView.getInstanceManager().getId()]['navigationTab'].cloneNode(true);
                navigationTabToBeRepeated.id = childView.id + Tabs.#tabIdSuffix;
                navigationTabToBeRepeated.setAttribute("aria-controls", childView.id + Tabs.#tabPanelIdSuffix);
                var instanceIndex = childView.getModel().index;
                var instanceManagerId = childView.getInstanceManager().getId();
                if (instanceIndex == 0) {
                    var closestNonRepeatableFieldId = this.#_templateHTML[instanceManagerId]['closestNonRepeatableFieldId'];
                    var closestRepeatableFieldInstanceManagerIds = this.#_templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'];
                    var indexToInsert = this.#getTabIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds);
                    if (indexToInsert == 0) {
                        var tabListParentElement = this.#getTabListElement();
                        tabListParentElement.insertBefore(navigationTabToBeRepeated, tabListParentElement.firstChild);
                    } else {
                        var beforeElement = this.#getCachedTabs()[indexToInsert - 1];
                        beforeElement.after(navigationTabToBeRepeated);
                    }
                } else {
                    var beforeTabNavElementId = childView.getInstanceManager().children[instanceIndex - 1].element.id + Tabs.#tabIdSuffix
                    var beforeElement = this.#getTabNavElementById(beforeTabNavElementId);
                    beforeElement.after(navigationTabToBeRepeated);
                }
                this.#cacheElements(this._elements.self);
                var repeatedTabPanel = this.#getTabPanelElementById(childView.id + Tabs.#tabPanelIdSuffix);
                repeatedTabPanel.setAttribute("aria-labelledby", childView.id + Tabs.#tabIdSuffix);
                this.#refreshActive();
                this.#bindEventsToTab(navigationTabToBeRepeated.id);
                this.#navigateAndFocusTab(navigationTabToBeRepeated.id);
            }
        }

        handleChildRemoval(removedInstanceView) {
            var removedTabPanelId = removedInstanceView.element.id + Tabs.#tabPanelIdSuffix;
            var removedTabNavId = removedInstanceView.element.id + Tabs.#tabIdSuffix;
            var tabPanelElement = this.#getTabPanelElementById(removedTabPanelId);
            var tabNavElement = this.#getTabNavElementById(removedTabNavId);
            tabNavElement.remove();
            tabPanelElement.remove();
            this.children.splice(this.children.indexOf(removedInstanceView), 1);
            this.#cacheElements(this._elements.self);
            this.#_active = this.getActiveTabId(this._elements["tab"]);
            this.#refreshActive();
        }

        addChild(childView) {
            super.addChild(childView);
            this.#cacheTemplateHTML(childView);
            if (this.getModel()._children.length === this.children.length) {
                this.#getClosestFieldsInView();
            }
        }

        /**
         * Adds unique HTML for added instance corresponding to requirements of different types of repeatableParent
         * @param instanceManager of the repeated component
         * @param addedModel of the repeated component
         * @param htmlElement of the repeated component
         */
        addRepeatableMarkup(instanceManager, addedModel, htmlElement) {
            let result = this.#getBeforeViewElement(instanceManager, addedModel.index);
            let beforeViewElement = result.beforeViewElement;
            let elementToEnclose = result.elementToEnclose;
            elementToEnclose.id = addedModel.id + result.idSuffix;
            beforeViewElement.after(elementToEnclose);
            elementToEnclose.append(htmlElement);
        }


        #cacheTemplateHTML(childView) {
            if (childView.getInstanceManager() != null && (this.#_templateHTML == null || this.#_templateHTML[childView.getInstanceManager().getId()] == null)) {
                var tabId = childView.element.id + Tabs.#tabIdSuffix;
                var tabPanelId = childView.element.id + Tabs.#tabPanelIdSuffix;
                var instanceManagerId = childView.getInstanceManager().getId();
                var navigationTabToBeRepeated = this.#getTabNavElementById(tabId);
                var tabPanelToBeRepeated = this.#getTabPanelElementById(tabPanelId);
                this.#_templateHTML[instanceManagerId] = {};
                this.#_templateHTML[instanceManagerId]['navigationTab'] = navigationTabToBeRepeated;
                this.#_templateHTML[instanceManagerId]['targetTabPanel'] = tabPanelToBeRepeated;
            }
        }

        #getClosestFieldsInView() {
            var tabPanels = this.#getCachedTabPanels();
            for (let i = 0; i < tabPanels.length; i++) {
                var tabPanel = tabPanels[i];
                var fieldView = this.getChild(tabPanel.id.substring(0, tabPanel.id.lastIndexOf("__")));
                if (fieldView.getInstanceManager() != null && fieldView.getInstanceManager().getModel().minOccur == 0) {
                    var instanceManagerId = fieldView.getInstanceManager().getId();
                    if (this.#_templateHTML[instanceManagerId]['closestNonRepeatableFieldId'] == null &&
                        this.#_templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'] == null) {
                        var result = this.#getClosestFields(i);
                        this.#_templateHTML[instanceManagerId]['closestNonRepeatableFieldId'] = result["closestNonRepeatableFieldId"];
                        this.#_templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'] = result["closestRepeatableFieldInstanceManagerIds"];
                    }
                }
            }
        }


        #getClosestFields(index) {
            var allTabPanels = this.#getCachedTabPanels();
            var result = {};
            result["closestRepeatableFieldInstanceManagerIds"] = [];
            for (let i = index - 1; i >= 0; i--) {
                var fieldId = allTabPanels[i].id.substring(0, allTabPanels[i].id.lastIndexOf("__"));
                var fieldView = this.getChild(fieldId);
                if (fieldView.getInstanceManager() == null) {
                    result["closestNonRepeatableFieldId"] = fieldId;
                    break;
                } else {
                    result["closestRepeatableFieldInstanceManagerIds"].push(fieldView.getInstanceManager().getId());
                    if (fieldView.getInstanceManager().getModel().minOccur != 0) {
                        break;
                    }
                }
            }
            return result;
        }

        #getTabIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds) {
            var tabPanels = this.#getCachedTabPanels();
            var resultIndex = -1;
            if (tabPanels) {
                for (let i = tabPanels.length - 1; i >= 0; i--) {
                    var currentFieldId = tabPanels[i].id.substring(0, tabPanels[i].id.lastIndexOf("__"));
                    if (closestNonRepeatableFieldId === currentFieldId) {
                        resultIndex = i;
                        break;
                    } else {
                        var fieldView = this.getChild(currentFieldId);
                        if (fieldView.getInstanceManager() != null && closestRepeatableFieldInstanceManagerIds.includes(fieldView.getInstanceManager().getId())) {
                            resultIndex = i;
                            break;
                        }
                    }
                }
            }
            return resultIndex + 1;
        }

        #getTabNavElementById(tabId) {
            var tabs = this.#getCachedTabs();
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].id === tabId) {
                        return tabs[i];
                    }
                }
            }
        }

        #getTabPanelElementById(tabPanelId) {
            var tabPanels = this.#getCachedTabPanels();
            if (tabPanels) {
                for (var i = 0; i < tabPanels.length; i++) {
                    if (tabPanels[i].id === tabPanelId) {
                        return tabPanels[i];
                    }
                }
            }
        }

        #getTabIndexById(tabId) {
            var tabs = this.#getCachedTabs();
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].id === tabId) {
                        return i;
                    }
                }
            }
            return -1;
        }

        #getCachedTabs() {
            return this._elements["tab"];
        }

        #getCachedTabPanels() {
            return this._elements["tabpanel"]
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Tabs({element, formContainer})
    }, Tabs.selectors.self);

}());