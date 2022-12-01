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

    class Accordion extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "accordion";
        static bemBlock = 'cmp-accordion'
        static selectors  = {
            self: `.${Accordion.bemBlock}`,
            description: `.${Accordion.bemBlock}__longdescription`,
            qm: `.${Accordion.bemBlock}__questionmark`,
            tooltipDiv: `.${Accordion.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
        }

        getClass() {
            return Accordion.IS;
        }

        getWidget() {
            return null;
        }

        getDescription() {
          return this.element.querySelector(Accordion.selectors.description);
        }

        getLabel() {
            return null;
        }

        getErrorDiv() {
            return null;
        }

        getTooltipDiv() {
          return this.element.querySelector(Accordion.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Accordion.selectors.qm);
        }

        setFocus() {
            this.setActive();
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Accordion({element, formContainer})
    }, Accordion.selectors.self);
})();
