/*
 *  Copyright 2021 Adobe Systems Incorporated
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

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload';
import { recurse } from 'cypress-recurse'

const commons = require('../commons/commons'),
    siteSelectors = require('../commons/sitesSelectors'),
    siteConstants = require('../commons/sitesConstants'),
    guideSelectors = require('../commons/guideSelectors'),
    guideConstants = require('../commons/formsConstants');

// Cypress command to login to aem page
Cypress.Commands.add("login", (pagePath) => {
    const username = Cypress.env('crx.username') ?  Cypress.env('crx.username') : "admin";
    const password = Cypress.env('crx.password') ? Cypress.env('crx.password') : "admin";
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('#submit-button').click();
});


function getCSRFToken() {
    const TOKEN_SERVLET = '/libs/granite/csrf/token.json';
    cy.request(TOKEN_SERVLET).its('body.token').as("token")
}

function getUserInfoHome() {
    const USER_INFO_SERVLET = "/libs/cq/security/userinfo.json";
    cy.request(USER_INFO_SERVLET).its('body.home').as("home")
}

// Cypress command to open authoring page
Cypress.Commands.add("enableOrDisableTutorials", (enable) => {
    getCSRFToken();
    getUserInfoHome();
    let preferences = {};
    if (!enable) {
        preferences = {
            'cq.authoring.editor.page.showTour62': enable,
            'cq.authoring.editor.page.showOnboarding62': enable,
            'cq.authoring.editor.template.showTour': enable,
            'cq.authoring.editor.template.showOnboarding': enable,
            'granite.shell.showonboarding620': enable,
            'cq.authoring.editor.theme.showTour': enable,
            'cq.authoring.ruleeditor.showTour': enable,
            'cq.authoring.editor.form.showTour': enable
        };
    } else {
        preferences = {
            'cq.authoring.editor.page.showTour62@Delete': enable,
            'cq.authoring.editor.page.showOnboarding62@Delete': enable,
            'cq.authoring.editor.template.showTour@Delete': enable,
            'cq.authoring.editor.template.showOnboarding@Delete': enable,
            'granite.shell.showonboarding620@Delete': enable,
            'cq.authoring.editor.theme.showTour@Delete': enable,
            'cq.authoring.ruleeditor.showTour@Delete': enable,
            'cq.authoring.editor.form.showTour@Delete': enable
        };
    }
    cy.get("@token").then(token => {
        preferences[":cq_csrf_token"] = token;
    });
    cy.get("@home").then(home => {
        const contextPath = Cypress.env('crx.contextPath') ?  Cypress.env('crx.contextPath') : "";
        const url = contextPath + home + '/preferences';
        //cy.request('POST', url, preferences) // not using cy.request, since application level cookies needs to be passed
        cy.window().then(win => {
            win.$.post(url, preferences)
        });
    });
});

let loginRedirected = false;
const waitForEditorToInitialize = () => {
    cy.window().then((win) => {
        // keeps rechecking "editables"
        return new Cypress.Promise((resolve, reject) => {
            const isReady = () => {
                // temporary added this to check if editor is loaded
                if (win.Granite && win.Granite.author && win.Granite.author.editables && win.Granite.author.editables.length > 0) {
                    return resolve()
                }
                setTimeout(isReady, 0)
            };
            isReady()
        })
    });
};

// Cypress command to open Site authoring page
Cypress.Commands.add("openSiteAuthoring", (pagePath) => {
    const editorPageUrl = cy.af.getEditorUrl(pagePath);
    const isEventComplete = {};
    cy.enableOrDisableTutorials(false);
    cy.visit(editorPageUrl).then(waitForEditorToInitialize);
    // Granite's frame bursting technique to prevent click jacking is not known by Cypress, hence this override is done
    // For more details, please refer, https://github.com/cypress-io/cypress/issues/3077
    // refer, https://github.com/cypress-io/cypress/issues/886#issuecomment-364779884
    cy.window().then(win => {
        // only if granite is defined, override the API
        if (win.Granite) {
            win.Granite.HTTP.handleLoginRedirect = function () {
                if (!loginRedirected) {
                    loginRedirected = true;
                    //alert(Granite.I18n.get("Your request could not be completed because you have been signed out."));
                    // var l = util.getTopWindow().document.location; // this causes frame burst and ideally should be fixed in Granite code
                    var l = win.Granite.author.EditorFrame.$doc.get(0).defaultView.location;
                    l.href =  win.Granite.HTTP.externalize("/") + "?resource=" + encodeURIComponent(l.pathname + l.search + l.hash);
                }
            };
        }
    });
});

// Cypress command to open authoring page
Cypress.Commands.add("openAuthoring", (pagePath) => {
    const baseUrl = Cypress.env('crx.contextPath') ?  Cypress.env('crx.contextPath') : "";
    cy.visit(baseUrl);
    cy.login(baseUrl);
    cy.openSiteAuthoring(pagePath);
});

// Cypress command to open authoring page
Cypress.Commands.add("openPage", (pagePath) => {
    const baseUrl = Cypress.env('crx.contextPath') ?  Cypress.env('crx.contextPath') : "";
    cy.visit(baseUrl);
    cy.login(baseUrl);
    cy.visit(pagePath);
});

// cypress command to select layer in authoring
Cypress.Commands.add("selectLayer", (layer) => {
    // please note: when switching from style to other layer, we refresh guide, so these events need to be checked here
    cy.get(siteSelectors.selectLayer.trigger).click();
    cy.get(siteSelectors.selectLayer.popover.self + ' [data-layer="' + layer + '"]').should('be.visible');
    cy.get(siteSelectors.selectLayer.popover.self + ' [data-layer="' + layer + '"]').click({force: true});
    cy.get(siteSelectors.selectLayer.current + '[data-layer="' + layer + '"].is-selected');
});

// cypress command to open editable toolbar
Cypress.Commands.add("openEditableToolbar", (selector) => {
    cy.get(selector) // adding assertion does implicit retry
    .invoke('attr', 'data-path')
    .then(($path) => {
        const path = siteSelectors.editableToolbar.elementDom.replace("%s", $path);
        cy.get("body").then($body => {
            if ($body.find(path).length === 0) {
                //evaluates as true if toolbar doesnt exists at all
                //you get here only if toolbar is visible
                cy.get(selector).click({force: true}); // end user does not face this but due to cypress checks, we need to add force true here
                // sometimes the above line results in this error, `<div.cq-Overlay.cq-Overlay--component.cq-draggable.cq-droptarget.is-resizable>` is not visible because its parent `<div.cq-Overlay.cq-Overlay--component.cq-Overlay--container>` has CSS property: `display: none`
                cy.get(path).should('be.visible');
            } else {
                cy.get(path).then($header => {
                    if (!$header.is(':visible')){
                        cy.get(selector).click({force: true});
                        cy.get(path).should('be.visible');
                    } else {
                        cy.get(siteSelectors.overlays.self).click(0,0); // dont click on body, always use overlay wrapper to click
                        cy.get(selector).click({force: true});
                        cy.get(path).should('be.visible');
                    }
                });
            }
        });
    })
});

// cypress command to invoke an editable action
Cypress.Commands.add("invokeEditableAction", (actionSelector) => {
    cy.get(actionSelector).should('be.visible').click({force: true});
});

// cypress command to initialize event handler on channel
Cypress.Commands.add("initializeEventHandlerOnChannel", (eventName) => {
    let isEventComplete = {done: false};
    // intialize the event handler for editableUpdateEvent
    cy.window().then(win => {
        cy.document().then(document => {
            const listener1 = e => {
                win.$(document).off(eventName, listener1);
                isEventComplete.done = true;
            };
            win.$(document).on(eventName, listener1);
        });
    });
    return cy.wrap(isEventComplete); // return a chainable object
});


// cypress command to initialize event handler on channel
Cypress.Commands.add("initializeEventHandlerOnWindow", (eventName) => {
    let isEventComplete = {done: false};
    // intialize the event handler on window
    cy.window().then(win => {
        // we have added it twice, since on editable action which involves refresh of guide, it is called twice
        const listener = e => {
            win.$(win).off(eventName, listener);
            isEventComplete.done = true;
        };
        win.$(win).on(eventName, listener);
    });

    return cy.wrap(isEventComplete); // return a chainable object
});

const waitForFormInit = () => {
    const INIT_EVENT = "AF_FormContainerInitialised"
    return cy.document().then(document => {
        cy.get('form').then(($form) => {
            const promise = new Cypress.Promise((resolve, reject) => {
                const listener1 = e => {
                    const isReady = () => {
                        if (!($form[0].classList.contains("cmp-adaptiveform-container--loading"))) {
                            resolve(e.detail);
                        }
                        setTimeout(isReady, 0)
                    }
                    isReady();
                }
                document.addEventListener(INIT_EVENT, listener1);
            })
            return promise
        });
    })
}

const waitForChildViewAddition = () => {
    return cy.get('[data-cmp-is="adaptiveFormContainer"]')
        .then((el) => {
            const ADD_EVENT = "AF_PanelInstanceAdded";
            const promise = new Cypress.Promise((resolve, reject) => {
                const listener1 = e => {
                    resolve(e.detail.formContainer);
                };
                el[0].addEventListener(ADD_EVENT, listener1);
            })
            return promise;
        });
}

Cypress.Commands.add("previewForm", (formPath) => {
    const pagePath = `${formPath}?wcmmode=disabled`
    return cy.openPage(pagePath).then(waitForFormInit)
})

Cypress.Commands.add("previewFormWithPanel", (formPath) => {
    const pagePath = `${formPath}?wcmmode=disabled`
    return cy.openPage(pagePath).then(waitForChildViewAddition)
})

// cypress command to delete component by path
Cypress.Commands.add("deleteComponentByPath", (componentPath) => {
    const editableUpdateEvent = siteConstants.EVENT_NAME_EDITABLES_UPDATED,
        componentPathSelector = "[data-path='" + componentPath + "']",
        overlayRepositionEvent = siteConstants.EVENT_NAME_OVERLAYS_REPOSITIONED;
    // intialize the event handler for editableUpdateEvent
    cy.initializeEventHandlerOnChannel(editableUpdateEvent).as("isEditableUpdateEventComplete");
    // intialize the event handler for overlay overlayRepositionEvent event
    cy.initializeEventHandlerOnChannel(overlayRepositionEvent).as("isOverlayRepositionEventComplete");
    // open editable toolbar
    cy.openEditableToolbar(siteSelectors.overlays.overlay.component + componentPathSelector);
    // click the delete action
    cy.get(siteSelectors.editableToolbar.actions.delete).should("be.visible").click();
    // check if delete dialog is seen and click on yes
    cy.get(siteSelectors.alertDialog.actions.last).should("be.visible").click();
    // wait for event to complete to signify deletion is complete
    cy.get("@isEditableUpdateEventComplete").its('done').should('equal', true); // wait here until done
    cy.get("@isOverlayRepositionEventComplete").its('done').should('equal', true); // wait here until done
});


// cypress command to insert component
Cypress.Commands.add("insertComponent", (selector, componentString, componentType) => {
    //Open toolbar of root panel
    const insertComponentDialog_Selector = '.InsertComponentDialog-components [value="' + componentType + '"]',
        insertComponentDialog_searchField = ".InsertComponentDialog-components input[type='search']";
    cy.openEditableToolbar(selector);
    cy.get(guideSelectors.editableToolbar.actions.insert).should('be.visible').click();
    recurse(
        // the commands to repeat, and they yield the input element
        () => cy.get(insertComponentDialog_searchField).clear().type(componentString),
        // the predicate takes the output of the above commands
        // and returns a boolean. If it returns true, the recursion stops
        ($input) => $input.val() === componentString,
    )
    cy.get(insertComponentDialog_searchField).type('{enter}');
    cy.get(insertComponentDialog_Selector).should('be.visible');// basically should assertions does implicit retry in cypress
    // refer https://docs.cypress.io/guides/references/error-messages.html#cy-failed-because-the-element-you-are-chaining-off-of-has-become-detached-or-removed-from-the-dom
    cy.get(insertComponentDialog_Selector).click({force: true}); // sometimes AEM popover is visible, hence adding force here
});

/**
 * Simulates a paste event.
 * Modified from https://gist.github.com/nickytonline/bcdef8ef00211b0faf7c7c0e7777aaf6
 *
 * @param subject A jQuery context representing a DOM element.
 * @param pasteOptions Set of options for a simulated paste event.
 * @param pasteOptions.pastePayload Simulated data that is on the clipboard.
 * @param pasteOptions.pasteFormat The format of the simulated paste payload. Default value is 'text'.
 *
 * @returns The subject parameter.
 *
 * @example
 * cy.get('body').paste({
 *   pasteType: 'application/json',
 *   pastePayload: {hello: 'yolo'},
 * });
 */
Cypress.Commands.add(
    'paste',
    {prevSubject: true},
    function (subject, pasteOptions) {
        const {pastePayload, pasteType} = pasteOptions;
        const data = pasteType === 'application/json' ? JSON.stringify(pastePayload) : pastePayload;
        // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
        const clipboardData = new DataTransfer();
        clipboardData.setData(pasteType, data);
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
        // It's possible to construct and dispatch a synthetic paste event, but this will not affect the document's contents.
        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            dataType: pasteType,
            data,
            clipboardData,
        });
        subject[0].dispatchEvent(pasteEvent);
        return subject;
    }
);


// cypress command to click ? and toggle description and tooltip
Cypress.Commands.add("toggleDescriptionTooltip", (bemBlock, fieldId, shortDescriptionText, longDescriptionText) => {
    if (!shortDescriptionText) {
        shortDescriptionText = 'This is short description';
    }
    if (!longDescriptionText) {
        longDescriptionText = 'This is long description';
    }
    cy.get(`#${fieldId}`).find(`.${bemBlock}__shortdescription`).invoke('attr', 'data-cmp-visible=false')
    .should('not.exist');
    cy.get(`#${fieldId}`).find(`.${bemBlock}__shortdescription`)
        .should('contain.text', shortDescriptionText);
    // click on ? mark
    cy.get(`#${fieldId}`).find(`.${bemBlock}__questionmark`).click();
    // long description should be shown
    cy.get(`#${fieldId}`).find(`.${bemBlock}__longdescription`).invoke('attr', 'data-cmp-visible')
    .should('not.exist');
    cy.get(`#${fieldId}`).find(`.${bemBlock}__longdescription`)
        .should('contain.text', longDescriptionText);
    // short description should be hidden.
    cy.get(`#${fieldId}`).find(`.${bemBlock}__shortdescription`).invoke('attr', 'data-cmp-visible')
    .should('eq', 'false');
});
