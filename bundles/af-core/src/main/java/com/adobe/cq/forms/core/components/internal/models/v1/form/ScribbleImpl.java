/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2025 Adobe
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

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.Scribble;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;

import java.util.Map;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Scribble.class, ComponentExporter.class },
    resourceType = "core/fd/components/form/scribble/v1/scribble")
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class ScribbleImpl extends AbstractFieldImpl implements Scribble {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String value;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.FD_DIALOG_LABEL)
    @Default(values = Scribble.DEFAULT_DIALOG_LABEL)
    protected String dialogLabel;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_FORMAT)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    protected String format;

    @Override
    public String getValue() {
        return value;
    }

    @JsonIgnore
    public String getDialogLabel() {
        return dialogLabel;
    }

    @Override
    public String getFormat() {
        return format;
    }

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.FILE_INPUT);
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> customProperties = super.getProperties();
        customProperties.put(ReservedProperties.PN_VIEWTYPE, "signature");
        if (getDialogLabel() != null)
            customProperties.put(ReservedProperties.FD_DIALOG_LABEL, getDialogLabel());
        return customProperties;
    }
}
