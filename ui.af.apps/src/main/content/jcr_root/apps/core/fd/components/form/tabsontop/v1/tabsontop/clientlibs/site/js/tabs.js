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

    class Tabs extends FormView.FormTabs {
        _templateHTML = {};
        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormTabs";
        static bemBlock = "cmp-tabs";
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
            olTabList: `.${Tabs.bemBlock}__tablist`,
            olTabList: `.${Tabs.bemBlock}__tablist`,
            tab: `.${Tabs.bemBlock}__tab`,
            hamburgerButton: `.${Tabs.bemBlock}__hamburger-button`
        };

        constructor(params) {
            super(params, Tabs.NS, Tabs.IS, Tabs.selectors);
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
                            _self.navigate(_self._elements["tab"][message.data.index].id);
                        }
                    }
                });
            }
            this.attacheEvent();
        }


        getClass() {
            return Tabs.IS;
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
            this.navigateAndFocusTab(id + '__tab');
            window.scrollTo(0, 0);
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
        getOlTabList() {
          return this.element.querySelector(Tabs.selectors.olTabList);
        }

        getTabs() {
          return this.element.querySelectorAll(Tabs.selectors.tab);
        }

        getHamburgerButton() {
          return this.element.querySelector(Tabs.selectors.hamburgerButton);
        }

        attacheEvent(){
          this.getHamburgerButton().addEventListener('click', (e) => {
            const element = this.getOlTabList();
            if(element){
              element.classList.toggle("cmp-tabs__show");
            }
          });
          const tabs = this.getTabs() || [];
          tabs.forEach(tab=>{
            tab.addEventListener('click', (e) => {
              const element = this.getOlTabList();
              if(element){
                element.classList.remove("cmp-tabs__show");
              }
            })
          })
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Tabs({element, formContainer})
    }, Tabs.selectors.self);

}());