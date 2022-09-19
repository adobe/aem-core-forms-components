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

import org.apache.commons.lang3.StringUtils;
import org.osgi.annotation.versioning.ConsumerType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Defines the form {@code CheckBox} Sling Model used for the {@code /apps/core/fd/components/form/checkbox/v1/checkbox} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 2.0.0
 */
@ConsumerType
public interface CheckBox extends Field, OptionsConstraint {

    /**
     * Defines the orientation for checkbox. Possible values: {@code horizontal}, {@code vertical}
     *
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    public enum Orientation {
        HORIZONTAL("horizontal"),
        VERTICAL("vertical");

        private String value;

        Orientation(String value) {
            this.value = value;
        }

        /**
         * Given a {@link String} <code>value</code>, this method returns the enum's value that corresponds to the provided string
         * representation. If no representation is found, {@link #HORIZONTAL} will be returned.
         *
         * @param value the string representation for which an enum value should be returned
         * @return the corresponding enum value, if one was found, or {@link #HORIZONTAL}
         * @since com.adobe.cq.forms.core.components.models.form 2.0.0
         */
        public static Orientation fromString(String value) {
            for (Orientation type : Orientation.values()) {
                if (StringUtils.equals(value, type.value)) {
                    return type;
                }
            }
            return HORIZONTAL;
        }

        /**
         * Returns the string value of this enum constant.
         *
         * @return the string value of this enum constant
         * @since com.adobe.cq.forms.core.components.models.form 2.0.0
         */
        public String getValue() {
            return value;
        }

        @Override
        @JsonValue
        public String toString() {
            return value;
        }
    }

    /**
     * Returns the orientation of the checkbox component
     *
     * @return {@link Orientation}.
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    @JsonIgnore
    default Orientation getOrientation() {
        return Orientation.HORIZONTAL;
    }
}
