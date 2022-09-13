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

    class Accordion extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "accordion";
        static bemBlock = 'cmp-adaptiveform-accordion'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            item: `.${Accordion.bemBlock}__item`,
            button: `.${Accordion.bemBlock}__button`,
            panel: `.${Accordion.bemBlock}__panel`
        };

        static cssClasses = {
            button: {
                disabled: "cmp-adaptiveform-accordion__button--disabled",
                expanded: "cmp-adaptiveform-accordion__button--expanded"
            },
            panel: {
                hidden: "cmp-adaptiveform-accordion__panel--hidden",
                expanded: "cmp-adaptiveform-accordion__panel--expanded"
            }
        };

        constructor(params) {
            super(params);
            this.registerExpandCollapseListner();
        }

        getClass() {
            return Accordion.IS;
        }

        setFocus() {
            this.setActive();
        }

        getItemButton(item) {
            return item.querySelector(Accordion.selectors.button);
        }

        getItemPanel(item) {
            return item.querySelector(Accordion.selectors.panel);
        }

        getItems() {
            return this.element.querySelectorAll(Accordion.selectors.item);
        }

        registerExpandCollapseListner() {
            this.getItems().forEach(item => {
                this.getItemButton(item).addEventListener('click', (e) => {
                    var button = e.target;
                    var panel = this.getItemPanel(item);
                    if (button.classList.contains(Accordion.cssClasses.button.expanded)) {
                        button.classList.remove(Accordion.cssClasses.button.expanded);
                        panel.classList.remove(Accordion.cssClasses.panel.expanded);

                        panel.classList.add(Accordion.cssClasses.panel.hidden);
                    }  else {
                        panel.classList.remove(Accordion.cssClasses.panel.hidden);

                        button.classList.add(Accordion.cssClasses.button.expanded);
                        panel.classList.add(Accordion.cssClasses.panel.expanded);
                    }
                });
            });
        }

        setModel(model) {
            super.setModel(model);
        }

    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Accordion({element, formContainer})
    }, Accordion.selectors.self);
})();
