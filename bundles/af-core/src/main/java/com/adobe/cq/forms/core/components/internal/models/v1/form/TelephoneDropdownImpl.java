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

import java.util.Arrays;

import javax.annotation.Nullable;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.models.form.TelephoneDropdown;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { TelephoneDropdown.class, ComponentExporter.class },
    resourceType = "core/fd/components/form/telephonedropdown/v1/telephonedropdown")
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TelephoneDropdownImpl extends DropDownImpl implements TelephoneDropdown {

    @ValueMapValue(injectionStrategy = InjectionStrategy.REQUIRED, name = "allowedCountryCodes")
    @Default(values = { "+0 CountryName" })
    private String[] allowedCountryCodes;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "pattern")
    @Nullable
    protected String pattern;
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    private boolean enforceEnum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "multiSelect")
    @Default(booleanValues = false)
    protected boolean multiSelect;

    @Override
    public Integer getMinItems() {
        return minItems;
    }

    @Override
    public boolean isEnforceEnum() {
        return enforceEnum;
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
    public String[] getAllowedCountryCodes() {
        return Arrays.copyOf(allowedCountryCodes, allowedCountryCodes.length);
    }

    @Nullable
    public String getPattern() {
        return pattern;
    }

}
