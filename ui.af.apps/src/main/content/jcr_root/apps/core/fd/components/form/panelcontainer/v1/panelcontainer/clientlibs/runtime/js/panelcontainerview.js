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

    class Panel extends FormView.FormPanel {

        _templateHTML = {};
        #childIdMap = {}

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormPanel";
        static bemBlock = 'cmp-container';
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            label: `.${Panel.bemBlock}__label`,
            description: `.${Panel.bemBlock}__longdescription`,
            qm: `.${Panel.bemBlock}__questionmark`,
            tooltipDiv: `.${Panel.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
        }

        getClass() {
            return Panel.IS;
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
        }

        getWidget() {
            return this.element.querySelector(Panel.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(Panel.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(Panel.selectors.label);
        }

        getErrorDiv() {
            //error div is not defined
            //return this.element.querySelector(Panel.selectors.errorDiv);
            return null;
        }

        getTooltipDiv() {
            return this.element.querySelector(Panel.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Panel.selectors.qm);
        }

        addChild(childView) {
            super.addChild(childView);
            if (this.getCountOfAllChildrenInModel() === this.children.length) {
                this.#cacheElements(this.element);
                this.#cacheDivToAppendChildMarkup();
                this.cacheClosestFieldsInView();
            } else if (childView.getInstanceManager() != null) {
                // this is for cases when repeatable instances are added after first initialisation
                this.#cacheElements(this.element);
            }
        }

        getChildViewByIndex(index) {
            if (this.#getCachedElements()[index] != null) {
                return this.getChild(this.#getCachedElements()[index].id)
            }
        }

        /**
         * Adds unique HTML for added instance corresponding to requirements of different types of repeatableParent
         * @param instanceManager of the repeated component
         * @param addedModel of the repeated component
         * @param htmlElement of the repeated component
         */
        addRepeatableMarkup(instanceManager, addedModel, htmlElement) {
            let result = this.#getBeforeViewElement(instanceManager, addedModel.index);
            if (result.beforeViewElement != null) {
                result.beforeViewElement.after(htmlElement);
            } else if (result.parentElement != null) {
                if (result.parentElement.children.length == 0) {
                    result.parentElement.append(htmlElement);
                } else {
                    result.parentElement.insertBefore(htmlElement, result.parentElement.firstElementChild);
                }
            }
            return htmlElement;
        }

        handleChildRemoval(removedInstanceView) {
            this.children.splice(this.children.indexOf(removedInstanceView), 1);
            this.#cacheElements(this._elements.self);
        }

        handleChildAddition(childView) {
            //can't initiate cacheElement From here as children property of the panel is not updated at this point,
            // hence cacheElement is called from addChild method which ensures panel's addChild is called first and children
            // property is updated
        }

        #cacheElements(wrapper) {
            this._elements = {};
            this._elements.self = wrapper;
            this._elements.items = [];
            this.#childIdMap = {};
            for (let i = 0; i < this.children.length; i++) {
                this.#childIdMap[this.children[i].id] = this.children[i];
            }
            let components = this._elements.self.querySelectorAll("[data-cmp-is]");
            for (let i = 0; i < components.length; i++) {
                //only consider this panel's child and not children of some  child panel.
                if (this.#childIdMap.hasOwnProperty(components[i].id)) {
                    this._elements.items.push(components[i]);
                }
            }
        }

        #getCachedElements() {
            return this._elements.items;
        }

        #getCachedElementById(id) {
            for (let i = 0; i < this.#getCachedElements().length; i++) {
                if (this.#getCachedElements()[i].id == id) {
                    return this.#getCachedElements()[i];
                }
            }
        }

        #cacheDivToAppendChildMarkup() {
            if (this.children.length > 0 && this._templateHTML['divToAppendChild'] === undefined) {
                var fieldView = this.children[0];
                //because htmlElement cached for repeating is element.parentElement in instanceManager
                this._templateHTML['divToAppendChild'] = fieldView.element.parentElement.parentElement;
            }
        }

        #getBeforeViewElement(instanceManager, instanceIndex) {
            var result = {};
            var instanceManagerId = instanceManager.getId();
            if (instanceIndex == 0) {
                var closestNonRepeatableFieldId = this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'];
                var closestRepeatableFieldInstanceManagerIds = this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'];
                var indexToInsert = this.getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds);
                if (indexToInsert > 0) {
                    result.beforeViewElement = this.#getCachedElements()[indexToInsert - 1].parentElement;
                } else {
                    result.parentElement = this._templateHTML['divToAppendChild'];
                }
            } else {
                var previousInstanceElement = instanceManager.children[instanceIndex - 1].element;
                var previousInstanceItemDiv = this.#getCachedElementById(previousInstanceElement.id).parentElement;
                result.beforeViewElement = previousInstanceItemDiv;
            }
            return result;
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Panel({element, formContainer})
    }, Panel.selectors.self);
})();
