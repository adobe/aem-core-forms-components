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

describe('Page - Authoring', function () {

    const dropDatePickerInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Date Picker", afConstants.components.forms.resourceType.datepicker);
        cy.get('body').click(0, 0);
    }

    const dropDatePickerInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/datepicker/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Date Picker", afConstants.components.forms.resourceType.datepicker);
        cy.get('body').click(0, 0);
    }

    const testDatePickerEditDialog = function (datePickerEditPathSelector, datePickerDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-datepicker__editdialog'
        if (isSites) {
            dropDatePickerInSites();
        } else {
            dropDatePickerInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + datePickerEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(datePickerDrop);
    }

    const testDatePickerBasicTab = function (datePickerEditPathSelector, datePickerDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-datepicker__editdialog'
        if (isSites) {
            dropDatePickerInSites();
        } else {
            dropDatePickerInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + datePickerEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get("[name='./name']").should("exist");
        cy.get("[name='./jcr:title']").should("exist");
        cy.get("[name='./hideTitle']").should("exist");
        cy.get("[name='./placeholder']").should("exist");
        cy.get("[name='./default']").should("exist");
        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(datePickerDrop);
    }

    const testDatePickerValidationTab = function (datePickerEditPathSelector, datePickerDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-datepicker__editdialog'
        if (isSites) {
            dropDatePickerInSites();
        } else {
            dropDatePickerInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + datePickerEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get(bemEditDialog).contains('Validation').click({force:true});
        cy.get("[name='./minimumDate']").should("exist");
        cy.get("[name='./minimumMessage']").should("exist");
        cy.get("[name='./maximumDate']").should("exist");
        cy.get("[name='./maximumMessage']").should("exist");
        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(datePickerDrop);
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            datePickerEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/datepicker",
            datePickerEditPathSelector = "[data-path='" + datePickerEditPath + "']",
            datePickerDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.datepicker.split("/").pop();

        beforeEach(function () {
          // this is done since cypress session results in 403 sometimes
          cy.openAuthoring(pagePath);
        });


        it('checking add and delete in form container', function () {
            dropDatePickerInContainer();
            cy.deleteComponentByPath(datePickerDrop);
        });

        it('open edit dialog of DatePicker', function () {
            testDatePickerEditDialog(datePickerEditPathSelector, datePickerDrop);
        });

        it('verify Basic tab in edit dialog of DatePicker', function () {
            testDatePickerBasicTab(datePickerEditPathSelector, datePickerDrop);
        });

        it('verify Validation tab in edit dialog of DatePicker', function () {
            testDatePickerValidationTab(datePickerEditPathSelector, datePickerDrop);
        });

    });

 context('Open Sites Editor', function () {
     const   pagePath = "/content/core-components-examples/library/adaptive-form/datepicker",
         datePickerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/datepicker",
         datePickerEditPathSelector = "[data-path='" + datePickerEditPath + "']",
         datePickerDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.datepicker.split("/").pop();

     beforeEach(function () {
       // this is done since cypress session results in 403 sometimes
       cy.openAuthoring(pagePath);
     });

     it('checking add and delete in form container', function () {
         dropDatePickerInSites();
         cy.deleteComponentByPath(datePickerDrop);
     });

     it ('open edit dialog of DatePicker', function(){
         testDatePickerEditDialog(datePickerEditPathSelector, datePickerDrop, true);
     });

     it('verify Basic tab in edit dialog of DatePicker', function () {
         testDatePickerBasicTab(datePickerEditPathSelector, datePickerDrop, true);
     });

     it('verify Validation tab in edit dialog of DatePicker', function () {
         testDatePickerValidationTab(datePickerEditPathSelector, datePickerDrop, true);
     });

 });
});
