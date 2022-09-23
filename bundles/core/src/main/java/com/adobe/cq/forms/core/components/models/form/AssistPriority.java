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
 * Defines the assist priority type. Possible values: {@code custom}, {@code description}, {@code label}, {@code name}
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
public enum AssistPriority {
    CUSTOM("custom"),
    DESCRIPTION("description"),
    LABEL("label"),
    NAME("name");

    private String value;

    AssistPriority(String value) {
        this.value = value;
    }

    /**
     * Given a {@link String} <code>value</code>, this method returns the enum's value that corresponds to the provided string
     * representation
     *
     * @param value the string representation for which an enum value should be returned
     * @return the corresponding enum value, if one was found
     * @since com.adobe.cq.wcm.core.components.models.form 13.0.0
     */
    public static AssistPriority fromString(String value) {
        for (AssistPriority type : AssistPriority.values()) {
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
