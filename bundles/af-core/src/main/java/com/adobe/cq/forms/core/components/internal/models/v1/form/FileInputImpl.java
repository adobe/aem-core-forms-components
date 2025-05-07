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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
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
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.FileInput;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { FileInput.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_FILE_INPUT_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class FileInputImpl extends AbstractFieldImpl implements FileInput {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MULTISELECTION)
    @Default(booleanValues = false)
    protected boolean multiSelection;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MAX_FILE_SIZE)
    protected String maxFileSize;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_FILE_ACCEPT)
    protected String[] accept;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_BUTTON_TEXT)
    @Default(values = FileInput.DEFAULT_BUTTON_TEXT)
    protected String buttonText;

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
        Type superType = super.getType();
        if (superType == null || StringUtils.isBlank(typeJcr) || superType == Type.FILE) {
            return isMultiple() ? Type.FILE_ARRAY : Type.FILE;
        }
        if (isMultiple() && superType == Type.STRING) {
            return Type.STRING_ARRAY;
        }
        return superType;
    }

    @Override
    public String getFormat() {
        Type type = getType();
        if (type == Type.STRING || type == Type.STRING_ARRAY) {
            return "data-url";
        }
        return null;
    }

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.FILE_INPUT);
    }

    @Override
    public Boolean isMultiple() {
        return multiSelection;
    }

    @Override
    public String getMaxFileSize() {
        if (maxFileSize == null || "".equals(maxFileSize))
            return null;
        else
            return maxFileSize + "MB";
    }

    @Override
    public String getButtonText() {
        return translate(ReservedProperties.PN_BUTTON_TEXT, buttonText);
    }

    @Override
    public List<String> getAccept() {
        return Optional.ofNullable(accept)
            .map(Arrays::asList)
            .orElse(Collections.emptyList());
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> customProperties = super.getProperties();
        customProperties.put("fd:buttonText", getButtonText());
        return customProperties;
    }
}
