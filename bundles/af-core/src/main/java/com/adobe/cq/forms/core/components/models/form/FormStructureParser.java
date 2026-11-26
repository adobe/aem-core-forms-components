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

import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ProviderType;

/**
 * Defines the {@code FormStructureParser} Sling Model to access the form container path from page or any child.
 *
 * @since com.adobe.cq.forms.core.components.models.form 2.0.0
 */
@ProviderType
public interface FormStructureParser {

    /**
     *
     * @returns the path of the form container in which the component is there
     */
    String getFormContainerPath();

    /**
     *
     * @returns reference to the client lib stored in the form container
     */
    String getClientLibRefFromFormContainer();

    /**
     * Returns the saved Theme Client Library category used by AEM 6.5, independently of request Theme Editor overrides.
     *
     * @return saved theme client library category from a form container, or {@code null} if unavailable
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    String getThemeClientLibRefFromFormContainer();

    /**
     * Resolves a request Theme Editor override to its theme client library category.
     * This does not read the saved category from the form container.
     *
     * @return resolved override category, or {@code null} if unavailable
     */
    String getThemeEditorThemeRef();

    /**
     * Checks if this resource contains a form container
     *
     * @return true if this resource or one of its children is a form container, else false
     */
    Boolean containsFormContainer();

    /**
     * @since com.adobe.cq.forms.core.components.models.form 5.4.1
     *
     * @return form definition json in Publish view
     */
    String getFormDefinition();
}
