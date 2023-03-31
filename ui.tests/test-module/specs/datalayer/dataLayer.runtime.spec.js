/*
 *  Copyright 2023 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

describe('Form with Data Layer', () => {
    const pagePath = "content/forms/af/core-components-it/samples/datalayer/basic.html";
    let formContainer = null;

    /**
    * initialization of form container before every test
    * */
    beforeEach(() => {
    cy.previewForm(pagePath).then(p => {
        formContainer = p;
        })
    });

    it('datalayer should get initialized properly', () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.window().then(function(win) {
            expect(win.adobeDataLayer).to.exist;
            expect(win.document.body.hasAttribute("data-cmp-data-layer-enabled")).to.be.true;
            expect(win.adobeDataLayer.addEventListener).to.not.be.undefined;
            expect(win.adobeDataLayer.getState).to.not.be.undefined;
            expect(win.adobeDataLayer.push).to.not.be.undefined;
            expect(win.adobeDataLayer.removeEventListener).to.not.be.undefined;
        });
    });

    it('datalayer should have page data', () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.window().then(function(win) {
            const dataLayer = win.adobeDataLayer.getState();
            expect(dataLayer.page).to.exist;
            const pageID = Object.keys(dataLayer.page)[0];
            expect(dataLayer.page[pageID]['@type']).to.be.eq('forms-components-examples/components/page');
            expect(dataLayer.page[pageID]['dc:title']).to.be.eq('Adaptive Form V2 (IT)');
            expect(dataLayer.page[pageID]['repo:modifyDate']).to.exist;
            expect(dataLayer.page[pageID]['repo:path']).to.exist;
            expect(dataLayer.page[pageID]['xdm:language']).to.exist;
            expect(dataLayer.page[pageID]['xdm:template']).to.exist;
        });
    });


    it('datalayer should have component data', () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.window().then(function(win) {
            const dataLayer = win.adobeDataLayer.getState();
            expect(dataLayer.component).to.exist;
            const componentID = Object.keys(dataLayer.component)[0];
            const pageID = Object.keys(dataLayer.page)[0];
            expect(dataLayer.component[componentID]['@type']).to.be.eq('forms-components-examples/components/form/textinput');
            expect(dataLayer.component[componentID]['dc:title']).to.be.eq('Text Input 1');
            expect(dataLayer.component[componentID]['parentId']).to.exist;
            expect(dataLayer.component[componentID]['parentId']).to.be.eq(pageID);
        });
    });
});
