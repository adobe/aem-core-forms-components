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
import java.util.Optional;

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
import com.adobe.cq.forms.core.components.models.form.FileInput;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { FileInput.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_FILE_INPUT_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class FileInputImpl extends AbstractFieldImpl implements FileInput {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "multiSelection")
    @Default(booleanValues = false)
    protected boolean multiSelection;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "maxFileSize")
    protected String maxFileSize;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "accept")
    protected String[] accept;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
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
        // if (isMultiple()) {
        // return Type.ARRAY;
        // } else {
        // }
        // file upload does not work for type string in core component, hence default it to file
        Type superType = super.getType();
        if (Type.STRING.equals(superType)) {
            return Type.FILE;
        } else {
            return superType; // we don't return array but rather type stored in JCR, for example, file[]
        }
    }

    @Override
    public Boolean isMultiple() {
        return multiSelection;
    }

    @Override
    public String getMaxFileSize() {
        return maxFileSize;
    }

    @Override
    public String getButtonText() {
        return buttonText;
    }

    @Override
    public List<String> getAccept() {
        return Optional.ofNullable(accept)
            .map(Arrays::asList)
            .orElse(Collections.emptyList());
    }
}
