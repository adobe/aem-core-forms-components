/*******************************************************************************
 * Copyright 2023 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/


/**
 * test function 1
 * @name testFunction1 test function 1
 * @return {string}
 */
function testFunction1()
{
    return "test";
}

/**
 * Returns 3 enum values
 * @name getEnum1 Get_Enum_1
 * @return {OPTIONS}
 */
function getEnum1() {
    var enums = [];
    enums[0] = 'one';
    enums[1] = 'two';
    enums[2] = 'three';
    return enums;
}

/**
 * Return 3 enum Name values
 * @name getEnumNames1 Get_Enum_Names_1
 * @return {OPTIONS}
 */
function getEnumNames1() {
    var enumNames = [];
    enumNames[0] = 'India';
    enumNames[1] = 'US';
    enumNames[2] = 'Singapore';
    return enumNames;
}


/**
 * Returns 2 enum values
 * @name getEnum2 Get_Enum_2
 * @return {OPTIONS}
 */
function getEnum2() {
    var enums = [];
    enums[0] = 'one';
    enums[1] = 'two';
    return enums;
}

/**
 * Return 2 enum Name values
 * @name getEnumNames2 Get_Enum_Names_2
 * @return {OPTIONS}
 */
function getEnumNames2() {
    var enumNames = [];
    enumNames[0] = 'one';
    enumNames[1] = 'two';
    return enumNames;
}

/**
 * clears the enums
 * @name clearEnums clear_enum
 * @return {OPTIONS}
 */
function clearEnums() {
    var enums = [];
    return enums;
}

/**
 * Formats Credit Card Number
 * @name formatCreditCardNumber Formats Credit Card Number
 * @param {object} field field whose value to be formatted
 * @return {string}
 */
function formatCreditCardNumber(field)
{
    var cardNumber = field.$value ? field.$value + '' : field.$value;
    var formattedNumber = cardNumber;
    if(cardNumber) {
        var maskedNumber = cardNumber.replace(/\d(?=\d{4})/g, '*');  // Replace digits with masked characters except for the last four
        var formattedNumber = maskedNumber.replace(/(.{4})/g, '$1 '); // Add spaces after every 4 letters
    }
    return formattedNumber;
}

/**
 * Formats Date input
 * @name formatDateInput Formats Date input
 * @param {object} field field whose value to be formatted
 * @return {string}
 */
function formatDateInput(field)
{
    var date = field.$value;
    return date ? date + ' today' : date;
}

/**
 * Formats email input
 * @name formatEmailInput Formats email input
 * @param {object} field field whose value to be formatted
 * @return {string}
 */
function formatEmailInput(field)
{
    var email = field.$value;
    var transformedEmail;
    if(email) {
        var parts = email.split('@');
        if (parts[0].length > 1) {
            transformedEmail = parts[0][0] + '*'.repeat(parts[0].length - 1) + '@' + parts[1];
        } else {
            transformedEmail = email;
        }
    }

    return transformedEmail;
}


/**
 * Formats telephone input
 * @name formatTelephoneInput Formats telephone input
 * @param {object} field field whose value to be formatted
 * @return {string}
 */
function formatTelephoneInput(field)
{
    var phoneNumber = field.$value;
    if(phoneNumber) {
        var maskedDigits = phoneNumber.substring(0, 7).replace(/\d/g, '*');
        var lastThreeDigits = phoneNumber.substring(7);
        return maskedDigits + lastThreeDigits;
    }
    return phoneNumber;
}

/**
 * Tests import data
 * @name testImportData
 * @param {scope} globals
 */
function testImportData(globals)
{
    globals.functions.importData(Object.fromEntries([['textinput_12605243111716188337417','abc']]));
}

/**
 * Tests set focus
 * @name testSetFocus
 * @param {object} emailField
 * @param {scope} globals
 */
function testSetFocus(emailField, globals)
{
    globals.functions.setFocus(emailField);
}

/**
 * Tests set focus with focusOption
 * @name testSetFocusWithFocusOption
 * @param {object} emailField
 * @param {string} focusOption
 * @param {scope} globals
 */
function testSetFocusWithFocusOption(emailField, focusOption, globals)
{
    globals.functions.setFocus(emailField, focusOption);
}

/**
 * Tests add instance with dispatchEvent
 * @name testAddInstance
 * @param {scope} globals
 */
function testAddInstance(globals)
{
    var repeatablePanel = globals.form.panelcontainer2;
    globals.functions.dispatchEvent(repeatablePanel, 'addInstance');
}

/**
 * Tests remove instance with dispatchEvent
 * @name testRemoveInstance
 * @param {scope} globals
 */
function testRemoveInstance(globals)
{
    var repeatablePanel = globals.form.panelcontainer2;
    globals.functions.dispatchEvent(repeatablePanel, 'removeInstance');
}

/**
 * clearValueCustomFunction
 * @name clearValueCustomFunction
 * @param {object} field field whose value to be cleared
 * @param {scope} globals
 **/
function clearValueCustomFunction(field, globals) {
    // only clear data if change was done by user from the UI.
    if (globals.event.payload.eventSource == "ui") {
        globals.functions.setProperty(field, {value: null});
    }
}

/**
 * customMessageUsingInvalidApi
 * @name customMessageUsingInvalidApi
 * @param {object} field
 * @param {scope} globals
 */
function customMessageUsingInvalidApi(field, globals) {
    const minLength = 15;
    const comments = field.$value.trim();
    if (comments.length < minLength) {
        globals.functions.setProperty(field, {valid: false, errorMessage : "Comments must be at least 15 characters long."});
    } else {
        globals.functions.setProperty(field, {valid : true});
    }
}

let label = '',
    panelLabel = '';

/**
 * updatePanelLabel
 * @name updatePanelLabel
 * @param {object} repeatablePanel
 * @param {scope} globals
 */
function updatePanelLabel(repeatablePanel, globals) {

    if (globals.field.$fieldType === 'panel' && label === '') {
        label = globals.field.who_lives_name.$label.value;
        panelLabel = globals.field.$label.value;
        globals.functions.setProperty(globals.field, {label: {"value": panelLabel + (globals.field.$index + 1)}});
        globals.functions.setProperty(globals.field.who_lives_name, {label: {"value": label + "<b>" + (globals.field.$index + 1) + "</b>"}});
    }

    // walk through other instances and update their label
    repeatablePanel.$parent.forEach(panel => {
        globals.functions.setProperty(panel,{label : {"value" : panelLabel + (panel.$index+1)}});
        globals.functions.setProperty(panel.who_lives_name,{label : {"value" : label+"<b>"+(panel.$index+1)+"</b>"}});
    });
}



/**
 * Tests add instance with dispatchEvent
 * @name addPanelInstance
 * @param {object} panel
 * @param {scope} globals
 */
function addPanelInstance(panel,globals)
{
    globals.functions.dispatchEvent(panel,'addInstance', globals.field.$parent.$index + 1);
}


/**
 * Tests remove instance with dispatchEvent
 * @name removePanelInstance
 * @param {object} panel
 * @param {scope} globals
 */
function removePanelInstance(panel,globals)
{
    globals.functions.dispatchEvent(panel, 'removeInstance', globals.field.$parent.$index);
    panel.forEach(p => {
        globals.functions.dispatchEvent(p, 'initialize');
    })
}
