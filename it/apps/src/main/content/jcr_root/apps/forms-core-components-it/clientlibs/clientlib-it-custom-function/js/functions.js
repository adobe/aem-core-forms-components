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





