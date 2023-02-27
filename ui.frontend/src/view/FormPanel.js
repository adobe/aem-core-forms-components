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

export default class FormPanel extends FormFieldBase {
    constructor(params) {
        super(params);
        this.children = [];
    }

    instantiateInstanceManager() {
        return new InstanceManager({
            "formContainer" : this.formContainer,
            "model": this._model.parent,
            "parentElement": this.element.parentElement.parentElement
        });
    }

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

    addChild(childView) {
        this.children.push(childView);
    }

    getChild(id){
        for(let key in this.children){
            if(this.children[key].id===id){
                return this.children[key];
            }
        }
    }

    customRepeatableHtmlHandler(instanceManager,addedModel,htmlElement,beforeElement){
        var instanceIndex=addedModel.index;
        if (instanceManager.children.length == 0) {
            instanceManager.parentElement.append(htmlElement);
        }else if (addedModel.index == 0) {
            let afterElement = instanceManager.children[0].element.parentElement;
            instanceManager.parentElement.insertBefore(htmlElement, afterElement);
        }else{
            let beforeViewElement = (beforeElement != null) ? beforeElement : instanceManager.children[instanceIndex - 1].element.parentElement;
            beforeViewElement.after(htmlElement);
        }
    }

    handleChildAddition(childView) {
        //This needs to be handled in tabs, accordion, wizard
    }

    handleChildRemoval(childView) {
        //This needs to be handled in tabs, accordion, wizard
    }

    /**
     * applies full state of the field to the HTML. Generally done just after the model is bound to the field
     * @param state
     */
    applyState(state) {
        this.updateVisible(state.visible);
        this.updateEnabled(state.enabled);
        this.initializeHelpContent(state);
    }

    /**
     * updates the html state based on enable state of the panel
     * @param enable
     */
    updateEnabled(enable) {
        this.toggle(enable, Constants.ARIA_DISABLED, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enable);
    }

    /**
     * Updates the html state based on valid state of the panel
     * @param valid
     * @param state
     */
    updateValid(valid, state) {
        this.toggle(valid, Constants.ARIA_INVALID, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_VALID, valid);
    }

}
