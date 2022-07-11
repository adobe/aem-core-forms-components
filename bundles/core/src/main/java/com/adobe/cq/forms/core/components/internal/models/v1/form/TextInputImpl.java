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
import java.util.Optional;

import javax.annotation.Nullable;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.DateConstraint;
import com.adobe.cq.forms.core.components.models.form.NumberConstraint;
import com.adobe.cq.forms.core.components.models.form.StringConstraint;
import com.adobe.cq.forms.core.components.models.form.TextInput;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { TextInput.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_TEXT_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TextInputImpl extends AbstractFieldImpl implements TextInput, StringConstraint, NumberConstraint, DateConstraint {

    @ScriptVariable
    private ValueMap properties;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    protected boolean multiLine;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "pattern")
    @Nullable
    protected String pattern;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String autocomplete;

    @Override
    public boolean isMultiLine() {
        return multiLine;
    }

    @Override
    public FieldType getDefaultFieldType() {
        if (isMultiLine()) {
            return FieldType.MULTILINE_INPUT;
        } else {
            return FieldType.TEXT_INPUT;
        }
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
    public Integer getMinimum() {
        return minimum;
    }

    @Override
    @Nullable
    public Integer getMaximum() {
        return maximum;
    }

    @Override
    public Date getMinimumDate() {
        return Optional.ofNullable(minDate)
            .map(Date::getTime)
            .map(Date::new)
            .orElse(null);
    }

    @Override
    public Date getMaximumDate() {
        return Optional.ofNullable(maxDate)
            .map(Date::getTime)
            .map(Date::new)
            .orElse(null);
    }
}
