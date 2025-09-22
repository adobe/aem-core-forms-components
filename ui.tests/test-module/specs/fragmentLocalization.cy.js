/*
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2023 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

describe('Fragment Localization Tests', () => {
  const formPath = "/content/forms/af/core-components-it/samples/fragment/basic";
  const pagePath = "/content/forms/af/core-components-it/samples/fragment/basic.html";
  let formContainer = null;

  /**
   * initialization of form container before every test
   * */
  beforeEach(() => {
    cy.previewForm(pagePath, {"params" : ["afAcceptLang=de"]}).then(p => {
      formContainer = p;
    })
  });

  const getFormId = (path, cursor = "") => {
    return cy.request("GET", `/adobe/forms/af/listforms?cursor=${cursor}`).then(({body}) => {
      let retVal = body.items.find(collection => collection.path === path);
      if (retVal) {
        return retVal.id;
      } else {
        console.log("fetching the list of forms again");
        if (body.cursor) {
          cursor = body.cursor;
          return getFormId(path, cursor);
        } else {
          throw new Error("form not found");
        }
      }
    });
  }


  it('should localize fragment content using getFormLocale API', () => {
    return cy.window().then($window => {
      if($window.guideBridge && $window.guideBridge.isConnected()) {
      // use cursor based API if latest AddOn
      return getFormId(formPath)
      .then(formId => {
        return fetch(`/adobe/forms/af/${formId}/de`)
        .then(response => {
          return response.text().then(body => {
            expect(body).to.contain("Responsive Text Input de")
          })
        })
      })
      }
    });
  })

  it("should display localized text when fragment is rendered in form", () => {
    const firstTextComponent = formContainer._model.items[0].items[0].items[0].id;
    cy.get(`#${firstTextComponent} .cmp-adaptiveform-textinput__label`).should('have.text', 'Text Input de');
  })
})
