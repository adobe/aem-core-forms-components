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
        static IS = "cmp-adaptiveform-panel";
        static CONTENT = "cmp-adaptiveform-panel-content";
        static selectors  = {
            self: "." + this.IS
        };

        constructor(params) {
            super(params);
        }

        getClass() {
            return Panel.IS;
        }

        getContentClass() {
            return Panel.CONTENT;
        }

    }

    function setup(event) {
        let formContainer =  event.detail;
        let panelElements = document.querySelectorAll(Panel.selectors.self);
        for (let i = 0; i < panelElements.length; i++) {
            let panel = new Panel({element: panelElements[i]});
            formContainer.addField(panel);
        }
        FormView.registerMutationObserver(Panel);
    }
    document.addEventListener("FormContainerInitialised", setup);
})();
