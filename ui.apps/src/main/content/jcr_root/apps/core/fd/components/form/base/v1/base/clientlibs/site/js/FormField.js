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
(function($) {
    "use strict";

    window.af = window.af || {};
    window.af.formsRuntime = window.af.formsRuntime || {};
    window.af.formsRuntime.view = window.af.formsRuntime.view || {};

    window.af.formsRuntime.view.FormField = class FormField {

        constructor(params) {
            this._model = params._model;  //runtime model of field
            this.element = params.element; //html element of field
            this.options = params.options; //dataset of field
            this._formContainer =  params._formContainer;
        }

        createWidgetOptions() {
            console.log("createWidgetOptions");
        }

        getFormContainer() {
            return this._formContainer;
        }

        setElement(element) {
            this.element = element;
        }

        setOptions(options) {
            this.options = options;
        }

        getModel() {
            return this._model;
        }

        getWidgetName() {
            return this._model._jsonModel.fieldType;
        }

        handleValueChanged() {
            console.log("handleValueChanged");
        }

        handleClick() {
            console.log("handleClick");
        }

        handleOnChange(value) {
            this._model.value = value;
        }

        subscribe() {
            this._model.subscribe((action) => {
                let state = action.target.getState();
                console.log(action.target.getState());
                if (!state.valid) {
                    alert(state.errorMessage);
                }
            });
        }
    }

})(jQuery);
