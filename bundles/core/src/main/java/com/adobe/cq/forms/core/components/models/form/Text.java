/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2017 Adobe
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
 * Defines the form {@code Text} Sling Model used for the {@code /apps/core/fd/components/form/text/v1/text} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface Text extends FormComponent {
    /**
     * Retrieves the text value to be displayed.
     *
     * @return the text value to be displayed, or {@code null} if no value can be returned
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1;
     */
    default String getValue() {
        return null;
    }

    /**
     * Checks if the text to be displayed is rich text or not.
     *
     * @return {@code true} if the text is rich (HTML formatting), {@code false otherwise}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1;
     */
    default boolean isRichText() {
        return false;
    }
}
