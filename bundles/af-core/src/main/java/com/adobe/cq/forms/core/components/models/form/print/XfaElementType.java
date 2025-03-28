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
package com.adobe.cq.forms.core.components.models.form.print;

import com.fasterxml.jackson.annotation.JsonValue;

public enum XfaElementType {
    PAGESET("pageset"),
    PAGEAREA("pagearea"),
    CONTENTAREA("contentarea"),
    MEDIUM("medium"),
    SUBFORM(
        "subform"),
    PANEL("panel"),
    TEXTFIELD("textfield"),
    CHECKBUTTON("checkbutton"),
    BUTTON(
        "button"),
    DATEFIELD("datefield"),
    DATETIMEFIELD("datetimefield"),
    NUMERICFIELD(
        "numericfield"),
    RADIOBUTTON("radiobutton"),
    TEXTBOX("textbox"),
    IMAGE(
        "image"),
    IMAGEFIELD("imagefield"),
    EXCLUSIONGROUP(
        "exclusiongroup"),
    BARCODE("barcode"),
    LINE("line"),
    RECTANGLE("rectangle"),
    PROTO("proto");

    private String value;

    XfaElementType(String value) {
        this.value = value;
    }

    /**
     * Given a {@link String} <code>value</code>, this method returns the enum's value that
     * corresponds to the provided string representation. If no representation is found,
     * {@link #TEXT_INPUT} will be returned.
     *
     * @param value the string representation for which an enum value should be returned
     * @return the corresponding enum value, if one was found, or {@link #TEXT_INPUT}
     */
    public static XfaElementType fromString(String value) {
        for (XfaElementType type : XfaElementType.values()) {
            if (value.equals(type.value)) {
                return type;
            }
        }
        return SUBFORM;
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
