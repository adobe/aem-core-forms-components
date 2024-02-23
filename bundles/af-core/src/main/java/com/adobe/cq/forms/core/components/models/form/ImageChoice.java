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

import java.util.List;

import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.cq.forms.core.components.internal.models.v1.form.ImageItem;

/**
 * Defines the form {@code ImageChoice} Sling Model used for the {@code /apps/core/fd/components/form/imagechoice/v1/imagechoice}
 * component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 1.0.0
 */
@ConsumerType
public interface ImageChoice extends Field {

    /**
     * Returns the type of selection for the image choice component, either single or multiple selection.
     *
     * @return the type of selection
     * @since com.adobe.cq.forms.core.components.models.form 1.0.0
     */
    String getSelectionType();

    /**
     * Returns the list of options associated with the image choice component.
     *
     * @return the list of options
     * @since com.adobe.cq.forms.core.components.models.form 1.0.0
     */
    List<ImageItem> getOptions();
}
