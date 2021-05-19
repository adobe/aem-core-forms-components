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

import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.osgi.annotation.versioning.ConsumerType;
import org.osgi.annotation.versioning.ProviderType;

/**
 *
 * Defines the sling model for {@code /apps/core/fd/components/formsportal/portallister} component.
 *
 * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
 */
@ConsumerType
public interface PortalLister {

    /**
     * Return List of Portal Items, Standardized by the {@link Item} interface
     *
     * @return List of items
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default List<Item> getItemList() {
        throw new UnsupportedOperationException();
    }

    /**
     * Return maximum number of results to be returned by getItemList at a time
     *
     * @return String containing numeric value of limit
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default Long getLimit() {
        throw new UnsupportedOperationException();
    }

    /**
     * Offset of next set of results
     *
     * @return long integer representing next offset
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default Long getNextOffset() {
        throw new UnsupportedOperationException();
    }

    default List<Resource> getAssetSources() {
        throw new UnsupportedOperationException();
    }

    default void setDefaultAssetSources(List<Resource> assetSources) {
        throw new UnsupportedOperationException();
    }

    @ConsumerType
    public interface Item {
        default String getTitle() {
            throw new UnsupportedOperationException();
        }

        default String getDescription() {
            throw new UnsupportedOperationException();
        }

        default String getTooltip() {
            throw new UnsupportedOperationException();
        }

        default String getFormLink() {
            throw new UnsupportedOperationException();
        }

        default String getThumbnailLink() {
            throw new UnsupportedOperationException();
        }
    }

    @ProviderType
    public interface LayoutType {
        public static final String CARD = "card";
    }
}
