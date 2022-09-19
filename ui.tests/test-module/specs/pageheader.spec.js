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
        // const responsiveGridDropZone = "Drag components here", // todo:  need to localize this
        // responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "']";
        // console.log(responsiveGridDropZoneSelector, "Adaptive Form Page Header component", afConstants.components.forms.resourceType.pageheader);

describe('Page - Authoring', function () {
    // we can use these values to log in
const dropPageHeaderInContainer = function() {
    const responsiveGridDropZone = "Drag components here", // todo:  need to localize this
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-text='" + responsiveGridDropZone + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Page Header", afConstants.components.forms.resourceType.pageheader);
    // console.log(responsiveGridDropZoneSelector, "Adaptive Form Page Header component", afConstants.components.forms.resourceType.pageheader);
    cy.get('body').click(0,0);
    }

const dropPageHeaderInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/pageheader/jcr:content/root/responsivegrid/demo/component/container/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Page Header", afConstants.components.forms.resourceType.pageheader);
    cy.get('body').click(0,0);
    }


context('Drag drop the pageheader', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        pageheaderEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/pageheader",
        pageheaderEditPathSelector = "[data-path='" + pageheaderEditPath + "']",
        pageheaderDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.pageheader.split("/").pop();
    beforeEach(function () {
        // this is done since cypress session results in 403 sometimes
        cy.openAuthoring(pagePath);
    });

    it('insert PageHeader in form container', function () {
        dropPageHeaderInContainer();
        cy.deleteComponentByPath(pageheaderDrop);
    });
     // no edit dialogue for text editor, no test for that
    })

context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/pageheader",
        pageheaderEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/container/pageheader",
        pageheaderEditPathSelector = "[data-path='" + pageheaderEditPath + "']",
        pageheaderDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/container/' + afConstants.components.forms.resourceType.pageheader.split("/").pop();

    beforeEach(function () {
        // this is done since cypress session results in 403 sometimes
        cy.openAuthoring(pagePath);
    });

    // removing the testing for site editor for now
    // it('insert aem forms Page Header', function () {
    //     dropPageHeaderInSites();
    //     cy.deleteComponentByPath(pageheaderDrop);
    // });

    // it('open edit dialog of aem forms PageHeader', function() {
    //     testTextInputBehaviour(textInputEditPathSelector, textInputDrop, true);
    // });
    
      })

})