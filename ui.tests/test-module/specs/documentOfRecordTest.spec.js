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

describe('Document of Record Test', () => {
  const formPath = "/content/forms/af/core-components-it/samples/document-of-record/dor-form";
  const pagePath = "/content/forms/af/core-components-it/samples/document-of-record/dor-form.html";
  let formContainer = null;

  /**
   * initialization of form container before every test
   * */
  beforeEach(() => {
    cy.previewForm(pagePath).then(p => {
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


  it('should download document of record', () => {
    cy.window().then($window => {
      if($window.guideBridge && $window.guideBridge.isConnected()) {
       const bridge = $window.guideBridge;
        const data = bridge.getFormModel().exportData();
        const formdata = new FormData();
        formdata.append("data", JSON.stringify(data));
        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };
        if (cy.af.isLatestAddon()) {
          // use cursor based API if latest AddOn
          return getFormId(formPath)
          .then(formId => {
            fetch(`/adobe/forms/af/dor/${formId}`, requestOptions)
            .then(response => {
              const contentType = response.headers.get('Content-Type');
              expect(contentType).to.equal("application/pdf")
              const blob = new Blob([response.data], {type: 'application/pdf'});
              expect(blob.size).not.to.equal(0)
            })
          })
        }
      }
    });
  })
})
