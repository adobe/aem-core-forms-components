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
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ArrayUtils;
import org.jetbrains.annotations.NotNull;
import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ContainerExporter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Defines the form {@code Container} Sling Model used for form container component (like fieldset or panel)
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface Container extends Base, BaseConstraint, ContainerExporter {

    /**
     * Returns the list of items present inside the container as an array.
     *
     * @return list of items
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    List<? extends ComponentExporter> getItems();

    /**
     * @see ContainerExporter#getExportedItems()
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @NotNull
    @Override
    @JsonIgnore
    default Map<String, ? extends ComponentExporter> getExportedItems() {
        return Collections.emptyMap();
    }

    @JsonIgnore
    @Override
    default boolean isRequired() {
        // explicitly setting null, since containers don't have required property
        return false;
    }

    @NotNull
    @Override
    @JsonIgnore
    default String[] getExportedItemsOrder() {
        return ArrayUtils.EMPTY_STRING_ARRAY;
    }

    /**
     * @see ContainerExporter#getExportedType()
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @NotNull
    @Override
    default String getExportedType() {
        return "";
    }
}
