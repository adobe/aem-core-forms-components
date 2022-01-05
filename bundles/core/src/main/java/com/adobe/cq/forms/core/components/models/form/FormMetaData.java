package com.adobe.cq.forms.core.components.models.form;

import org.osgi.annotation.versioning.ConsumerType;

/**
 * Defines the form metadata
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface FormMetaData {

    /**
     * Returns the version of the adaptive form specification
     *
     * @return the version of adaptive form specification
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getVersion() {return "1.0.0";}

    /**
     * Returns the locale of the form
     *
     * @return the locale of the form
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getLocale() {return "en-us";}

    /**
     * Returns the version of the rule grammar
     *
     * @return the version of the rule grammar
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getGrammar() {return "json-formula-1.0.0";}

    /**
     * Returns the submit action
     *
     * @return the submit action
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    String getAction();

    /**
     * Returns the data url to fetch form data
     *
     * @return the data url to fetch form data
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    String getDataUrl();
}
