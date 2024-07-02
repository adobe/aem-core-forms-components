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

// import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

// import com.adobe.cq.wcm.core.components.commons.link.Link;
// import com.adobe.cq.forms.core.components.models.form.BaseConstraint.Type;

@ConsumerType
public interface FormTitle extends FormComponent {

    /**
     * Returns the HTML element type (h1-h6) used for the markup.
     *
     * @return the element type
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1;
     */
    default String getFormat() {
        return null;
    }

    String PN_DESIGN_DEFAULT_FORMAT = "format";

    /**
     * Returns the text to be displayed as title.
     *
     * @return the title's text
     */
    default String getText() {
        return null;
    }

    /**
     * Retrieves the text value to be displayed.
     *
     * @return the text value to be displayed, or {@code null} if no value can be returned
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1;
     */
    default String getValue() {
        return null;
    }
}
