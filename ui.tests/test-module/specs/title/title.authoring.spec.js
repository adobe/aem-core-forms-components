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

const afConstants = require("../../libs/commons/formsConstants");
const sitesSelectors = require("../../libs/commons/sitesSelectors");


describe('Page - Authoring', function () {
    const dropTitleInContainer = function() {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Title", afConstants.components.forms.resourceType.title);
        cy.get('body').click( 0,0);
    }

    const dropTitleInSites = function() {
        const dataPath = "/content/core-components-examples/library/adaptive-form/title/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Title", afConstants.components.forms.resourceType.title);
        cy.get('body').click( 0,0);
    }

    const testTitleEditDialog = function(titleEditPathSelector, titleDrop, isSites) {
        if (isSites) {
            dropTitleInSites();
        } else {
            dropTitleInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + titleEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(titleDrop);
    }


    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            titleEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/title",
            titleEditPathSelector = "[data-path='" + titleEditPath + "']",
            titleDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.title.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert Title in form container', function () {
            dropTitleInContainer();
            cy.deleteComponentByPath(titleDrop);
        });

        it ('check edit dialog availability of Title', function(){
            testTitleEditDialog(titleEditPathSelector,titleDrop
            );
        });

    });

    context('Open Sites Editor', function () {
        const   pagePath = "/content/core-components-examples/library/adaptive-form/title",
            titleEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/title",
            titleEditPathSelector = "[data-path='" + titleEditPath + "']",
            editDialogConfigurationSelector = "[data-action='CONFIGURE']",
            titleDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.title.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms Title', function () {
            dropTitleInSites();
            cy.deleteComponentByPath(titleDrop);
        });

        it ('check edit dialog availability of Title', function(){
           testTitleEditDialog(titleEditPathSelector,titleDrop, true);
        });

    });
})