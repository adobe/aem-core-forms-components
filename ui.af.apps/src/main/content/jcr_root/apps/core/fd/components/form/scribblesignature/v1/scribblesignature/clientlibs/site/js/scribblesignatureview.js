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
    class ScribbleSignature extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormScribbleSignature";
        static bemBlock = 'cmp-adaptiveform-scribblesignature'
        static selectors  = {
            self: `[data-${this.NS}-is="${this.IS}"]`,
            widget: `.${ScribbleSignature.bemBlock}__widget`,
            label: `.${ScribbleSignature.bemBlock}__label`,
            description: `.${ScribbleSignature.bemBlock}__longdescription`,
            qm: `.${ScribbleSignature.bemBlock}__questionmark`,
            errorDiv: `.${ScribbleSignature.bemBlock}__errormessage`,
            tooltipDiv: `.${ScribbleSignature.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
        }

        getWidget() {
            return this.element.querySelector(ScribbleSignature.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(ScribbleSignature.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(ScribbleSignature.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(ScribbleSignature.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(ScribbleSignature.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(ScribbleSignature.selectors.qm);
        }

        setModel(model) {
            super.setModel(model);
            const canvas = this.getWidget();
            const context = canvas.getContext('2d');
            let isDrawing = false;

            canvas.addEventListener('mousedown', (e) => {
                isDrawing = true;
                context.beginPath();
                context.moveTo(e.offsetX, e.offsetY);
            });

            canvas.addEventListener('mousemove', (e) => {
                if (isDrawing) {
                    context.lineTo(e.offsetX, e.offsetY);
                    context.stroke();
                }
            });

            canvas.addEventListener('mouseup', () => {
                isDrawing = false;
                this._model.value = canvas.toDataURL();
            });

            canvas.addEventListener('mouseleave', () => {
                isDrawing = false;
            });

            this.widget.addEventListener('blur', () => {
                this.setInactive();
            });

            this.widget.addEventListener('focus', () => {
                this.setActive();
            });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new ScribbleSignature({element, formContainer})
    }, ScribbleSignature.selectors.self);

})();
