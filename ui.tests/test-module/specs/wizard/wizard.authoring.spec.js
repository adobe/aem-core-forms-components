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
const guideSelectors = require("../../libs/commons/guideSelectors");

describe('Page - Authoring', function () {
    // we can use these values to log in

    const dropWizardInContainer = function() {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Wizard Layout", afConstants.components.forms.resourceType.wizard);
        cy.get('body').click( 0,0);
    }

    const addComponentInWizard = function (componentString, componentType) {
        const dataPath="/content/forms/af/core-components-it/blank/jcr:content/guideContainer/wizard/*",
         wizardDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(wizardDropZoneSelector, componentString, componentType);
        cy.get('body').click( 0,0);
    }

    const dropWizardInSites = function() {
        const dataPath = "/content/core-components-examples/library/adaptive-form/wizard/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Wizard Layout", afConstants.components.forms.resourceType.wizard);
        cy.get('body').click( 0,0);
    }



    context('Open Forms Editor', function() {
        const pagePath = "/content/forms/af/core-components-it/blank",
            wizardLayoutDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.wizard.split("/").pop(),
            wizardEditPathSelector = "[data-path='" + wizardLayoutDrop + "']",
            wizardBlockBemSelector = '.cmp-adaptiveform-wizard',
            insertComponentDialog_searchField = ".InsertComponentDialog-components input[type='search']",
            editDialogNavigationPanelSelector = "[data-action='PANEL_SELECT']",
            textInputPath=wizardLayoutDrop+"/"+afConstants.components.forms.resourceType.formtextinput.split("/").pop(),
            numberInputPath=wizardLayoutDrop+"/"+afConstants.components.forms.resourceType.formnumberinput.split("/").pop(),
            textInputDataId="[data-id='"+textInputPath+"']",
            numberInputDataId="[data-id='" + numberInputPath + "']",
            textInputDataPath="[data-path='" + textInputPath + "']",
            numberInputDataPath="[data-path='" + numberInputPath + "']",
            editDialogConfigurationSelector = "[data-action='CONFIGURE']";
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert Wizard in form container', function () {
            dropWizardInContainer();
            cy.get(wizardEditPathSelector).should("exist");
            cy.deleteComponentByPath(wizardLayoutDrop);
        });

        it ('check edit dialog availability of Wizard', function(){
            dropWizardInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + wizardEditPathSelector);
            cy.get(editDialogConfigurationSelector).should('be.visible');
            cy.deleteComponentByPath(wizardLayoutDrop);
        });

        it('open edit dialog of Wizard', function(){
            dropWizardInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + wizardEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(wizardBlockBemSelector+'__editdialog').should('be.visible');
            cy.get('.cq-dialog-cancel').should('be.visible');
            cy.get('.cq-dialog-submit').should('be.visible');
            cy.get('.cq-dialog-cancel').click({force:true});
            cy.deleteComponentByPath(wizardLayoutDrop);
        });

        it('verify tabs in edit dialog of Wizard',function (){
            dropWizardInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + wizardEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(wizardBlockBemSelector+'__editdialog').contains('Basic').click({force:true});
            cy.get(wizardBlockBemSelector+'__editdialog').contains('Help Content').click({force:true});
            cy.get(wizardBlockBemSelector+'__editdialog').contains('Accessibility').click({force:true});
            cy.get('.cq-dialog-cancel').click({force:true});
            cy.deleteComponentByPath(wizardLayoutDrop) ;
        });

        it('verify Basic tab in edit dialog of Wizard',function (){
            dropWizardInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + wizardEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(wizardBlockBemSelector+'__editdialog').contains('Help Content').click({force:true});
            cy.get(wizardBlockBemSelector+'__editdialog').contains('Basic').click({force:true});
            cy.get("[name='./name']").should("exist");
            cy.get("[name='./jcr:title']").should("exist");
            cy.get("[name='./layout']").should("exist");
            cy.get("[name='./dataRef']").should("exist");
            cy.get("[name='./visible']").should("exist");
            cy.get("[name='./enabled']").should("exist");
            cy.get('.cq-dialog-cancel').click({force:true});
            cy.deleteComponentByPath(wizardLayoutDrop) ;
        });



        it('verify adding componenets in wizard',function(){
            dropWizardInContainer();
            addComponentInWizard("Adaptive Form Number Input", afConstants.components.forms.resourceType.formnumberinput);
            addComponentInWizard("Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
            cy.get(numberInputDataPath).should("exist");
            cy.get(textInputDataPath).should("exist");
            cy.deleteComponentByPath(wizardLayoutDrop) ;
        });

        // todo: flaky
        it('verify Navigation Working between tabs in Authoring', { retries: 3 }, function(){
            dropWizardInContainer();
            addComponentInWizard("Adaptive Form Number Input", afConstants.components.forms.resourceType.formnumberinput);
            addComponentInWizard("Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + wizardEditPathSelector);
            cy.invokeEditableAction(editDialogNavigationPanelSelector);
            cy.wait(2000);
            cy.get("table.cmp-panelselector__table").find("tr").should("have.length", 2);
            cy.get("table.cmp-panelselector__table").find(textInputDataId).find("td").first().should('be.visible').click({force:true});
            cy.get('body').click( 0,0);
            cy.get('div'+numberInputDataPath).should('have.css', 'height', '0px');
            cy.invokeEditableAction(editDialogNavigationPanelSelector);
            cy.get("table.cmp-panelselector__table").find(numberInputDataId).find("td").first().should('be.visible').click({force:true});
            cy.get('body').click( 0,0);
            cy.get('div'+textInputDataPath).should('have.css', 'height', '0px');
            cy.deleteComponentByPath(wizardLayoutDrop) ;
        });
    })

    context('Open Sites Editor', function () {
        const   pagePath = "/content/core-components-examples/library/adaptive-form/wizard",
            wizardEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/wizard",
            wizardBlockBemSelector = '.cmp-adaptiveform-wizard',
            editDialogConfigurationSelector = "[data-action='CONFIGURE']",
            wizardEditPathSelector = "[data-path='" + wizardEditPath + "']";

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms Wizard', { retries: 3 }, function () {
            dropWizardInSites();
            cy.deleteComponentByPath(wizardEditPath);
        });

        // adding retry, sometimes site editor does not load
        it('open edit dialog of aem forms Wizard', { retries: 3 }, function() {
            dropWizardInSites();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + wizardEditPathSelector);
            cy.invokeEditableAction(editDialogConfigurationSelector);
            cy.get(wizardBlockBemSelector+'__editdialog').contains('Help Content').click({force:true});
            cy.get(wizardBlockBemSelector+'__editdialog').contains('Basic').click({force:true});
            cy.get("[name='./name']").should("exist");
            cy.get("[name='./jcr:title']").should("exist");
            cy.get("[name='./layout']").should("exist");
            cy.get("[name='./dataRef']").should("exist");
            cy.get("[name='./visible']").should("exist");
            cy.get("[name='./enabled']").should("exist");
            cy.get('.cq-dialog-cancel').click({force:true});
            cy.deleteComponentByPath(wizardEditPath) ;

        });

    });
})