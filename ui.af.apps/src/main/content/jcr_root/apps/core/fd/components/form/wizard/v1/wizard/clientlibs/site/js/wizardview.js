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

    const keyCodes = {
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    const WizardMixin = window.Forms.CoreComponentsCommons.WizardMixin;

    class Wizard extends WizardMixin(FormView.FormPanel) {

        _templateHTML = {};

        static NS = FormView.Constants.NS;
        static #tabIdSuffix = "_wizard-item-nav";
        static #wizardPanelIdSuffix = "__wizardpanel";

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
            previousButtonHidden: "cmp-adaptiveform-wizard__previousNav__hidden",
            nextButton: `.${Wizard.bemBlock}__nextNav`,
            previousButtonV2: `.${Wizard.bemBlock}__nav--previous`,
            nextButtonV2: `.${Wizard.bemBlock}__nav--next`,
            nextButtonHidden: "cmp-adaptiveform-wizard__nextNav__hidden",
            olTabList: `.${Wizard.bemBlock}__tabList`
        };

        constructor(params) {
            super(params);
            const {element} = params;
            this.cacheElements(element);
            this.setActive(this.getCachedTabs())
            this._active = this.getActiveIndex(this.getCachedTabs());
            this.#setNavigationRange();
            this.#hideUnhideNavButtons(this._active);
            this.refreshActive();

            this.#bindEvents();
        }

        getClass() {
            return Wizard.IS;
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
            const index = this.#getTabIndexById(id + '_wizard-item-nav');
            this.navigate(index);
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
            return (this.element.querySelector(Wizard.selectors.previousButton) || this.element.querySelector(Wizard.selectors.previousButtonV2));
        }

        getNextButtonDiv() {
            return (this.element.querySelector(Wizard.selectors.nextButton) || this.element.querySelector(Wizard.selectors.nextButtonV2));
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
            const _self = this;
            this.getNextButtonDiv().addEventListener("click", function (event) {
                _self.#navigateToNextTab();
            })
            this.getPreviousButtonDiv().addEventListener("click", function (event) {
                _self.#navigateToPreviousTab();
            })


        }

        /**
         * Handles tab keydown events
         *
         * @private
         * @param {Object} event The keydown event
         */
        #onKeyDown(event) {
            const index = this._active;

            const lastIndex = this.getCachedTabs().length - 1;

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
         * Refreshes the tab markup based on the current {@code Tabs_active} index
         *
         * @private
         */
        refreshActive() {
            super.refreshActive();
            this.#hideUnhideNavButtons(this._active);
        }

        /**
         * Focuses the element and prevents scrolling the element into view
         *
         * @param {HTMLElement} element Element to focus
         */
        focusWithoutScroll(element) {
            const x = window.scrollX || window.pageXOffset;
            const y = window.scrollY || window.pageYOffset;
            element.focus();
            window.scrollTo(x, y);
        }


        #navigateToNextTab() {
            const activeIndex = this._active;
            const activeTabElement = this.getCachedTabs()[activeIndex];
            const activeChildId = activeTabElement.id.substring(0, activeTabElement.id.lastIndexOf(Wizard.#tabIdSuffix));
            const activeChildView = this.getChild(activeChildId);
            let activeChildModel;
            if(activeChildView) {
                activeChildModel = activeChildView.getModel();
            }
            else {
                activeChildModel = this.getModel().items.find(child => child.id === activeChildId);
            }
            let validationErrorList;
            if (!this.#isAuthoring()) {
                validationErrorList =  activeChildModel.validate();
            }
            if (validationErrorList === undefined || validationErrorList.length == 0) {
                let tabs = this.getCachedTabs();
                let nextVisibleIndex = this.#findNextVisibleChildIndex(activeIndex);
                if (tabs && nextVisibleIndex >= 0) {
                    this.#navigateAndFocusTab(nextVisibleIndex);
                }
            }
            this.#hideUnhideNavButtons(this._active);
        }

        #isAuthoring() {
            return window.Granite && window.Granite.author;
        }

        #navigateToPreviousTab() {
            const activeIndex = this._active;
            const tabs = this.getCachedTabs();
            const lastVisibleIndex = this.#findLastVisibleChildIndex(activeIndex);
            if (tabs && lastVisibleIndex >= 0) {
                this.#navigateAndFocusTab(lastVisibleIndex);
            }
            this.#hideUnhideNavButtons(this._active);
        }

        /**
         * Hides or shows, next and previous navigation buttons
         *
         * @private
         * @param {Number} index The index of the tab to navigate to
         * @param {Number} total number of tabs
         */
        #hideUnhideNavButtons(activeTabIndex) {
            const tabsLength = this.getCachedTabs() ? this.getCachedTabs().length : 0;

            const nextVisible = this.#findNextVisibleChildIndex(activeTabIndex);
            const previousVisible = this.#findLastVisibleChildIndex(activeTabIndex);

            if(tabsLength === 0 || this.maxEnabledTab <= this.minEnabledTab) {
                this.getPreviousButtonDiv().setAttribute(Wizard.DATA_ATTRIBUTE_VISIBLE,"false");
                this.getNextButtonDiv().setAttribute(Wizard.DATA_ATTRIBUTE_VISIBLE,"false");
            }

            if(activeTabIndex <= this.minEnabledTab || previousVisible === -1) {
                this.getPreviousButtonDiv().setAttribute(Wizard.DATA_ATTRIBUTE_VISIBLE,"false");
            }
            if(activeTabIndex === this.maxEnabledTab || nextVisible === -1) {
                this.getNextButtonDiv().setAttribute(Wizard.DATA_ATTRIBUTE_VISIBLE,"false");
            }

            if(tabsLength > 1 && activeTabIndex > this.minEnabledTab && previousVisible > -1) {
                this.getPreviousButtonDiv().setAttribute(Wizard.DATA_ATTRIBUTE_VISIBLE,"true");
            }

            if(activeTabIndex < this.maxEnabledTab && nextVisible > -1) {
                this.getNextButtonDiv().setAttribute(Wizard.DATA_ATTRIBUTE_VISIBLE,"true");
            }
        }

        #setNavigationRange() {
            const wizardPanels = this.getCachedWizardPanels();
            if(wizardPanels) {
                this.maxEnabledTab = wizardPanels.length-1;
                this.minEnabledTab = 0;
                for (let i = 0; i < wizardPanels.length; i++) {
                    if(!this.#childComponentVisible(this.getCachedWizardPanels()[i])) {
                        this.minEnabledTab = i+1;
                    } else {
                        break;
                    }
                }
                for (let i = wizardPanels.length - 1; i >= 0; i--) {
                    if(!this.#childComponentVisible(this.getCachedWizardPanels()[i])) {
                        this.maxEnabledTab = i;
                    } else {
                        break;
                    }
                }
                this.minEnabledTab = Math.max(0, this.minEnabledTab);
                this.maxEnabledTab = Math.min(this.getCachedTabs().length-1, this.maxEnabledTab);
            }
        }

        #childComponentVisible(wizardTab) {
            return wizardTab.children[0].getAttribute('data-cmp-visible') === 'true';
        }

        #findNextVisibleChildIndex(currentIndex) {
            const tabs = this.getCachedTabs();
            const tabsLength = tabs? tabs.length : 0;
            for (let i = currentIndex + 1; i < tabsLength; i++) {
                let isVisible = tabs[i].getAttribute(Wizard.DATA_ATTRIBUTE_VISIBLE);
                if (isVisible === null || isVisible === 'true') {
                    return i;
                }
            }
            return -1;
        }

        #findLastVisibleChildIndex(currentIndex) {
            const tabs = this.getCachedTabs();
            if(tabs) {
                for (let i = currentIndex - 1; i >= 0; i--) {
                    let isVisible = tabs[i].getAttribute(Wizard.DATA_ATTRIBUTE_VISIBLE);
                    if (isVisible === null || isVisible === 'true') {
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
        #navigateAndFocusTab(index) {
            this.navigate(index);
            this.focusWithoutScroll(this.getCachedTabs()[index]);
        }

        #syncWizardNavLabels() {
            const tabs = this.getCachedTabs();
            const wizardPanels = this.getCachedWizardPanels();
            if (tabs) {
                for (let i = 0; i < tabs.length; i++) {
                    let id = wizardPanels[i].querySelectorAll("[data-cmp-is]")[0].id;
                    tabs[i].id = id + Wizard.#tabIdSuffix;
                    tabs[i].setAttribute("aria-controls", id + Wizard.#wizardPanelIdSuffix);
                }
            }
        }

        #syncWizardPanels() {
            const wizardPanels = this.getCachedWizardPanels();
            if (wizardPanels) {
                for (let i = 0; i < wizardPanels.length; i++) {
                    let id = wizardPanels[i].querySelectorAll("[data-cmp-is]")[0].id;
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
                let navigationTabToBeRepeated = this._templateHTML[childView.getInstanceManager().getId()]['navigationTab']
                    .cloneNode(true);
                navigationTabToBeRepeated.id = childView.id + Wizard.#tabIdSuffix;
                navigationTabToBeRepeated.setAttribute("aria-controls", childView.id + Wizard.#wizardPanelIdSuffix);
                let instanceIndex = childView.getModel().index;
                let instanceManagerId = childView.getInstanceManager().getId()
                if (instanceIndex == 0) {
                    let closestNonRepeatableFieldId = this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'];
                    let closestRepeatableFieldInstanceManagerIds = this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'];
                    let indexToInsert = this.getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds);
                    if (indexToInsert == 0) {
                        let tabListParentElement = this.#getTabListElement();
                        tabListParentElement.insertBefore(navigationTabToBeRepeated, tabListParentElement.firstChild);
                    } else {
                        let beforeElement = this.getCachedTabs()[indexToInsert - 1];
                        beforeElement.after(navigationTabToBeRepeated);
                    }
                } else {
                    let beforeTabNavElementId = childView.getInstanceManager().children[instanceIndex - 1].element.id + Wizard.#tabIdSuffix
                    let beforeElement = this.#getTabNavElementById(beforeTabNavElementId);
                    beforeElement.after(navigationTabToBeRepeated);
                }
                this.cacheElements(this._elements.self);
                let repeatedWizardPanel = this.#getWizardPanelElementById(childView.id + Wizard.#wizardPanelIdSuffix);
                repeatedWizardPanel.setAttribute("aria-labelledby", childView.id + Wizard.#tabIdSuffix);
                this.refreshActive();
                this.#getTabIndexById();
                if (childView.getInstanceManager().getModel().minOccur != undefined && childView.getInstanceManager().children.length > childView.getInstanceManager().getModel().minOccur) {
                    this.#navigateAndFocusTab(this.#getTabIndexById(navigationTabToBeRepeated.id));
                }
            }
        }

        handleChildRemoval(removedInstanceView) {
            let removedTabPanelId = removedInstanceView.element.id + Wizard.#wizardPanelIdSuffix;
            let removedTabNavId = removedTabPanelId.substring(0, removedTabPanelId.lastIndexOf("__")) + Wizard.#tabIdSuffix;
            let wizardPanelElement = this.#getWizardPanelElementById(removedTabPanelId);
            let tabNavElement = this.#getTabNavElementById(removedTabNavId);
            tabNavElement.remove();
            wizardPanelElement.remove();
            this.children.splice(this.children.indexOf(removedInstanceView), 1);
            this.cacheElements(this._elements.self);
            this._active = this.getActiveIndex(this.getCachedTabs());
            this.refreshActive();
        }

        addChild(childView) {
            super.addChild(childView);
            this.#cacheTemplateHTML(childView);
            //when all children are available in view
            if (this.getCountOfAllChildrenInModel() === this.children.length) {
                this.cacheClosestFieldsInView();
                this.handleHiddenChildrenVisibility();
            }
            this.#setNavigationRange();
            this.#hideUnhideNavButtons(this._active);
        }

        getChildViewByIndex(index) {
            let wizardPanels = this.getCachedWizardPanels();
            let fieldId = wizardPanels[index].id.substring(0, wizardPanels[index].id.lastIndexOf("__"));
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
            return elementToEnclose;
        }

        #cacheTemplateHTML(childView) {
            if (childView.getInstanceManager() != null && (this._templateHTML == null || this._templateHTML[childView.getInstanceManager().getId()] == null)) {
                let tabId = childView.element.id + Wizard.#tabIdSuffix;
                let wizardPanelId = childView.element.id + Wizard.#wizardPanelIdSuffix;
                let instanceManagerId = childView.getInstanceManager().getId();
                let navigationTabToBeRepeated = this.#getTabNavElementById(tabId);
                let wizardPanelToBeRepeated = this.#getWizardPanelElementById(wizardPanelId)
                this._templateHTML[instanceManagerId] = {};
                this._templateHTML[instanceManagerId]['navigationTab'] = navigationTabToBeRepeated;
                this._templateHTML[instanceManagerId]['targetWizardPanel'] = wizardPanelToBeRepeated;
            }
        }

        #getTabNavElementById(tabId) {
            let tabs = this.getCachedTabs();
            if (tabs) {
                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].id === tabId) {
                        return tabs[i];
                    }
                }
            }
        }

        #getWizardPanelElementById(wizardPanelId) {
            let wizardPanels = this.getCachedWizardPanels();
            if (wizardPanels) {
                for (let i = 0; i < wizardPanels.length; i++) {
                    if (wizardPanels[i].id === wizardPanelId) {
                        return wizardPanels[i];
                    }
                }
            }
        }

        #getTabIndexById(tabId) {
            let tabs = this.getCachedTabs();
            if (tabs) {
                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].id === tabId) {
                        return i;
                    }
                }
            }
            return -1;
        }

        #getBeforeViewElement(instanceManager, instanceIndex) {
            let result = {};
            let instanceManagerId = instanceManager.getId();
            if (instanceIndex == 0) {
                let closestNonRepeatableFieldId = this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'];
                let closestRepeatableFieldInstanceManagerIds = this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'];
                let indexToInsert = this.getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds);
                let wizardPanels = this.getCachedWizardPanels();
                if (indexToInsert > 0) {
                    result.beforeViewElement = this.#getWizardPanelElementById(wizardPanels[indexToInsert - 1].id);
                } else {
                    result.beforeViewElement = this.getPreviousButtonDiv();
                }
            } else {
                let previousInstanceElement = instanceManager.children[instanceIndex - 1].element;
                let previousInstanceWizardPanelIndex = this.#getTabIndexById(previousInstanceElement.id + Wizard.#tabIdSuffix);
                result.beforeViewElement = this.getCachedWizardPanels()[previousInstanceWizardPanelIndex];
            }
            return result;
        }

        updateChildVisibility(visible, state) {
            this.updateVisibilityOfNavigationElement(this.#getTabNavElementById(state.id + Wizard.#tabIdSuffix), visible);
            let activeTabNavElement = this.getCachedTabs()[this._active];
            this.#setNavigationRange();
            this.#hideUnhideNavButtons(this._active);
            if (!visible && activeTabNavElement.id === state.id + Wizard.#tabIdSuffix) {
                let child = this.findFirstVisibleChild(this.getCachedTabs());
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
