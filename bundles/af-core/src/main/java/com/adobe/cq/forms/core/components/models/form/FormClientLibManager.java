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

/**
 * Defines the {@code FormClientLibManager} Sling Model to perform operation related to client libraries.
 *
 * @since com.adobe.cq.forms.core.components.models.form 4.5.0
 */
public interface FormClientLibManager {

    /**
     * Adds a client lib reference associated with a fragment/form container to a global store in a particular request.
     *
     * @param clientLibRef
     */
    void addClientLibRef(@NotNull String clientLibRef);

    /**
     * Returns a unique list of client lib references that was added to the global store in a particular request.
     *
     * @return client libs
     */
    List<String> getClientLibRefList();
}
