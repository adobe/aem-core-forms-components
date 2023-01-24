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

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * A interface which specifies the different form string type constraints
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ProviderType
public interface StringConstraint extends BaseConstraint, FormatConstraint {

    /**
     * Returns the minimum length of the data. The constraint is applicable only for field with type string
     *
     * @return minimum length of the data
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Integer getMinLength();

    /**
     * Returns the maximum length of the data. The constraint is applicable only for field with type string
     *
     * @return maximum length of the data
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Integer getMaxLength();

    /**
     * As specified in the JSON Schema specification, the regex against which the value of the field should be tested with.
     *
     * Returns the regex. The constraint is applicable only for field with type string
     *
     * @return string represented as pattern
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getPattern() {
        return null;
    }
}
