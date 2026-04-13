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

import javax.annotation.Nullable;

import org.apache.commons.lang3.StringUtils;
import org.osgi.annotation.versioning.ConsumerType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Defines the form {@code ImageChoice} Sling Model used for the
 * {@code /apps/core/fd/components/form/imagechoice/v1/imagechoice} component.
 *
 * <p>
 * The ImageChoice component allows users to select one or more options
 * represented by images. It supports both single-select (radio button behavior)
 * and multi-select (checkbox group behavior) modes.
 * </p>
 *
 * @since com.adobe.cq.forms.core.components.models.form 5.13.0
 */
@ConsumerType
public interface ImageChoice extends Field, OptionsConstraint, ContainerConstraint {

    /**
     * Defines the selection type for image choice.
     * Possible values: {@code single}, {@code multi}
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    enum SelectionType {
        SINGLE("single"),
        MULTI("multi");

        private String value;

        SelectionType(String value) {
            this.value = value;
        }

        public static SelectionType fromString(String value) {
            for (SelectionType type : SelectionType.values()) {
                if (StringUtils.equals(value, type.value)) {
                    return type;
                }
            }
            return SINGLE;
        }

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
     * Defines the orientation for image choice layout.
     * Possible values: {@code horizontal}, {@code vertical}
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    enum Orientation {
        HORIZONTAL("horizontal"),
        VERTICAL("vertical");

        private String value;

        Orientation(String value) {
            this.value = value;
        }

        public static Orientation fromString(String value) {
            for (Orientation type : Orientation.values()) {
                if (StringUtils.equals(value, type.value)) {
                    return type;
                }
            }
            return HORIZONTAL;
        }

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
     * Returns the orientation of the image choice component.
     *
     * @return {@link Orientation}
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @JsonIgnore
    default Orientation getOrientation() {
        return Orientation.HORIZONTAL;
    }

    /**
     * Returns the selection type of the image choice component.
     * {@code single} behaves like radio buttons (one selection),
     * {@code multi} behaves like checkbox group (multiple selections).
     *
     * @return {@link SelectionType}
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @JsonIgnore
    default SelectionType getSelectionType() {
        return SelectionType.SINGLE;
    }

    /**
     * Returns the array of image source paths corresponding to each enum option.
     * The array is parallel to the enums array - imageSrc[i] is the image for enum[i].
     *
     * @return array of image source paths, or null if not set
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    String[] getImageSrc();
}
