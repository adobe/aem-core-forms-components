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

import javax.annotation.Nullable;

import org.osgi.annotation.versioning.ConsumerType;

/**
 * Defines the form {@code panel} Sling Model used for the {@code /apps/core/fd/components/form/panel/v1/panel} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 2.0.0
 */
@ConsumerType
public interface Panel extends Container, ContainerConstraint {
    /**
     * Checks if the container should be rendered read only.
     *
     * @return {@code true} if the container should be read-only, {@code false} otherwise
     * @since com.adobe.cq.forms.core.components.models.form 4.4.0
     */
    @Nullable
    default Boolean isReadOnly() {
        return null;
    }

    /**
     * Checks if the container is wrap data.
     *
     * @return {@code true} if the container is wrap data, {@code false} otherwise
     * @since com.adobe.cq.forms.core.components.models.form 5.3.0
     */
    default boolean isWrapData() {
        return false;
    }

}
