/*******************************************************************************
 * Copyright 2026 Adobe
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
    class FileInputV4 extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormCustomFileInput";
        static bemBlock = 'cmp-adaptiveform-fileinput'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${FileInputV4.bemBlock}__widget`,
            label: `.${FileInputV4.bemBlock}__label`,
            description: `.${FileInputV4.bemBlock}__longdescription`,
            qm: `.${FileInputV4.bemBlock}__questionmark`,
            errorDiv: `.${FileInputV4.bemBlock}__errormessage`,
            tooltipDiv: `.${FileInputV4.bemBlock}__shortdescription`,
            fileListDiv : `.${FileInputV4.bemBlock}__filelist`,
            attachButtonLabel : `.${FileInputV4.bemBlock}__widgetlabel`,
            dragArea: `.${FileInputV4.bemBlock}__dragarea`
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
            return this.element.querySelector(FileInputV4.selectors.widget);
        }

        getDragArea() {
            return this.element.querySelector(FileInputV4.selectors.dragArea);
        }

        getDescription() {
            return this.element.querySelector(FileInputV4.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(FileInputV4.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(FileInputV4.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(FileInputV4.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(FileInputV4.selectors.qm);
        }

        getFileListDiv() {
            return this.element.querySelector(FileInputV4.selectors.fileListDiv);
        }

        getAttachButtonLabel() {
            return this.element.querySelector(FileInputV4.selectors.attachButtonLabel);
        }

        updateEnabled(enabled, state) {
            if (this.widget) {
                this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_ENABLED, enabled);
                const isDisabled = !enabled || state.readOnly;
                if (isDisabled) {
                    this.widget.setAttribute("disabled", "disabled");
                } else {
                    this.widget.removeAttribute("disabled");
                }
            }
        }

        updateValue(value) {
            if (this.widgetObject == null) {
                this.widgetObject = new CustomFileInputWidget(this.widgetFields);
            }
            this.widgetObject.setValue(value);
            super.updateEmptyStatus();
        }

        setModel(model) {
            super.setModel(model);
            if (this.widgetObject == null) {
                this.widgetObject = new CustomFileInputWidget(this.widgetFields);
            }
            this.getAttachButtonLabel().addEventListener('focus', () => {
                this.setActive();
            })
            this.getAttachButtonLabel().addEventListener('blur', () => {
                this.setInactive();
            })
        }

        syncWidget() {
            let widgetElement = this.getWidget ? this.getWidget() : null;
            if (widgetElement) {
                widgetElement.id = this.getId() + "__widget";
                const closestElement = widgetElement?.previousElementSibling;
                if (closestElement && closestElement.tagName.toLowerCase() === 'label') {
                    closestElement.setAttribute('for', this.getId() + "__widget");
                } else {
                    this.getAttachButtonLabel().removeAttribute('for');
                }
            }
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new FileInputV4({element, formContainer})
    }, FileInputV4.selectors.self);

})();
