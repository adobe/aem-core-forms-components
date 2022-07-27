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

export default class FormPanel {

    constructor(params) {
        this.formContainer = params.formContainer;
        this.parent = params.parent || params.formContainer;
        this.element = params.element; //html element of panel
        let elPanelContent = this.element.getElementsByClassName(this.getContentClass())
        if (elPanelContent && elPanelContent.length > 0) {
            this.panelContentElement = elPanelContent[0].clone();
            // panel will have id, if it's an array (panelContent will repeat),
            // otherwise it's an object and id will be of inside panel content
            this.element = this.element.id ? this.element : elPanelContent[0];
        }
        if (this.element.id) {
            this.setId(this.element.id);
        }

        this.options = Utils.readData(this.element, this.getClass());  //dataset of panel
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

    getContentClass() {
        throw new Error ("Not Implemented");
    }

    setValid() {
        throw new Error ("Not Implemented");
    }

    setInvalid() {
        throw new Error ("Not Implemented");
    }

    setEnabled() {
        throw new Error ("Not Implemented");
    }

    setDisabled() {
        throw new Error ("Not Implemented");
    }

    setVisible() {
        throw new Error ("Not Implemented");
    }

    setInvisible() {
        throw new Error ("Not Implemented");
    }

    setActive() {
        throw new Error ("Not Implemented");
    }

    setInactive() {
        throw new Error ("Not Implemented");
    }

    subscribe() {
        this._model.subscribe((action) => {
            let state = action.target.getState();
            state.valid ? this.setValid() : this.setInvalid();
            state.enabled ? this.setEnabled() : this.setDisabled();
            state.visible ? this.setVisible() : this.setInvisible();
            //todo repeat
        });
    }
}
