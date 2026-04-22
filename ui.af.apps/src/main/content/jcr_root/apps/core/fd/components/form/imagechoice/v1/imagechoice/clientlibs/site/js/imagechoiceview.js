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
    class ImageChoice extends FormView.FormOptionFieldBase {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormImageChoice";
        static bemBlock = 'cmp-adaptiveform-imagechoice';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widgets: `.${ImageChoice.bemBlock}__widget`,
            widget: `.${ImageChoice.bemBlock}__option__widget`,
            label: `.${ImageChoice.bemBlock}__label`,
            description: `.${ImageChoice.bemBlock}__longdescription`,
            qm: `.${ImageChoice.bemBlock}__questionmark`,
            errorDiv: `.${ImageChoice.bemBlock}__errormessage`,
            tooltipDiv: `.${ImageChoice.bemBlock}__shortdescription`,
            option: `.${ImageChoice.bemBlock}__option`,
            optionLabel: `.${ImageChoice.bemBlock}__option-label`,
            optionImage: `.${ImageChoice.bemBlock}__option-image`,
            optionText: `.${ImageChoice.bemBlock}__option-text`
        };

        constructor(params) {
            super(params);
            this.qm = this.element.querySelector(ImageChoice.selectors.qm);
            this._selectionType = this.element.getAttribute('data-cmp-selection-type') || 'single';
        }

        get isMultiSelect() {
            return this._selectionType === 'multi';
        }

        getWidgets() {
            return this.element.querySelector(ImageChoice.selectors.widgets);
        }

        getWidget() {
            return this.element.querySelectorAll(ImageChoice.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(ImageChoice.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(ImageChoice.selectors.label);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(ImageChoice.selectors.qm);
        }

        getTooltipDiv() {
            return this.element.querySelector(ImageChoice.selectors.tooltipDiv);
        }

        getErrorDiv() {
            return this.element.querySelector(ImageChoice.selectors.errorDiv);
        }

        getOptions() {
            return this.element.querySelectorAll(ImageChoice.selectors.option);
        }

        #addWidgetListeners(optionWidget) {
            optionWidget.addEventListener('change', (e) => {
                if (this.isMultiSelect) {
                    this.#updateMultiValue();
                } else {
                    this.setModelValue(e.target.value);
                }
            });
            optionWidget.addEventListener('focus', (e) => {
                this.setActive();
            });
            optionWidget.addEventListener('blur', (e) => {
                this.setInactive();
            });
        }

        setModel(model) {
            super.setModel(model);
            this.widget.forEach(optionWidget => {
                this.#addWidgetListeners(optionWidget);
            });
            if (this.isMultiSelect) {
                this.#updateMultiValue();
            }
        }

        #updateMultiValue() {
            let value = [];
            this.widget.forEach(widget => {
                if (widget.checked) {
                    value.push(widget.value);
                }
            }, this);
            if (value.length !== 0 || this._model.value != null) {
                this.setModelValue(value);
            }
        }

        updateEnabled(enabled, state) {
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_ENABLED, enabled);
            this.widget.forEach(widget => {
                if (enabled === false) {
                    if (state.readOnly === false) {
                        widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, "disabled");
                    }
                } else if (state.readOnly === false) {
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
                }
            });
        }

        updateReadOnly(readonly) {
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_READONLY, readonly);
            this.widget.forEach(widget => {
                if (readonly === true) {
                    widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, "disabled");
                    widget.setAttribute("aria-readonly", true);
                } else {
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
                    widget.removeAttribute("aria-readonly");
                }
            });
        }

        updateValidity(validity) {
            if (validity.valid === undefined) {
                this.element.removeAttribute(FormView.Constants.DATA_ATTRIBUTE_VALID);
                this.widget.forEach(widget => widget.removeAttribute(FormView.Constants.ARIA_INVALID));
            } else {
                this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_VALID, validity.valid);
                this.widget.forEach(widget => widget.setAttribute(FormView.Constants.ARIA_INVALID, !validity.valid));
            }
        }

        updateValue(modelValue) {
            if (this.isMultiSelect) {
                modelValue = [].concat(modelValue);
                let selectedWidgetValues = modelValue.map(String);
                this.widget.forEach(widget => {
                    if (selectedWidgetValues.includes(widget.value)) {
                        widget.checked = true;
                        widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.HTML_ATTRS.CHECKED);
                    } else {
                        widget.checked = false;
                        widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
                    }
                }, this);
            } else {
                this.widget.forEach(widget => {
                    if (modelValue != null && widget.value != null && (modelValue.toString() == widget.value.toString())) {
                        widget.checked = true;
                        widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.HTML_ATTRS.CHECKED);
                    } else {
                        widget.checked = false;
                        widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
                    }
                }, this);
            }
            super.updateEmptyStatus();
        }

        #createOption(value, itemLabel) {
            let inputType = this.isMultiSelect ? 'checkbox' : 'radio';
            let richScreenReaderText = `${this._model.label.value}:  ${itemLabel}`;
            let plainScreenReaderText = window.DOMPurify ? window.DOMPurify.sanitize(richScreenReaderText, { ALLOWED_TAGS: [] }) : richScreenReaderText;

            const optionDiv = document.createElement('div');
            optionDiv.className = ImageChoice.selectors.option.slice(1);

            const label = document.createElement('label');
            label.className = ImageChoice.selectors.optionLabel.slice(1);

            const input = document.createElement('input');
            input.type = inputType;
            input.name = this._model.name;
            input.className = ImageChoice.selectors.widget.slice(1);
            input.value = value;
            input.setAttribute('aria-label', plainScreenReaderText);
            input.tabIndex = 0;
            if (this._model.readOnly === true || this._model.enabled === false) {
                input.setAttribute('disabled', 'true');
                if (this._model.readOnly === true) {
                    input.setAttribute('aria-readonly', 'true');
                }
            }

            const imageSpan = document.createElement('span');
            imageSpan.className = ImageChoice.selectors.optionImage.slice(1);

            // Look up image by finding the index of this value in the model's enum array
            let layout = this._model.properties && this._model.properties['afs:layout'];
            let imageSrcArray = layout && layout.imageSrc;
            let enumArray = this._model.enum;
            if (imageSrcArray && enumArray) {
                let idx = enumArray.indexOf(value);
                if (idx === -1) {
                    idx = enumArray.findIndex(e => String(e) === String(value));
                }
                if (idx >= 0 && imageSrcArray[idx]) {
                    let altText = window.DOMPurify ? window.DOMPurify.sanitize(itemLabel, { ALLOWED_TAGS: [] }) : itemLabel;
                    const img = document.createElement('img');
                    img.src = imageSrcArray[idx];
                    img.alt = altText;
                    img.className = 'cmp-adaptiveform-imagechoice__image';
                    imageSpan.appendChild(img);
                }
            }

            const textSpan = document.createElement('span');
            textSpan.className = ImageChoice.selectors.optionText.slice(1);
            let purifiedLabel = window.DOMPurify ? window.DOMPurify.sanitize(itemLabel) : itemLabel;
            textSpan.innerHTML = purifiedLabel;

            label.appendChild(input);
            label.appendChild(imageSpan);
            label.appendChild(textSpan);
            optionDiv.appendChild(label);

            this.#addWidgetListeners(input);
            return optionDiv;
        }

        updateEnum(newEnums) {
            super.updateEnumForRadioButtonAndCheckbox(newEnums, this.#createOption);
            this.widget = this.getWidget();
        }

        updateEnumNames(newEnumNames) {
            // Override parent behavior: parent's updateEnumNamesForRadioButtonAndCheckbox
            // does option.querySelector('span') which grabs the __option-image span (first span)
            // and overwrites its innerHTML with text, destroying the <img>.
            // Instead, target the __option-text span specifically.
            let options = [...this.getOptions()];
            if (options.length === 0) {
                newEnumNames.forEach((enumName, index) => {
                    const enumValue = this._model.enum?.[index] ?? enumName;
                    this.getWidgets().appendChild(this.#createOption(enumValue, enumName));
                });
            } else {
                options.forEach((option, index) => {
                    let textSpan = option.querySelector(ImageChoice.selectors.optionText);
                    let input = option.querySelector(ImageChoice.selectors.widget);
                    if (index < newEnumNames.length) {
                        let purifiedValue = window.DOMPurify ? window.DOMPurify.sanitize(newEnumNames[index]) : newEnumNames[index];
                        if (textSpan) {
                            textSpan.innerHTML = purifiedValue;
                        }
                        if (input && input.hasAttribute("aria-label")) {
                            let richScreenReaderText = `${this._model.label.value}:  ${purifiedValue}`;
                            let plainScreenReaderText = window.DOMPurify ? window.DOMPurify.sanitize(richScreenReaderText, { ALLOWED_TAGS: [] }) : richScreenReaderText;
                            input.setAttribute("aria-label", plainScreenReaderText);
                        }
                    }
                });
            }
            this.widget = this.getWidget();
        }

        updateRequired(required, state) {
            if (this.widget) {
                this.element.toggleAttribute("required", required);
                this.element.setAttribute("data-cmp-required", required);
                this.element.setAttribute("aria-required", required);
                let widgetsContainer = this.getWidgets();
                if (widgetsContainer) {
                    widgetsContainer.setAttribute("aria-required", required);
                }
            }
        }

        syncMarkupWithModel() {
            // Do NOT call super.syncMarkupWithModel() which rebuilds options
            // from enum/enumNames and destroys the server-rendered images.
            // Only sync widget names with the model.
            this.#syncWidgetName();
        }

        #syncWidgetName() {
            const name = this.getModel()?.name;
            this.widget.forEach(widget => {
                widget.setAttribute("name", `${this.id}_${name}`);
            });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new ImageChoice({element, formContainer});
    }, ImageChoice.selectors.self);

})();
