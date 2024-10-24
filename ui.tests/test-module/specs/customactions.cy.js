
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

describe('Custom Actions to fetch Custom Function & Prefill', () => {
  const pagePath = "/content/forms/af/core-components-it/samples/embed/customactiontesting.html?wcmmode=disabled";
  let formContainer = null;

  /**
   * initialization of form container before every test
   * */
  beforeEach(() => {
    cy.openPage(pagePath);
  });

  it('should use fd:customFunctionAction to fetch the custom functions', () => {
    cy.intercept('GET', '/custom-function-path-will-be-set-by-model').as('customFunctionRequest');
    cy.wait('@customFunctionRequest').its('response.statusCode').should('eq', 404);
    cy.get('@customFunctionRequest').should('have.property', 'state', 'Complete');
  })

  it('should use fd:prefillAction to fetch the prefill data', () => {
    cy.intercept('GET', '/prefill-path-will-be-set-by-model?*').as('prefillRequest');
    cy.wait('@prefillRequest').its('response.statusCode').should('eq', 404);
    cy.get('@prefillRequest').should('have.property', 'state', 'Complete');
  })
})
