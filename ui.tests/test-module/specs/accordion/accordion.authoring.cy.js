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


const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

/**
 * Testing Accordion with Sites Editor
 */
describe('Page - Authoring', function () {
    // we can use these values to log in

    const dropAccordionInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Accordion", afConstants.components.forms.resourceType.accordion);
        cy.get('body').click(0, 0);
    }

    const dropAccordionInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/accordion/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Accordion", afConstants.components.forms.resourceType.accordion);
        cy.get('body').click(0, 0);
    }

    const testAccordionBehaviour = function (accordionEditPathSelector, accordionDrop, isSites) {
        if (isSites) {
            dropAccordionInSites();
        } else {
            dropAccordionInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + accordionEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get("[name='./name']")
            .should("exist");
        cy.get("[name='./jcr:title']")
            .should("exist");
        cy.get("[name='./layout']")
            .should("not.exist")
        cy.get("[name='./dataRef']")
            .should("exist");
        cy.get("[name='./visible']")
            .should("exist");
        cy.get("[name='./enabled']")
            .should("exist");
        cy.get("[name='./assistPriority']")
            .should("exist");
        cy.get("[name='./custom']")
            .should("exist");

        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(accordionDrop);
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            accordionEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/accordion",
            accordionPathSelector = "[data-path='" + accordionEditPath + "']";
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert Accordion in form container', {retries: 3}, function () {
            cy.cleanTest(accordionEditPath).then(function () {
                dropAccordionInContainer();
                cy.deleteComponentByPath(accordionEditPath);
            });
        });

        it('runtime time library should not be loaded', function() {
            cy.cleanTest(accordionEditPath).then(function () {
                cy.intercept('GET', /jcr:content\/guideContainer\/accordion\.html/).as('accordionRequest');
                dropAccordionInContainer()
                cy.wait('@accordionRequest').then((interception) => {
                    const htmlContent = interception.response.body;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlContent, 'text/html');
                    const runtimeUrlPattern = /core\/fd\/af-clientlibs\/core-forms-components-runtime-base/;
                    const scriptTags = Array.from(doc.querySelectorAll('script[src]'));
                    console.log("tags ", scriptTags);
                    const isClientLibraryLoaded = scriptTags.some(script => runtimeUrlPattern.test(script.src));
                    expect(isClientLibraryLoaded).to.be.false;
                })
                cy.deleteComponentByPath(accordionEditPath);
            });
        })

        it('open edit dialog of Accordion', {retries: 3}, function () {
            cy.cleanTest(accordionEditPath).then(function() {
                testAccordionBehaviour(accordionPathSelector, accordionEditPath);
            });
        });

        it('switch accordion tabs', {retries: 3}, function () {
            cy.cleanTest(accordionEditPath).then(function(){
                dropAccordionInContainer();
                cy.get(`div[data-path='${accordionEditPath}/item_2']`).should('not.have.attr', 'data-cmp-expanded')
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + accordionPathSelector);
                cy.invokeEditableAction("[data-action='PANEL_SELECT']");
                cy.get("table.cmp-panelselector__table").find("tr").should("have.length", 2);
                cy.get("table.cmp-panelselector__table tr").eq(0)
                    .should("contain.text", "Adaptive Form Panel: Item 1");
                cy.get("table.cmp-panelselector__table tr").eq(1)
                    .should("contain.text", "Adaptive Form Panel: Item 2");
                cy.get("tr[data-name='item_2']").click();

                cy.get('body').click(0, 0);
                cy.invokeEditableAction("[data-action='PANEL_SELECT']");
                cy.get("tr[data-name='item_2']").click();
                cy.get(`div[data-path='${accordionEditPath}/item_1']`).should('not.have.attr', 'data-cmp-expanded')
                cy.deleteComponentByPath(accordionEditPath);
            });
        });

        it('open editable toolbar of 2nd accordion item', {retries: 3}, function () {
            cy.cleanTest(accordionEditPath).then(function(){
                dropAccordionInContainer();
                cy.reload();
                cy.get(`div[data-path='${accordionEditPath}/item_2']`).should('not.have.attr', 'data-cmp-expanded'); 
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + accordionPathSelector);
                cy.invokeEditableAction("[data-action='PANEL_SELECT']");
                cy.get("table.cmp-panelselector__table").find("tr").should("have.length", 2);
                cy.get("table.cmp-panelselector__table tr").eq(0)
                    .should("contain.text", "Adaptive Form Panel: Item 1");
                cy.get("table.cmp-panelselector__table tr").eq(1)
                    .should("contain.text", "Adaptive Form Panel: Item 2");
                cy.get("tr[data-name='item_2']").click();
                cy.get(`div[data-path='${accordionEditPath}/item_1']`).should('not.have.attr', 'data-cmp-expanded');
                cy.get('body').click(0, 0);
                cy.get(`div[data-path='${accordionEditPath}']`).click({force: true});
                cy.get(`div[data-path='${accordionEditPath}/item_2']`).click({force: true});
                cy.get('#EditableToolbar').should('be.visible');
                cy.deleteComponentByPath(accordionEditPath);
            });
        });
    })

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/accordion",
            accordionEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/accordion",
            accordionEditPathSelector = "[data-path='" + accordionEditPath + "']";

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);

        });

        it('insert aem forms Accordion', {retries: 3}, function () {
            cy.cleanTest(accordionEditPath).then(function () {
                dropAccordionInSites();
                cy.deleteComponentByPath(accordionEditPath);
            });
        });

        // todo: intermittent failure
        it('open edit dialog of aem forms Accordion', {retries: 3}, function () {
            cy.cleanTest(accordionEditPath).then(function () {
                testAccordionBehaviour(accordionEditPathSelector, accordionEditPath, true);
            });
        });

    });
})