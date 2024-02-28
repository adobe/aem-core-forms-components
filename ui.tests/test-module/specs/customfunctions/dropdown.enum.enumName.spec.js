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

describe('Test UpdateEnum, UpdateEnumName for dropdown', () => {
    const pagePath = "/content/forms/af/core-components-it/samples/customfunctions/populate-dropdown.html";
    let formContainer = null;

    let addEnumBtn1 = '#button-4f9d6db1a7-widget',
        addEnumNameBtn1 = '#button-8d6d549b2d-widget',
        addBothBtn1 = '#button-7280e14826-widget',

        addEnumBtn2 = '#button-3bdbcd7835-widget',
        addEnumNameBtn2 = '#button-3d1937a260-widget',
        addBothBtn2 = '#button-527756ca35-widget',

        addEnumBtn3 = '#button-dbaf45c85d-widget',
        addEnumNameBtn3 = '#button-e65796ada8-widget',
        addBothBtn3  = '#button-b735ec7e4d-widget',

        addEnumBtn4 = '#button-a7f050d76f-widget',
        addEnumNameBtn4 = '#button-8f89a3ab82-widget',
        addBothBtn4  = '#button-2fd35c697b-widget',
        clearBtn = '#button-45fc40730e-widget';

    let dropdown1 = '#dropdown-5c4fff127c-widget option',
        dropdown2 = '#dropdown-9f84e9825f-widget option',
        dropdown3 = '#dropdown-20d64d4aed-widget option',
        dropdown4 = '#dropdown-6ca22b3ce1-widget option';

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

    describe('Dropdown with no options', () => {
        it('add enums', () => {
            cy.get(addEnumBtn1).click().then(() => {
                cy.get(dropdown1).should('have.length', 4);
                cy.get(dropdown1).each((option, index) => {
                    if(option.val() !== '') {
                        expect(option.val()).to.be.eq(enums[index - 1]);
                        expect(option.text()).to.be.eq(enums[index - 1]);
                    }
                })
            })
        });

        it('add enum Names', () => {
            cy.get(addEnumNameBtn1).click().then(() => {
                cy.get(dropdown1).should('have.length', 4);
                cy.get(dropdown1).each((option, index) => {
                    if(option.val() !== '') {
                        expect(option.val()).to.be.eq(enumNames[index - 1]);
                        expect(option.text()).to.be.eq(enumNames[index - 1]);
                    }
                });
            })
        });

        it ('add Both', () => {
            cy.get(addBothBtn1).click().then(() => {
                cy.get(dropdown1).should('have.length', 4);
                cy.get(dropdown1).each((option, index) => {
                    if(option.val() !== '') {
                        expect(option.val()).to.be.eq(enums[index - 1]);
                        expect(option.text()).to.be.eq(enumNames[index - 1]);
                    }
                });
            })
        });
    });

    describe('length of current options = length of new enums, enumNames', () => {
        it('add enums', () => {
            cy.get(addEnumBtn2).click().then(() => {
                cy.get(dropdown2).should('have.length', 4);
                cy.get(dropdown2).each((option, index) => {
                    if(option.val() !== '') {
                        expect(option.val()).to.be.eq(enums[index - 1]);
                        expect(option.text()).to.be.eq(`country${index}`);
                    }
                })
            })
        });

        it('add enum Names', () => {
            cy.get(addEnumNameBtn2).click().then(() => {
                cy.get(dropdown2).should('have.length', 4);
                cy.get(dropdown2).each((option, index) => {
                    if(option.val() !== '') {
                        expect(option.val()).to.be.eq(`${index}`);
                        expect(option.text()).to.be.eq(enumNames[index - 1]);
                    }
                });
            })
        });

        it('add Both', () => {
            cy.get(addBothBtn2).click().then(() => {
                cy.get(dropdown2).should('have.length', 4);
                cy.get(dropdown2).each((option, index) => {
                    if(option.val() !== '') {
                        expect(option.val()).to.be.eq(enums[index - 1]);
                        expect(option.text()).to.be.eq(enumNames[index - 1]);
                    }
                });
            })
        });
    });

    describe('length of current options < length of new enums, enumNames', () => {
        it('add enums', () => {
            cy.get(addEnumBtn3).click().then(() => {
                cy.get(dropdown3).should('have.length', 4);
                cy.get(dropdown3).each((option, index) => {
                    if(option.val() !== '' && index < 3) {
                        expect(option.val()).to.be.eq(enums[index - 1]);
                        expect(option.text()).to.be.eq(`country${index}`);
                    } else if(option.val()) {
                        expect(option.val()).to.be.eq(enums[index - 1]);
                        expect(option.text()).to.be.eq(enums[index - 1]);  // for new enums enumName = enums
                    }
                })
            })
        });

        it('add enum Names', () => {
            cy.get(addEnumNameBtn3).click().then(() => {
                cy.get(dropdown3).should('have.length', 3);
                cy.get(dropdown3).each((option, index) => {
                    if(option.val() !== '') {
                        expect(option.val()).to.be.eq(`${index}`);
                        expect(option.text()).to.be.eq(enumNames[index - 1]);
                    }
                });
            })
        });

        it('add Both', () => {
            cy.get(addBothBtn3).click().then(() => {
                cy.get(dropdown3).should('have.length', 4);
                cy.get(dropdown3).each((option, index) => {
                    if(option.val() !== '') {
                        expect(option.val()).to.be.eq(enums[index - 1]);
                        expect(option.text()).to.be.eq(enumNames[index - 1]);
                    }
                });
            })
        });
    });

    describe('length of current options > length of new enums, enumNames', () => {
        it('add enums', () => {
            cy.get(addEnumBtn4).click().then(() => {
                cy.get(dropdown4).should('have.length', 4);
                cy.get(dropdown4).each((option, index) => {
                    if(option.val() !== '') {
                        expect(option.val()).to.be.eq(enums[index - 1]);
                        expect(option.text()).to.be.eq(`country${index}`);
                    }
                })
            })
        });

        it('add enum Names', () => {
            cy.get(addEnumNameBtn4).click().then(() => {
                cy.get(dropdown4).should('have.length', 5);
                cy.get(dropdown4).each((option, index) => {
                    if(option.val() !== '' && index < 4) {
                        expect(option.val()).to.be.eq(`${index}`);
                        expect(option.text()).to.be.eq(enumNames[index - 1]);
                    } else if(option.val()) {
                        expect(option.val()).to.be.eq(`${index}`);
                        expect(option.text()).to.be.eq(option.val());
                    }
                });
            })
        });

        it('add Both', () => {
            cy.get(addBothBtn4).click().then(() => {
                cy.get(dropdown4).should('have.length', 4);
                cy.get(dropdown4).each((option, index) => {
                    if(option.val() !== '') {
                        expect(option.val()).to.be.eq(enums[index - 1]);
                        expect(option.text()).to.be.eq(enumNames[index - 1]);
                    }
                });
            })
        });

    });

    describe('Clear all Dropdown options', () => {
        it('check clear', () => {
            cy.get(clearBtn).click().then(() => {
                cy.get(dropdown4).should('have.length', 1); // only the blank option
            })
        });
    });

})
