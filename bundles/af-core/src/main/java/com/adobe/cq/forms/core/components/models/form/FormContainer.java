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

import java.util.Collections;
import java.util.Map;
import java.util.function.Consumer;

import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.aemds.guide.service.GuideSchemaType;
import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.cq.export.json.ComponentExporter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Defines the form container {@code FormContainer} Sling Model used for the {@code /apps/core/fd/components/form/formcontainer} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface FormContainer extends Container {

    /**
     * Name of the adobe global API root for HTTP API
     *
     * @since com.adobe.cq.forms.core.components.models.form 4.0.0
     */
    String ADOBE_GLOBAL_API_ROOT = "/adobe";

    /**
     * Name of the forms runtime API root for HTTP API
     *
     * @since com.adobe.cq.forms.core.components.models.form 4.0.0
     */
    String FORMS_RUNTIME_API_GLOBAL_ROOT = "/forms/af";

    /**
     * Name of the resource property that defines the document path containing the json
     *
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    String PN_RUNTIME_DOCUMENT_PATH = "formModelDocumentPath";

    /**
     * Name of the resource property that defines the reference to the client lib
     *
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    String PN_CLIENT_LIB_REF = GuideConstants.CLIENT_LIB_REF;

    String DEFAULT_FORMS_SPEC_VERSION = "0.14.0";

    /**
     * Returns form metadata {@link FormMetaData}
     *
     * @return form meta data
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonProperty("metadata")
    FormMetaData getMetaData();

    /**
     * Returns the version of the adaptive form specification
     *
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonProperty("adaptiveform")
    default String getAdaptiveFormVersion() {
        return DEFAULT_FORMS_SPEC_VERSION;
    }

    /*
     * Returns schema reference
     *
     * @return reference to schema
     *
     * @since com.adobe.cq.forms.core.components.models.form 2.1.0
     */
    @Nullable
    @JsonIgnore
    default String getSchemaRef() {
        return null;
    }

    /**
     * Returns schema type {@link GuideSchemaType}
     *
     * @return schema type
     * @since com.adobe.cq.forms.core.components.models.form 2.1.0
     */
    @Nullable
    @JsonIgnore
    default GuideSchemaType getSchemaType() {
        return null;
    }

    /**
     * Returns name of the client lib category
     *
     * @return name of the client lib category
     * @since com.adobe.cq.forms.core.components.models.form 2.1.0
     */
    @Nullable
    @JsonIgnore
    default String getClientLibRef() {
        return null;
    }

    /**
     * Returns a unique identifier
     *
     * @return unique identifier
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default String getId() {
        return null;
    }

    @Override
    default String getFieldType() {
        return FieldType.FORM.getValue();
    }

    @JsonIgnore
    @Override
    default Boolean isEnabled() {
        // explicitly setting true, since form container does not have enabled property, but other containers like panel have enabled
        return true;
    }

    /**
     * Returns the language in which the form was authored
     *
     * @return the language of the form
     * @since com.adobe.cq.forms.core.components.models.form 4.5.0
     */
    default Boolean getHamburgerMenu() {
        // explicitly setting true, since form container does not have enabled property, but other containers like panel have enabled
        return false;
    }

    @Override
    @JsonIgnore
    default Label getLabel() {
        // explicitly setting null, since form container does not have label, but other containers like panel have a label
        return null;
    }

    @JsonIgnore
    @Override
    default Boolean isVisible() {
        // explicitly setting true, since form container does not have visible property, but other containers like panel have visible
        return true;
    }

    @JsonIgnore
    @Override
    default String getName() {
        // explicitly setting null, since form container does not have name property, but other containers like panel have a name
        return null;
    }

    @JsonIgnore
    @Override
    default BaseConstraint.Type getType() {
        // explicitly setting null, since form container does not have type property, but other containers like panel have a type
        return null;
    }

    /**
     * Returns the form title
     *
     * @return form title
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getTitle() {
        return "";
    }

    /**
     * Returns the form description
     *
     * @return form description
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getDescription() {
        return "";
    }

    /**
     * Returns the form model
     *
     * @return the form model, based on the document path configured or the items
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonIgnore
    default Map<String, Object> getModel() {
        return Collections.emptyMap();
    }

    /**
     * Returns the document path (dam asset) containing the form model json
     *
     * @return the document path containing form model json, if one was set, or {@code null}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonIgnore
    default String getDocumentPath() {
        return null;
    }

    /**
     * Returns base64 encoded current page path
     *
     * @return base64 encoded current page path
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonIgnore
    @Nullable
    String getEncodedCurrentPagePath();

    /**
     * Returns the form thank you message
     *
     * @return form thank you message
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonIgnore
    String getThankYouMessage();

    /**
     * Returns the form thank you page
     *
     * @return form thank you page
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonIgnore
    default String getThankYouPage() {
        return null;
    }

    /**
     * Returns the form thank you option
     *
     * @return form thank you option
     * @since com.adobe.cq.forms.core.components.models.form 4.4.0
     */
    @JsonIgnore
    default ThankYouOption getThankYouOption() {
        return null;
    };

    /**
     * Returns the form data
     *
     * @return the form data
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonProperty("data")
    default String getFormData() {
        return "";
    }

    /**
     * Returns the submit action
     *
     * @return the submit action
     * @since com.adobe.cq.forms.core.components.models.form 4.0.0
     */
    default String getAction() {
        return null;
    }

    /**
     * Returns the data url to fetch form data
     *
     * @return the data url to fetch form data
     * @since com.adobe.cq.forms.core.components.models.form 4.0.0
     */
    default String getDataUrl() {
        return null;
    }

    /**
     * Returns the language in which the form was authored
     *
     * @return the language of the form
     * @since com.adobe.cq.forms.core.components.models.form 4.0.0
     */
    default String getLang() {
        return Base.DEFAULT_LANGUAGE;
    }

    /**
     * Returns the language of the containing page
     *
     * @return the language of the containing page
     * @since com.adobe.cq.forms.core.components.models.form 4.7.1
     */
    @JsonIgnore
    default String getContainingPageLang() {
        return getLang();
    }

    /**
     * API to give direction of content in HTML for a given language.
     *
     * @return one of the constants "rtl" or "ltr" depending on direction of given language
     * @since com.adobe.cq.forms.core.components.models.form 4.5.0
     */
    @JsonIgnore
    default String getLanguageDirection() {
        return "ltr";
    }

    /**
     * Returns the redirect url after form submission
     *
     * @return the redirect url of the form
     * @since com.adobe.cq.forms.core.components.models.form 4.4.0
     */
    @JsonIgnore
    default String getRedirectUrl() {
        return null;
    }

    /**
     * Returns the prefill service for the form
     *
     * @return the prefill service
     * @since com.adobe.cq.forms.core.components.models.form 4.4.0
     */
    @JsonIgnore
    default String getPrefillService() {
        return null;
    }

    /**
     * Set the contextPath in formContainer
     *
     * @since com.adobe.cq.forms.core.components.models.form 4.4.0
     */
    @JsonIgnore
    default void setContextPath(String contextPath) {}

    @JsonIgnore
    default void visit(Consumer<ComponentExporter> callback) throws Exception {}

    /**
     * Returns site page path if dropped in sites else the form page path.
     *
     * @return parent page path before jcr:content
     * @since com.adobe.cq.forms.core.components.models.form 4.4.0
     */
    @JsonIgnore
    default String getParentPagePath() {
        return null;
    }
}
