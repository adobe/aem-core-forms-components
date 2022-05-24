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

import java.util.Collections;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.wcm.core.components.models.Component;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * A base interface to be extended by all the different types of form elements.
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface Base extends Component {

    /**
     * Defines the view type. Possible values: {@code text-input}, {@code multiline-input}, {@code number-input}, {@code date-input},
     * {@code file-input}, {@code drop-down}, {@code radio-group}
     * , {@code plain-text}, {@code checkbox}, {@code button}, {@code panel}
     *
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    public enum ViewType {
        TEXT_INPUT("text-input"),
        MULTILINE_INPUT("multiline-input"),
        NUMBER_INPUT("number-input"),
        DATE_INPUT("date-input"),
        FILE_INPUT("file-input"),
        DROP_DOWN("drop-down"),
        RADIO_GROUP("radio-group"),
        PLAIN_TEXT("plain-text"),
        CHECKBOX("checkbox"),
        BUTTON("button"),
        PANEL("panel"),
        CHECKBOX_GROUP("checkbox-goup");
        private String value;

        ViewType(String value) {
            this.value = value;
        }

        /**
         * Given a {@link String} <code>value</code>, this method returns the enum's value that corresponds to the provided string
         * representation. If no representation is found, {@link #TEXT_INPUT} will be returned.
         *
         * @param value the string representation for which an enum value should be returned
         * @return the corresponding enum value, if one was found, or {@link #TEXT_INPUT}
         * @since com.adobe.cq.forms.core.components.models.form 0.0.1
         */
        public static ViewType fromString(String value) {
            for (ViewType type : ViewType.values()) {
                if (StringUtils.equals(value, type.value)) {
                    return type;
                }
            }
            return TEXT_INPUT;
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
     * Defines the constraint type. Possible values: {@code type}, {@code required}, {@code minimum}, {@code maximum}, {@code minLength},
     * {@code maxLength}
     * , {@code step}, {@code format}, {@code pattern}, {@code minItems}, {@code maxItems}, {@code uniqueItems}, {@code enforceEnum},
     * {@code validationExpression}
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
        UNIQUE_ITEMS("uniqueItems"),
        ENFORCE_ENUM("enforceEnum"),
        VALIDATION_EXPRESSION("validationExpression");

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
    }

    /**
     * Returns label of the form field
     *
     * @return label of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default Label getLabel() {
        return null;
    }

    /**
     * Returns the name of the form field
     *
     * @return name of the form field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default String getName() {
        return null;
    }

    /**
     * Returns the reference to the data model
     *
     * @return reference to the data model
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default String getDataRef() {
        return null;
    }

    /**
     * Returns the description of the field
     *
     * @return the description of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default String getDescription() {
        return null;
    }

    /**
     * Returns the short description of the field
     *
     * @return the short description of the field
     * @since com.adobe.cq.forms.core.components.models.form 1.0.0
     */
    @Nullable
    default String getShortDescription() {
        return null;
    }

    /**
     * Returns {@code true} if short description should always be visible, otherwise {@code false}.
     *
     * @return {@code true} if short description should always be visible, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 1.0.0
     */
    default boolean isShortDescriptionVisible() {
        return false;
    }

    /**
     * Returns the string to indicate the text to be read by screen readers
     *
     * @return the screen reader text
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default String getScreenReaderText() {
        return null;
    }

    /**
     * Returns the view type
     * 
     * @return the view type
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    String getViewType(); // todo: keeping string here to support custom view types

    /**
     * Returns {@code true} if form field should be visible, otherwise {@code false}.
     *
     * @return {@code true} if form field should be visible, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default boolean isVisible() {
        return true;
    }

    /**
     * Returns {@code true} if form field should be enabled, otherwise {@code false}.
     *
     * @return {@code true} if form field should be enabled, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default boolean isEnabled() {
        return true;
    }

    /**
     * Returns map of constraint messages specific to each constraint (like required, minLength etc). The constraint
     * list would change based on the form field type
     *
     * @return map of constraint messages specific to each constraint.
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @NotNull
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    default Map<ConstraintType, String> getConstraintsMessages() {
        return Collections.emptyMap();
    }

    /**
     * @see ComponentExporter#getExportedType()
     * @since com.adobe.cq.wcm.core.components.models.form 14.2.0
     */
    @NotNull
    @Override
    default String getExportedType() {
        return "";
    }
}
