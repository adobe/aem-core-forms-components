/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2021 Adobe
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
package com.adobe.cq.forms.core.components.models.formsportal;

import org.osgi.annotation.versioning.ConsumerType;

/**
 *
 * Defines the sling model for {@code /apps/core/fd/components/formsportal/searchlister} component.
 *
 * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
 */
@ConsumerType
public interface SearchAndLister extends PortalLister {

    /**
     * Returns whether search box should be available or not
     *
     * @return should search box be shown
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default boolean getSearchDisabled() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns whether sort option should be enabled
     *
     * @return Should support sorting
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default boolean getSortDisabled() {
        throw new UnsupportedOperationException();
    }
}
