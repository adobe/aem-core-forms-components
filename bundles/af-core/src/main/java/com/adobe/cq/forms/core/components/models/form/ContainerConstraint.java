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

import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ProviderType;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * A interface which specifies the different form container constraints
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ProviderType
public interface ContainerConstraint {
    /**
     * Returns the minimum items of the container (ie array data type)
     *
     * @return the minimum items
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Nullable
    default Integer getMinItems() {
        return null;
    }

    /**
     * Returns the maximum items of the container (ie array data type)
     *
     * @return the maximum items
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Nullable
    default Integer getMaxItems() {
        return null;
    }

    /**
     * Returns the minimum occurrence of the container (ie array data type)
     *
     * @return the minimum occurrence
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Nullable
    default Integer getMinOccur() {
        return null;
    }

    /**
     * Returns the maximum occurrence of the container (ie array data type)
     *
     * @return the maximum occurrence
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Nullable
    default Integer getMaxOccur() {
        return null;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Nullable
    default Boolean isRepeatable() {
        return null;
    }

    // todo: add initial items here
}
