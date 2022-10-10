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

    var keyCodes = {
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };


    class Wizard extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormWizard";
        static bemBlock = "cmp-adaptiveform-wizard";

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
            nextButton: `.${Wizard.bemBlock}__nextNav`
        };

        constructor(params) {
            super(params);
            const {element} = params;
            this.#cacheElements(element);
            this.#setActive(this._elements["tab"])
            this._active = this.getActiveIndex(this._elements["tab"]);
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
                CQ.CoreComponents.MESSAGE_CHANNEL.subscribeRequestMessage("cmp.panelcontainer", function(message) {
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
                if (hook.closest("[data-cmp-is="+Wizard.IS+"]") === this._elements.self) { // only process own tab elements
                    var key = hook.dataset[Wizard.NS + "Hook" + "Adaptiveformwizard"];
                    if (this._elements[key]) {
                        if (!Array.isArray(this._elements[key])) {
                            var tmp = this._elements[key];
                            this._elements[key] = [tmp];
                        }
                        this._elements[key].push(hook);
                    } else {
                        this._elements[key] = hook;
                    }
                }
            }
        }

        getClass() {
            return Wizard.IS;
        }

        setFocus() {
            this.setActive();
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


        /**
         * Binds navigation buttons event handling
         *
         * @private
         */
        #bindEvents() {
            var _self = this;
            this.getNextButtonDiv().addEventListener("click", function (event){
                _self.#navigateToNextTab();
            })
            this.getPreviousButtonDiv().addEventListener("click", function (event){
                _self.#navigateToPreviousTab();
            })


        }

        /**
         * Returns the index of the active tab, if no tab is active returns 0
         *
         * @param {Array} tabs Tab elements
         * @returns {Number} Index of the active tab, 0 if none is active
         */
        getActiveIndex(tabs) {
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
                if (Array.isArray(tabs)){
                    tabs[0].classList.add(Wizard.selectors.active.tab);
                }else{
                    tabs.classList.add(Wizard.selectors.active.tab);
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
            var index = this._active;

            var lastIndex = this._elements["tab"].length - 1;

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
            var wizardPanels = this._elements["wizardpanel"];
            var tabs = this._elements["tab"];

            if (wizardPanels) {
                if (Array.isArray(wizardPanels)) {
                    for (var i = 0; i < wizardPanels.length; i++) {
                        if (i === parseInt(this._active)) {
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
                } else {
                    // only one tab
                    wizardPanels.classList.add(Wizard.selectors.active.wizardpanel);
                    tabs.classList.add(Wizard.selectors.active.tab);
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
            var activeIndex=this._active;
            var tabs=this._elements["tab"];
            if (tabs) {
                if (Array.isArray(tabs)) {
                    var totalTabs=tabs.length;
                    if(activeIndex<totalTabs-1){
                        this.#navigateAndFocusTab(activeIndex+1);
                    }
                }
            }
        }

        #navigateToPreviousTab() {
            var activeIndex=this._active;
            var tabs=this._elements["tab"];
            if (tabs) {
                if (Array.isArray(tabs)) {
                    if(activeIndex>0){
                        this.#navigateAndFocusTab(activeIndex-1);
                    }
                }
            }
        }


        /**
         * Navigates to the tab at the provided index
         *
         * @private
         * @param {Number} index The index of the tab to navigate to
         */
        #navigate(index) {
            this._active = index;
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
            this.focusWithoutScroll(this._elements["tab"][index]);
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Wizard({element, formContainer})
    }, Wizard.selectors.self);

}());
