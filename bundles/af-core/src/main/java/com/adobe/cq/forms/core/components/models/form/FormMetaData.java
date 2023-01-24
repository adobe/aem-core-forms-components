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

import org.osgi.annotation.versioning.ProviderType;

/**
 * Defines the form metadata
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ProviderType
public interface FormMetaData {

    /**
     * Returns the version of the adaptive form specification
     *
     * @return the version of adaptive form specification
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getVersion() {
        return "1.0.0";
    }

    /**
     * Returns the version of the rule grammar
     *
     * @return the version of the rule grammar
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getGrammar() {
        return "json-formula-1.0.0";
    }
}
