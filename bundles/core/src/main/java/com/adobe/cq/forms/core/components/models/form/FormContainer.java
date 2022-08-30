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

import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Defines the form container {@code FormContainer} Sling Model used for the {@code /apps/core/fd/components/form/formcontainer} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
// todo: have to add rule events here
public interface FormContainer extends Container {

    /**
     * Name of the resource property that defines the document path containing the json
     *
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    String PN_RUNTIME_DOCUMENT_PATH = "formModelDocumentPath";

    /**
     * Returns form metadata {@link FormMetaData}
     *
     * @return form meta data
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonProperty("metadata")
    FormMetaData getMetaData();

    /**
     * Returns a unique identifier
     *
     * @return unique identifier
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    @JsonIgnore
    default String getId() {
        return null;
    }

    @Override
    default String getFieldType() {
        return FieldType.FORM.getValue();
    }

    @JsonIgnore
    @Override
    default boolean isEnabled() {
        // explicitly setting true, since form container does not have enabled property, but other containers like panel have enabled
        return true;
    }

    @Override
    @JsonIgnore
    default Label getLabel() {
        // explicitly setting null, since form container does not have label, but other containers like panel have a label
        return null;
    }

    @JsonIgnore
    @Override
    default boolean isVisible() {
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
    String getThankYouPage();

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
}
