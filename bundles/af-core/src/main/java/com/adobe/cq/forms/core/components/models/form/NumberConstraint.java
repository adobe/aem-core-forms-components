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
 * A interface which specifies the different form number type constraints
 *
 * @since com.adobe.cq.forms.core.components.models.form 2.0.0
 */
@ProviderType
public interface NumberConstraint {

    /**
     * Returns the minimum value for the number. The constraint is applicable only for field with type number
     *
     * @return minimum value for the number
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Long getMinimum();

    /**
     * Returns the maximum value for the number. The constraint is applicable only for field with type number
     *
     * @return maximum value for the number
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Long getMaximum();

    /**
     * Returns the Maximum value (exclusive) that can be entered by the user.
     *
     * @return maximum value (exclusive) for the number
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Long getExclusiveMaximum();

    /**
     * Returns the minimum value (exclusive) that can be entered by the user.
     *
     * @return minimum value (exclusive) for the number
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Long getExclusiveMinimum();

}
