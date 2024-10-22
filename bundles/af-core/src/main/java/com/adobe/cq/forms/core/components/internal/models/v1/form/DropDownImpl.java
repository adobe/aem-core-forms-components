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
import com.adobe.cq.forms.core.components.models.form.DropDown;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.util.AbstractOptionsFieldImpl;
<<<<<<< HEAD
=======
import com.drew.lang.annotations.NotNull;
>>>>>>> e139fdfc3 (Test cases to enable auto-completion on dropdown component)

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { DropDown.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_DROP_DOWN_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class DropDownImpl extends AbstractOptionsFieldImpl implements DropDown {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MULTISELECT)
    @Default(booleanValues = false)
    protected boolean multiSelect;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.FD_AUTOCOMPLETE)
    @Default(booleanValues = false)
    protected boolean autoComplete;

    @Override
    public Integer getMinItems() {
        return minItems;
    }

    @Override
    public Integer getMaxItems() {
        return maxItems;
    }

    @Override
    public Boolean isMultiSelect() {
        return multiSelect;
    }

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.DROP_DOWN);
    }

    @Override
    public Boolean isAutoComplete() {
        return autoComplete;
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> customProperties = super.getProperties();
        customProperties.put(ReservedProperties.FD_AUTOCOMPLETE, isAutoComplete());
        return customProperties;
    }
}
