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
    const dropSeparatorInContainer = function() {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Separator", afConstants.components.forms.resourceType.separator);
        cy.get('body').click( 0,0);
    }

    const dropSeparatorInSites = function() {
        const dataPath = "/content/core-components-examples/library/adaptive-form/separator/jcr:content/root/responsivegrid/demo/component/container/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Separator", afConstants.components.forms.resourceType.separator);
        cy.get('body').click( 0,0);
    }

    const testSeparatorEditDialog = function(separatorEditPathSelector, separatorDrop, isSites) {
        if (isSites) {
            dropSeparatorInSites();
        } else {
            dropSeparatorInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + separatorEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(separatorDrop);
    }


    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            separatorEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/separator",
            separatorEditPathSelector = "[data-path='" + separatorEditPath + "']",
            separatorDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.separator.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert Separator in form container', function () {
            dropSeparatorInContainer();
            cy.deleteComponentByPath(separatorDrop);
        });

        it ('check edit dialog availability of Separator', function(){
            testSeparatorEditDialog(separatorEditPathSelector,separatorDrop
            );
        });

    });

    context('Open Sites Editor', function () {
        const   pagePath = "/content/core-components-examples/library/adaptive-form/separator",
            separatorEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/container/separator",
            separatorEditPathSelector = "[data-path='" + separatorEditPath + "']",
            separatorDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/container/' + afConstants.components.forms.resourceType.separator.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms Separator', function () {
            dropSeparatorInSites();
            cy.deleteComponentByPath(separatorDrop);
        });

        it ('check edit dialog availability of Separator', function(){
            testSeparatorEditDialog(separatorEditPathSelector,separatorDrop, true);
        });

    });
})