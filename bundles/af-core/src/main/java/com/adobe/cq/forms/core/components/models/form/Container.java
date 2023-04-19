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

import com.day.cq.wcm.foundation.model.export.AllowedComponentsExporter;
import org.apache.commons.lang3.ArrayUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ContainerExporter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    // @JsonView(Views.Author.class) // including in author for backward compatibility of DOR
    @JsonIgnore
    // todo: needs to be removed later, since this is used in DOR today
    List<? extends ComponentExporter> getItems();

    /**
     * @see ContainerExporter#getExportedItems()
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @NotNull
    @Override
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    default Map<String, ? extends ComponentExporter> getExportedItems() {
        return Collections.emptyMap();
    }

    @JsonIgnore
    @Override
    default Boolean isRequired() {
        // explicitly setting null, since containers don't have required property
        return false;
    }

    @NotNull
    @Override
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
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

    @JsonProperty("appliedCssClassNames")
    @Nullable
    default String getAppliedCssClasses() {
        return null;
    }

    // the below mentioned interface methods are copied from ResponsiveGridExporter
    // done because CM throws this, the product interface com.day.cq.wcm.foundation.model.responsivegrid.export.ResponsiveGridExporter
    // annotated with @ProviderType should not be implemented by custom code.

    /**
     * @return The CSS class names to be applied to the current grid.
     */
    @Nullable
    String getGridClassNames();

    /**
     * @return The CSS class names associated with each responsive grid column and listed by column name
     */
    @NotNull
    Map<String, String> getColumnClassNames();

    /**
     * @return The number of columns available for direct children in the grid.
     */
    int getColumnCount();

    /**
     * @return Allowed Components object for the current grid.
     */
    @JsonProperty("allowedComponents")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    AllowedComponentsExporter getExportedAllowedComponents();
}
