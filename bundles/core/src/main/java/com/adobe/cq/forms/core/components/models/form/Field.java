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

import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Defines the form {@code Field} Sling Model used for form field component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 0.0.1
 */
@ConsumerType
public interface Field extends Base, BaseConstraint {

    /**
     * Checks if the field should be rendered read only.
     *
     * @return {@code true} if the field should be read-only, {@code false} otherwise
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default boolean isReadOnly() {
        return false;
    }

    /**
     * The placeholder to show on the field.
     *
     * @return placeholder to show on the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getPlaceHolder() {
        return null;
    }

    /**
     * The format in which the value will be displayed to the user on screen in the field.
     * For example when using a currency field, the currency sign should be shown to the user.
     *
     * @return display format of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getDisplayFormat() {
        return null;
    }

    /**
     * The format in which the value will be edited by the user.
     * For instance users in Germany would want to interchange decimal (.) and comma (,) when entering numerical values.
     *
     * @return edit format of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getEditFormat() {
        return null;
    }

    /**
     * The format in which the value will be exported or submitted.
     *
     * @return data format of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    default String getDataFormat() {
        return null;
    }

    /**
     * The value of the field when no value is provided by the end user or data model.
     * The type of this property should match the value of the type property defined in the Field.
     * If not, then a type coercion will be tried and if that fails, the value will be set to null.
     *
     * @return default value of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    Object getDefault();

    /**
     * Returns the short description of the field
     *
     * @return the short description of the field
     * @since com.adobe.cq.forms.core.components.models.form 1.0.0
     */
    @JsonIgnore
    @Nullable
    default String getShortDescription() {
        return null;
    }

    /**
     * Returns {@code true} if short description should always be visible, otherwise {@code false}.
     *
     * @return {@code true} if short description should always be visible, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 1.0.0
     */
    @JsonIgnore
    default boolean isShortDescriptionVisible() {
        return false;
    }

    @JsonIgnore
    String getFormContainer();

    String getId();

}
