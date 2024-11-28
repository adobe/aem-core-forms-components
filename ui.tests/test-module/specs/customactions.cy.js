
/*
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe Systems Incorporated
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

describe('Custom Urls to fetch Custom Function & Prefill', () => {
  const pagePath = "/content/forms/af/core-components-it/samples/embed/customactiontesting.html?wcmmode=disabled";
  const formJsonPath = "/content/forms/af/core-components-it/samples/embed/customactiontesting/jcr:content/guideContainer.model.en.json";
  const formJson = '{"id":"L2NvbnRlbnQvZm9ybXMvYWYvY29yZS1jb21wb25lbnRzLWl0L3NhbXBsZXMvZW1iZWQvY3VzdG9tYWN0aW9udGVzdGluZw==","fieldType":"form","lang":"en","title":"customactiontesting","action":"/adobe/forms/af/submit/L2NvbnRlbnQvZm9ybXMvYWYvY29yZS1jb21wb25lbnRzLWl0L3NhbXBsZXMvZW1iZWQvY3VzdG9tYWN0aW9udGVzdGluZw==","properties":{"themeRef":"/libs/fd/af/themes/canvas","schemaType":"none","fd:dor":{"dorType":"none"},"fd:path":"/content/forms/af/core-components-it/samples/embed/customactiontesting/jcr:content/guideContainer","fd:schemaType":"BASIC","fd:isHamburgerMenuEnabled":false,"fd:roleAttribute":null,"fd:formDataEnabled":true,"fd:autoSave":{"fd:enableAutoSave":false},"fd:customFunctionsUrl":"/customfunctionsprefix/adobe/forms/af/customfunctions/L2NvbnRlbnQvZm9ybXMvYWYvY29yZS1jb21wb25lbnRzLWl0L3NhbXBsZXMvZW1iZWQvY3VzdG9tYWN0aW9udGVzdGluZw==","fd:dataUrl":"/prefillprefix/adobe/forms/af/data/L2NvbnRlbnQvZm9ybXMvYWYvY29yZS1jb21wb25lbnRzLWl0L3NhbXBsZXMvZW1iZWQvY3VzdG9tYWN0aW9udGVzdGluZw=="},"columnCount":12,"gridClassNames":"aem-Grid aem-Grid--12 aem-Grid--default--12","events":{"custom:setProperty":["$event.payload"]},"metadata":{"grammar":"json-formula-1.0.0","version":"1.0.0"},"adaptiveform":"0.14.2",":type":"forms-components-examples/components/form/container","allowedComponents":{"components":[],"applicable":false}}';


  /**
   * initialization of form container before every test
   * */
  beforeEach(() => {
    cy.intercept('GET', formJsonPath, {
      statusCode: 200,
      body: formJson
    })
    cy.openPage(pagePath);
  });

  it('should use fd:customFunctionUrl to fetch the custom functions', () => {
    cy.intercept('GET', /^\/customfunctionsprefix.*/).as('customFunctionRequest');
    cy.wait('@customFunctionRequest').its('response.statusCode').should('eq', 404);
    cy.get('@customFunctionRequest').should('have.property', 'state', 'Complete');
  })

  it('should use fd:dataUrl to fetch the prefill data', () => {
    cy.intercept('GET', /^\/prefillprefix.*/).as('prefillRequest');
    cy.wait('@prefillRequest').its('response.statusCode').should('eq', 404);
    cy.get('@prefillRequest').should('have.property', 'state', 'Complete');
  })
})
