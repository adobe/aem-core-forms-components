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
package com.adobe.cq.forms.core.components.models.form.xfa;

import org.jetbrains.annotations.Nullable;

import com.fasterxml.jackson.annotation.JsonProperty;

public interface Para {
    @Nullable
    @JsonProperty("vAlign")
    default String getVAlign() {
        return "";
    }

    @Nullable
    @JsonProperty("hAlign")
    default String getHAlign() {
        return "";
    }

    @Nullable
    default String getLineHeight() {
        return "";
    }

    @Nullable
    default String getSpaceAbove() {
        return "";
    }

    @Nullable
    default String getSpaceBelow() {
        return "";
    }

    @Nullable
    default String getMarginLeft() {
        return "";
    }

    @Nullable
    default String getMarginRight() {
        return "";
    }

    @Nullable
    default String getTextIndent() {
        return "";
    }

    @Nullable
    default String getWidows() {
        return "";
    }

    @Nullable
    default String getOrphans() {
        return "";
    }

    @Nullable
    default String getPreserve() {
        return "";
    }
}
