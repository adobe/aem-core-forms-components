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

describe('GuideBridge registerConfig custom function url in external web page', () => {
  const pagePath = "/content/forms/sites/core-components-it/guidebridgeconfig.html";
  let formContainer = null;

  /**
   * initialization of form container before every test
   * */
  beforeEach(() => {
    cy.openPage(pagePath);
  });

  it('should prefix the custom function api path', () => {
    cy.intercept('GET', '/customprefixpath/**').as('customPrefixPathRequest');
    cy.wait('@customPrefixPathRequest').its('response.statusCode').should('eq', 404);
    cy.get('@customPrefixPathRequest').should('have.property', 'state', 'Complete');
  })
})
