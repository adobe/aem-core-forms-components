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

import java.util.Map;

import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.cq.wcm.core.components.models.Component;

/**
 *
 * Defines the sling model for {@code /apps/core/fd/components/formsportal/searchlister} component.
 *
 * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
 */
@ConsumerType
public interface SearchAndLister extends Component {

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
     * Returns layout in which sub-views should be rendered
     *
     * @return String indication layout of listing
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default String getLayout() {
        throw new UnsupportedOperationException();
    }

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

    /**
     * Returns number of search results to return per page
     *
     * @return maximum results in a page
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default long getResultLimit() {
        throw new UnsupportedOperationException();
    }

    default Map<String, Object> getSearchResults() {
        throw new UnsupportedOperationException();
    }
}
