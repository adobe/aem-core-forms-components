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

import {Constants} from "../constants.js";
import FormPanel from "./FormPanel.js";

export default class FormTabs extends FormPanel {

    static keyCodes = {
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    #_active;
    #_IS;
    #_NS;
    #_selectors;
    #tabIdSuffix = "__tab";
    #tabPanelIdSuffix = "__tabpanel";
    _templateHTML = {};

    constructor(params, ns, is, selectors) {
        super(params);
        this.#_NS = ns;
        this.#_IS = is;
        this.#_selectors = selectors;
        const {element} = params;
        this.#cacheElements(element);
        this.#_active = this.getActiveTabId(this.#getCachedTabs());
        this.#refreshActive();
        this.#bindEvents();
    }

    /**
     * Refreshes the tab markup based on the current {@code Tabs#_active} index
     */
    #refreshActive() {
        var tabpanels = this.#getCachedTabPanels();
        var tabs = this.#getCachedTabs();
        if (tabpanels) {
            for (var i = 0; i < tabpanels.length; i++) {
                if (tabs[i].id === this.#_active) {
                    tabpanels[i].classList.add(this.#_selectors.active.tabpanel);
                    tabpanels[i].removeAttribute(Constants.ARIA_HIDDEN);
                    tabs[i].classList.add(this.#_selectors.active.tab);
                    tabs[i].setAttribute(Constants.ARIA_SELECTED, true);
                    tabs[i].setAttribute(Constants.TABINDEX, "0");
                } else {
                    tabpanels[i].classList.remove(this.#_selectors.active.tabpanel);
                    tabpanels[i].setAttribute(Constants.ARIA_HIDDEN, true);
                    tabs[i].classList.remove(this.#_selectors.active.tab);
                    tabs[i].setAttribute(Constants.ARIA_SELECTED, false);
                    tabs[i].setAttribute(Constants.TABINDEX, "-1");
                }
            }
        }
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
                        _self.navigateAndFocusTab(tabs[index].id);
                    });
                }(i));
                tabs[i].addEventListener("keydown", function (event) {
                    _self.#onKeyDown(event);
                });
            }
            ;
        }
    }

    /**
     * Caches the Tabs elements as defined via the {@code data-tabs-hook="ELEMENT_NAME"} markup API
     *
     * @private
     * @param {HTMLElement} wrapper The Tabs wrapper element
     * @param {string} ns Namespace
     * @param {string} is IS
     *
     */
    #cacheElements(wrapper) {
        this._elements = {};
        this._elements.self = wrapper;
        var hooks = this._elements.self.querySelectorAll("[data-" + this.#_NS + "-hook-" + this.#_IS + "]");

        for (var i = 0; i < hooks.length; i++) {
            var hook = hooks[i];
            if (hook.closest("[data-cmp-is=" + this.#_IS + "]") === this._elements.self) { // only process own tab elements
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
            case FormTabs.keyCodes.ARROW_LEFT:
            case FormTabs.keyCodes.ARROW_UP:
                event.preventDefault();
                if (index > 0) {
                    this.navigateAndFocusTab(tabs[index - 1].id);
                }
                break;
            case FormTabs.keyCodes.ARROW_RIGHT:
            case FormTabs.keyCodes.ARROW_DOWN:
                event.preventDefault();
                if (index < lastIndex) {
                    this.navigateAndFocusTab(tabs[index + 1].id);
                }
                break;
            case FormTabs.keyCodes.HOME:
                event.preventDefault();
                this.navigateAndFocusTab(tabs[0].id);
                break;
            case FormTabs.keyCodes.END:
                event.preventDefault();
                this.navigateAndFocusTab(tabs[lastIndex].id);
                break;
            default:
                return;
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

    /**
     * Navigates to the item at the provided index and ensures the active tab gains focus
     *
     * @private
     * @param {Number} index The index of the item to navigate to
     */
    navigateAndFocusTab(tabId) {
        this.navigate(tabId);
        this.focusWithoutScroll(this.#getTabNavElementById(tabId));
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
    navigate(tabId) {
        this.#_active = tabId;
        this.#refreshActive();
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

    #syncTabLabels() {
        var tabs = this.#getCachedTabs();
        var tabPanels = this.#getCachedTabPanels();
        if (tabPanels) {
            for (var i = 0; i < tabPanels.length; i++) {
                var childViewId = tabPanels[i].querySelectorAll("[data-cmp-is]")[0].id;
                tabs[i].id = childViewId + this.#tabIdSuffix;
                tabs[i].setAttribute("aria-controls", childViewId + this.#tabPanelIdSuffix);
            }
        }
    }

    #syncTabPanels() {
        var tabPanels = this.#getCachedTabPanels();
        if (tabPanels) {
            for (var i = 0; i < tabPanels.length; i++) {
                var childViewId = tabPanels[i].querySelectorAll("[data-cmp-is]")[0].id;
                tabPanels[i].id = childViewId + this.#tabPanelIdSuffix;
                tabPanels[i].setAttribute("aria-labelledby", childViewId + this.#tabIdSuffix);
            }
        }
    }

    syncMarkupWithModel() {
        super.syncMarkupWithModel();
        this.#syncTabLabels();
        this.#syncTabPanels();
    }

    handleChildAddition(childView) {
        if (childView.getInstanceManager() != null && this._templateHTML[childView.getInstanceManager().getId()] != null) {
            var navigationTabToBeRepeated = this._templateHTML[childView.getInstanceManager().getId()]['navigationTab'].cloneNode(true);
            navigationTabToBeRepeated.id = childView.id + this.#tabIdSuffix;
            navigationTabToBeRepeated.setAttribute("aria-controls", childView.id + this.#tabPanelIdSuffix);
            var instanceIndex = childView.getModel().index;
            var instanceManagerId = childView.getInstanceManager().getId();
            if (instanceIndex == 0) {
                var closestNonRepeatableFieldId = this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'];
                var closestRepeatableFieldInstanceManagerIds = this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'];
                var indexToInsert = this.getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds);
                if (indexToInsert == 0) {
                    var tabListParentElement = this.#getTabListElement();
                    tabListParentElement.insertBefore(navigationTabToBeRepeated, tabListParentElement.firstChild);
                } else {
                    var beforeElement = this.#getCachedTabs()[indexToInsert - 1];
                    beforeElement.after(navigationTabToBeRepeated);
                }
            } else {
                var beforeTabNavElementId = childView.getInstanceManager().children[instanceIndex - 1].element.id + this.#tabIdSuffix
                var beforeElement = this.#getTabNavElementById(beforeTabNavElementId);
                beforeElement.after(navigationTabToBeRepeated);
            }
            this.#cacheElements(this._elements.self);
            var repeatedTabPanel = this.#getTabPanelElementById(childView.id + this.#tabPanelIdSuffix);
            repeatedTabPanel.setAttribute("aria-labelledby", childView.id + this.#tabIdSuffix);
            this.#refreshActive();
            this.#bindEventsToTab(navigationTabToBeRepeated.id);
            this.navigateAndFocusTab(navigationTabToBeRepeated.id);
        }
    }

    handleChildRemoval(removedInstanceView) {
        var removedTabPanelId = removedInstanceView.element.id + this.#tabPanelIdSuffix;
        var removedTabNavId = removedInstanceView.element.id + this.#tabIdSuffix;
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
            this.cacheClosestFieldsInView();
            this.handleHiddenChildrenVisibility();
        }
    }

    #cacheTemplateHTML(childView) {
        if (childView.getInstanceManager() != null && (this._templateHTML == null || this._templateHTML[childView.getInstanceManager().getId()] == null)) {
            var tabId = childView.element.id + this.#tabIdSuffix;
            var tabPanelId = childView.element.id + this.#tabPanelIdSuffix;
            var instanceManagerId = childView.getInstanceManager().getId();
            var navigationTabToBeRepeated = this.#getTabNavElementById(tabId);
            var tabPanelToBeRepeated = this.#getTabPanelElementById(tabPanelId);
            this._templateHTML[instanceManagerId] = {};
            this._templateHTML[instanceManagerId]['navigationTab'] = navigationTabToBeRepeated;
            this._templateHTML[instanceManagerId]['targetTabPanel'] = tabPanelToBeRepeated;
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

    #bindEventsToTab(tabId) {
        var _self = this;
        var tabs = this.#getCachedTabs();
        var index = this.#getTabIndexById(tabId);
        tabs[index].addEventListener("click", function (event) {
            _self.navigateAndFocusTab(tabId);
        });
        tabs[index].addEventListener("keydown", function (event) {
            _self.#onKeyDown(event);
        });
    }

    #getTabListElement() {
        return this.element.querySelector(this.#_selectors.olTabList)
    }

    #getCachedTabPanels() {
        return this._elements["tabpanel"]
    }

    #getCachedTabs() {
        return this._elements["tab"];
    }

    /**
     * Adds unique HTML for added instance corresponding to requirements of different types of repeatableParent
     * @param instanceManager of the repeated component
     * @param addedModel of the repeated component
     * @param htmlElement of the repeated component
     */
    addRepeatableMarkup(instanceManager, addedModel, htmlElement) {
        let elementToEnclose = this._templateHTML[instanceManager.getId()]['targetTabPanel'].cloneNode(false);
        elementToEnclose.id = addedModel.id + this.#tabPanelIdSuffix;
        let result = this.#getBeforeViewElement(instanceManager, addedModel.index);
        let beforeViewElement = result.beforeViewElement;
        beforeViewElement.after(elementToEnclose);
        elementToEnclose.append(htmlElement);
    }

    #getBeforeViewElement(instanceManager, instanceIndex) {
        var result = {};
        var instanceManagerId = instanceManager.getId();
        if (instanceIndex == 0) {
            var closestNonRepeatableFieldId = this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'];
            var closestRepeatableFieldInstanceManagerIds = this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'];
            var indexToInsert = this.getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds);
            if (indexToInsert > 0) {
                result.beforeViewElement = this.#getCachedTabPanels()[indexToInsert - 1];
            } else {
                result.beforeViewElement = this.#getTabListElement();
            }
        } else {
            var previousInstanceElement = instanceManager.children[instanceIndex - 1].element;
            var previousInstanceTabPanelIndex = this.#getTabIndexById(previousInstanceElement.id + this.#tabIdSuffix);
            result.beforeViewElement = this.#getCachedTabPanels()[previousInstanceTabPanelIndex];
        }
        return result;
    }


    getChildViewByIndex(index) {
        var allTabPanels = this.#getCachedTabPanels();
        var fieldId = allTabPanels[index].id.substring(0, allTabPanels[index].id.lastIndexOf("__"));
        return this.getChild(fieldId);
    }

    updateChildVisibility(visible, state) {
        this.updateVisibilityOfNavigationElement(this.#getTabNavElementById(state.id + this.#tabIdSuffix), visible);
        var activeTabId = this.getActiveTabId(this._elements["tab"]);
        if (!visible && activeTabId === state.id + this.#tabIdSuffix) {
            let child = this.findFirstVisibleChild(this.#getCachedTabs());
            if (child) {
                this.navigateAndFocusTab(child.id)
            }
        }
    }

}
