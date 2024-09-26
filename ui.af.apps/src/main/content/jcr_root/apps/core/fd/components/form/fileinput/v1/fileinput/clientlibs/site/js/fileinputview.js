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
(function() {

    "use strict";
    class FileInput extends FormView.FormFileInput {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormFileInput";
        static bemBlock = 'cmp-adaptiveform-fileinput'
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${FileInput.bemBlock}__widget`,
            label: `.${FileInput.bemBlock}__label`,
            description: `.${FileInput.bemBlock}__longdescription`,
            qm: `.${FileInput.bemBlock}__questionmark`,
            errorDiv: `.${FileInput.bemBlock}__errormessage`,
            tooltipDiv: `.${FileInput.bemBlock}__shortdescription`,
            fileListDiv: `.${FileInput.bemBlock}__filelist`,
            attachButtonLabel: `.${FileInput.bemBlock}__widgetlabel`
        };

        constructor(params) {
            super(params);
        }

        widgetFields = {
            widget: this.getWidget(),
            fileListDiv: this.getFileListDiv(),
            model: () => this._model
        }

        getWidget() {
            return this.element.querySelector(FileInput.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(FileInput.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(FileInput.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(FileInput.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(FileInput.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(FileInput.selectors.qm);
        }

        getFileListDiv() {
            return this.element.querySelector(FileInput.selectors.fileListDiv);
        }

        getAttachButtonLabel() {
            return this.element.querySelector(FileInput.selectors.attachButtonLabel);
        }

        updateValue(value) {
            if (this.widgetObject == null) {
                this.widgetObject = new FileInputWidget(this.widgetFields)
            }
            this.widgetObject.setValue(value);
            super.updateEmptyStatus();
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

        setModel(model) {
            super.setModel(model);
            if (this.widgetObject == null) {
                this.widgetObject = new FileInputWidget(this.widgetFields)
            }
            this.getAttachButtonLabel().addEventListener('focus', () => {
                this.setActive();
            })
            this.getAttachButtonLabel().addEventListener('blur', () => {
                this.setInactive();
            })
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new FileInput({element, formContainer})
    }, FileInput.selectors.self);

})();
