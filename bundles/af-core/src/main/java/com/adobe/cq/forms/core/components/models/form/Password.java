/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~ Copyright 2024 Adobe
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
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

package com.adobe.cq.forms.core.components.models.form;

import org.osgi.annotation.versioning.ConsumerType;

/**
 * Interface for {@code Password} Sling Model used for the {@code /apps/core/fd/components/form/password/v1/password} component.
 * 
 * @since com.adobe.cq.forms.core.components.models.form 2.0.0
 */
@ConsumerType
public interface Password extends Field, StringConstraint, NumberConstraint {

    /**
     * Returns the validation pattern (regex) for the password field.
     *
     * @return the validation pattern
     * @since com.adobe.cq.forms.core.components.models.form 2.0.0
     */
    String getValidationPattern();

}
