/*
 *  Copyright 2022 Adobe Systems Incorporated
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

const commons = require('../libs/commons/commons'),
      sitesSelectors = require('../libs/commons/sitesSelectors'),
      afConstants = require('../libs/commons/formsConstants');

//Testing footer with forms editor
describe('Footer - Authoring', function(){

    const getPreviewIframeBody = () => {
        // get the iframe > document > body
        // and retry until the body element is not empty
        return cy
            .get('iframe#ContentFrame')
            .its('0.contentDocument.body').should('not.be.empty')
            .then(cy.wrap)
    }

    const insertFooterInContainer = function(){
        const responsiveGridDropZone = "Drag components here", // todo:  need to localize this
              responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "']";
        cy.selectLayer('Edit')
        cy.insertComponent(responsiveGridDropZoneSelector, "Footer", afConstants.components.forms.resourceType.footer)
        cy.get('body').click(0,0)
    }

    context('Open Forms editor', function(){
        const pagePath = "/content/forms/af/core-components-it/blank",
              footerEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/footer/text",
              footerEditPathSelector = "[data-path='" + footerEditPath + "']",
              footerDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.footer.split("/").pop(),
              input = 'My Custom Footer'

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('Insert Footer in Form Container', function () {
            insertFooterInContainer();
        })

        it('Edit footer in component', function(){
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + footerEditPathSelector)
            cy.invokeEditableAction("[data-action='EDIT']")
            getPreviewIframeBody().find('.cmp-adaptiveform-footer__text').should('have.length',1).clear().type(input);
            cy.invokeEditableAction("[data-action='control#save']")
            cy.deleteComponentByPath(footerDrop);
        })

    })

})

