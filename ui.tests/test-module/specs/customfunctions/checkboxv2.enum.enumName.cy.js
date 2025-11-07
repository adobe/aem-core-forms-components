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

describe('Test UpdateEnum, UpdateEnumName for Checkbox', () => {
    const pagePath = "/content/forms/af/core-components-it/samples/customfunctions/populate-checkboxv2.html";
    let formContainer = null;

    let addEnumNameBtn1= '#button-5bc5fab8c0-widget',
        addEnumBtn1 = '#button-6951fcf2b2-widget',
        addBothBtn1 = '#button-487d71c3ba-widget',

        addEnumNameBtn2 = '#button-ad5baa0047-widget',
        addEnumBtn2 = '#button-fe525e925a-widget',
        addBothBtn2 = '#button-07229a0cd4-widget',

        addEnumNameBtn3 = '#button-5ed411b277-widget',
        addEnumBtn3 = '#button-91a8b94636-widget',
        addBothBtn3  = '#button-a73ae3d48a-widget',

        addEnumNameBtn4 = '#button-ab004c2b14-widget',
        addEnumBtn4 = '#button-db372ecc80-widget',
        addBothBtn4  = '#button-c099ce340a-widget',
        clearBtn = '#button-6f9298f657-widget';

    let checkbox1 = '#checkboxgroup-c156999de2-widget',
        checkbox2 = '#checkboxgroup-50b0f345aa-widget',
        checkbox3 = '#checkboxgroup-e821624a2f-widget',
        checkbox4 = '#checkboxgroup-da4906da81-widget';

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

    describe('Checkbox with no options', () => {
        it('add enums', () => {
            cy.get(addEnumBtn1).click().then(() => {
                cy.get(checkbox1).children().should('have.length', 3);
                cy.get(checkbox1).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(enums[index]);
                })
            })
        });

        it('add enums Names', () => {
            cy.get(addEnumNameBtn1).click().then(() => {
                cy.get(checkbox1).children().should('have.length', 3);
                cy.get(checkbox1).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enumNames[index]);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });

        it('add both', () => {
            cy.get(addBothBtn1).click().then(() => {
                cy.get(checkbox1).children().should('have.length', 3);
                cy.get(checkbox1).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });
    });

    describe('length of current options = length of new enums, enumNames', () => {
        it('add enums', () => {
            cy.get(addEnumBtn2).click().then(() => {
                cy.get(checkbox2).children().should('have.length', 3);
                cy.get(checkbox2).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(`country${index + 1}`);
                })
            })
        });

        it('add enums Names', () => {
            cy.get(addEnumNameBtn2).click().then(() => {
                cy.get(checkbox2).children().should('have.length', 3);
                cy.get(checkbox2).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(`${index + 1}`);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });

        it('add both', () => {
            cy.get(addBothBtn2).click().then(() => {
                cy.get(checkbox2).children().should('have.length', 3);
                cy.get(checkbox2).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });
    });

    describe('length of current options < length of new enums, enumNames', () => {
        it('add enums', () => {
            cy.get(addEnumBtn3).click().then(() => {
                cy.get(checkbox3).children().should('have.length', 3);
                cy.get(checkbox3).children().each((option, index) => {
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
                cy.get(checkbox3).children().should('have.length', 2);
                cy.get(checkbox3).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(`${index + 1}`);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });

        it('add both', () => {
            cy.get(addBothBtn3).click().then(() => {
                cy.get(checkbox3).children().should('have.length', 3);
                cy.get(checkbox3).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });
    });

    describe('length of current options > length of new enums, enumNames', () => {
        it('add enums', () => {
            cy.get(addEnumBtn4).click().then(() => {
                cy.get(checkbox4).children().should('have.length', 3);
                cy.get(checkbox4).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(`country${index + 1}`);
                })
            })
        });

        it('add enums Names', () => {
            cy.get(addEnumNameBtn4).click().then(() => {
                cy.get(checkbox4).children().should('have.length', 4);
                cy.get(checkbox4).children().each((option, index) => {
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
                cy.get(checkbox4).children().should('have.length', 3);
                cy.get(checkbox4).children().each((option, index) => {
                    expect(option.find('input').val()).to.be.eq(enums[index]);
                    expect(option.find('span').text()).to.be.eq(enumNames[index]);
                })
            })
        });

    });

    describe('Clear all Checkbox options', () => {
        it('check clear', () => {
            cy.get(clearBtn).click().then(() => {
                cy.get(checkbox4).children().should('have.length', 0); // only the blank option
            })
        });
    });

})
