package com.adobe.cq.forms.core.components.models.form;

import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Defines the form {@code Password} Sling Model used for the {@code /apps/core/fd/components/form/passwordinput/v1/passwordinput}
 * component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface PasswordInput extends Field, NumberConstraint, DateConstraint, StringConstraint {

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
     * Returns {@code "off"} if autocomplete is disabled, otherwise {@code "on"} or values listed @see
     * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete">here</a>
     *
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonProperty("autocomplete")
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
