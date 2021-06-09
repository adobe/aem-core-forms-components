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

import java.util.*;

import org.osgi.annotation.versioning.*;

public interface DraftsAndSubmissions extends PortalLister {

    /**
     * Returns title string of component
     *
     * @return Search and Lister Title String
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default String getTitle() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns type - DRAFT / SUBMISSION / PENDING_SIGN
     *
     * @return Type - DRAFT / SUBMISSION / PENDING_SIGN
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default String getType() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns layout in which sub-views should be rendered
     *
     * @return String indication layout of listing
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default String getLayout() {
        throw new UnsupportedOperationException();
    }

    /**
     * Return maximum number of results to be returned by getItemList at a time
     *
     * @return String containing numeric value of limit
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default Integer getLimit() {
        throw new UnsupportedOperationException();
    }

    /**
     * Return map of queried results
     *
     * @return Map of queried results
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default Map<String, Object> getSearchResults() {
        throw new UnsupportedOperationException();
    }

    @ProviderType
    public enum TypeEnum {
        DRAFT,
        SUBMISSION,
        PENDING_SIGN
    }

}
