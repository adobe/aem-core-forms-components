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
import FormField from "./FormField";

export default class FormPanel extends FormField {

    constructor(params) {
        super(params);
        if (this.element.id) {
            this.setId(this.element.id);
        }
        this.children = [];
        //todo repeat
        /*if (this._model.type == 'array') {
        }*/
    }

    getTagName() {
        return "No_Tag";
    }

    bindEventListeners() {
        //todo, can utilize options
    }

    addChild(childView) {
        //let childModel = childView.getModel();
        //let childModelId = childModel.getId();
        //push it as a map in case of array
        this.children.push(childView);
    }
}
