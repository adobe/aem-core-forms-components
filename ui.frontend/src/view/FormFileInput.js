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
     * Class representing components based on FileInput.
     * @extends module:FormView~FormFileInput
     */
    class FormFileInput extends FormFieldBase {

        constructor(params) {
            super(params);
        }

        setModel(model) {
            super.setModel(model);
            if (this.widgetObject == null) {
                this.widgetObject = new FileInputWidget(this.widgetFields);
            }
        }

        updateValue(value) {
            if (this.widgetObject == null) {
                this.widgetObject = new FileInputWidget(this.widgetFields);
            }
            this.widgetObject.setValue(value);
            super.updateEmptyStatus();
        }

        syncWidget() {
            let widgetElement = this.getWidget ? this.getWidget() : null;
            if (widgetElement) {
                widgetElement.id = this.getId() + "__widget";
                this.getAttachButtonLabel().setAttribute('for', this.getId() + "__widget");
            }
        }

        /*
          We are overriding the syncLabel method of the FormFieldBase class because for all components, 
          we pass the widgetId in 'for' attribute. However, for the file input component, 
          we already have a widget, so we should not pass the widgetId twice
        */
        syncLabel() {
          let labelElement = typeof this.getLabel === 'function' ? this.getLabel() : null;
          if (labelElement) {
              labelElement.setAttribute('for', this.getId());
          }
        }

        syncMarkupWithModel() {
            super.syncMarkupWithModel();
            this.syncWidget();
            this.syncLabel();
        }
    }
    
export default FormFileInput;