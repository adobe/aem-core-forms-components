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

import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.Nullable;

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
import com.adobe.cq.forms.core.components.models.form.PasswordInput;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { PasswordInput.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_PASSWORD_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PasswordInputImpl extends AbstractFieldImpl implements PasswordInput {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_PATTERN)
    @Nullable
    protected String pattern;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_AUTOCOMPLETE)
    @Nullable
    protected String autocomplete;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_SHOW_HIDE_PASSWORD)
    @Default(booleanValues = true)
    protected boolean showHidePassword;

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.PASSWORD);
    }

    @Override
    @Nullable
    public Object[] getDefault() {
        // password values must never be exposed in rendered markup or the exported JSON model,
        // regardless of how the underlying property was set (authoring dialog, direct content write, etc.)
        return null;
    }

    @Override
    @Nullable
    public Integer getMinLength() {
        return minLength;
    }

    @Override
    @Nullable
    public Integer getMaxLength() {
        return maxLength;
    }

    @Override
    @Nullable
    public String getPattern() {
        return pattern;
    }

    @Override
    public String getAutoComplete() {
        return autocomplete;
    }

    @Override
    public boolean isShowHidePasswordEnabled() {
        return showHidePassword;
    }

    /**
     * Exposes {@code showHidePassword} as the OOTB {@code fd:}-prefixed custom property so it is available to headless
     * clients (the boolean getter above is only a convenience for the HTL rendering path and is not itself serialized).
     */
    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> properties = new LinkedHashMap<>(super.getProperties());
        properties.put("fd:" + ReservedProperties.PN_SHOW_HIDE_PASSWORD, showHidePassword);
        return properties;
    }
}
