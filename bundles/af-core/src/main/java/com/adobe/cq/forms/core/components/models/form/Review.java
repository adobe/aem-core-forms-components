/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
package com.adobe.cq.forms.core.components.models.form;

import org.osgi.annotation.versioning.ConsumerType;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Defines the {@code Review} Sling Model used for the {@code /apps/core/fd/components/form/review} component.
 *
 * @since com.adobe.cq.forms.core.components.models 5.9.6
 */
@ConsumerType
public interface Review extends Base {

    /**
     * @return an array of linked panels to be reviewed on the review page. Each linked panel is the name of a panel that is linked to the
     *         review page.
     * @since com.adobe.cq.forms.core.components.models.form 5.9.6
     */
    @JsonIgnore
    String[] getLinkedPanels();

    /**
     * @return the edit mode action, which indicates whether edit button is visible on the review page at field, panel, both, or none
     * @since com.adobe.cq.forms.core.components.models.form 5.9.6
     */
    @JsonIgnore
    String getEditModeAction();
}
