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

    function WizardMixin(Base) {
        return class extends Base {
            static NS = "cmp";
            static IS = "adaptiveFormWizard";
            static bemBlock = "cmp-adaptiveform-wizard";
            static DATA_ATTRIBUTE_VISIBLE = 'data-cmp-visible';

            static selectors = {
                self: "[data-" + this.NS + '-is="' + this.IS + '"]',
                active: {
                    tab: "cmp-adaptiveform-wizard__tab--active",
                    wizardpanel: "cmp-adaptiveform-wizard__wizardpanel--active"
                },
                stepped: {
                    tab: "cmp-adaptiveform-wizard__tab--stepped",
                    wizardpanel: "cmp-adaptiveform-wizard__wizardpanel--stepped",
                }    
            };

            _active;

            constructor(params) {
                super(params);
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
                const hooks = this._elements.self.querySelectorAll("[data-" + this.constructor.NS + "-hook-" + this.constructor.IS + "]");

                for (let i = 0; i < hooks.length; i++) {
                    let hook = hooks[i];
                    if (hook.closest("[data-cmp-is=" + this.constructor.IS + "]") === this._elements.self) { // only process own tab elements
                        let key = hook.dataset[this.constructor.NS + "Hook" + "Adaptiveformwizard"];
                        if (this._elements[key]) {
                            if (!Array.isArray(this._elements[key])) {
                                let tmp = this._elements[key];
                                this._elements[key] = [tmp];
                            }
                            this._elements[key].push(hook);
                        } else {
                            this._elements[key] = [hook];
                        }
                    }
                }
            }

            setActive(tabs) {
                if (tabs) {
                    tabs[0].classList.add(this.constructor.selectors.active.tab);
                }
            }

            addSteppedClass() {
                const tabs = this.getCachedTabs();
                const wizardPanels = this.getCachedWizardPanels();
                const activeChildId =  this.getActiveWizardTabId(tabs)
                const activeTab = this.getTabNavElementById(activeChildId);
                if (activeTab.classList.contains(this.constructor.selectors.active.tab)) {
                    activeTab.classList.add(this.constructor.selectors.stepped.tab);

                    const correspondingPanel = Array.from(wizardPanels).find(panel =>
                        panel.getAttribute("aria-labelledby") === activeTab.id
                    );
            
                    if (correspondingPanel) {
                        correspondingPanel.classList.add(this.constructor.selectors.stepped.wizardpanel);
                    }
                }
            }

            getTabNavElementById(tabId) {
                let tabs = this.getCachedTabs();
                if (tabs) {
                    for (let i = 0; i < tabs.length; i++) {
                        if (tabs[i].id === tabId) {
                            return tabs[i];
                        }
                    }
                }
            }

            getActiveWizardTabId(tabs) {
                if (tabs) {
                    var result = tabs[0].id;
                    for (var i = 0; i < tabs.length; i++) {
                        if (tabs[i].classList.contains(this.constructor.selectors.active.tab)) {
                            result = tabs[i].id;
                            break;
                        }
                    }
                    return result;
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
                    for (let i = 0; i < tabs.length; i++) {
                        if (tabs[i].classList.contains(this.constructor.selectors.active.tab)) {
                            return i;
                        }
                    }
                }
                return 0;
            }

            getCachedTabs() {
                return this._elements["tab"];
            }

            getCachedWizardPanels() {
                return this._elements["wizardpanel"]
            }

            /**
             * Navigates to the tab at the provided index
             *
             * @private
             * @param {Number} index The index of the tab to navigate to
             */
            navigate(index) {
                if (this._active === index) {
                    return; // already on this tab
                }
                this._active = index;
                this.addSteppedClass();
                this.refreshActive();
            }

            /**
             * Refreshes the tab markup based on the current {@code Tabs_active} index
             *
             * @private
             */
            refreshActive() {
                const wizardPanels = this.getCachedWizardPanels();
                const tabs = this.getCachedTabs();
                if (wizardPanels) {
                    for (let i = 0; i < wizardPanels.length; i++) {
                        if( wizardPanels[i] && tabs[i]) {
                            if (i === parseInt(this._active)) {
                                wizardPanels[i].classList.add(this.constructor.selectors.active.wizardpanel);
                                wizardPanels[i].removeAttribute("aria-hidden");
                                tabs[i].classList.add(this.constructor.selectors.active.tab);
                                tabs[i].setAttribute("aria-selected", true);
                                tabs[i].setAttribute("tabindex", "0");
                            } else {
                                wizardPanels[i].classList.remove(this.constructor.selectors.active.wizardpanel);
                                wizardPanels[i].setAttribute("aria-hidden", true);
                                tabs[i].classList.remove(this.constructor.selectors.active.tab);
                                tabs[i].setAttribute("aria-selected", false);
                                tabs[i].setAttribute("tabindex", "-1");
                            }
                        }
                    }
                }
                if (this.hideUnhideNavButtons) {
                    this.hideUnhideNavButtons(this._active);
                }
            }
        }
    }

    window.Forms = window.Forms || {};
    window.Forms.CoreComponentsCommons = window.Forms.CoreComponentsCommons || {};
    window.Forms.CoreComponentsCommons.WizardMixin = WizardMixin;

    const event = new CustomEvent('WizardMixinLoaded', {
        detail: {
            WizardMixin: WizardMixin
        }
    });
    window.dispatchEvent(event);

}());
