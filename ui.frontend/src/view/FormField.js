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

import Utils from "../utils";

export default class FormField {

    constructor(params) {
        this.formContainer = params.formContainer;
        //this.parent = params.parent || params.formContainer; no need of this, as we intend to set parent view
        this.element = params.element; //html element of field
        this.options = Utils.readData(this.element, this.getClass());  //dataset of field
        this.setId(this.element.id);
        this.bindEventListeners();
    }

    setId(id) {
        this.id = id;
    }

    getFormContainerPath() {
        return this.options["adaptiveformcontainerPath"];
    }

    getId() {
        return this.id;
    }

    bindEventListeners() {
        this.element.addEventListener('change', (event) => {
            this._model.value = event.target.value;
        });
        //implementing classes will generally add focus and blur
    }

    setModel(model) {
        this._model = model;
    }

    getModel() {
        return this._model;
    }

    getClass() {
       throw new Error ("Not Implemented");
    }

    setValue(value) {
       throw new Error("Not implemented");
    }

    setFocus() {
        throw new Error("Not implemented");
    }

    setParent(parentView) {
        this.parentView = parentView;
        if (this.parentView.addChild) {
            this.parentView.addChild(this);
        }
    }

    //link class of state, single function to handle various properties of state
    setState(state) {
        throw new Error("Not implemented");
    }

    subscribe() {
        this.setState(this._model);
        this._model.subscribe((action) => {
            let state = action.target.getState();
            //action.changes[{prop, newValue, currValue}]
            this.setState(state);
        });
    }
}
