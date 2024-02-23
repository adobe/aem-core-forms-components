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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.ImageChoice;
import com.adobe.cq.forms.core.components.util.AbstractOptionsFieldImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { ImageChoice.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_IMAGECHOICE_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class ImageChoiceImpl extends AbstractOptionsFieldImpl implements ImageChoice {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "selectionType")
    @Nullable
    protected String selectionType;

    @Inject
    @Via("resource")
    @Optional
    protected List<ImageItem> options = new ArrayList<>();

    public ImageChoiceImpl() {
        // No-argument constructor
    }

    @Override
    public @NotNull Map<String, Object> getCustomLayoutProperties() {
        Map<String, Object> customLayoutProperties = super.getCustomLayoutProperties();
        if (selectionType != null) {
            customLayoutProperties.put("selectionType", selectionType);
        }
        return customLayoutProperties;
    }

    @JsonIgnore
    public String getSelectionType() {
        return selectionType;
    }

    public List<ImageItem> getOptions() {
        return options;
    }

    @Override
    public Type getType() {
        return super.getType(); // Calling the getType() method of the superclass
    }
}
