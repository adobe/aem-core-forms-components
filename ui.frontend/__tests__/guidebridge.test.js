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

import {Constants} from "../src";
import FormContainer from "../src/view/FormContainer";
import * as formJson from './resources/form.json';


test('GuideBridge test', () => {
   expect(window.guideBridge).not.toBeNull();
   guideBridge.connect(function() {
       expect(guideBridge.isConnected()).toBeTruthy();
       let formData = guideBridge.getData();
       expect(formData).not.toBeNull();
       expect(formData.hasOwnProperty("textinput1662370110841")).toBeTruthy();
       let formModel = guideBridge.getFormModel();
       expect(formModel).not.toBeNull();
       formModel.importData({"textinput1662370110841" : "test"});
       expect(guideBridge.validate()).toBeTruthy();
       formModel.importData({"textinput1662370110841" : "test123"});
       expect(guideBridge.validate()).toBeFalsy();
   });
   var formContainer = new FormContainer({
       _formJson: formJson,
       _path: "/a/b/c"
   });
   const event = new CustomEvent(Constants.FORM_CONTAINER_INITIALISED, { "detail": formContainer });
   document.dispatchEvent(event);
});