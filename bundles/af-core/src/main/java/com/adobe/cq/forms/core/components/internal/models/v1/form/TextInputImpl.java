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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.util.Date;

import javax.annotation.Nullable;
import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { TextInput.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_TEXT_V1, FormConstants.RT_FD_FORM_EMAIL_V1, FormConstants.RT_FD_FORM_TELEPHONE_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TextInputImpl extends AbstractFieldImpl implements TextInput {

    // type number and date are implemented in sling model as per crispr specification
    // but it is not supported in AEM dialogs

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MULTILINE)
    @Default(booleanValues = false)
    protected boolean multiLine;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_FORMAT)
    @Nullable
    protected String format;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_PATTERN)
    @Nullable
    protected String pattern;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_AUTOCOMPLETE)
    @Nullable
    protected String autocomplete;

    /** Type number specific constraints **/
    private Object exclusiveMinimumVaue;
    private Object exclusiveMaximumValue;

    /** End of Type number specific constraints **/
    @Override
    public boolean isMultiLine() {
        return multiLine;
    }

    @Override
    public String getFieldType() {
        if (isMultiLine()) {
            return FieldType.MULTILINE_INPUT.getValue();
        }
        return super.getFieldType(FieldType.TEXT_INPUT);
    }

    @Override
    @Nullable
    public Integer getMinLength() {
        return minLength;
    }

    @Override
    @Nullable
    public Integer getMaxLength() {
        return maxLength;
    }

    @Override
    @Nullable
    public String getPattern() {
        return pattern;
    }

    @Override
    public String getAutoComplete() {
        return autocomplete;
    }

    @Override
    @Nullable
    public Long getMinimum() {
        return minimum;
    }

    @Override
    @Nullable
    public Long getMaximum() {
        return maximum;
    }

    @Override
    @Nullable
    public Long getExclusiveMaximum() {
        return (Long) exclusiveMaximumValue;
    }

    @Override
    @Nullable
    public Long getExclusiveMinimum() {
        return (Long) exclusiveMinimumVaue;
    }

    @Override
    public Date getMinimumDate() {
        return ComponentUtils.clone(minimumDate);
    }

    @Override
    public Date getMaximumDate() {
        return ComponentUtils.clone(maximumDate);
    }

    @Override
    public Date getExclusiveMaximumDate() {
        return ComponentUtils.clone((Date) exclusiveMaximumValue);
    }

    @Override
    public Date getExclusiveMinimumDate() {
        return ComponentUtils.clone((Date) exclusiveMinimumVaue);
    }

    @Override
    @Nullable
    public String getFormat() {
        return format;
    }

    @PostConstruct
    private void initTextInput() {
        exclusiveMaximumValue = ComponentUtils.getExclusiveValue(exclusiveMaximum, maximum, null);
        exclusiveMinimumVaue = ComponentUtils.getExclusiveValue(exclusiveMinimum, minimum, null);
        // in json either, exclusiveMaximum or maximum should be present
        if (exclusiveMaximumValue != null) {
            maximum = null;
        }
        if (exclusiveMinimumVaue != null) {
            minimum = null;
        }
    }
}
