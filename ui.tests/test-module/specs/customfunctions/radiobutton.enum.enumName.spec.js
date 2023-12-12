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
    const pagePath = "/content/forms/af/core-components-it/samples/customfunctions/populate-radiobutton.html";
    let formContainer = null;

    let addEnumNameBtn1= '#button-7db7ca464d-widget',
        addEnumBtn1 = '#button-6a11e0b238-widget',
        addBothBtn1 = '#button-4536febd58-widget',

        addEnumNameBtn2 = '#button-aa02c61adb-widget',
        addEnumBtn2 = '#button-0827bc366b-widget',
        addBothBtn2 = '#button-a54450c9fc-widget',

        addEnumNameBtn3 = '#button-85fdd0b494-widget',
        addEnumBtn3 = '#button-985165da2b-widget',
        addBothBtn3  = '#button-ee38441696-widget',

        addEnumNameBtn4 = '#button-1c9c0c2199-widget',
        addEnumBtn4 = '#button-210c49c8b0-widget',
        addBothBtn4  = '#button-ceda6d9362-widget',
        clearBtn = '#button-acd04c2c45-widget';

    let radiobutton1 = '#radiobutton-9d8554b27d-widget',
        radiobutton2 = '#radiobutton-4db6375a9d-widget',
        radiobutton3 = '#radiobutton-9e43a37229-widget',
        radiobutton4 = '#radiobutton-b35b71a5c3-widget';

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
