/*
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * ~ Copyright 2024 Adobe
 * ~
 * ~ Licensed under the Apache License, Version 2.0 (the "License");
 * ~ you may not use this file except in compliance with the License.
 * ~ You may obtain a copy of the License at
 * ~
 * ~ http://www.apache.org/licenses/LICENSE-2.0
 * ~
 * ~ Unless required by applicable law or agreed to in writing, software
 * ~ distributed under the License is distributed on an "AS IS" BASIS,
 * ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * ~ See the License for the specific language governing permissions and
 * ~ limitations under the License.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

package com.adobe.cq.forms.core.components.internal.models.v3.form;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.internal.models.v2.form.FileInputImplV2;
import com.adobe.cq.forms.core.components.models.form.FileInput;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { FileInput.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_FILE_INPUT_V3 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class FileInputImplV3 extends FileInputImplV2 {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DRAG_DROP_TEXT_V3)
    @Default(values = FileInput.DEFAULT_DRAGDROP_TEXT)
    protected String dragDropTextV3;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.FD_FILE_ACCEPT_EXTENSIONS)
    protected String[] acceptExtensions;

    @Override
    public String getDragDropText() {
        return dragDropTextV3;
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> customProperties = super.getProperties();
        customProperties.remove(ReservedProperties.PN_DRAG_DROP_TEXT);
        customProperties.put(ReservedProperties.PN_DRAG_DROP_TEXT_V3, getDragDropText());
        return customProperties;
    }

    @Override
    public List<String> getAcceptExtensions() {
        // adding . in front of the accept extensions
        if (acceptExtensions != null) {
            for (int i = 0; i < acceptExtensions.length; i++) {
                acceptExtensions[i] = "." + acceptExtensions[i];
            }
        }
        return Optional.ofNullable(acceptExtensions)
            .map(Arrays::asList)
            .orElse(Collections.emptyList());
    }
}
