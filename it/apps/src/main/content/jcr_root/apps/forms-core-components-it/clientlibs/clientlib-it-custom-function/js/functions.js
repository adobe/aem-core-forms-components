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



