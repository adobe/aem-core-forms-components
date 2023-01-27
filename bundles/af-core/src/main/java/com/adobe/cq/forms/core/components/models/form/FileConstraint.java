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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.osgi.annotation.versioning.ProviderType;

/**
 * Interface for constraints applicable to file attachments
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ProviderType
public interface FileConstraint {

    String DEFAULT_MAX_FILE_SIZE = "2MB";

    List<String> DEFAULT_ACCEPT = Collections.unmodifiableList(Arrays.asList("audio/*", "video/*", "image/*", "text/*", "application/pdf"));

    /**
     * Returns the Maximum file size (in IEC specification) that a field can accept. The constraint is
     * applicable for file attachment field
     *
     * @return the maximum file size
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getMaxFileSize() {
        return DEFAULT_MAX_FILE_SIZE;
    }

    /**
     * Returns the list of standard IANA media types which field can accept. The constraint is
     * applicable for file attachment field
     *
     * @return the list of standard IANA media types
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default List<String> getAccept() {
        return DEFAULT_ACCEPT;
    }
}
