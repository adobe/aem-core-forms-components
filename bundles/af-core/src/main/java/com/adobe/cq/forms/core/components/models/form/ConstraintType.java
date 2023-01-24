/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
package com.adobe.cq.forms.core.components.models.form;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Defines the constraint type. Possible values: {@code type}, {@code required}, {@code minimum}, {@code maximum},
 * {@code minLength}, {@code maxLength}, {@code step}, {@code format}, {@code pattern}, {@code minItems}, {@code maxItems},
 * {@code minOccur}, {@code maxOccur}, {@code uniqueItems}, {@code enforceEnum}, {@code validationExpression}
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
public enum ConstraintType {
    TYPE("type"),
    REQUIRED("required"),
    MINIMUM("minimum"),
    MAXIMUM("maximum"),
    MIN_LENGTH("minLength"),
    MAX_LENGTH("maxLength"),
    STEP("step"),
    FORMAT("format"),
    PATTERN("pattern"),
    MIN_ITEMS("minItems"),
    MAX_ITEMS("maxItems"),
    MIN_OCCUR("minOccur"),
    MAX_OCCUR("maxOccur"),
    UNIQUE_ITEMS("uniqueItems"),
    ENFORCE_ENUM("enforceEnum"),
    VALIDATION_EXPRESSION("validationExpression"),
    MAXFILE_SIZE("maxFileSize"),
    ACCEPT("accept");

    private String value;

    ConstraintType(String value) {
        this.value = value;
    }

    /**
     * Given a {@link String} <code>value</code>, this method returns the enum's value that corresponds to the provided string
     * representation
     *
     * @param value the string representation for which an enum value should be returned
     * @return the corresponding enum value, if one was found
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    public static ConstraintType fromString(String value) {
        for (ConstraintType type : ConstraintType.values()) {
            if (StringUtils.equals(value, type.value)) {
                return type;
            }
        }
        return null;
    }

    /**
     * Returns the string value of this enum constant.
     *
     * @return the string value of this enum constant
     * @since com.adobe.cq.wcm.core.components.models.form 13.0.0
     */
    public String getValue() {
        return value;
    }

    @Override
    @JsonValue
    public String toString() {
        return value;
    }

    /**
     * returns the name of the property which stores the value of the error message for the constraint
     *
     * @return string
     */
    public String getMessageProperty() {
        return value + "Message";
    }
}
