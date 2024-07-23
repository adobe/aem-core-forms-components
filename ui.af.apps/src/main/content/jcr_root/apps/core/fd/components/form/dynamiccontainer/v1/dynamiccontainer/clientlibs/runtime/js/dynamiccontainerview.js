/*******************************************************************************
 * Copyright 2024 Adobe
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
(function () {

    class DynamicContainer extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormDynamicContainer";
        static bemBlock = 'cmp-adaptiveform-dynamiccontainer'
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            label: `.${DynamicContainer.bemBlock}__label`,
            description: `.${DynamicContainer.bemBlock}__longdescription`,
            qm: `.${DynamicContainer.bemBlock}__questionmark`,
            tooltipDiv: `.${DynamicContainer.bemBlock}__shortdescription`,
            content: `.${DynamicContainer.bemBlock}__content`
        };

        html = null;

        visited = false;

        constructor(params) {
            super(params);
        }

        getClass() {
            return DynamicContainer.IS;
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
        }

        getWidgetId(){
          return this.getId();
        }

        getWidget() {
            return null;
        }

        getDescription() {
            return this.element.querySelector(DynamicContainer.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(DynamicContainer.selectors.label);
        }

        getErrorDiv() {
            //error div is not defined
            return null;
        }

        getTooltipDiv() {
            return null;
        }

        getQuestionMarkDiv() {
            return null;
        }

        handleChildRemoval(removedInstanceView) {
            this.children.splice(this.children.indexOf(removedInstanceView), 1);
        }

        #executeGETCall(url, callback) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        callback(null, xhr.responseText);
                    } else {
                        callback(new Error('Request failed with status: ' + xhr.status), null);
                    }
                }
            };
            xhr.open('GET', url, true);
            xhr.send();
        }

        async #fetchData(url) {
            return new Promise((resolve, reject) => {
                this.#executeGETCall(url, (error, response) => {
                    if (error) {
                        console.error('Error:', error);
                        reject(error);
                    } else {
                        console.log('Response:', response);
                        resolve(response);
                    }
                })
            })
        }

        async #stitchHTMLInDOM(json) {
            if(document.getElementById(this.id).querySelector(DynamicContainer.selectors.content).childElementCount === 0) {
                let data = { "modelJSON" : json };
                const params = new URLSearchParams(data).toString();
                const html = await this.#fetchData(this._model.properties['fd:path'] + '.af.generate.html?' + params); // fetch html from server
                const container = document.createElement('div');
                container.innerHTML = html;
                let finalHTML = container.children[0];
                document.getElementById(this.id).querySelector(DynamicContainer.selectors.content).appendChild(finalHTML);
                return finalHTML;
            }
        }

        async setActive() {
            if(document.getElementById(this.id).querySelector(DynamicContainer.selectors.content).childElementCount === 0 && this.visited === false) { //fetch the json only if content is empty
                this.visited = true;
                let jsonModel = await this.#fetchData(this._model._jsonModel.dataModelRef);
                this.html = await this.#stitchHTMLInDOM(jsonModel); // stitching the html
                this.formContainer._model.importModel(this._model, JSON.parse(jsonModel)); // updating the model
            }
        }

        setModel(model) {
            super.setModel(model);
        }

        updateAppendDynamicItems(dynamicPanelView, dynamicPanelModel) {
            FormView.Utils.createViewAndRegisterMutationObservers(this.html , this.formContainer);
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new DynamicContainer({element, formContainer})
    }, DynamicContainer.selectors.self);
})();
