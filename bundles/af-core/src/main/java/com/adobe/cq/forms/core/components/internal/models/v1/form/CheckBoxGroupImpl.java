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
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.CheckBox;
import com.adobe.cq.forms.core.components.models.form.CheckBoxGroup;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.util.AbstractOptionsFieldImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { CheckBoxGroup.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_CHECKBOX_GROUP_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class CheckBoxGroupImpl extends AbstractOptionsFieldImpl implements CheckBoxGroup {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_ORIENTATION)
    @Nullable
    protected String orientationJcr;
    private CheckBox.Orientation orientation;

    @PostConstruct
    private void initCheckBoxGroupModel() {
        orientation = CheckBox.Orientation.fromString(orientationJcr);
    }

    @Override
    public @NotNull Map<String, Object> getCustomLayoutProperties() {
        Map<String, Object> customLayoutProperties = super.getCustomLayoutProperties();
        if (orientation != null) {
            customLayoutProperties.put("orientation", orientation);
        }
        return customLayoutProperties;
    }

    @JsonIgnore
    public CheckBox.Orientation getOrientation() {
        return orientation;
    }

    @Override
    public Integer getMinItems() {
        return minItems;
    }

    @Override
    public Integer getMaxItems() {
        return maxItems;
    }

    @Override
    public Type getType() {
        return super.getType(); // check box group always has type array // we always return boolean[], string[] or number[]
    }

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.CHECKBOX_GROUP);
    }
}
