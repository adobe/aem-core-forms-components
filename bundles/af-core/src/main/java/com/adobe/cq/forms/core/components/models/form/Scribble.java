/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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
 * Defines the form Scribble Sling Model used for the Scribble component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 5.12.0
 */
@ConsumerType
public interface Scribble extends Field {

    String DEFAULT_DIALOG_LABEL = "Please sign here";

    /**
     * Returns the data-url string of the scribble.
     *
     * @return data-url string representing the scribble
     * @since com.adobe.cq.forms.core.components.models.form 5.11.0
     */
    String getValue();

    /**
     * Returns the format of the scribble.
     *
     * @return the format of the scribble, e.g., data-url
     * @since com.adobe.cq.forms.core.components.models.form 5.11.0
     */
    String getFormat();

}
