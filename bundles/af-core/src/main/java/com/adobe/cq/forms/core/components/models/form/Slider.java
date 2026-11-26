/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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
import org.osgi.annotation.versioning.ConsumerType;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Defines the form {@code Slider} Sling Model used for the {@code /apps/core/fd/components/form/slider/v1/slider} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 5.13.0
 */
@ConsumerType
public interface Slider extends Field, NumberConstraintV2 {

    /**
     * Returns the granularity of the slider. The value of the field must be a multiple of the step, counted from the minimum.
     *
     * @return the step of the slider
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("step")
    default Number getStep() {
        return null;
    }

    /**
     * @see BaseConstraint#getType()
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Override
    default Type getType() {
        return Type.NUMBER;
    }
}
