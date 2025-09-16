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

import {Constants} from "../constants.js";
import FormFieldBase from "./FormFieldBase.js";
import InstanceManager from "./InstanceManager.js";

/**
 * @module FormView
 */

/**
 * FormPanel class represents a panel within a form.
 * @extends module:FormView~FormFieldBase
 */
class FormPanel extends FormFieldBase {
    /**
     * Creates an instance of FormPanel.
     * @param {Object} params - The parameters for initializing the FormPanel.
     */
    constructor(params) {
        super(params);
        this.children = [];
    }

    /**
     * Instantiates the InstanceManager for the FormPanel.
     * @returns {InstanceManager} The newly instantiated InstanceManager.
     */
    instantiateInstanceManager() {
        return new InstanceManager({
            "formContainer": this.formContainer,
            "model": this._model.parent,
            "parentElement": this.element.parentElement.parentElement
        });
    }

    /**
     * Sets the model for the FormPanel.
     * @param {Object} model - The model to be set for the FormPanel.
     */
    setModel(model) {
        super.setModel(model);
        if (model.repeatable) {
            let instanceManager = this.formContainer.getField(model.parent.id);
            if (instanceManager == null) {
                instanceManager = this.instantiateInstanceManager();
                this.formContainer.addInstanceManager(instanceManager);
            }
            this.setInstanceManager(instanceManager);
            instanceManager.addChild(this);
        }
    }

    /**
     * Sets the focus to a child element within the FormPanel.
     * @param {string} id - The ID of the child element to set focus to.
     */
    setFocus(id) {
        const fieldType = this.parentView?.getModel()?.fieldType;
        if (fieldType !== 'form' && this.parentView?.setFocus) {
            this.parentView.setFocus(this.getId());
        }
    }

    getActiveRepeatableNonRepeatableTabId(items, id){
        for (const item of items) {
            if(item.id === id){
                return id;
            } else if(item.fieldType === 'panel' && item.type === 'array'){
                const repeatableItems = this.formContainer.getModel().getElement(item.id).getState();
                const result = this.getActiveRepeatableNonRepeatableTabId(repeatableItems.items, id);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }
  
    /**
     * Sets the focus to first field while navigating in navigable layouts.
     * @param {string} id - The ID of the field to set focus to.
     */
    focusToFirstVisibleField(id) {
        const form = this.formContainer.getModel();
        const activeTabId = this.getActiveRepeatableNonRepeatableTabId(this.getModel().getState().items, id); 
        const activeTab = form.getElement(activeTabId);
        if (!activeTab) {
            return;
        }

        const findFirstPanelNonPanelField = (item) => {
            // Return early if not visible
            if (!item.visible || !item.enabled) {
                return null;
            }
        
            // If item is not a panel, return it
            if (item.fieldType && item.fieldType !== "panel") {
                return item;
            } else {
                // Check each child
                for (const childItem of item.items) {
                    const result = findFirstPanelNonPanelField(childItem);
                    if (result) {
                        return result;
                    }
                }
            }

            return null;
        };
    
        const firstField = findFirstPanelNonPanelField(activeTab);
        if (firstField) {
            setTimeout(() => {this.formContainer.setFocus(firstField.id)}, 0);
        }
    }

    /**
     * Adds a child view to the FormPanel.
     * @param {Object} childView - The child view to be added.
     */
    addChild(childView) {
        this.children.push(childView);
    }

    /**
     * Gets the count of all children in the model.
     * @returns {number} The count of all children in the model.
     */
    getCountOfAllChildrenInModel() {
        var countOfChildren = 0;
        for (let key in this.getModel()._children) {
            var child = this.getModel()._children[key];
            if (child.minOccur != undefined && child.maxOccur != undefined && child._children != undefined) {
                //(child._children.length == 0) this can happen in cases of prefill or removeInstance onLoad via rules
                countOfChildren += (child._children.length == 0) ? 1 : child._children.length;
            } else {
                countOfChildren += 1;
            }
        }
        return countOfChildren;
    }

    /**
     * Gets a child view by its ID.
     * @param {string} id - The ID of the child view to retrieve.
     * @returns {Object} The child view with the specified ID.
     */
    getChild(id) {
        for (let key in this.children) {
            if (this.children[key].id === id) {
                return this.children[key];
            }
        }
    }

    /**
     * Handles the addition of a child view.
     * This method needs to be implemented in tabs, accordion, and wizard.
     * @param {Object} childView - The child view that was added.
     */
    handleChildAddition(childView) {
        //This needs to be handled in tabs, accordion, wizard
    }

    /**
     * Handles the removal of a child view.
     * This method needs to be implemented in tabs, accordion, and wizard.
     * @param {Object} childView - The child view that was removed.
     */
    handleChildRemoval(childView) {
        //This needs to be handled in tabs, accordion, wizard
    }

    /**
     * Extends the standard updateLabel by applying the panel title as an aria-label
     * Useful for panel components like "Terms and Conditions" which were being ignored by NVDA
     * @param {Object} label - The label.
     */
    updateLabel(label) {
        super.updateLabel(label);

        const bemClass = Array.from(this.element.classList).filter(bemClass => !bemClass.includes('--'))[0];
        const labelContainer = this.element.querySelector(`.${bemClass}__label-container`).querySelector(`.${bemClass}__label`);
        const regionContainer = this.element.querySelector(`.${bemClass}__widget-container`);

        if(regionContainer && regionContainer.hasAttribute('role') && (regionContainer.getAttribute('role') === 'region')) {
            regionContainer.setAttribute('aria-label', labelContainer.innerHTML);
        }
    }

    /**
     * Applies the full state of the field to the HTML.
     * Generally done just after the model is bound to the field.
     * @param {Object} state - The state to be applied.
     */
    applyState(state) {
        this.updateVisible(state.visible);
        this.updateEnabled(state.enabled);
        this.initializeHelpContent(state);
        this.updateLabel(state.label);
    }

    /**
     * Updates the HTML state based on the enable state of the panel.
     * @param {boolean} enable - The enable state of the panel.
     * @override
     */
    updateEnabled(enable) {
        this.toggle(enable, Constants.ARIA_DISABLED, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enable);
    }

    /**
     * Updates the HTML state based on the valid state of the panel.
     * @param {boolean} valid - The valid state of the panel.
     * @param {Object} state - The state object.
     * @override
     * @deprecated Use the new method updateValidity() instead.
     */
    updateValid(valid, state) {
        // not doing anything, since it would impact performance, as the same functionality
        // is implemented by updateValidity
    }

    /**
     * Updates the HTML state based on the validity state of the panel.
     * @param {object} validity - The validity state of the panel.
     * @param {Object} state - The state object.
     * @override
     */
    updateValidity(validity, state) {
        // todo: handle the type of validity later
        const valid = validity.valid;
        this.toggle(valid, Constants.ARIA_INVALID, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_VALID, valid);
    }

    /**
     * Gets the child view at the specified index.
     * This method needs to be implemented in every layout.
     * @param {number} index - The index of the child view.
     */
    getChildViewByIndex(index) {
        //everyLayout needs to implement this method
    }

    /**
     * Gets the closest fields for a given index.
     * @param {number} index - The index to search for closest fields.
     * @returns {Object} An object containing the closest fields information.
     * @private
     */
    #getClosestFields(index) {
        var result = {};
        result["closestRepeatableFieldInstanceManagerIds"] = [];
        for (let i = index - 1; i >= 0; i--) {
            var fieldView = this.getChildViewByIndex(i);
            if (fieldView.getInstanceManager() == null) {
                result["closestNonRepeatableFieldId"] = fieldView.getId();
                break;
            } else {
                result["closestRepeatableFieldInstanceManagerIds"].push(fieldView.getInstanceManager().getId());
                if (fieldView.getInstanceManager().getModel().minOccur != 0) {
                    break;
                }
            }
        }
        return result;
    }

    /**
     * Caches the closest fields within the view.
     * @private
     */
    cacheClosestFieldsInView() {
        for (let i = 0; i < this.children.length; i++) {
            var fieldView = this.getChildViewByIndex(i);
            if (fieldView.getInstanceManager() != null && fieldView.getInstanceManager().getModel().minOccur == 0) {
                var instanceManagerId = fieldView.getInstanceManager().getId();
                if (this._templateHTML[instanceManagerId] == null) {
                    this._templateHTML[instanceManagerId] = {};
                }
                if (this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'] == null &&
                    this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'] == null) {
                    var result = this.#getClosestFields(i);
                    this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'] = result["closestNonRepeatableFieldId"];
                    this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'] = result["closestRepeatableFieldInstanceManagerIds"];
                }
            }
        }
    }

    /**
     * Gets the index at which to insert a new field.
     * @param {string} closestNonRepeatableFieldId - The ID of the closest non-repeatable field.
     * @param {string[]} closestRepeatableFieldInstanceManagerIds - The IDs of the closest repeatable field instance managers.
     * @returns {number} The index at which to insert the new field.
     */
    getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds) {
        var resultIndex = -1;
        for (let i = this.children.length - 1; i >= 0; i--) {
            var fieldView = this.getChildViewByIndex(i);
            if (closestNonRepeatableFieldId === fieldView.getId()) {
                resultIndex = i;
                break;
            } else {
                if (fieldView.getInstanceManager() != null && closestRepeatableFieldInstanceManagerIds.includes(fieldView.getInstanceManager().getId())) {
                    resultIndex = i;
                    break;
                }
            }
        }
        return resultIndex + 1;
    }

    /**
     * Gets the repeatable root element of a child view.
     * @param {Object} childView - The child view.
     * @returns {HTMLElement} The repeatable root element.
     */
    getRepeatableRootElement(childView){
      return childView.element.parentElement;
    }

    /**
     * Updates the visibility of a child element.
     * This method needs to be implemented in individual layouts.
     * @param {boolean} visible - The visibility state of the child element.
     * @param {Object} state - The state object.
     */
    updateChildVisibility(visible, state) {
        // implement in individual layouts
    }

    /**
     * Handles the visibility of hidden children.
     * @private
     */
    handleHiddenChildrenVisibility() {
        for (let i = 0; i < this.children.length; i++) {
            let isVisible = this.children[i].element.getAttribute(Constants.DATA_ATTRIBUTE_VISIBLE);
            if (isVisible === 'false') {
                this.updateChildVisibility(false, this.children[i].getModel().getState());
            }
        }
    }

    /**
     * Finds the first visible child element from the given children.
     * @param {HTMLElement[]} children - The children elements to search.
     * @returns {HTMLElement} The first visible child element, or null if none found.
     */
    findFirstVisibleChild(children) {
        for (let i = 0; i < children.length; i++) {
            let isVisible = children[i].getAttribute(Constants.DATA_ATTRIBUTE_VISIBLE);
            if (isVisible != 'false') {
                return children[i];
            }
        }
    }

    /**
     * Updates the visibility of a navigation element.
     * @param {HTMLElement} navigationTabElement - The navigation tab element.
     * @param {boolean} visible - The visibility state of the navigation element.
     * @private
     */
    updateVisibilityOfNavigationElement(navigationTabElement, visible) {
        if (navigationTabElement) {
            if (visible === false) {
                navigationTabElement.setAttribute(Constants.ARIA_HIDDEN, true);
            } else {
                navigationTabElement.removeAttribute(Constants.ARIA_HIDDEN);
            }
            navigationTabElement.setAttribute(Constants.DATA_ATTRIBUTE_VISIBLE, visible);
        }
    }

    /**
     * Updates the HTML class based on the existence of a value in a field. 
     * For the layout components, there's no need to do this, so override the updateEmptyStatus method.
     */
    updateEmptyStatus() {

    }

}

export default FormPanel;
