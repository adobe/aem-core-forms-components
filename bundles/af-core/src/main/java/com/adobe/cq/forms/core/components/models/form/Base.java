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

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ProviderType;

import com.adobe.cq.export.json.ComponentExporter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * A base interface to be extended by all the different types of form elements.
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ProviderType
public interface Base extends FormComponent {
    public final String DATE_FORMATTER = "yyyy-MM-dd";

    /**
     * Returns label of the form field
     *
     * @return label of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default Label getLabel() {
        return null;
    }

    /**
     * Returns the description of the field
     *
     * @return the description of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default String getDescription() {
        return null;
    }

    /**
     * Returns json formula rule to indicate the text to be read by screen readers based on the {@link AssistPriority} configured.
     *
     * @return the screen reader text as json formula rule
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Nullable
    default String getScreenReaderText() {
        return null;
    }

    /**
     * Returns the string to indicate the text to be read by screen readers. This
     * could be used on server side to compute initial rendition
     *
     * @return the screen reader text
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @Nullable
    @JsonIgnore
    default String getHtmlScreenReaderText() {
        return null;
    }

    /**
     * Returns {@code true} if form field should be enabled, otherwise {@code false}.
     *
     * @return {@code true} if form field should be enabled, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default boolean isEnabled() {
        return true;
    }

    /**
     * Returns map of constraint messages specific to each constraint (like required, minLength etc). The constraint
     * list would change based on the form field type
     *
     * @return map of constraint messages specific to each constraint.
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @NotNull
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    default Map<ConstraintType, String> getConstraintMessages() {
        return Collections.emptyMap();
    }

    /**
     * @see ComponentExporter#getExportedType()
     * @since com.adobe.cq.wcm.core.components.models.form 14.2.0
     */
    @NotNull
    @Override
    default String getExportedType() {
        return "";
    }

    /**
     * Returns the tool tip of the field
     *
     * @return the tool tip of the field
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @Nullable
    default String getTooltip() {
        return null;
    }

    /**
     * Returns {@code true} if tooltip should always be visible, otherwise {@code false}.
     *
     * @return {@code true} if tooltip should always be visible, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonIgnore
    default boolean isTooltipVisible() {
        return false;
    }
}
