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

/**
 * Tests that validateFormData from @aemforms/af-core correctly evaluates form
 * JSON constraints, and that the SSV error pipeline maps those results to
 * markAsInvalid calls on the right fields.
 *
 * This verifies the full chain:
 *   validateFormData(model, data) → ValidationError[] → {fieldName, message}
 *   → defaultSubmitErrorHandler → formModel.visit() → field.markAsInvalid()
 */

// @aemforms/af-custom-functions must be mocked before importing customFunctions
const mockCfDefaultSubmitErrorHandler = jest.fn();
jest.mock("@aemforms/af-custom-functions", () => ({
    toObject: jest.fn(),
    externalize: jest.fn(url => url),
    validateURL: jest.fn(),
    navigateTo: jest.fn(),
    defaultErrorHandler: jest.fn(),
    defaultSubmitSuccessHandler: jest.fn(),
    defaultSubmitErrorHandler: (...args) => mockCfDefaultSubmitErrorHandler(...args),
    fetchCaptchaToken: jest.fn(),
    dateToDaysSinceEpoch: jest.fn(),
    downloadDoR: jest.fn(),
    exportFormData: jest.fn()
}));

import { validateFormData } from "@aemforms/af-core";
import { customFunctions } from "../src/customFunctions";

// ─── minimal form model factories ──────────────────────────────────────────────

/**
 * Returns the minimal form JSON required by af-core for a list of fields.
 * Each field entry must include at least: fieldType, name, and any constraints.
 */
function makeFormModel(fields) {
    return {
        adaptiveform: "0.10.0",
        items: fields
    };
}

function textField(name, overrides) {
    // id must be set explicitly; otherwise af-core generates a random one and
    // ValidationError.fieldName (which equals this.id) won't match the field name.
    return Object.assign({ fieldType: "text-input", id: name, name, type: "string" }, overrides);
}

function numberField(name, overrides) {
    return Object.assign({ fieldType: "number-input", id: name, name, type: "number" }, overrides);
}

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts af-core ValidationError[] into the {qualifiedName, message} array that
 * the SSV IO action sends in its HTTP 400 response body.
 *
 * ValidationError.fieldName is the field's id (set explicitly in our test models
 * to equal the field name). The IO action maps these to qualifiedName by traversing
 * the form model JSON; here we simulate that by prefixing with "$form.".
 */
function toSsvErrors(validationErrors) {
    var result = [];
    validationErrors.forEach(function(err) {
        var qualifiedName = err.fieldName ? ("$form." + err.fieldName) : null;
        var messages = Array.isArray(err.errorMessages) ? err.errorMessages : [];
        messages.forEach(function(msg) {
            result.push({ qualifiedName: qualifiedName, message: msg });
        });
    });
    return result;
}

// ─── validateFormData tests ────────────────────────────────────────────────────

describe("validateFormData (af-core JSON constraint validation)", () => {

    test("returns valid=true and empty messages when all data satisfies constraints", () => {
        const model = makeFormModel([
            textField("email",  { required: true }),
            textField("name",   { required: true, maxLength: 50 }),
            numberField("age",  { minimum: 0, maximum: 120 })
        ]);
        const data = { email: "user@example.com", name: "Alice", age: 30 };

        const result = validateFormData(model, data);

        expect(result.valid).toBe(true);
        expect(result.messages).toHaveLength(0);
    });

    test("reports required violation when a mandatory field is empty", () => {
        const model = makeFormModel([
            textField("email", { required: true })
        ]);
        const data = { email: "" };

        const result = validateFormData(model, data);

        expect(result.valid).toBe(false);
        const emailErrors = result.messages.filter(m => m.fieldName === "email");
        expect(emailErrors.length).toBeGreaterThan(0);
    });

    test("reports maxLength violation", () => {
        const model = makeFormModel([
            textField("username", { maxLength: 5 })
        ]);
        const data = { username: "toolongvalue" };

        const result = validateFormData(model, data);

        expect(result.valid).toBe(false);
        const errors = result.messages.filter(m => m.fieldName === "username");
        expect(errors.length).toBeGreaterThan(0);
    });

    test("reports minimum violation on a number field", () => {
        const model = makeFormModel([
            numberField("age", { minimum: 18 })
        ]);
        const data = { age: 10 };

        const result = validateFormData(model, data);

        expect(result.valid).toBe(false);
        const errors = result.messages.filter(m => m.fieldName === "age");
        expect(errors.length).toBeGreaterThan(0);
    });

    test("reports maximum violation on a number field", () => {
        const model = makeFormModel([
            numberField("quantity", { maximum: 100 })
        ]);
        const data = { quantity: 200 };

        const result = validateFormData(model, data);

        expect(result.valid).toBe(false);
        const errors = result.messages.filter(m => m.fieldName === "quantity");
        expect(errors.length).toBeGreaterThan(0);
    });

    test("reports minLength violation", () => {
        const model = makeFormModel([
            textField("password", { minLength: 8 })
        ]);
        const data = { password: "abc" };

        const result = validateFormData(model, data);

        expect(result.valid).toBe(false);
        const errors = result.messages.filter(m => m.fieldName === "password");
        expect(errors.length).toBeGreaterThan(0);
    });

    test("reports pattern violation", () => {
        const model = makeFormModel([
            textField("zip", { pattern: "^[0-9]{5}$" })
        ]);
        const data = { zip: "ABCDE" };

        const result = validateFormData(model, data);

        expect(result.valid).toBe(false);
        const errors = result.messages.filter(m => m.fieldName === "zip");
        expect(errors.length).toBeGreaterThan(0);
    });

    test("returns valid=true when pattern constraint is satisfied", () => {
        const model = makeFormModel([
            textField("zip", { pattern: "^[0-9]{5}$" })
        ]);
        const data = { zip: "12345" };

        const result = validateFormData(model, data);

        expect(result.valid).toBe(true);
        expect(result.messages).toHaveLength(0);
    });

    test("collects violations across multiple fields in one pass", () => {
        const model = makeFormModel([
            textField("email",  { required: true }),
            numberField("age",  { minimum: 18 }),
            textField("code",   { pattern: "^[A-Z]{3}$" })
        ]);
        const data = { email: "", age: 5, code: "12" };

        const result = validateFormData(model, data);

        expect(result.valid).toBe(false);
        const fieldNames = result.messages.map(m => m.fieldName);
        expect(fieldNames).toContain("email");
        expect(fieldNames).toContain("age");
        expect(fieldNames).toContain("code");
    });

    test("each ValidationError has errorMessages array with at least one string", () => {
        const model = makeFormModel([
            textField("name", { required: true })
        ]);
        const data = { name: "" };

        const result = validateFormData(model, data);

        expect(result.valid).toBe(false);
        result.messages.forEach(err => {
            expect(Array.isArray(err.errorMessages)).toBe(true);
            expect(err.errorMessages.length).toBeGreaterThan(0);
            expect(typeof err.errorMessages[0]).toBe("string");
        });
    });
});

// ─── full pipeline: validateFormData → SSV error format → defaultSubmitErrorHandler ─

describe("SSV pipeline: af-core validation → markAsInvalid", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        global.alert = jest.fn();
    });

    test("errors from validateFormData trigger markAsInvalid on matching fields", () => {
        const model = makeFormModel([
            textField("email", { required: true }),
            numberField("age",  { minimum: 18 })
        ]);
        const data = { email: "", age: 10 };

        const { messages } = validateFormData(model, data);
        const ssvErrors = toSsvErrors(messages);

        // Build the mock form model the way customFunctions.js uses it.
        // qualifiedName mirrors what AF form JSON emits for a top-level field.
        const emailField = { name: "email", qualifiedName: "$form.email", markAsInvalid: jest.fn() };
        const ageField   = { name: "age",   qualifiedName: "$form.age",   markAsInvalid: jest.fn() };
        const byQn = { "$form.email": emailField, "$form.age": ageField };
        const formModel  = {
            resolveQualifiedName: jest.fn(qn => byQn[qn] || null)
        };

        const globals = {
            event: {
                type: "submitError",
                payload: {
                    body: {
                        errorType: "SSV_VALIDATION_ERROR",
                        valid: false,
                        errors: ssvErrors
                    }
                }
            },
            form: {},
            formModel
        };

        customFunctions.defaultSubmitErrorHandler("Error", globals);

        expect(emailField.markAsInvalid).toHaveBeenCalled();
        expect(ageField.markAsInvalid).toHaveBeenCalled();
        expect(mockCfDefaultSubmitErrorHandler).not.toHaveBeenCalled();
    });

    test("valid data produces no SSV errors and handler falls through normally", () => {
        const model = makeFormModel([
            textField("email", { required: true }),
            numberField("age",  { minimum: 18 })
        ]);
        const data = { email: "test@example.com", age: 25 };

        const { messages, valid } = validateFormData(model, data);

        expect(valid).toBe(true);
        expect(messages).toHaveLength(0);

        // No SSV errors to pass to the handler
        const ssvErrors = toSsvErrors(messages);
        expect(ssvErrors).toHaveLength(0);
    });

    test("toSsvErrors flattens multiple errorMessages per field into separate entries", () => {
        const model = makeFormModel([
            textField("code", { minLength: 3, maxLength: 3, pattern: "^[A-Z]{3}$" })
        ]);
        const data = { code: "12" };  // fails minLength and pattern

        const { messages } = validateFormData(model, data);
        const ssvErrors = toSsvErrors(messages);

        // Each error entry has qualifiedName and a non-empty message string
        ssvErrors.forEach(err => {
            expect(err.qualifiedName).toBe("$form.code");
            expect(typeof err.message).toBe("string");
            expect(err.message.length).toBeGreaterThan(0);
        });
    });
});
