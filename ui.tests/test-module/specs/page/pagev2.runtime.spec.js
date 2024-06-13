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

describe("Form with Page component version 2", () => {

    const pagePath = "content/forms/af/core-components-it/samples/page/afv2.html"
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it(" form should get rendered with main tag in body ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.get("html body main form").should("exist");
    })
})

describe("Form with Page component version 2 for eds rendering", () => {
    const pagePath = "/bin/franklin.delivery/adobe-rnd/aem-boilerplate-forms/main/content/forms/af/core-components-it/samples/page/afv2.html"
    beforeEach(() => {
        cy.openPage(pagePath);
    });

    it(" form should get rendered with main tag in body and should have pre code tags ", () => {
        cy.get("html body main div div div pre code").should("exist");
        cy.get("html body main div div div pre code").then(($codeEle)=>{
            const encodedJson=$codeEle.get()[0].innerHTML;
            const formJson=JSON.parse(JSON.parse(encodedJson));
            expect(formJson).to.have.property("id");
            expect(formJson["id"]).to.equal("L2NvbnRlbnQvZm9ybXMvYWYvY29yZS1jb21wb25lbnRzLWl0L3NhbXBsZXMvcGFnZS9hZnYy");
            expect(formJson).to.have.property("fieldType");
            expect(formJson).to.have.property(":items");
            expect(formJson).to.have.property("title");
            expect(formJson).to.have.property("action");
            expect(formJson["action"]).to.equal("/adobe/forms/af/submit/L2NvbnRlbnQvZm9ybXMvYWYvY29yZS1jb21wb25lbnRzLWl0L3NhbXBsZXMvcGFnZS9hZnYy");

        })
    })
})
