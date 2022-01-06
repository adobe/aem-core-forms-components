package com.adobe.cq.forms.core.components.models.form;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ContainerExporter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.ArrayUtils;
import org.jetbrains.annotations.NotNull;
import org.osgi.annotation.versioning.ConsumerType;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Defines the form container {@code FormContainer} Sling Model used for the {@code /apps/core/fd/components/form/formcontainer} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
// todo: have to add rule events here
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
     * Returns the form thank you message
     *
     * @return form thank you message
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonProperty("props:thankyouMessage")
    String getThankYouMessage();


    /**
     * Returns the form thank you page
     *
     * @return form thank you page
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonProperty("props:thankyouPage")
    String getThankYouPage();



    /**
     * @see ContainerExporter#getExportedType()
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @NotNull
    @Override
    default String getExportedType() {
        return "";
    }

    /**
     * Returns the form data
     *
     * @return the form data
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getData() {return "";}
}
