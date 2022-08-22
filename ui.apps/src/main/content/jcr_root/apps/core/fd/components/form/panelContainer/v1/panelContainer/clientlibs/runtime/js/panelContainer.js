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

    class Panel extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormPanel";
        static VALID = FormView.Constants.VALID;
        static ENABLED = FormView.Constants.ENABLED;
        static VISIBLE = FormView.Constants.VISIBLE;
        static ACTIVE = FormView.Constants.ACTIVE;
        static ARIA_DISABLED = FormView.Constants.ARIA_DISABLED;
        static ARIA_HIDDEN = FormView.Constants.ARIA_HIDDEN;
        static ARIA_INVALID = FormView.Constants.ARIA_INVALID;

        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]'
        };

        static setters = {
            valid : function (element, value) {
                if (value == true) {
                    element.setAttribute(Panel.VALID, true);
                    element.setAttribute(Panel.ARIA_INVALID, false);
                } else if (value == false) {
                    element.setAttribute(Panel.VALID, false);
                    element.setAttribute(Panel.ARIA_INVALID, true);
                }
            },
            enabled : function (element, value) {
                if (value == true) {
                    element.setAttribute(Panel.ENABLED, true);
                    element.setAttribute(Panel.ARIA_DISABLED, false);
                } else if (value == false) {
                    element.setAttribute(Panel.ENABLED, false);
                    element.setAttribute(Panel.ARIA_DISABLED, true);
                }
            },
            visible : function (element, value) {
                if (value == true) {
                    element.setAttribute(Panel.VISIBLE, true);
                    element.setAttribute(Panel.ARIA_HIDDEN, false);
                } else if (value == false) {
                    element.setAttribute(Panel.VISIBLE, false);
                    element.setAttribute(Panel.ARIA_HIDDEN, true);
                }
            }
        }

        constructor(params) {
            super(params);
        }

        getClass() {
            return Panel.IS;
        }

        // Set of functions that impact accessibility and appearance
        setFocus() {
            this.setActive();
            // Below aligns with AF 1.0, but we have had bugs because focus is not set on non form element
            // preceding the first form element, hence discontinuing.

            /*
            // Focus the first child, that will automatically make this panel active
            // otherwise just make the panel active
            if (this.children[0] && this.children[0].setFocus) {
                this.children[0].setFocus();
            } else {
                this.setActive();
            }*/
        }

        setActive() {
            this.element.setAttribute(Panel.ACTIVE, true);
            if (this.parentView && this.parentView.setActive) {
                this.parentView.setActive();
            }
        }

        setInactive() {
            this.element.setAttribute(Panel.ACTIVE, false);
            if (this.parentView && this.parentView.setInactive) {
                this.parentView.setInactive();
            }
        }

        setState(state) {
            //Explicit checks for true and false, to prevent tampering the initial state
            for (const prop in Object.keys(Panel.setters)) {
                if (prop in state) {
                    Panel.setters[prop](this.element, state[prop])
                }
            }
        }
    }

    function setup(event) {
        let formContainer =  event.detail;
        let panelElements = document.querySelectorAll(Panel.selectors.self);
        for (let i = 0; i < panelElements.length; i++) {
            let panel = new Panel({element: panelElements[i], formContainer: formContainer});
            formContainer.addField(panel);
        }
        FormView.Utils.registerMutationObserver(Panel);
    }
    document.addEventListener(FormView.Constants.FORM_CONTAINER_INITIALISED, setup);
})();
