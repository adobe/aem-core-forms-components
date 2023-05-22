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
            olTabList: `.${VerticalTabs.bemBlock}__tablist`
        };

        constructor(params) {
            super(params, VerticalTabs.NS, VerticalTabs.IS, VerticalTabs.selectors);
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
                        if (message.data.operation === "navigate") {
                            _self.navigate(_self._elements["tab"][message.data.index].id);
                        }
                    }
                });
            }
        }

        getClass() {
            return VerticalTabs.IS;
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
            this.navigateAndFocusTab(id + '__tab');
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
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new VerticalTabs({element, formContainer})
    }, VerticalTabs.selectors.self);

}());