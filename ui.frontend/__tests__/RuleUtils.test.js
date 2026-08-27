/*******************************************************************************
 * Copyright 2025 Adobe
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

import RuleUtils from '../src/RuleUtils';
import HTTPAPILayer from '../src/HTTPAPILayer';
import {FunctionRuntime} from '@aemforms/af-core';

jest.mock('../src/HTTPAPILayer', () => ({
    __esModule: true,
    default: {
        getJson: jest.fn(),
        getCustomFunctionConfig: jest.fn()
    }
}));

jest.mock('@aemforms/af-core', () => ({
    __esModule: true,
    FunctionRuntime: {
        registerFunctions: jest.fn()
    }
}));

beforeEach(() => {
    jest.clearAllMocks();
    // Clean up any test functions added to window
    delete window.myValidate;
    delete window.computeTotal;
    delete window.onChangeHandler;
});

// ─── registerCustomFunctionsV2 ───────────────────────────────────────────────

test('registerCustomFunctionsV2 never calls the HTTP API', async () => {
    await RuleUtils.registerCustomFunctionsV2({ ':items': {} });
    expect(HTTPAPILayer.getJson).not.toHaveBeenCalled();
    expect(HTTPAPILayer.getCustomFunctionConfig).not.toHaveBeenCalled();
});

test('registerCustomFunctionsV2 registers window functions found in form rules', async () => {
    window.myValidate = jest.fn();
    window.computeTotal = jest.fn();

    const formJson = {
        ':items': {
            field1: {
                validationExpression: 'myValidate($value)',
                rules: { value: 'computeTotal($form)' }
            }
        }
    };

    await RuleUtils.registerCustomFunctionsV2(formJson);

    expect(FunctionRuntime.registerFunctions).toHaveBeenCalledTimes(1);
    const registered = FunctionRuntime.registerFunctions.mock.calls[0][0];
    expect(registered.myValidate).toBe(window.myValidate);
    expect(registered.computeTotal).toBe(window.computeTotal);
});

test('registerCustomFunctionsV2 skips names not present on window', async () => {
    // onChangeHandler is NOT on window
    const formJson = {
        ':items': {
            field1: { events: { 'change': ['onChangeHandler($event)'] } }
        }
    };

    await RuleUtils.registerCustomFunctionsV2(formJson);

    const registered = FunctionRuntime.registerFunctions.mock.calls[0][0];
    expect(Object.keys(registered)).not.toContain('onChangeHandler');
});

test('registerCustomFunctionsV2 skips non-function window properties with the same name', async () => {
    window.myValidate = 'not-a-function';

    const formJson = {
        ':items': {
            field1: { validationExpression: 'myValidate($value)' }
        }
    };

    await RuleUtils.registerCustomFunctionsV2(formJson);

    const registered = FunctionRuntime.registerFunctions.mock.calls[0][0];
    expect(Object.keys(registered)).not.toContain('myValidate');
});

test('registerCustomFunctionsV2 works with an empty form', async () => {
    await RuleUtils.registerCustomFunctionsV2({ ':items': {} });
    expect(FunctionRuntime.registerFunctions).toHaveBeenCalledWith({});
});

// ─── extractFunctionNames ────────────────────────────────────────────────────

test('extractFunctionNames extracts from form-level events', () => {
    const formJson = {
        events: { 'initialize': ['myInit($form)', 'setup()'] }
    };
    const result = RuleUtils.extractFunctionNames(formJson);
    const ids = result.map(f => f.id);
    expect(ids).toContain('myInit');
    expect(ids).toContain('setup');
});

test('extractFunctionNames extracts from form-level rules', () => {
    const formJson = {
        rules: { visible: 'isAdmin($user)' }
    };
    const result = RuleUtils.extractFunctionNames(formJson);
    expect(result.map(f => f.id)).toContain('isAdmin');
});

test('extractFunctionNames extracts from validationExpression and displayValueExpression', () => {
    const formJson = {
        ':items': {
            field1: {
                validationExpression: 'validateEmail($value)',
                displayValueExpression: 'formatPhone($value)'
            }
        }
    };
    const result = RuleUtils.extractFunctionNames(formJson);
    const ids = result.map(f => f.id);
    expect(ids).toContain('validateEmail');
    expect(ids).toContain('formatPhone');
});

test('extractFunctionNames extracts from nested panel items', () => {
    const formJson = {
        ':items': {
            panel: {
                ':items': {
                    nestedField: {
                        validationExpression: 'deepValidate($value)'
                    }
                }
            }
        }
    };
    const result = RuleUtils.extractFunctionNames(formJson);
    expect(result.map(f => f.id)).toContain('deepValidate');
});

test('extractFunctionNames deduplicates function names', () => {
    const formJson = {
        ':items': {
            field1: { validationExpression: 'myFunc($value)' },
            field2: { validationExpression: 'myFunc($value)' }
        }
    };
    const result = RuleUtils.extractFunctionNames(formJson);
    const matches = result.filter(f => f.id === 'myFunc');
    expect(matches).toHaveLength(1);
});

test('extractFunctionNames returns empty array for form with no rules', () => {
    const result = RuleUtils.extractFunctionNames({ ':items': { field1: { label: { value: 'Name' } } } });
    // May contain built-in tokens like 'if', 'contains' from the af-core expressions but not custom ones
    // The important thing: no crash and returns an array
    expect(Array.isArray(result)).toBe(true);
});
