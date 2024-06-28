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
            widget: `.${Tabs.bemBlock}__tablist`
        };

        constructor(params) {
            super(params, Tabs.NS, Tabs.IS, Tabs.selectors);
        }


        getClass() {
            return Tabs.IS;
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
            this.navigateAndFocusTab(id + '__tab');
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
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Tabs({element, formContainer})
    }, Tabs.selectors.self);

}());
