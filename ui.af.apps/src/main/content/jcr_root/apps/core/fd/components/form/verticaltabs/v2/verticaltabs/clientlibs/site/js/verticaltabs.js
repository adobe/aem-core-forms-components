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

    class VerticalTabs extends FormView.FormTabs {
        _templateHTML = {};
        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormVerticalTabs";
        static bemBlock = "cmp-verticaltabs";
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            active: {
                tab: "cmp-verticaltabs__tab--active",
                tabpanel: "cmp-verticaltabs__tabpanel--active"
            },
            label: `.${VerticalTabs.bemBlock}__label`,
            description: `.${VerticalTabs.bemBlock}__longdescription`,
            qm: `.${VerticalTabs.bemBlock}__questionmark`,
            tooltipDiv: `.${VerticalTabs.bemBlock}__shortdescription`,
            olTabList: `.${VerticalTabs.bemBlock}__tablist`,
            widget: `.${VerticalTabs.bemBlock}__tabs-container`
        };

        constructor(params) {
            super(params, VerticalTabs.NS, VerticalTabs.IS, VerticalTabs.selectors);
            this.toggleActiveTabDropdown();
            this.setChildTablistVisibility();
            this.bindTabClickEvents();
            this.removeDropdownForNoChild();
            this.observeChildTabAddition();
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
                    if (message.data && message.data.type === "cmp-verticaltabs" && message.data.id === _self._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate" && _self._elements["tab"][message.data.index] != undefined) {
                            _self.navigate(_self._elements["tab"][message.data.index].id);
                        }
                    }
                });
            }
        }

        getClass() {
            return VerticalTabs.IS;
        }

        getTabNavElementById(tabId) {
            // Assuming tabs are stored in a property this.tabs
            return this.tabs.find(tab => tab.id === tabId);
        }

        getParentTabId(tabId) {
            // Get the tab element
            let tabElement = this.getTabNavElementById(tabId);

            // Find the closest parent tab element
            let parentTabElement = tabElement.closest('.cmp-verticaltabs__tab--vertical');

            // If a parent tab exists, return its id, otherwise return null
            return parentTabElement ? parentTabElement.id : null;
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
            this.navigateAndFocusTab(id + '__tab'); // Append '__tab' to the id to get the tab id
        }

        navigateAndFocusTab(tabId) {
            // Navigate to the tab
            this.navigate(tabId);
            // Focus on the tab without scrolling the element into view
            this.focusWithoutScroll(this.getTabNavElementById(tabId));
            // Handle nested vertical tabs
            let parentTabId = this.getParentTabId(tabId);
            if (parentTabId) {
                // If the tab is nested, navigate and focus on the parent tab first
                this.navigateAndFocusTab(parentTabId);
            }
        }

        getWidget() {
            return this.element.querySelector(VerticalTabs.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(VerticalTabs.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(VerticalTabs.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(VerticalTabs.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(VerticalTabs.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(VerticalTabs.selectors.qm);
        }

        // toggleActiveTabDropdown() {
        //     // Get all active vertical tabs
        //     var activeTabs = this.element.querySelectorAll('.cmp-verticaltabs__tab--vertical.cmp-verticaltabs__tab--active');
        //
        //     // Add click event listener to each active tab
        //     activeTabs.forEach(function(tab) {
        //         tab.addEventListener('click', function() {
        //             // Get the associated child tab list
        //             var childTabList = tab.nextElementSibling;
        //
        //             // Toggle the active class on the child tab list
        //             childTabList.classList.toggle('cmp-verticaltabs__tablist--active');
        //         });
        //     });
        // }

        toggleActiveTabDropdown() {
            // Get all active vertical tabs
            var activeTabs = this.element.querySelectorAll('.cmp-verticaltabs__tab--vertical.cmp-verticaltabs__tab--active');

            // Add click event listener to each active tab
            activeTabs.forEach(function(tab) {
                // Check if the tab has an active child
                var hasActiveChild = tab.querySelector('.cmp-verticaltabs__tab--active') !== null;

                // If the tab does not have an active child, add the click event listener
                if (!hasActiveChild) {
                    tab.addEventListener('click', function() {
                        // Get the associated child tab list
                        var childTabList = tab.nextElementSibling;

                        // Toggle the active class on the child tab list
                        childTabList.classList.toggle('cmp-verticaltabs__tablist--active');
                    });
                }
            });
        }

        setChildTablistVisibility() {
            // Select all <li> elements with the class 'cmp-verticaltabs__tab--vertical'
            let liElements = this.element.querySelectorAll('.cmp-verticaltabs__tab--vertical');

            // Iterate over the <li> elements
            liElements.forEach(liElement => {
                // Check if the <li> element has the class 'cmp-verticaltabs__tab--active'
                if (liElement.classList.contains('cmp-verticaltabs__tab--active')) {
                    // Select the child <ol> element
                    let olElement = liElement.nextElementSibling;

                    // If the <li> element has a child <ol> element
                    if (olElement && olElement.tagName.toLowerCase() === 'ol') {
                        // Select the child tabs
                        let childTabs = olElement.querySelectorAll('.cmp-verticaltabs__tab');

                        // Check if any child tab is active
                        let isAnyChildTabActive = Array.from(childTabs).some(childTab => childTab.classList.contains('cmp-verticaltabs__tab--active'));

                        // If no child tab is active, add the active class to the first child tab
                        if (!isAnyChildTabActive && childTabs.length > 0) {
                            childTabs[0].classList.add('cmp-verticaltabs__tab--active');
                        }

                        // Make the child <ol> visible
                        olElement.classList.add('cmp-verticaltabs__tablist--active');
                    } else {
                        // If the <li> element does not have a child <ol> element, add the active class to the <li> element
                        liElement.classList.add('cmp-verticaltabs__tab--active');
                    }
                } else {
                    // If the <li> element is not active, hide the child <ol>
                    let olElement = liElement.nextElementSibling;
                    if (olElement && olElement.tagName.toLowerCase() === 'ol') {
                        olElement.classList.remove('cmp-verticaltabs__tablist--active');
                    }
                }
            });
        }

        bindTabClickEvents() {
            // Select all <li> elements with the class 'cmp-verticaltabs__tab'
            let tabElements = this.element.querySelectorAll('.cmp-verticaltabs__tab');

            // Iterate over the <li> elements
            tabElements.forEach(tabElement => {
                // Add click event listener to each tab
                tabElement.addEventListener('click', () => {
                    // Toggle the 'cmp-verticaltabs__tab--active' class
                    tabElement.classList.toggle('cmp-verticaltabs__tab--active');

                    // Get the associated tab panel
                    let tabPanelId = tabElement.id.replace('__tab', '__tabpanel');
                    let tabPanel = this.element.querySelector('#' + tabPanelId);

                    // Toggle the 'cmp-verticaltabs__tabpanel--active' class
                    if (tabPanel) {
                        tabPanel.classList.toggle('cmp-verticaltabs__tabpanel--active');
                    }
                });
            });
        }

        removeDropdownForNoChild() {
            // Select all <li> elements with the class 'cmp-verticaltabs__tab--vertical'
            let liElements = this.element.querySelectorAll('.cmp-verticaltabs__tab--vertical');

            // Iterate over the <li> elements
            liElements.forEach(liElement => {
                // Check if the <li> element has child tabs
                let childTabs = liElement.querySelectorAll('.cmp-verticaltabs__tab');
                if (childTabs.length === 0) {
                    // If no child tabs, find the dropdown element
                    let dropdownElement = liElement.querySelector('.dropdown-selector');
                    // Remove the dropdown element from the DOM
                    if (dropdownElement) {
                        dropdownElement.remove();
                    }
                }
            });
        }

        observeChildTabAddition() {
            // Create a MutationObserver instance
            let observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // Check if child nodes were added
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Iterate over the added nodes
                        mutation.addedNodes.forEach((node) => {
                            // Check if the added node is a tab
                            if (node.classList.contains('cmp-verticaltabs__tab')) {
                                // Check if the parent tab has the 'no-children' class
                                let parentTab = node.parentElement.parentElement;
                                if (parentTab.classList.contains('no-children')) {
                                    // Remove the 'no-children' class from the parent tab
                                    parentTab.classList.remove('no-children');
                                }
                            }
                        });
                    }
                });
            });

            // Start observing the tab container for child node additions
            let tabContainer = this.element.querySelector('.cmp-verticaltabs__tabs-container');
            observer.observe(tabContainer, { childList: true, subtree: true });
        }

    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new VerticalTabs({element, formContainer})
    }, VerticalTabs.selectors.self);

}());