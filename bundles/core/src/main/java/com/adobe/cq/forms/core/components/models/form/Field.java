package com.adobe.cq.forms.core.components.models.form;

import org.jetbrains.annotations.NotNull;
import org.osgi.annotation.versioning.ConsumerType;

import java.util.Collections;
import java.util.Map;

/**
 * Defines the form {@code Field} Sling Model used for form field component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface Field extends Base, BaseConstraint {


    /**
     * Checks if the field should be rendered read only.
     *
     * @return {@code true} if the field should be read-only, {@code false} otherwise
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default boolean isReadOnly() {
        return false;
    }

    /**
     * The value of the field when no value is provided by the end user or data model.
     * The type of this property should match the value of the type property defined in the Field.
     * If not, then a type coercion will be tried and if that fails, the value will be set to null.
     *
     * @return default value of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
     Object getDefault();

}

