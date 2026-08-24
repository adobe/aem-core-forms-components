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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.Text;
import com.adobe.cq.forms.core.components.util.AbstractBaseImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Sling Model for the Adobe Sign Block core component.
 */
@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Text.class, Base.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_ADOBE_SIGN_BLOCK_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class AdobeSignBlockImpl extends AbstractBaseImpl implements Text {

    private static final Pattern ADOBE_SIGN_TAG_PATTERN = Pattern.compile("\\{\\{[*]?([^:]*)_es_:");

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private String adobeSignFieldTag;

    @Override
    public String getValue() {
        String tag = StringUtils.defaultString(adobeSignFieldTag);
        String markup = StringUtils.isNotBlank(value) ? value + "&nbsp;" + tag : tag;
        return translate("value", markup);
    }

    /**
     * Always {@code true}: the Text field is always authored as rich text, and the rendered value
     * always additionally contains the real (unescaped) placeholder markup above.
     */
    @Override
    public boolean isRichText() {
        return true;
    }

    /**
     * Excluded from JSON; the rich-text content is surfaced via {@link #getValue()}.
     */
    @Override
    @JsonIgnore
    public String getText() {
        return getValue();
    }

    @Override
    public String getFieldType() {
        return FieldType.ADOBE_SIGN_BLOCK.getValue();
    }

    /**
     * Returns the names of Adobe Sign text-tag fields embedded in this block's HTML content
     * (e.g. {@code {{Signature1_es_:signer1:signature}}} yields {@code "Signature1"}).
     * Returns {@code null} when no text tags are present so the property is omitted from JSON.
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String[] getAdobeSignFields() {
        String blockValue = getValue();
        if (blockValue != null && !blockValue.isEmpty()) {
            List<String> fieldNames = new ArrayList<>();
            Set<String> seen = new HashSet<>();
            Matcher matcher = ADOBE_SIGN_TAG_PATTERN.matcher(blockValue);
            while (matcher.find()) {
                String fieldName = matcher.group(1);
                if (seen.add(fieldName)) {
                    fieldNames.add(fieldName);
                }
            }
            if (!fieldNames.isEmpty()) {
                return fieldNames.toArray(new String[0]);
            }
        }
        return null;
    }
}
