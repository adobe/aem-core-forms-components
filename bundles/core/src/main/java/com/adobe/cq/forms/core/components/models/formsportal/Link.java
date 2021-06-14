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

import com.adobe.cq.wcm.core.components.models.Component;

/**
 * Defines the sling model for {@code /apps/core/fd/components/formsportal/link} component.
 *
 * @since com.adobe.cq.forms.core.components.models.aemform 1.0.0
 */
@ConsumerType
public interface Link extends Component {

    /**
     * Defines the Asset Type that is being linked to
     */
    enum AssetType {
        ADAPTIVE_FORM,
        PDF,
        OTHERS,
        EXTERNAL_LINK,
        NONE
    }

    /**
     * Returns url to which the component is linking to
     * The URL contains query parameters if configured
     *
     * @return URL after processing, or {@code #} if none is set
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.0.0
     */
    default String getAssetPathWithQueryParams() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the text shown in Link
     *
     * @return Title string. It is a mandatory field.
     * @since com.adobe.cq.forms.core.components.models.formsportal 1.0.0
     */
    default String getTitle() {
        throw new UnsupportedOperationException();
    }

    /**
     * Return the text shown on hovering over link
     *
     * @return Tooltip string. Can return null if not set
     * @since com.adobe.cq.forms.core.components.models.formsportal 1.0.0
     */
    default String getTooltip() {
        throw new UnsupportedOperationException();
    }

    /**
     * Return the asset type that is linked to
     *
     * @return Asset Type if set
     * @since com.adobe.cq.forms.core.components.models.formsportal 1.0.0
     */
    default AssetType getAssetType() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns path to the asset to which the URL would redirect to
     * Note that this is not the url. For url, use {@link #getAssetPathWithQueryParams}
     *
     * @return Path to asset if configured
     * @since com.adobe.cq.forms.core.components.models.formsportal 1.0.0
     */
    default String getAssetPath() {
        throw new UnsupportedOperationException();
    }
}
