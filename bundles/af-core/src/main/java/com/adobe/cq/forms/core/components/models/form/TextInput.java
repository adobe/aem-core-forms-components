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

import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Defines the form {@code Text} Sling Model used for the {@code /apps/core/fd/components/form/textinput/v1/textinput} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface TextInput extends Field, NumberConstraint, DateConstraint, StringConstraint {

    /**
     * Returns {@code true} if multi line, otherwise {@code false}.
     *
     * @return {@code true} if multi line, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonIgnore
    default boolean isMultiLine() {
        return false;
    }

    /**
     * Returns {@code "off"} if autocomplete if disabled, otherwise {@code "on"} or values listed @see
     * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete">here</a>
     *
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @Nullable
    default String getAutoComplete() {
        return null;
    }

    /**
     * Returns the format of the form field as specified in the json schema specification(for example, date, binary etc)
     *
     * @return the format of the form field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default String getFormat() {
        return null;
    }

}
