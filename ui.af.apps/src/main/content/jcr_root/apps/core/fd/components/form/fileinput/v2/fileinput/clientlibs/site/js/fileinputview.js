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
(function() {

    "use strict";
    class FileInputV2 extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormFileInput";
        static bemBlock = 'cmp-adaptiveform-fileinput'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${FileInputV2.bemBlock}__widget`,
            label: `.${FileInputV2.bemBlock}__label`,
            description: `.${FileInputV2.bemBlock}__longdescription`,
            qm: `.${FileInputV2.bemBlock}__questionmark`,
            errorDiv: `.${FileInputV2.bemBlock}__errormessage`,
            tooltipDiv: `.${FileInputV2.bemBlock}__shortdescription`,
            fileListDiv : `.${FileInputV2.bemBlock}__filelist`,
            attachButtonLabel : `.${FileInputV2.bemBlock}__widgetlabel`,
            dragArea: `.${FileInputV2.bemBlock}__dragarea`
        };

        constructor(params) {
            super(params);
        }
        widgetFields = {
            widget: this.getWidget(),
            fileListDiv: this.getFileListDiv(),
            model: () => this._model,
            dragArea: this.getDragArea()
        };

        getWidget() {
            return this.element.querySelector(FileInputV2.selectors.widget);
        }

        getDragArea() {
            return this.element.querySelector(FileInputV2.selectors.dragArea);
        }

        getDescription() {
            return this.element.querySelector(FileInputV2.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(FileInputV2.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(FileInputV2.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(FileInputV2.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(FileInputV2.selectors.qm);
        }

        getFileListDiv() {
            return this.element.querySelector(FileInputV2.selectors.fileListDiv);
        }

        #getAttachButtonLabel() {
            return this.element.querySelector(FileInputV2.selectors.attachButtonLabel);
        }

        updateValue(value) {
            if (this.widgetObject == null) {
                this.widgetObject = new FileInputWidgetV2(this.widgetFields);
            }
            this.widgetObject.setValue(value);
            super.updateEmptyStatus();
        }

        setModel(model) {
            super.setModel(model);
            if (this.widgetObject == null) {
                this.widgetObject = new FileInputWidgetV2(this.widgetFields);
            }
        }

        #syncWidget() {
            let widgetElement = this.getWidget ? this.getWidget() : null;
            if (widgetElement) {
                widgetElement.id = this.getId() + "__widget";
                this.#getAttachButtonLabel().setAttribute('for', this.getId() + "__widget");
            }

        }

        /*
          We are overriding the syncLabel method of the FormFieldBase class because for all components, 
          we pass the widgetId in 'for' attribute. However, for the file input component, 
          we already have a widget, so we should not pass the widgetId twice
        */
        #syncLabel() {
          let labelElement = typeof this.getLabel === 'function' ? this.getLabel() : null;
          if (labelElement) {
              labelElement.setAttribute('for', this.getId());
          }
        }

        syncMarkupWithModel() {
            super.syncMarkupWithModel();
            this.#syncWidget();
            this.#syncLabel();
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new FileInputV2({element, formContainer})
    }, FileInputV2.selectors.self);

})();
