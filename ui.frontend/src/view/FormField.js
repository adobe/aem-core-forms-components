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
import Utils from "../utils.js";

export default class FormField {

    constructor(params) {
        this.formContainer = params.formContainer;
        this.element = params.element; //html element of field
        this.options = Utils.readData(this.element, this.getClass());  //dataset of field
        this.setId(this.element.id);
        this.active = false;
    }

    setId(id) {
        this.id = id;
    }

    setParent(parentView) {
        this.parentView = parentView;
        if (this.parentView.addChild) {
            this.parentView.addChild(this);
        }
        if (this.getInstanceManager() && !(this.getInstanceManager().getRepeatableParentView())) {
            this.getInstanceManager().setRepeatableParentView(parentView);
        }
    }

    setInstanceManager(instanceManager) {
        this.instanceManager = instanceManager;
    }

    setActive() {
        if (!this.isActive()) {
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_ACTIVE, true);
        }
        if (this.parentView && this.parentView.setActive) {
            this.parentView.setActive();
        }
    }

    setInactive() {
        if (this.isActive()) {
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_ACTIVE, false);
        }
        if (this.parentView && this.parentView.setInactive) {
            this.parentView.setInactive();
        }
    }

    isActive() {
        return this.active;
    }

    getFormContainerPath() {
        return this.options["adaptiveformcontainerPath"];
    }

    getId() {
        return this.id;
    }

    setModel(model) {
        if (typeof this._model === "undefined" || this._model === null) {
            this._model = model;
        } else {
            throw "Re-initializing model is not permitted"
        }
    }

    /**
     * toggles the html element based on the property. If the property is false, then adds the data-attribute and
     * css class
     * @param property
     * @param dataAttribute
     * @param value
     */
    toggle(property, dataAttribute, value) {
       this.toggleAttribute(this.element, property, dataAttribute, value);
    }

    /**
     * Toggles the given @param element based on the property. If the property is false, then adds the data-attribute and
     * css class
     * @param element
     * @param property
     * @param dataAttribute
     * @param value
     */
    toggleAttribute(element, property, dataAttribute, value) {
        if (element) {
            if (property === false) {
                element.setAttribute(dataAttribute, value);
            } else {
                element.removeAttribute(dataAttribute);
            }
        }
    }

    /**
     * @return 'afs:layout' properties. Empty object if no layout property present
     */
    getLayoutProperties() {
        let layoutProperties = {};
        const state = this.getModel().getState();
        if (state && state.properties && state.properties['afs:layout']) {
            layoutProperties =  state.properties['afs:layout'];
        }
        return layoutProperties;
    }

    getModel() {
        return this._model;
    }

    subscribe() {
        throw "the field does not subscribe to the model"
    }

    initializeHelpContent(state) {
        throw "method not implemented";
    }

    getInstanceManager() {
        return this.instanceManager;
    }
}
