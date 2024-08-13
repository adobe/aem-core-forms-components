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
const dataSet = require('../../test-module/libs/commons/localeDataSets');
const baseUrl = '/content/dam/formsanddocuments/core-components-it/samples/af2-form-translation/jcr:content?wcmmode=disabled',
    languageUrl = baseUrl + '&afAcceptLang=';

const waitForLangDataToLoad= () => {
    cy.document().then((doc) => {
        let ready = false;
        doc.addEventListener('AF_LanguageInitialised', () => {
            ready = true;
        });
        return new Cypress.Promise((resolve, reject) => {
            const isReady = () => {
                if (ready) {
                    return resolve()
                }
                setTimeout(isReady, 0)
            };
            isReady()
        })
    });
};

describe('Verify constants are changing for each language', function () {
    dataSet.languages.forEach(currLanguage => {
        it(currLanguage.LANGUAGE + " is loaded", function () {
            let currentLang = currLanguage.LOCALE;
            if (currentLang === 'en') {
                cy.openPage(baseUrl).then(waitForLangDataToLoad);
            } else {
                cy.openPage(languageUrl + currentLang).then(waitForLangDataToLoad);
            }
            Object.entries(currLanguage.TRANSLATION).forEach(component => {
                if(component[0] === 'CHECK_BOX1_ITEM1' || component[0] === 'CHECK_BOX2_ITEM1') {
                    cy.get(dataSet.selectors[component[0]]).eq(0).invoke('text').should('eq', component[1]);
                }
                else {
                    cy.get(dataSet.selectors[component[0]]).invoke('text').should('eq', component[1]);
                }
            })

            for(const key in currLanguage.I18N_STRINGS) {
                cy.window().then((win) => {
                    expect(win.FormView.LanguageUtils.getTranslatedString(currLanguage.LOCALE, key)).to.be.eq(currLanguage.I18N_STRINGS[key]);
                })
            }
        });
    });
});
