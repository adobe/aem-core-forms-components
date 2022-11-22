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

import org.osgi.annotation.versioning.ConsumerType;

/**
 * Defines the {@code Button} Sling Model used for the {@code /apps/core/fd/components/form/button} component.
 *
 * @since com.adobe.cq.forms.core.components.models 2.1.0
 */
@ConsumerType
public interface Button extends Base {
    /**
     * Returns the button value.
     *
     * @return the button value
     * @since com.adobe.cq.forms.core.components.models 2.1.0
     */
    default String getValue() {
        return null;
    }

    /**
     * Returns the button icon identifier.
     *
     * @return the button icon identifier
     * @since com.adobe.cq.forms.core.components.models 2.1.0
     */
    default String getIcon() {
        return null;
    }

    /**
     * Returns the button default value.
     *
     * @return the button icon identifier
     * @since com.adobe.cq.forms.core.components.models 2.1.0
     */
    default String getDefault() {
        return null;
    }

    /**
     * Returns the type of action of the button
     */
    default String getButtonType() {
        return null;
    }
}