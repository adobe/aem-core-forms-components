/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2025 Adobe
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

public enum ChannelType {
    WEB("web"),
    PRINT("print");

    private String value;

    ChannelType(String value) {
        this.value = value;
    }

    /**
     * Given a {@link String} <code>value</code>, this method returns the enum's value that corresponds to the provided string
     * representation. If no representation is found, {@link #TEXT_INPUT} will be returned.
     *
     * @param value the string representation for which an enum value should be returned
     * @return the corresponding enum value, if one was found, or {@link #TEXT_INPUT}
     */
    public static ChannelType fromString(String value) {
        for (ChannelType type : ChannelType.values()) {
            if (StringUtils.equals(value, type.value)) {
                return type;
            }
        }
        return WEB;
    }

    /**
     * Returns the string value of this enum constant.
     *
     * @return the string value of this enum constant
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
