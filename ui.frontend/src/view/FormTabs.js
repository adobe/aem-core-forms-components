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

/**
 * @module FormView
 */

/**
 * Class representing a FormTabs component.
 * @extends module:FormView~FormPanel
 */
class FormTabs extends FormPanel {

    /**
     * Keycodes for various keyboard keys.
     * @type {object}
     */
    static keyCodes = {
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

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
    /**
     * Suffix for tab IDs.
     * @type {string}
     */
    #tabIdSuffix = "__tab";
    /**
     * Suffix for tab panel IDs.
     * @type {string}
     */
    #tabPanelIdSuffix = "__tabpanel";
    /**
     * Template HTML object.
     * @type {object}
     */
    _templateHTML = {};

    /**
     * Create a FormTabs instance.
     * @param {object} params - The parameters object.
     * @param {HTMLElement} params.element - The element for the FormTabs component.
     * @param {string} ns - The namespace.
     * @param {string} is - The IS.
     * @param {object} selectors - The selectors object.
     */
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
     * Refreshes the tab markup based on the current active index.
     * @private
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
     * Binds Tabs event handling.
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
     * Caches the Tabs elements as defined via the {@code data-tabs-hook="ELEMENT_NAME"} markup API.
     * @private
     * @param {HTMLElement} wrapper - The Tabs wrapper element.
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

    /**
     * Retrieves the index of a tab element by its ID.
     * @param {string} tabId - The ID of the tab element.
     * @returns {number} The index of the tab element, or -1 if not found.
     */
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
     * Navigates to the item at the provided index and ensures the active tab gains focus.
     * @private
     * @param {string} tabId - The ID of the tab to navigate to.
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
     * Focuses the element and prevents scrolling the element into view.
     * @param {HTMLElement} element - Element to focus.
     */
    focusWithoutScroll(element) {
        if(element) {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            element.focus();
            window.scrollTo(x, y);
        }
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


    /**
     * Synchronizes tab labels with their corresponding tab panels.
     * Updates the ID and aria-controls attribute of each tab label.
     * @private
     */
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

    /**
     * Synchronizes tab panels with their corresponding tab labels.
     * Updates the ID and aria-labelledby attribute of each tab panel.
     * @private
     */
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

    /**
     * Synchronizes the markup with the component model.
     * Calls the syncMarkupWithModel method of the superclass.
     * Calls #syncTabLabels and #syncTabPanels methods.
     */
    syncMarkupWithModel() {
        super.syncMarkupWithModel();
        this.#syncTabLabels();
        this.#syncTabPanels();
    }

    /**
     * Handles the addition of a child view.
     * @param {Object} childView - The child view being added.
     * @override
     */
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
            this.#bindEventsToTab(navigationTabToBeRepeated.id);
            this.#refreshActive();
            if (childView.getInstanceManager().getModel().minOccur != undefined && childView.getInstanceManager().children.length > childView.getInstanceManager().getModel().minOccur) {
                this.navigateAndFocusTab(navigationTabToBeRepeated.id);
            } else {
                //this will run at initial loading of runtime and keep the first tab active
                this.navigateAndFocusTab(this.findFirstVisibleChild(this.#getCachedTabs()).id);
            }
        }
    }


    /**
     * Handles the removal of a child view.
     * @param {Object} removedInstanceView - The removed child view.
     * @override
     */
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

    /**
     * Adds a child view.
     * @param {Object} childView - The child view to be added.
     * @override
     */
    addChild(childView) {
        super.addChild(childView);
        this.#cacheTemplateHTML(childView);
        if (this.getCountOfAllChildrenInModel() === this.children.length) {
            this.cacheClosestFieldsInView();
            this.handleHiddenChildrenVisibility();
        }
    }

    /**
     * Caches the HTML template for a child view.
     * @param {Object} childView - The child view.
     * @private
     */
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

    /**
     * Gets the tab panel element by its ID.
     * @param {string} tabPanelId - The ID of the tab panel element.
     * @returns {HTMLElement} The tab panel element.
     * @private
     */
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

    /**
     * Binds events to a tab element.
     * @param {string} tabId - The ID of the tab element.
     * @private
     */
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

    /**
     * Gets the tab list element.
     * @returns {HTMLElement} The tab list element.
     * @private
     */
    #getTabListElement() {
        return this.element.querySelector(this.#_selectors.olTabList)
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
     * Adds unique HTML for an added instance corresponding to the requirements of different types of repeatable parents.
     * @param {Object} instanceManager - The instance manager of the repeated component.
     * @param {Object} addedModel - The added model of the repeated component.
     * @param {HTMLElement} htmlElement - The HTML element of the repeated component.
     * @returns {HTMLElement} The enclosed element containing the added instance HTML.
     */
    addRepeatableMarkup(instanceManager, addedModel, htmlElement) {
        let elementToEnclose = this._templateHTML[instanceManager.getId()]['targetTabPanel'].cloneNode(false);
        elementToEnclose.id = addedModel.id + this.#tabPanelIdSuffix;
        let result = this.#getBeforeViewElement(instanceManager, addedModel.index);
        let beforeViewElement = result.beforeViewElement;
        beforeViewElement.after(elementToEnclose);
        elementToEnclose.append(htmlElement);
        return elementToEnclose;
    }

    /**
     * Gets the element before which a new view should be inserted.
     * @param {Object} instanceManager - The instance manager.
     * @param {number} instanceIndex - The index of the instance.
     * @returns {Object} An object with the before view element.
     * @private
     */
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

    /**
     * Gets the child view at the specified index.
     * @param {number} index - The index of the child view.
     * @returns {Object} The child view at the specified index.
     * @override
     */
    getChildViewByIndex(index) {
        var allTabPanels = this.#getCachedTabPanels();
        var fieldId = allTabPanels[index].id.substring(0, allTabPanels[index].id.lastIndexOf("__"));
        return this.getChild(fieldId);
    }


    /**
     * Updates the visibility of a child element based on the provided state.
     * @param {boolean} visible - The visibility state of the child element.
     * @param {Object} state - The state of the child element.
     * @override
     */
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

export default FormTabs;
