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

package com.adobe.cq.forms.core.components.internal.models.v1.form;

import javax.annotation.Nullable;
import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Password;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Password.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_PASSWORD_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PasswordImpl extends AbstractFieldImpl implements Password {

    private Object exclusiveMinimumVaue;
    private Object exclusiveMaximumValue;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String validationPattern;

    @Override
    public String getFieldType() {
        return super.getFieldType();
    }

    @Override
    public Integer getMinLength() {
        return minLength;
    }

    @Override
    public Integer getMaxLength() {
        return maxLength;
    }

    @Override
    public Long getMinimum() {
        return minimum;
    }

    @Override
    public Long getMaximum() {
        return maximum;
    }

    @Override
    public String getFormat() {
        return displayFormat;
    }

    @Override
    public String getValidationPattern() {
        return validationPattern;
    }

    @Override
    public Long getExclusiveMaximum() {
        return (Long) exclusiveMaximumValue;
    }

    @Override
    public Long getExclusiveMinimum() {
        return (Long) exclusiveMinimumVaue;
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
