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


import { recurse } from 'cypress-recurse';
import 'cypress-plugin-snapshots/commands';

const commons = require('../commons/commons'),
    siteSelectors = require('../commons/sitesSelectors'),
    siteConstants = require('../commons/sitesConstants'),
    guideSelectors = require('../commons/guideSelectors'),
    guideConstants = require('../commons/formsConstants');
var toggles = [];

// Cypress command to login to aem page
Cypress.Commands.add("login", (pagePath, failurehandler = () => {}) => {
    const username = Cypress.env('crx.username') ? Cypress.env('crx.username') : "admin";
    const password = Cypress.env('crx.password') ? Cypress.env('crx.password') : "admin";
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    let retryCount = 0;
    let maxRetries = 3;
    // Check if the element with id 'submit-button' exists
    cy.get('body').then(($body) => {
        const element = $body.find('#submit-button');
        if (element.length === 0) {
            // Element is not present
            retryCount++;
            if (retryCount <= maxRetries) {
                // Retry the visit with an exponential backoff delay
                const delay = Math.pow(2, retryCount - 1) * 1000; // 2^n seconds
                cy.wait(delay);
                failurehandler();
            }
        } else {
            // Element is present, click it
            cy.wrap(element).click();
        }
    });
});



function getCSRFToken(contextPath) {
    const TOKEN_SERVLET = contextPath + '/libs/granite/csrf/token.json';
    cy.request(TOKEN_SERVLET).its('body.token').as("token")
}

function getUserInfoHome(contextPath) {
    const USER_INFO_SERVLET = contextPath + "/libs/cq/security/userinfo.json";
    cy.request(USER_INFO_SERVLET).its('body.home').as("home")
}


// Cypress command to open authoring page
Cypress.Commands.add("enableOrDisableTutorials", (enable) => {
    const contextPath = Cypress.env('crx.contextPath') ? Cypress.env('crx.contextPath') : "";
    getCSRFToken(contextPath);
    getUserInfoHome(contextPath);
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
        const url = contextPath + home + '/preferences';
        //cy.request('POST', url, preferences) // not using cy.request, since application level cookies needs to be passed
        cy.window().then(win => {
            win.$.post(url, preferences)
        });
    });
});

// Cypress command to open AFv2
Cypress.Commands.add("openAFv2TemplateEditor", () => {
    const baseUrl = Cypress.env('crx.contextPath') ? Cypress.env('crx.contextPath') : "";
    cy.visit(baseUrl, {'failOnStatusCode': false});
    cy.login(baseUrl, () => {
        cy.openAFv2TemplateEditor();
    });
    cy.openTemplateEditor("/conf/core-components-examples/settings/wcm/templates/af-blank-v2/structure.html");
});

// Cypress command to open template editor
Cypress.Commands.add("openTemplateEditor", (templatePath) => {
    const contextPath = Cypress.env('crx.contextPath') ? Cypress.env('crx.contextPath') : "";
    const path = contextPath ? `${contextPath}/editor.html${templatePath}` : `editor.html${templatePath}`;
    cy.enableOrDisableTutorials(false);
    cy.visit(path, {'failOnStatusCode': false}).then(waitForEditorToInitialize);
    preventClickJacking();
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

const preventClickJacking = () => {
    cy.window().then(win => {
        // only if granite is defined, override the API
        if (win.Granite) {
            win.Granite.HTTP.handleLoginRedirect = function () {
                if (!loginRedirected) {
                    loginRedirected = true;
                    //alert(Granite.I18n.get("Your request could not be completed because you have been signed out."));
                    // var l = util.getTopWindow().document.location; // this causes frame burst and ideally should be fixed in Granite code
                    var l = win.Granite.author.EditorFrame.$doc.get(0).defaultView.location;
                    l.href = win.Granite.HTTP.externalize("/") + "?resource=" + encodeURIComponent(l.pathname + l.search + l.hash);
                }
            };
        }
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
    preventClickJacking();
});


Cypress.Commands.add('clickDialogWithRetry', (selector = '.cq-dialog-cancel', retryCount = 3) => {
    let currentRetry = 0;

    function clickRetry() {
        cy.get(selector)
        .click({ multiple: true })
        .should(($element) => {
            if ($element.closest('.cq-dialog').is(':visible')) {
                if (currentRetry < retryCount - 1) {
                    currentRetry++;
                    clickRetry();
                }
            }
        });
    }
    clickRetry();
});


// Cypress command to get form JSON
Cypress.Commands.add("getFormJson", (pagePath) => {
    const pageUrl = cy.af.getFormJsonUrl(pagePath);
    return cy.request({
        method : 'GET',
        url: pageUrl
    }).its('body');
});

// Cypress command to open template editor
Cypress.Commands.add("openTemplateEditor", (templatePath) => {
    const contextPath = Cypress.env('crx.contextPath') ? Cypress.env('crx.contextPath') : "";
    const path = contextPath ? `${contextPath}/editor.html${templatePath}` : `editor.html${templatePath}`;
    cy.enableOrDisableTutorials(false);
    cy.visit(path, {'failOnStatusCode': false}).then(waitForEditorToInitialize);
    preventClickJacking();
});

// Cypress command to open authoring page
Cypress.Commands.add("openAuthoring", (pagePath) => {
    const baseUrl = Cypress.env('crx.contextPath') ? Cypress.env('crx.contextPath') : "";
    // getting status 403 intermittently, just ignore it
    cy.visit(baseUrl, {'failOnStatusCode': false});
    cy.login(baseUrl, () => {
        cy.openAuthoring(pagePath);
    });
    cy.openSiteAuthoring(pagePath);
});

// Cypress command to open authoring page
Cypress.Commands.add("openPage", (pagePath, options = {}) => {
    const contextPath = Cypress.env('crx.contextPath') ? Cypress.env('crx.contextPath') : "";
    let path = ((contextPath && !pagePath.startsWith(contextPath)) ? `${contextPath}${pagePath.startsWith('/') ? '' : '/'}${pagePath}` : pagePath);
    if (!options.noLogin) {
    // getting status 403 intermittently, just ignore it
        const baseUrl = contextPath;
        cy.visit(baseUrl, {'failOnStatusCode': false});
        cy.getCookie('login-token').then(cookie => {
            if(!cookie) {
                cy.login(baseUrl, () => {
                    cy.openPage(path, options);
                });
            }
        })
    }
    cy.visit(path, options);
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
                    if (!$header.is(':visible')) {
                        cy.get(selector).first().click({force: true});
                        cy.get(path).should('be.visible');
                    } else {
                        cy.get(siteSelectors.overlays.self).scrollIntoView(); // dont click on body, always use overlay wrapper to click
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
                    if(document.querySelector("[data-cmp-adaptiveform-container-loader='"+ $form[0].id + "']")?.classList.contains("cmp-adaptiveform-container--loading")){
                        const isReady = () => {
                            const container = document.querySelector("[data-cmp-adaptiveform-container-loader='"+ $form[0].id + "']");
                            if (container &&
                                e.detail._path === $form.data("cmp-path") &&
                                !container.classList.contains("cmp-adaptiveform-container--loading")) {

                                resolve(e.detail);
                            }
                            setTimeout(isReady, 0)
                        }
                        isReady();
                    }
                }
                document.addEventListener(INIT_EVENT, listener1);
            })
            return promise
        });
    })
}

const waitForFormInitMultipleContiners = (multipleEmbedContainers) => {
    const INIT_EVENT = "AF_FormContainerInitialised"
    return cy.document().then(document => {
        const promiseArray = []
        cy.get('form').each(($form) => {
            const promise = new Cypress.Promise((resolve, reject) => {
                const listener1 = e => {
                    if(document.querySelector("[data-cmp-adaptiveform-container-loader='"+ $form[0].id + "']")?.classList.contains("cmp-adaptiveform-container--loading")){
                        const isReady = () => {
                            const container = document.querySelector("[data-cmp-adaptiveform-container-loader='"+ $form[0].id + "']");
                            if (container &&
                                e.detail._path === $form.data("cmp-path") &&
                                !container.classList.contains("cmp-adaptiveform-container--loading")) {

                                resolve(e.detail);
                            }
                            setTimeout(isReady, 0)
                        }
                        isReady();
                    }
                }
                document.addEventListener(INIT_EVENT, listener1);
            })
        if(typeof multipleEmbedContainers == "boolean" && multipleEmbedContainers){
            promiseArray.push(new Cypress.Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(promise);
                }, 1000);
            }));
        } else {
            promiseArray.push(promise)
        }
        }).then(($lis) => {
            if(typeof multipleEmbedContainers == "boolean" && multipleEmbedContainers) {
                setTimeout(() => {
                    return Promise.all(promiseArray);
                }, 1000);
            } else {
                return Promise.all(promiseArray)
            }
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

Cypress.Commands.add("getFormData", () => {
    return cy.window().then(win => {
        const promise = new Cypress.Promise((resolve, reject) => {
            const successhandler = data => {
                resolve(data);
            };
            win.guideBridge.getFormDataString({success: successhandler});
        });
        return promise;
    });
});


Cypress.Commands.add("getFromDefinitionUsingOpenAPIUsingCursor", (formPath, cursor = "", limit = 20) => {
    return cy.request("GET", `/adobe/forms/af/listforms?cursor=${cursor}&limit=${limit}`).then(({body}) => {
        // We need its ID to continue nesting below it
        let retVal = body.items.find(collection => collection.path === formPath);
        if (retVal) {
            return cy.request("GET", `/adobe/forms/af/${retVal.id}`);
        } else {
            console.log("fetching the list of forms again");
            if (body.cursor) {
                cursor = body.cursor;
            }
            return cy.getFromDefinitionUsingOpenAPIUsingCursor(formPath, cursor, limit);
        }
    });
});

// this API is deprecated, this is not to be used anymore
Cypress.Commands.add("getFromDefinitionUsingOpenAPI", (formPath, offset = 0, limit = 20) => {
    return cy.request("GET", `/adobe/forms/af/listforms?offset=${offset}&limit=${limit}`).then(({body}) => {
        // We need its ID to continue nesting below it
        let retVal = body.items.find(collection => collection.path === formPath);
        if (retVal) {
            return cy.request("GET", `/adobe/forms/af/${retVal.id}`);
        } else {
            console.log("fetching the list of forms again");
            return cy.getFromDefinitionUsingOpenAPI(formPath, offset + limit, limit);
        }
    });
});


Cypress.Commands.add("previewForm", (formPath, options = {}) => {
    const contextPath = Cypress.env('crx.contextPath') ? Cypress.env('crx.contextPath') : "";
    let pagePath = contextPath ? `${contextPath}${formPath.startsWith('/') ? '' : '/'}${formPath}?wcmmode=disabled` : `${formPath}?wcmmode=disabled`;
    if (options?.params) {
        options.params.forEach((param) => pagePath += `&${param}`)
        delete options.params
    }
    if(options?.multipleEmbedContainers) {
        return cy.openPage(pagePath, options).then(() => waitForFormInitMultipleContiners(options?.multipleEmbedContainers))
    }
    if(options?.multipleContainers) {
        return cy.openPage(pagePath, options).then(waitForFormInitMultipleContiners)
    }
    return cy.openPage(pagePath, options).then(waitForFormInit)
})

Cypress.Commands.add("fetchFeatureToggles",()=>{
    return cy.request('/etc.clientlibs/toggles.json')
})

Cypress.Commands.add("cleanTest", (editPath) => {
    // clean the test before the next run, if any
    return cy.get("body").then($body => {
        return cy.window().then((win) => {
            return new Cypress.Promise((resolve, reject) => {
                const isReady = () => {
                    if ((win.Granite && win.Granite.author && win.Granite.author.editables && win.Granite.author.editables.length > 0) &&
                        $body.find('#OverlayWrapper').length > 0 &&
                        $body.find('#OverlayWrapper').is(':visible') &&
                        !$body.find('#OverlayWrapper').hasClass('is-hidden-children')) {
                        // do something custom here
                        const selector12 = "[data-path='" + editPath + "']";
                        if ($body.find(selector12).length > 0) {
                            cy.deleteComponentByPath(editPath);
                        }
                        resolve(editPath);
                    } else {
                        setTimeout(isReady, 0);
                    }
                };
                isReady();
            });
        });
    });
})

Cypress.Commands.add("cleanTitleTest", (editPath) => {
    // clean the test before the next run, if any
    return cy.get("body").then($body => {
        return new Cypress.Promise((resolve, reject) => {
            // do something custom here
            const selector12 = "div[data-path^='" + editPath + "']";
            if ($body.find(selector12).length > 0) {
                $body.find(selector12).each(($index, $titleComponent) => {
                    cy.deleteComponentByPath($titleComponent.dataset.path);
                })
            }
            resolve(editPath);
        });
    });
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
    cy.get(siteSelectors.editableToolbar.actions.delete).should("be.visible").click({force: true});
    // check if delete dialog is seen and click on yes
    cy.get(siteSelectors.alertDialog.actions.last).should("be.visible").click({force: true});
    // wait for event to complete to signify deletion is complete
    cy.get("@isEditableUpdateEventComplete").its('done').should('equal', true); // wait here until done
    cy.get("@isOverlayRepositionEventComplete").its('done').should('equal', true); // wait here until done
});

// cypress command to delete component by title
Cypress.Commands.add("deleteComponentByTitle", (title) => {
    const editableUpdateEvent = siteConstants.EVENT_NAME_EDITABLES_UPDATED,
        componentPathSelector = "[title='" + title + "']",
        overlayRepositionEvent = siteConstants.EVENT_NAME_OVERLAYS_REPOSITIONED;
    // intialize the event handler for editableUpdateEvent
    cy.initializeEventHandlerOnChannel(editableUpdateEvent).as("isEditableUpdateEventComplete");
    // intialize the event handler for overlay overlayRepositionEvent event
    cy.initializeEventHandlerOnChannel(overlayRepositionEvent).as("isOverlayRepositionEventComplete");
    // open editable toolbar
    cy.openEditableToolbar(siteSelectors.overlays.overlay.component + componentPathSelector);
    // click the delete action
    cy.get(siteSelectors.editableToolbar.actions.delete).should("be.visible").click({force: true});
    // check if delete dialog is seen and click on yes
    cy.get(siteSelectors.alertDialog.actions.last).should("be.visible").click({force: true});
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

Cypress.Commands.add("openSidePanelTab", (tab) => {
    cy.window().then(function (win) {
        let isSidePanelOpen = win.$("#SidePanel").hasClass("sidepanel-opened");
        if (!isSidePanelOpen) {
            cy.get("#Content .toggle-sidepanel").click();
        }
    });
    var tabSelector = '[role="tablist"] [role="tab"][title="' + tab + '"]';
    cy.get(tabSelector)
    .should("be.visible")
    .click();
    cy.get(tabSelector + ".is-selected").should("exist");
})


/**
 * This will attach a listener to console.error calls,
 * that will help in checking if errors were logged or not.
 *
 * This is supposed to be called in the before hook of a test, like this:
 * before(() => {
 *     cy.attachConsoleErrorSpy();
 * });
 */
Cypress.Commands.add("attachConsoleErrorSpy", () => {
    Cypress.on('window:before:load', (win) => {
        cy.spy(win.console, 'error');
    });
});



/**
 * This checks if any console.errors were logged or not,
 * after the spy was attached (see above command).
 * So make sure to attach the spy function first!
 */
Cypress.Commands.add("expectNoConsoleErrors", () => {
    return cy.window().then(win => {
        const spy = cy.spy(win.console, 'error');
        cy.wrap(spy).should('have.callCount', 0);
    });
});

Cypress.Commands.add("getContentIFrameBody", () => {
    return cy
        .get('iframe#ContentFrame')
        .its('0.contentDocument.body').should('not.be.empty')
        .then(cy.wrap)
});

Cypress.Commands.add("isElementInViewport", { prevSubject: true }, (subject) => {
    const rect = subject[0].getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= Cypress.config("viewportHeight") &&
        rect.right <= Cypress.config("viewportWidth")
    );
});


/**
 * This function is used to fetch elements from ContentFrame iframe which are not accessible.
 * Without this, the element will not be returned due to browser's cross-origin security feature.
 */
Cypress.Commands.add("getContentIframeBody", () => {
    return cy
        .get('#ContentFrame')
        .its('0.contentDocument.body').should('not.be.empty')
        .then(cy.wrap)
});

/**
 * This function is used to fetch rule editor iframe.
 */
Cypress.Commands.add("getRuleEditorIframe", () => {
    // get the iframe > document > body
    // and retry until the body element is not empty
    return cy
        .get('iframe#af-rule-editor')
        .its('0.contentDocument.body').should('not.be.empty')
        .then(cy.wrap)
});

/**
 * This function is used to change language.
 */
Cypress.Commands.add("changeLanguage", (str) => {
    cy.openPage('/aem/forms.html/content/dam/formsanddocuments');
    cy.get(siteSelectors.locale.shell.userProperties).click();
    cy.get(siteSelectors.locale.shell.userPreferences).click();
    cy.get(siteSelectors.locale.language).first().click();
    cy.get(`coral-selectlist-item[value=${str}]`).click({force: true});
    cy.get(siteSelectors.locale.accept).click();
});


const mimeTypes = {
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'bat': 'application/x-msdos-program',
    'msg': 'application/vnd.ms-outlook',
    // Add more mappings as needed
};

const getMimeType = (fileName) => {
    const extension = fileName.split('.').pop();
    return mimeTypes[extension] || 'application/octet-stream';
};

Cypress.Commands.add("attachFile", (fileInput, fileNames) => {
    const uploads = fileNames.map(fileName => {
        const mimeType = getMimeType(fileName);
        return cy.fixture(fileName, { encoding: null }).then(fileContent => {
            return cy.get(fileInput).selectFile({
                contents: fileContent,
                fileName: fileName,
                mimeType: mimeType
            }, { force: true });
        });
    });
    return cy.wrap(uploads);
});
