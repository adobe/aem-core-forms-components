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

// Mock @aemforms/af-custom-functions before importing the module under test
const mockCfDefaultSubmitErrorHandler = jest.fn();
const mockCfDefaultSubmitSuccessHandler = jest.fn();
const mockCfDefaultErrorHandler = jest.fn();

jest.mock("@aemforms/af-custom-functions", () => ({
    toObject: jest.fn(),
    externalize: jest.fn(url => url),
    validateURL: jest.fn(),
    navigateTo: jest.fn(),
    defaultErrorHandler: (...args) => mockCfDefaultErrorHandler(...args),
    defaultSubmitSuccessHandler: (...args) => mockCfDefaultSubmitSuccessHandler(...args),
    defaultSubmitErrorHandler: (...args) => mockCfDefaultSubmitErrorHandler(...args),
    fetchCaptchaToken: jest.fn(),
    dateToDaysSinceEpoch: jest.fn(),
    downloadDoR: jest.fn(),
    exportFormData: jest.fn()
}));

import { customFunctions } from "../src/customFunctions";

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeSsvGlobals(errors, formModel) {
    return {
        event: {
            type: "submitError",
            payload: {
                body: {
                    errorType: "SSV_VALIDATION_ERROR",
                    valid: false,
                    errors: errors
                }
            }
        },
        form: {},
        formModel: formModel
    };
}

function makeFormModel(fields) {
    const byQn = {};
    fields.forEach(f => { byQn[f.qualifiedName] = f; });
    return {
        resolveQualifiedName: jest.fn(qn => byQn[qn] || null)
    };
}

function makeField(name) {
    return {
        name: name,
        qualifiedName: "$form." + name,
        markAsInvalid: jest.fn()
    };
}

// ─── tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
});

describe("defaultSubmitErrorHandler", () => {

    test("marks named fields invalid when SSV_VALIDATION_ERROR returned", () => {
        const emailField = makeField("email");
        const ageField   = makeField("age");
        const formModel  = makeFormModel([emailField, ageField]);

        const globals = makeSsvGlobals(
            [
                { qualifiedName: "$form.email", message: "Must be a valid email" },
                { qualifiedName: "$form.age",   message: "Must be 18 or older" }
            ],
            formModel
        );

        customFunctions.defaultSubmitErrorHandler("Generic error", globals);

        expect(formModel.resolveQualifiedName).toHaveBeenCalledWith("$form.email");
        expect(formModel.resolveQualifiedName).toHaveBeenCalledWith("$form.age");
        expect(emailField.markAsInvalid).toHaveBeenCalledWith("Must be a valid email");
        expect(ageField.markAsInvalid).toHaveBeenCalledWith("Must be 18 or older");
        expect(mockCfDefaultSubmitErrorHandler).not.toHaveBeenCalled();
    });

    test("shows alert for form-level errors (qualifiedName absent)", () => {
        const formModel = makeFormModel([]);

        const globals = makeSsvGlobals(
            [{ message: "Form is incomplete" }],
            formModel
        );

        customFunctions.defaultSubmitErrorHandler("Generic error", globals);

        expect(global.alert).toHaveBeenCalledWith("Form is incomplete");
        expect(mockCfDefaultSubmitErrorHandler).not.toHaveBeenCalled();
    });

    test("handles mix of field-level and form-level errors", () => {
        const emailField = makeField("email");
        const formModel  = makeFormModel([emailField]);

        const globals = makeSsvGlobals(
            [
                { qualifiedName: "$form.email", message: "Invalid email" },
                { message: "Please review the form" }
            ],
            formModel
        );

        customFunctions.defaultSubmitErrorHandler("Generic error", globals);

        expect(emailField.markAsInvalid).toHaveBeenCalledWith("Invalid email");
        expect(global.alert).toHaveBeenCalledWith("Please review the form");
        expect(mockCfDefaultSubmitErrorHandler).not.toHaveBeenCalled();
    });

    test("joins multiple form-level error messages into a single alert", () => {
        const formModel = makeFormModel([]);

        const globals = makeSsvGlobals(
            [
                { message: "Error one" },
                { message: "Error two" }
            ],
            formModel
        );

        customFunctions.defaultSubmitErrorHandler("Generic error", globals);

        expect(global.alert).toHaveBeenCalledWith("Error one\nError two");
    });

    test("does not throw when formModel is undefined (rule-editor context)", () => {
        // When called from a Rule Editor rule, globals.formModel is not populated.
        // Field-level errors should be silently skipped; form-level errors still alerted.
        const globals = makeSsvGlobals(
            [
                { qualifiedName: "$form.name", message: "Required" },
                { message: "Form-level issue" }
            ],
            undefined  // no formModel
        );

        expect(() => {
            customFunctions.defaultSubmitErrorHandler("Generic error", globals);
        }).not.toThrow();

        expect(global.alert).toHaveBeenCalledWith("Form-level issue");
    });

    test("falls back to cf.defaultSubmitErrorHandler for non-SSV errors", () => {
        const globals = {
            event: {
                type: "submitError",
                payload: { body: { errorType: "SOME_OTHER_ERROR" } }
            },
            form: {},
            formModel: makeFormModel([])
        };

        customFunctions.defaultSubmitErrorHandler("Generic error", globals);

        expect(mockCfDefaultSubmitErrorHandler).toHaveBeenCalledWith("Generic error", globals);
        expect(global.alert).not.toHaveBeenCalled();
    });

    test("falls back to cf.defaultSubmitErrorHandler when payload body is absent", () => {
        const globals = {
            event: { type: "submitError", payload: {} },
            form: {},
            formModel: makeFormModel([])
        };

        customFunctions.defaultSubmitErrorHandler("Generic error", globals);

        expect(mockCfDefaultSubmitErrorHandler).toHaveBeenCalledWith("Generic error", globals);
    });

    test("falls back to cf.defaultSubmitErrorHandler when errors array is empty", () => {
        const globals = makeSsvGlobals([], makeFormModel([]));

        customFunctions.defaultSubmitErrorHandler("Generic error", globals);

        expect(mockCfDefaultSubmitErrorHandler).toHaveBeenCalledWith("Generic error", globals);
    });

    test("falls back to cf.defaultSubmitErrorHandler when globals is null", () => {
        customFunctions.defaultSubmitErrorHandler("Generic error", null);

        expect(mockCfDefaultSubmitErrorHandler).toHaveBeenCalledWith("Generic error", null);
    });

    test("does not call markAsInvalid on unrelated fields", () => {
        const emailField = makeField("email");
        const nameField  = makeField("name");
        const formModel  = makeFormModel([emailField, nameField]);

        // Only email has an error; name should NOT be marked invalid
        const globals = makeSsvGlobals(
            [{ qualifiedName: "$form.email", message: "Bad email" }],
            formModel
        );

        customFunctions.defaultSubmitErrorHandler("Generic error", globals);

        expect(emailField.markAsInvalid).toHaveBeenCalledWith("Bad email");
        expect(nameField.markAsInvalid).not.toHaveBeenCalled();
    });
});
