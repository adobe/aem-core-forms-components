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

describe('Test UpdateEnum, UpdateEnumName for RadioButton', () => {
    const pagePath = "/content/forms/af/core-components-it/samples/customfunctions/populate-radiobuttonv2.html";
    let formContainer = null;

    let addEnumNameBtn1= '#button-4f38b76fd2-widget',
        addEnumBtn1 = '#button-d4b00ec0b8-widget',
        addBothBtn1 = '#button-eaa3f23f0b-widget',

        addEnumNameBtn2 = '#button-56661f131d-widget',
        addEnumBtn2 = '#button-0c6ee72db4-widget',
        addBothBtn2 = '#button-69bf3d3a88-widget',

        addEnumNameBtn3 = '#button-4ecaf3bc01-widget',
        addEnumBtn3 = '#button-4dc9bdc9a3-widget',
        addBothBtn3  = '#button-54180ffb16-widget',

        addEnumNameBtn4 = '#button-a48e23295a-widget',
        addEnumBtn4 = '#button-933aa82bb7-widget',
        addBothBtn4  = '#button-26157ea292-widget',
        clearBtn = '#button-3e6807207c-widget';

    let radiobutton1 = '#radiobutton-9810c51fa5-widget',
        radiobutton2 = '#radiobutton-7842f66371-widget',
        radiobutton3 = '#radiobutton-073bbdd83c-widget',
        radiobutton4 = '#radiobutton-6bc17edce1-widget';

    let enums = ["one", "two", "three"],
        enumNames = ["India", "US", "Singapore"];

    /**
     * initialization of form container before every test
     * */
    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    describe('Radiobutton with no options', () => {
        it('add enums', () => {
            cy.get(addEnumBtn1).click().then(() => {
                cy.get(radiobutton1).children().should('have.length', 3);
                cy.get(radiobutton1).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(enums[index]);
                })
            })
        });

        it('add enums Names', () => {
            cy.get(addEnumNameBtn1).click().then(() => {
                cy.get(radiobutton1).children().should('have.length', 3);
                cy.get(radiobutton1).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enumNames[index]);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });

        it('add both', () => {
            cy.get(addBothBtn1).click().then(() => {
                cy.get(radiobutton1).children().should('have.length', 3);
                cy.get(radiobutton1).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });
    });

    describe('length of current options = length of new enums, enumNames', () => {
        it('add enums', () => {
            cy.get(addEnumBtn2).click().then(() => {
                cy.get(radiobutton2).children().should('have.length', 3);
                cy.get(radiobutton2).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(`country${index + 1}`);
                })
            })
        });

        it('add enums Names', () => {
            cy.get(addEnumNameBtn2).click().then(() => {
                cy.get(radiobutton2).children().should('have.length', 3);
                cy.get(radiobutton2).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(`${index + 1}`);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });

        it('add both', () => {
            cy.get(addBothBtn2).click().then(() => {
                cy.get(radiobutton2).children().should('have.length', 3);
                cy.get(radiobutton2).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });
    });

    describe('length of current options < length of new enums, enumNames', () => {
        it('add enums', () => {
            cy.get(addEnumBtn3).click().then(() => {
                cy.get(radiobutton3).children().should('have.length', 3);
                cy.get(radiobutton3).children().each((option, index) => {
                    if(index < 2) {
                        expect(option.find('input').val()).to.be.eq(enums[index]);
                        expect(option.find('span').text()).to.be.eq(`country${index + 1}`);
                    } else {
                        expect(option.find('input').val()).to.be.eq(enums[index]);
                        expect(option.find('span').text()).to.be.eq(enums[index]);
                    }
                })
            })
        });

        it('add enums Names', () => {
            cy.get(addEnumNameBtn3).click().then(() => {
                cy.get(radiobutton3).children().should('have.length', 2);
                cy.get(radiobutton3).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(`${index + 1}`);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });

        it('add both', () => {
            cy.get(addBothBtn3).click().then(() => {
                cy.get(radiobutton3).children().should('have.length', 3);
                cy.get(radiobutton3).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });
    });

    describe('length of current options > length of new enums, enumNames', () => {
        it('add enums', () => {
            cy.get(addEnumBtn4).click().then(() => {
                cy.get(radiobutton4).children().should('have.length', 3);
                cy.get(radiobutton4).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(`country${index + 1}`);
                })
            })
        });

        it('add enums Names', () => {
            cy.get(addEnumNameBtn4).click().then(() => {
                cy.get(radiobutton4).children().should('have.length', 4);
                cy.get(radiobutton4).children().each((option, index) => {
                    if(index < 3) {
                        expect(option.find('input').val()).to.be.eq(`${index + 1}`);
                        expect(option.find('span').text()).to.be.eq(enumNames[index]);
                    } else {
                        expect(option.find('input').val()).to.be.eq(`${index + 1}`);
                        expect(option.find('span').text()).to.be.eq(`${index + 1}`);
                    }

                })
            })
        });

        it('add both', () => {
            cy.get(addBothBtn4).click().then(() => {
                cy.get(radiobutton4).children().should('have.length', 3);
                cy.get(radiobutton4).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });

    });

    describe('Clear all RadioButton options', () => {
        it('check clear', () => {
            cy.get(clearBtn).click().then(() => {
                cy.get(radiobutton4).children().should('have.length', 0); // only the blank option
            })
        });
    });
})