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
 * Interface for date and number constraints
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface NumberAndDateConstraint extends BaseConstraint {

    /**
     * Returns the minimum value that a user can enter in the Field. This constraint is applicable for
     * Fields that have type number or type string and format date (i.e. Date Fields)
     *
     * @return the minimum value which could be Date serialized in ISO 8601 format or a number
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    Object getMinimum();

    /**
     * Returns the maximum value that a user can enter in the Field. This constraint is applicable for
     * Fields that have type number or type string and format date (i.e. Date Fields)
     *
     * @return the maximum value which could be Date serialized in ISO 8601 format (string) or a number
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    Object getMaximum();

}



