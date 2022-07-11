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

import java.util.Map;

import javax.annotation.Nullable;
import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.CheckBox;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { CheckBox.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_CHECKBOX_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class CheckBoxImpl extends AbstractOptionsFieldImpl implements CheckBox {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "orientation")
    @Nullable
    protected String orientationJcr;
    private Orientation orientation;

    @Override
    public FieldType getDefaultFieldType() {
        return FieldType.CHECKBOX;
    }

    @PostConstruct
    private void initCheckBoxModel() {
        orientation = Orientation.fromString(orientationJcr);
    }

    @Override
    public @NotNull Map<String, Object> getCustomProperties() {
        Map<String, Object> customProperties = super.getCustomProperties();
        if (orientation != null) {
            customProperties.put("orientation", orientation);
        }
        return customProperties;
    }

    @Override
    public Orientation getOrientation() {
        return orientation;
    }

}
