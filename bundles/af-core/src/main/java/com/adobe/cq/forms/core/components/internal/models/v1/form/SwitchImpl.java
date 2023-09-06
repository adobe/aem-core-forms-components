/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
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
import com.adobe.cq.forms.core.components.models.form.Switch;
import com.adobe.cq.forms.core.components.util.AbstractBaseImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Switch.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_SWITCH_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class SwitchImpl extends AbstractBaseImpl implements Switch {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "onValue")
    protected String onValue;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "offValue")
    protected String offValue;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "icon")
    @Nullable
    private String icon;

    @Override
    @Nullable
    public String getOffValue() {
        return offValue;
    }

    @Override
    @Nullable
    public String getOnValue() {
        return onValue;
    }

    @Override
    public String getIcon() {
        return icon;
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
        return super.getProperties();
    }
}
