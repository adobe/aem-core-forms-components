import FormPanel from "./FormPanel";

/*******************************************************************************
 * Copyright 2023 Adobe
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

import FormFieldBase from "./FormFieldBase.js";

/**
 * Class representing components baed on CheckBox.
 * @extends module:FormView~FormPanel
 */
class FormCheckBox extends FormFieldBase {

    constructor(params) {
        super(params);
    }

    updateValue(modelValue) {
        if (modelValue === this._model._jsonModel.enum[0]) {
            this.widget.checked = true
            this.widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.HTML_ATTRS.CHECKED)
            this.widget.setAttribute(FormView.Constants.ARIA_CHECKED, true);
        } else {
            this.widget.checked = false
            this.widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
            this.widget.setAttribute(FormView.Constants.ARIA_CHECKED, false);
        }
        this.widget.value = modelValue;
        super.updateEmptyStatus();
    }

    setModel(model) {
        super.setModel(model);
        this._onValue = this._model._jsonModel.enum[0];
        this._offValue = this._model._jsonModel.enum[1];
        this.widget.addEventListener('change', (e) => {
            if (this.widget.checked) {
                this._model.value = this._onValue;
            } else {
                this._model.value = this._offValue;
            }
        })

    }
}

export default FormCheckBox;