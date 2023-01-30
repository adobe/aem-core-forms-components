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

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Interface for options constraints (for radio button, check box and drop down type of fields)
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ProviderType
public interface OptionsConstraint {

    /**
     * Returns {@code true} if enforceEnum is set, otherwise {@code false}.
     * Whether a user can enter a value that is not present in the enum array. If set to true, a user will be able to enter
     * any other value that is not in the list of enum. That generally means that enum is used a aid for users to enter the value but
     * is not a validation constraint. The constraint is applicable only if the enum property is defined on the Field
     *
     * @return {@code true} if enforceEnum is set, otherwise {@code false}.
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default boolean isEnforceEnum() {
        return false;
    }

    /**
     * Returns a list of options to put restrictions on the possible values of the field.
     * The type of values in the enum array must match the value of the type property defined in the field.
     *
     * @return the list of enum
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @JsonProperty("enum")
    Object[] getEnums();

    /**
     * Returns a user friendly text to display for the possible options to be shown to the end user.
     * The length of enum and enumNames array must match
     *
     * @return the list of enum names
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    String[] getEnumNames();
}
