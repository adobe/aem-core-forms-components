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


    class Wizard extends FormView.FormPanel {

        _templateHTML = {};
        #_active;

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormWizard";
        static bemBlock = "cmp-adaptiveform-wizard";
        static #tabIdSuffix = "_wizard-item-nav";
        static #wizardPanelIdSuffix = "__wizardpanel";
        static DATA_ATTRIBUTE_VISIBLE = 'data-cmp-visible';

        static selectors = {
            self: "[data-" + Wizard.NS + '-is="' + Wizard.IS + '"]',
            active: {
                tab: "cmp-adaptiveform-wizard__tab--active",
                wizardpanel: "cmp-adaptiveform-wizard__wizardpanel--active"
            },
            label: `.${Wizard.bemBlock}__label`,
            description: `.${Wizard.bemBlock}__longdescription`,
            qm: `.${Wizard.bemBlock}__questionmark`,
            widget: `.${Wizard.bemBlock}__widget`,
            tooltipDiv: `.${Wizard.bemBlock}__shortdescription`,
            previousButton: `.${Wizard.bemBlock}__previousNav`,
            nextButton: `.${Wizard.bemBlock}__nextNav`,
            olTabList: `.${Wizard.bemBlock}__tabList`
        };

        constructor(params) {
            super(params);
            const {element} = params;
            this.#cacheElements(element);

            this.#setActive(this.#getCachedTabs())
            this.#_active = this.#getActiveIndex(this.#getCachedTabs());
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
                    if (message.data && message.data.type === "cmp-adaptiveform-wizard" && message.data.id === _self._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate") {
                            _self.#navigate(message.data.index);
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
            var hooks = this._elements.self.querySelectorAll("[data-" + Wizard.NS + "-hook-" + Wizard.IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("[data-cmp-is=" + Wizard.IS + "]") === this._elements.self) { // only process own tab elements
                    var key = hook.dataset[Wizard.NS + "Hook" + "Adaptiveformwizard"];
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
            return Wizard.IS;
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
            const index = this.#getTabIndexById(id + '_wizard-item-nav');
            this.#navigate(index);
        }

        getWidget() {
            return this.element.querySelector(Wizard.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(Wizard.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(Wizard.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(Wizard.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(Wizard.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Wizard.selectors.qm);
        }

        getPreviousButtonDiv() {
            return this.element.querySelector(Wizard.selectors.previousButton);
        }

        getNextButtonDiv() {
            return this.element.querySelector(Wizard.selectors.nextButton);
        }

        #getTabListElement() {
            return this.element.querySelector(Wizard.selectors.olTabList)
        }


        /**
         * Binds navigation buttons event handling
         *
         * @private
         */
        #bindEvents() {
            var _self = this;
            this.getNextButtonDiv().addEventListener("click", function (event) {
                _self.#navigateToNextTab();
            })
            this.getPreviousButtonDiv().addEventListener("click", function (event) {
                _self.#navigateToPreviousTab();
            })


        }

        /**
         * Returns the index of the active tab, if no tab is active returns 0
         *
         * @param {Array} tabs Tab elements
         * @returns {Number} Index of the active tab, 0 if none is active
         */
        #getActiveIndex(tabs) {
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].classList.contains(Wizard.selectors.active.tab)) {
                        return i;
                    }
                }
            }
            return 0;
        }


        #setActive(tabs) {
            if (tabs) {
                tabs[0].classList.add(Wizard.selectors.active.tab);
            }
        }

        /**
         * Handles tab keydown events
         *
         * @private
         * @param {Object} event The keydown event
         */
        #onKeyDown(event) {
            var index = this.#_active;

            var lastIndex = this.#getCachedTabs().length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        this.#navigateAndFocusTab(index - 1);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        this.#navigateAndFocusTab(index + 1);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    this.#navigateAndFocusTab(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    this.#navigateAndFocusTab(lastIndex);
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
            var wizardPanels = this.#getCachedWizardPanels();
            var tabs = this.#getCachedTabs();
            if (wizardPanels) {
                for (var i = 0; i < wizardPanels.length; i++) {
                    if (i === parseInt(this.#_active)) {
                        wizardPanels[i].classList.add(Wizard.selectors.active.wizardpanel);
                        wizardPanels[i].removeAttribute(FormView.Constants.ARIA_HIDDEN);
                        tabs[i].classList.add(Wizard.selectors.active.tab);
                        tabs[i].setAttribute(FormView.Constants.ARIA_SELECTED, true);
                        tabs[i].setAttribute(FormView.Constants.TABINDEX, "0");
                    } else {
                        wizardPanels[i].classList.remove(Wizard.selectors.active.wizardpanel);
                        wizardPanels[i].setAttribute(FormView.Constants.ARIA_HIDDEN, true);
                        tabs[i].classList.remove(Wizard.selectors.active.tab);
                        tabs[i].setAttribute(FormView.Constants.ARIA_SELECTED, false);
                        tabs[i].setAttribute(FormView.Constants.TABINDEX, "-1");
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


        #navigateToNextTab() {
            var activeIndex = this.#_active;
            var activeTabElement = this.#getCachedTabs()[activeIndex];
            var activeChildId = activeTabElement.id.substring(0, activeTabElement.id.lastIndexOf(Wizard.#tabIdSuffix));
            var activeChildView = this.getChild(activeChildId);
            var validationErrorList = activeChildView.getModel().validate();
            if (validationErrorList === undefined || validationErrorList.length == 0) {
                var tabs = this.#getCachedTabs();
                var nextVisibleIndex = this.#findNextVisibleChildIndex(activeIndex);
                if (tabs && nextVisibleIndex >= 0) {
                    this.#navigateAndFocusTab(nextVisibleIndex);
                }
            }
        }


        #navigateToPreviousTab() {
            var activeIndex = this.#_active;
            var tabs = this.#getCachedTabs();
            var lastVisibleIndex = this.#findLastVisibleChildIndex(activeIndex);
            if (tabs && lastVisibleIndex >= 0) {
                this.#navigateAndFocusTab(lastVisibleIndex);
            }
        }

        #findNextVisibleChildIndex(currentIndex) {
            var tabs = this.#getCachedTabs();
            for (var i = currentIndex + 1; i < tabs.length; i++) {
                let isVisible = tabs[i].getAttribute(Wizard.DATA_ATTRIBUTE_VISIBLE);
                if (isVisible === null || isVisible === 'true') {
                    return i;
                }
            }
            return -1;
        }

        #findLastVisibleChildIndex(currentIndex) {
            var tabs = this.#getCachedTabs();
            for (var i = currentIndex - 1; i >= 0; i--) {
                let isVisible = tabs[i].getAttribute(Wizard.DATA_ATTRIBUTE_VISIBLE);
                if (isVisible === null || isVisible === 'true') {
                    return i;
                }
            }
            return -1;
        }


        /**
         * Navigates to the tab at the provided index
         *
         * @private
         * @param {Number} index The index of the tab to navigate to
         */
        #navigate(index) {
            this.#_active = index;
            this.#refreshActive();
        }

        /**
         * Navigates to the item at the provided index and ensures the active tab gains focus
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         */
        #navigateAndFocusTab(index) {
            this.#navigate(index);
            this.focusWithoutScroll(this.#getCachedTabs()[index]);
        }

        #syncWizardNavLabels() {
            var tabs = this.#getCachedTabs();
            var wizardPanels = this.#getCachedWizardPanels();
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    var id = wizardPanels[i].querySelectorAll("[data-cmp-is]")[0].id;
                    tabs[i].id = id + Wizard.#tabIdSuffix;
                    tabs[i].setAttribute("aria-controls", id + Wizard.#wizardPanelIdSuffix);
                }
            }
        }

        #syncWizardPanels() {
            var wizardPanels = this.#getCachedWizardPanels();
            if (wizardPanels) {
                for (var i = 0; i < wizardPanels.length; i++) {
                    var id = wizardPanels[i].querySelectorAll("[data-cmp-is]")[0].id;
                    wizardPanels[i].id = id + Wizard.#wizardPanelIdSuffix;
                    wizardPanels[i].setAttribute("aria-labelledby", id + Wizard.#tabIdSuffix);
                }
            }
        }

        syncMarkupWithModel() {
            super.syncMarkupWithModel();
            this.#syncWizardNavLabels();
            this.#syncWizardPanels();
        }

        handleChildAddition(childView) {
            if (childView.getInstanceManager() != null && this._templateHTML[childView.getInstanceManager().getId()] != null) {
                var navigationTabToBeRepeated = this._templateHTML[childView.getInstanceManager().getId()]['navigationTab']
                    .cloneNode(true);
                navigationTabToBeRepeated.id = childView.id + Wizard.#tabIdSuffix;
                navigationTabToBeRepeated.setAttribute("aria-controls", childView.id + Wizard.#wizardPanelIdSuffix);
                var instanceIndex = childView.getModel().index;
                var instanceManagerId = childView.getInstanceManager().getId()
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
                    var beforeTabNavElementId = childView.getInstanceManager().children[instanceIndex - 1].element.id + Wizard.#tabIdSuffix
                    var beforeElement = this.#getTabNavElementById(beforeTabNavElementId);
                    beforeElement.after(navigationTabToBeRepeated);
                }
                this.#cacheElements(this._elements.self);
                var repeatedWizardPanel = this.#getWizardPanelElementById(childView.id + Wizard.#wizardPanelIdSuffix);
                repeatedWizardPanel.setAttribute("aria-labelledby", childView.id + Wizard.#tabIdSuffix);
                this.#refreshActive();
                this.#getTabIndexById()
                this.#navigateAndFocusTab(this.#getTabIndexById(navigationTabToBeRepeated.id));
            }
        }

        handleChildRemoval(removedInstanceView) {
            var removedTabPanelId = removedInstanceView.element.id + Wizard.#wizardPanelIdSuffix;
            var removedTabNavId = removedTabPanelId.substring(0, removedTabPanelId.lastIndexOf("__")) + Wizard.#tabIdSuffix;
            var wizardPanelElement = this.#getWizardPanelElementById(removedTabPanelId);
            var tabNavElement = this.#getTabNavElementById(removedTabNavId);
            tabNavElement.remove();
            wizardPanelElement.remove();
            this.children.splice(this.children.indexOf(removedInstanceView), 1);
            this.#cacheElements(this._elements.self);
            this.#_active = this.#getActiveIndex(this.#getCachedTabs());
            this.#refreshActive();
        }

        addChild(childView) {
            super.addChild(childView);
            this.#cacheTemplateHTML(childView);
            //when all children are available in view
            if (this.getModel()._children.length === this.children.length) {
                this.cacheClosestFieldsInView();
                this.handleHiddenChildrenVisibility();
            }
        }

        getChildViewByIndex(index) {
            var wizardPanels = this.#getCachedWizardPanels();
            var fieldId = wizardPanels[index].id.substring(0, wizardPanels[index].id.lastIndexOf("__"));
            return this.getChild(fieldId);
        }

        /**
         * Adds unique HTML for added instance corresponding to requirements of different types of repeatableParent
         * @param instanceManager of the repeated component
         * @param addedModel of the repeated component
         * @param htmlElement of the repeated component
         */
        addRepeatableMarkup(instanceManager, addedModel, htmlElement) {
            let elementToEnclose = this._templateHTML[instanceManager.getId()]['targetWizardPanel'].cloneNode(false);
            elementToEnclose.id = addedModel.id + Wizard.#wizardPanelIdSuffix;
            let result = this.#getBeforeViewElement(instanceManager, addedModel.index);
            let beforeViewElement = result.beforeViewElement;
            beforeViewElement.after(elementToEnclose);
            elementToEnclose.append(htmlElement.querySelector('#' + addedModel.id));
        }

        #cacheTemplateHTML(childView) {
            if (childView.getInstanceManager() != null && (this._templateHTML == null || this._templateHTML[childView.getInstanceManager().getId()] == null)) {
                var tabId = childView.element.id + Wizard.#tabIdSuffix;
                var wizardPanelId = childView.element.id + Wizard.#wizardPanelIdSuffix;
                var instanceManagerId = childView.getInstanceManager().getId();
                var navigationTabToBeRepeated = this.#getTabNavElementById(tabId);
                var wizardPanelToBeRepeated = this.#getWizardPanelElementById(wizardPanelId)
                this._templateHTML[instanceManagerId] = {};
                this._templateHTML[instanceManagerId]['navigationTab'] = navigationTabToBeRepeated;
                this._templateHTML[instanceManagerId]['targetWizardPanel'] = wizardPanelToBeRepeated;
            }
        }

        #getCachedTabs() {
            return this._elements["tab"];
        }

        #getCachedWizardPanels() {
            return this._elements["wizardpanel"]
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

        #getWizardPanelElementById(wizardPanelId) {
            var wizardPanels = this.#getCachedWizardPanels();
            if (wizardPanels) {
                for (var i = 0; i < wizardPanels.length; i++) {
                    if (wizardPanels[i].id === wizardPanelId) {
                        return wizardPanels[i];
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

        #getBeforeViewElement(instanceManager, instanceIndex) {
            var result = {};
            var instanceManagerId = instanceManager.getId();
            if (instanceIndex == 0) {
                var closestNonRepeatableFieldId = this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'];
                var closestRepeatableFieldInstanceManagerIds = this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'];
                var indexToInsert = this.getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds);
                var wizardPanels = this.#getCachedWizardPanels();
                if (indexToInsert > 0) {
                    result.beforeViewElement = this.#getWizardPanelElementById(wizardPanels[indexToInsert - 1].id);
                } else {
                    result.beforeViewElement = this.getPreviousButtonDiv();
                }
            } else {
                var previousInstanceElement = instanceManager.children[instanceIndex - 1].element;
                var previousInstanceWizardPanelIndex = this.#getTabIndexById(previousInstanceElement.id + Wizard.#tabIdSuffix);
                result.beforeViewElement = this.#getCachedWizardPanels()[previousInstanceWizardPanelIndex];
            }
            return result;
        }

        updateChildVisibility(visible, state) {
            this.updateVisibilityOfNavigationElement(this.#getTabNavElementById(state.id + Wizard.#tabIdSuffix), visible);
            var activeTabNavElement = this.#getCachedTabs()[this.#_active];
            if (!visible && activeTabNavElement.id === state.id + Wizard.#tabIdSuffix) {
                let child = this.findFirstVisibleChild(this.#getCachedTabs());
                if (child) {
                    this.#navigateAndFocusTab(this.#getTabIndexById(child.id));
                }
            }
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Wizard({element, formContainer})
    }, Wizard.selectors.self);

}());
