/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
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

import org.osgi.annotation.versioning.ConsumerType;

/**
 * Defines the {@code Switch} Sling Model used for the {@code /apps/core/fd/components/form/switch} component.
 *
 * @since com.adobe.cq.forms.core.components.models 2.1.0
 */
@ConsumerType
public interface Switch extends Base {
    /**
     * Returns the switch value.
     *
     * @return the switch value
     * @since com.adobe.cq.forms.core.components.models 2.1.0
     */
    default String getValue() {
        return null;
    }

    /**
     * Returns the switch icon identifier.
     *
     * @return the switch icon identifier
     * @since com.adobe.cq.forms.core.components.models 2.1.0
     */
    default String getIcon() {
        return null;
    }

    /**
     * Returns the switch default value.
     *
     * @return the switch icon identifier
     * @since com.adobe.cq.forms.core.components.models 2.1.0
     */
    default String getDefault() {
        return null;
    }
}