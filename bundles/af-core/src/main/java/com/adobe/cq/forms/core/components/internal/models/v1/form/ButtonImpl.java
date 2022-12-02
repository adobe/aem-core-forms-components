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

import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.Nullable;

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
import com.adobe.cq.forms.core.components.models.form.Button;
import com.adobe.cq.forms.core.components.util.AbstractBaseImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Button.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_BUTTON_V1, FormConstants.RT_FD_FORM_SUBMIT_BUTTON_V1,
        FormConstants.RT_FD_FORM_RESET_BUTTON_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class ButtonImpl extends AbstractBaseImpl implements Button {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "value")
    @Nullable
    protected String value;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "icon")
    @Nullable
    private String icon;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "default")
    @Nullable
    private String defaultValue;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "buttonType")
    @Default(values = "button")
    protected String buttonType;

    @Override
    public String getValue() {
        return value;
    }

    @Override
    public String getIcon() {
        return icon;
    }

    @Override
    public String getDefault() {
        return defaultValue;
    }

    @Override
    public String getButtonType() {
        return buttonType;
    }

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    protected boolean dorExclusion;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @org.jetbrains.annotations.Nullable
    protected String dorColspan;

    @Override
    @JsonIgnore
    public Map<String, Object> getDorProperties() {
        Map<String, Object> customDorProperties = new LinkedHashMap<>();
        customDorProperties.put("dorExclusion", dorExclusion);
        if (dorColspan != null) {
            customDorProperties.put("dorColspan", dorColspan);
        }
        return customDorProperties;
    }

    @Override
    public Map<String, Object> getProperties() {
        Map<String, Object> properties = super.getProperties();
        if (getButtonType() != null) {
            properties.put("fd:buttonType", buttonType);
        }
        return properties;
    }
}
