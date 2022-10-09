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

import java.util.Date;

import org.osgi.annotation.versioning.ConsumerType;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * A interface which specifies the different form date type constraints
 *
 * @since com.adobe.cq.forms.core.components.models.form 2.0.0
 */
@ConsumerType
public interface DateConstraint extends FormatConstraint {

    /**
     * Returns the minimum value for the date. The constraint is applicable only for field with type date
     *
     * @return minimum date
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("minimum")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Base.DATE_FORMATTER)
    Date getMinimumDate();

    /**
     * Returns the maximum value for the date. The constraint is applicable only for field with type date
     *
     * @return maximum date
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("maximum")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Base.DATE_FORMATTER)
    Date getMaximumDate();

    /**
     * Returns the Maximum value (exclusive) that can be entered by the user.
     *
     * @return maximum value (exclusive) for the date
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("exclusiveMaximum")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Base.DATE_FORMATTER)
    Date getExclusiveMaximumDate();

    /**
     * Returns the minimum value (exclusive) that can be entered by the user.
     *
     * @return minimum value (exclusive) for the date
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("exclusiveMinimum")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Base.DATE_FORMATTER)
    Date getExclusiveMinimumDate();

    default String getFormat() {
        return Format.DATE.toString();
    }
}
