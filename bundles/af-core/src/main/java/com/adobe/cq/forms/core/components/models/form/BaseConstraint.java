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
import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ProviderType;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * A base interface which specifies the different form field constraints
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ProviderType
public interface BaseConstraint {

    /**
     * Defines the data type. Possible values: {@code string}, {@code file}, {@code file[]}, {@code number}, {@code boolean}, {@code array}
     * , {@code object}
     *
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    public enum Type {
        STRING("string"),
        STRING_ARRAY("string[]"),
        NUMBER("number"),

        INTEGER("integer"),
        NUMBER_ARRAY("number[]"),
        BOOLEAN("boolean"),
        BOOLEAN_ARRAY("boolean[]"),
        OBJECT("object"),
        ARRAY("array"),
        FILE("file"),
        FILE_ARRAY("file[]");

        private String value;

        Type(String value) {
            this.value = value;
        }

        /**
         * Given a {@link String} <code>value</code>, this method returns the enum's value that corresponds to the provided string
         * representation. If no representation is found, {@link #STRING} will be returned.
         *
         * @param value the string representation for which an enum value should be returned
         * @return the corresponding enum value, if one was found, or {@link #STRING}
         * @since com.adobe.cq.wcm.core.components.models.form 13.0.0
         */
        public static Type fromString(String value) {
            for (Type type : Type.values()) {
                if (StringUtils.equals(value, type.value)) {
                    return type;
                }
            }
            return STRING;
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
    }

    /**
     * Returns {@code true} if field is required, otherwise {@code false}.
     *
     * @return {@code true} if field is required, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default boolean isRequired() {
        return false;
    }

    /**
     * Returns the data type of the form field.
     *
     * @return the data type of the form field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default Type getType() {
        return Type.STRING;
    }

    /**
     * Returns an expression returning boolean value indicating whether the value in the field is valid or not
     *
     * @return an expression
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default String getValidationExpression() {
        return null;
    }

}
