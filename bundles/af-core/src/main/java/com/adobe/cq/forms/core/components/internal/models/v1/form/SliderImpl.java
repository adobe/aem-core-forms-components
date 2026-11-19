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

import javax.annotation.Nullable;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.Slider;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Slider.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_SLIDER_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class SliderImpl extends AbstractFieldImpl implements Slider {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_STEP)
    @Nullable
    private String stepAsStr;

    @Override
    @Nullable
    public Number getMinimumNumber() {
        return ComponentUtils.parseNumber(minimumAsStr);
    }

    @Override
    @Nullable
    public Number getMaximumNumber() {
        return ComponentUtils.parseNumber(maximumAsStr);
    }

    @Override
    @Nullable
    public Number getStep() {
        return ComponentUtils.parseNumber(stepAsStr);
    }

    @Override
    public Type getType() {
        Type superType = super.getType();
        if (Type.STRING.equals(superType)) {
            return Type.NUMBER;
        } else {
            return superType;
        }
    }

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.RANGE);
    }
}
