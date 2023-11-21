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

import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ProviderType;

/**
 * Interface to represent text as rich content
 *
 * @since com.adobe.cq.forms.core.components.models.form 4.8.0
 */
@ProviderType
public interface TextContent {

    /**
     * Returns {@code true} if text is rich, otherwise {@code false}.
     *
     * @return {@code true} if text is rich, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 4.8.0
     */
    @Nullable
    default Boolean isRichText() {
        return null;
    }

    /**
     * Returns a user friendly text to display for the possible options to be shown to the end user.
     *
     * @return the content of this text
     * @since com.adobe.cq.forms.core.components.models.form 4.8.0
     */
    @Nullable
    default String getValue() {
        return null;
    }

}