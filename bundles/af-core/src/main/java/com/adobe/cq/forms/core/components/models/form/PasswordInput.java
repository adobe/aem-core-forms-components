/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Defines the form {@code Password} Sling Model used for the
 * {@code /apps/core/fd/components/form/passwordinput/v1/passwordinput} component.
 *
 * <p>
 * Password is modelled as a first-class field type (rather than a variant of {@link TextInput}) so that the
 * password-specific contract (visibility toggle, default-value masking, credential autofill tokens) does not leak
 * into the text, email and telephone components that share {@code TextInput}.
 * </p>
 *
 * @since com.adobe.cq.forms.core.components.models.form 2.0.0
 */
@ConsumerType
public interface PasswordInput extends Field, StringConstraint {

    /**
     * Returns {@code true} if the password show/hide visibility toggle should be rendered, otherwise {@code false}.
     *
     * @return {@code true} if the visibility toggle should be rendered, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonIgnore
    default boolean isShowHidePasswordEnabled() {
        return true;
    }

    /**
     * Returns {@code "off"} if autocomplete is disabled, otherwise the configured autofill token (for example
     * {@code new-password} or {@code current-password}) @see
     * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete">here</a>.
     *
     * @return the autocomplete attribute value, or {@code null} if not set
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonProperty("autocomplete")
    @Nullable
    default String getAutoComplete() {
        return null;
    }

    /**
     * Returns the format of the form field as specified in the json schema specification. Password fields have no
     * format by default.
     *
     * @return the format of the form field
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @Override
    @Nullable
    default String getFormat() {
        return null;
    }

}
