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
import Utils from "./utils";
import {createFormInstance, FileObject, extractFileInfo, Click, Change, Submit, Blur, AddItem, RemoveItem} from "@aemforms/af-core";
import {FormField, FormContainer, FormFieldBase, FormPanel} from "./view";
import {Constants} from "./constants";
import GuideBridge from "./GuideBridge";
import HTTPAPILayer from "./HTTPAPILayer";

window.af = {
    formsRuntime: {
        model: {
            form: {}
        },
        view: {
            formContainer: {},
            utils: {}
        },
        events: {}
    }
}
window.guideBridge = new GuideBridge();

const Actions = {
    Click, Change, Submit, Blur, AddItem, RemoveItem
}

export {createFormInstance, FormField, FormFieldBase, FormPanel, FormContainer, Constants, Utils, Actions, HTTPAPILayer, FileObject, extractFileInfo};