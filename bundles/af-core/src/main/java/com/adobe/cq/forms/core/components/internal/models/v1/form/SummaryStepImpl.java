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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.util.Map;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.SummaryStep;
import com.adobe.cq.forms.core.components.util.AbstractBaseImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { SummaryStep.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_SUMMARY_STEP_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class SummaryStepImpl extends AbstractBaseImpl implements SummaryStep {

    static final String PROP_DISPLAY_MSG = "displayMsg";
    static final String PROP_AUTO_SUBMIT = "autoSubmit";

    static final String VIEW_TYPE_SUMMARY_STEP = "summary-step";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PROP_DISPLAY_MSG)
    @Nullable
    private String displayMsg;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PROP_AUTO_SUBMIT)
    @Default(booleanValues = true)
    private boolean autoSubmit;

    @Override
    public String getDisplayMsg() {
        return displayMsg;
    }

    @Override
    public boolean isAutoSubmit() {
        return autoSubmit;
    }

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.PLAIN_TEXT);
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> properties = super.getProperties();
        if (getDisplayMsg() != null) {
            properties.put("fd:displayMsg", getDisplayMsg());
        }
        properties.put("fd:autoSubmit", isAutoSubmit());
        return properties;
    }
}
