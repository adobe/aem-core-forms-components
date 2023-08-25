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

import org.jetbrains.annotations.NotNull;
import org.osgi.annotation.versioning.ProviderType;

/**
 * Defines the {@code FormClientLibManager} Sling Model to perform operation related to client libraries.
 *
 * @since com.adobe.cq.forms.core.components.models.form 4.5.0
 */
@ProviderType
public interface FormClientLibManager {

    /**
     * Adds a client library associated with form or fragment for a request, that can be consumed later within the scope of request.
     *
     * @param clientLibRef
     */
    void addClientLibRef(@NotNull String clientLibRef);

    /**
     * Returns list of client libraries associated with form and fragments that were added for the request.
     *
     * @return client libs
     */
    List<String> getClientLibRefList();
}
