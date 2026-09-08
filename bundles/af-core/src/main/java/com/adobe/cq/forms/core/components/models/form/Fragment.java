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

import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.osgi.annotation.versioning.ConsumerType;

/**
 * Defines the form {@code Fragment} Sling Model used for the {@code /apps/core/fd/components/form/fragment/v1/fragment} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 4.4.0
 */
@ConsumerType
public interface Fragment extends Panel {

    /**
     * Fragment reference
     *
     * @return {@code fragRef}
     * @since com.adobe.cq.forms.core.components.models.form 4.4.0
     */
    String getFragmentPath();

    /**
     * List of children of fragment container
     * 
     * @return
     * @since com.adobe.cq.forms.core.components.models.form 4.4.0
     */
    List<Resource> getFragmentChildren();

    /**
     * Returns fragment container resource
     *
     * @return
     * @since com.adobe.cq.forms.core.components.models.form 5.4.1
     */
    Resource getFragmentContainer();

    /**
     * Returns {@code true} if the fragment is marked to be lazily loaded (via the {@code fd:lazyLoad}
     * property), in which case its definition is not inlined in the form JSON and is fetched on demand
     * at runtime, otherwise {@code false}.
     *
     * @return {@code true} if the fragment should be lazily loaded, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    default boolean isLazyLoad() {
        return false;
    }
}
