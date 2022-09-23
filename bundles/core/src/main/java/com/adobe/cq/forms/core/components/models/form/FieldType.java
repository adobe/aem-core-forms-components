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

public enum FieldType {
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
    FORM("form"),
    CHECKBOX_GROUP("checkbox-group"),
    IMAGE("image");

    private String value;

    FieldType(String value) {
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
    public static FieldType fromString(String value) {
        for (FieldType type : FieldType.values()) {
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
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
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
