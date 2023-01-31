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

import javax.annotation.Nonnull;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ProviderType;

import com.adobe.cq.forms.core.components.views.Views;
import com.adobe.cq.wcm.core.components.models.Component;
import com.day.cq.i18n.I18n;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonView;

@ProviderType
public interface FormComponent extends Component {
    public final String CUSTOM_PROPERTY_WRAPPER = "afs:layout"; // needs to be renamed to "CUSTOM_LAYOUT_PROPERTY_WRAPPER" later

    /**
     * Returns the field type
     *
     * @return the field type
     * @since com.adobe.cq.forms.core.components.models.form 1.0.0
     */
    String getFieldType(); // todo: keeping string here to support custom view types

    /**
     * Returns {@code true} if form field should be visible, otherwise {@code false}.
     *
     * @return {@code true} if form field should be visible, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default boolean isVisible() {
        return true;
    }

    /**
     * Custom Properties
     *
     * @since com.adobe.cq.forms.core.components.models.form 1.1.0
     */
    @NotNull
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    default Map<String, Object> getProperties() {
        return Collections.emptyMap();
    }

    /**
     * Custom DOR Properties
     *
     * @since com.adobe.cq.forms.core.components.models.form 2.1.0
     */
    @JsonView(Views.Author.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    default Map<String, Object> getDorProperties() {
        return Collections.emptyMap();
    }

    /**
     * Returns getPath of the form field
     *
     * @return getPath of the field
     * @since com.adobe.cq.forms.core.components.util 3.1.0
     */
    @JsonView(Views.Author.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    default String getPath() {
        return null;
    }

    /**
     * Returns the name of the form field
     *
     * @return name of the form field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default String getName() {
        return null;
    }

    /**
     * Returns the reference to the data model
     *
     * @return reference to the data model
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default String getDataRef() {
        return null;
    }

    /**
     * Returns the rules defined for the component after filtering out invalid rules
     * If no rules are defined, returns an empty map
     *
     * @return map containing the rules and their expressions
     */
    @NotNull
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    default Map<String, String> getRules() {
        return Collections.emptyMap();
    }

    /**
     * Returns the events defined for the component after filtering out invalid rules
     *
     * @return map containing the events and their expressions
     *         If no rules are defined, returns an empty map
     */
    @NotNull
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    default Map<String, String[]> getEvents() {
        return Collections.emptyMap();
    }

    /**
     * Sets i18n object
     *
     * @param i18n reference to the {@link I18n} object
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonIgnore
    default void setI18n(@Nonnull I18n i18n) {
        // empty body
    }

}
