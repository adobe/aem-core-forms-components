package com.adobe.cq.forms.core.components.models.form;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.osgi.annotation.versioning.ConsumerType;

/**
 * Defines the form container {@code FormContainer} Sling Model used for the {@code /apps/core/fd/components/form/formcontainer} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface FormContainer extends Container {

    /**
     * Returns form metadata {@link FormMetaData}
     *
     * @return form meta data
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonProperty("metadata")
    FormMetaData getMetaData();

    /**
     * Returns the form title
     *
     * @return form title
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getTitle() {return "";}

    /**
     * Returns the form data
     *
     * @return the form data
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getData() {return "";}
}
