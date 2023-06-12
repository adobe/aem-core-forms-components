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
package com.adobe.cq.forms.core.components.util;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.models.form.Label;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.i18n.I18n;
import com.fasterxml.jackson.annotation.JsonInclude;

public class LabelImpl implements Label {

    private static final String PN_HIDE_TITLE = "hideTitle";
    private static final String PN_TITLE = JcrConstants.JCR_TITLE;
    private static final String PN_IS_TITLE_RICH_TEXT = "isTitleRichText";

    private ValueMap properties;
    private I18n i18n;

    public LabelImpl(Resource field, I18n i18n) {
        this.properties = field.getValueMap();
        this.i18n = i18n;
    }

    /**
     * Returns {@code true} if label is rich text, otherwise {@code false}.
     *
     * @return {@code true} if label is rich text, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public Boolean isRichText() {
        return properties.get(PN_IS_TITLE_RICH_TEXT, Boolean.class);
    }

    /**
     * Returns {@code true} if label should be visible, otherwise {@code false}.
     *
     * @return {@code true} if label should be visible, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public Boolean isVisible() {
        Boolean hideTitle = properties.get(PN_HIDE_TITLE, Boolean.class);
        if (hideTitle != null) {
            return !hideTitle;
        }
        return null;
    }

    /**
     * Returns the value of this label.
     *
     * @return the value of this label
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    public String getValue() {
        return ComponentUtils.translate(properties.get(PN_TITLE, "\n"), PN_TITLE, properties, i18n);
    }
}
