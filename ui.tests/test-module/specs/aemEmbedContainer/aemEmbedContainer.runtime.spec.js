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
describe("Sites with Aem Embed Container", () => {

    context('aem embed container in iframe mode ', function () {

        const pagePath = "/content/core-components-examples/library/adaptive-form/aemembedcontainer.html";

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openPage(pagePath);

        })

        const getIframeBody = () => {
            // get the iframe > document > body
            // and retry until the body element is not empty
            return cy
                .get('iframe')
                .its('0.contentDocument.body').should('not.be.empty')
                .then(cy.wrap)
        }

        it("test for iframe presence in for with data path as selected form", () => {
            cy.get('.cmp-aemform__iframecontent').should('have.length', 1);
            cy.get('.cmp-aemform__iframecontent').should('have.attr', "data-form-page-path", "/content/forms/af/core-components-it/samples/numberinput/basic");
        })

        it("test for aemembedcontainer presence inside iframe", () => {
            getIframeBody().find('.cmp-adaptiveform-container').should('have.length', 1);
            getIframeBody().find('.cmp-adaptiveform-container').find('.cmp-adaptiveform-numberinput__widget').should('have.length', 6);
        })

        it("test for form presence in nonIframe mode", () => {
            cy.get('.cmp-adaptiveform-container').should('have.length', 1);
            cy.get('.cmp-adaptiveform-container').find('.cmp-adaptiveform-textinput__widget').should('have.length', 8);
        })
    })
})