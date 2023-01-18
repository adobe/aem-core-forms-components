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
        sitesConstants = require('../libs/commons/sitesConstants'),
        guideSelectors = require('../libs/commons/guideSelectors'),
        afConstants = require('../libs/commons/formsConstants');

describe('Page - Authoring', function () {
    // we can use these values to log in

const dropPageHeaderInContainer = function() {
    const responsiveGridDropZone = "/content/forms/af/core-components-it/blank/jcr:content/parsys1/*", 
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + responsiveGridDropZone + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Header", afConstants.components.forms.resourceType.pageheader);
    cy.get('body').click(0,0);
    }

const dropPageHeaderInSites = function() {
    const dataPath =  "/content/core-components-examples/library/adaptive-form/pageheader/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Header", afConstants.components.forms.resourceType.pageheader);
    cy.get('body').click(0,0);
    }


context('Drag drop the pageheader', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
    pageheaderDrop = pagePath + afConstants.FORM_EDITOR_LAYOUT_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.pageheader.split("/").pop(),
    imageDrop = pagePath + afConstants.FORM_EDITOR_LAYOUT_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.pageheader.split("/").pop()+'/image',
    textDrop = pagePath + afConstants.FORM_EDITOR_LAYOUT_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.pageheader.split("/").pop()+'/text';
    beforeEach(function () {
        // this is done since cypress session results in 403 sometimes
        cy.openAuthoring(pagePath);
    });

    it('insert PageHeader in form container', function () {
        dropPageHeaderInContainer();
        cy.deleteComponentByPath(pageheaderDrop);
    });

    it('deleting image from the pageheader', function () {
        dropPageHeaderInContainer();
        cy.deleteComponentByPath(imageDrop);
    });

    it('deleting text from the pageheader', function () {
        dropPageHeaderInContainer();
        cy.deleteComponentByPath(textDrop);
    });
    
     // no edit dialogue for text editor, no test for that
    })

context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/pageheader",
        pageheaderDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX +'/guideContainer/'+ afConstants.components.forms.resourceType.pageheader.split("/").pop();

    beforeEach(function () {
        // this is done since cypress session results in 403 sometimes
        cy.openAuthoring(pagePath);
    });

    it('insert aem forms Page Header', function () {
        dropPageHeaderInSites();
        cy.deleteComponentByPath(pageheaderDrop);
    });
    
      })

})