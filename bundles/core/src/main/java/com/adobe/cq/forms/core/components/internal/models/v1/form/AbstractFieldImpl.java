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

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.models.form.Field;

/**
 * Abstract class which can be used as base class for {@link Field} implementations.
 */
public abstract class AbstractFieldImpl extends AbstractBaseImpl implements Field {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    protected boolean readOnly;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "_value")
    @Nullable
    protected Object defaultValue;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "placeholderText")
    @Nullable
    protected String placeholder;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "displayPictureClause")
    @Nullable
    protected String displayFormat;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "editPictureClause")
    @Nullable
    protected String editFormat;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "dataFormat")
    @Nullable
    protected String dataFormat;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String shortDescription;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "shortVisible")
    @Default(booleanValues = false)
    protected boolean shortDescriptionVisible;

    @SlingObject
    private Resource resource;

    @Override
    public boolean isReadOnly() {
        return readOnly;
    }

    @Override
    public Object getDefault() {
        return defaultValue;
    }

    @Override
    @Nullable
    public String getPlaceHolder() {
        return placeholder;
    }

    @Override
    @Nullable
    public String getDisplayFormat() {
        return displayFormat;
    }

    @Override
    @Nullable
    public String getEditFormat() {
        return editFormat;
    }

    @Override
    @Nullable
    public String getDataFormat() {
        return dataFormat;
    }

    @Override
    public @Nullable String getShortDescription() {
        return shortDescription;
    }

    @Override
    public boolean isShortDescriptionVisible() {
        return shortDescriptionVisible;
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> customProperties = new LinkedHashMap<>();
        if (shortDescription != null) {
            customProperties.put("shortDescription", shortDescription);
            customProperties.put("shortDescriptionVisible", shortDescriptionVisible);
        }
        return customProperties;
    }
    @Override
    @Nullable
    public String getFormContainer() {
        Resource parent = resource.getParent();
        if (parent != null) {
            return parent.getPath();
        }
        return null;
    }

    @Override
    @Nullable
    public String getId() {
        return resource.getPath();
    }

}
