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
import * as datePickerFormJson from "./mocks/formModel.json";
import FormContainer from "../src/view/FormContainer";
import Form from "@aemforms/af-core/lib/Form";
import DatePicker from "../src/view/DatePicker";

test('datepicker test', () => {
    document.body.innerHTML = `
    <div class="cmp-datepicker" data-cmp-is="datepicker" data-cmp-formcontainer="/content/forms/af/try1/jcr:content/guideContainer">
        <label for="/content/forms/af/try1/jcr:content/guideContainer/datepicker">Date of Birth</label>
        <input type="date" id="/content/forms/af/try1/jcr:content/guideContainer/datepicker">
    </div>`;
    let containerPath = "/content/forms/af/try1/jcr:content/guideContainer";
    let datePickerId = "/content/forms/af/try1/jcr:content/guideContainer/datepicker";
    let formContainer = new FormContainer({_formJson: datePickerFormJson, path: containerPath});
    formContainer.initialise().then(() => {
        expect(formContainer.getModel()).toBeInstanceOf(Form);
        expect(formContainer.getField(datePickerId)).toBeNull();
        let fieldElements = document.querySelectorAll(DatePicker.selectors.self);
        for (let i = 0; i < fieldElements.length; i++) {
            let datePickerField = new DatePicker({element: fieldElements[i], formContainer: formContainer});
            let formField = formContainer.getField(datePickerId);
            expect(formField).not.toBeNull();
            expect(formField.getId()).toEqual(datePickerId);
        }
    });

});