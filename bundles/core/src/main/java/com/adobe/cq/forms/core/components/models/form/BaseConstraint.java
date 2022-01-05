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


import org.osgi.annotation.versioning.ConsumerType;

/**
 * A base interface which specifies the different form field constraints
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface BaseConstraint {

    /**
     * Returns {@code true} if field is required, otherwise {@code false}.
     *
     * @return {@code true} if field is required, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default boolean isRequired() {
        return false;
    }

    /**
     * Returns the data type of the form field.
     *
     * @return the data type of the form field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getType() {
        return null;
    }

    /**
     * Returns the format of the form field as specified in the json schema specification(for example, date, binary etc)
     *
     * @return the format of the form field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getFormat() {
        return null;
    }

    /**
     * Returns an expression returning boolean value indicating whether the value in the field is valid or not
     *
     * @return an expression
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getExpression() {
        return null;
    }



}
