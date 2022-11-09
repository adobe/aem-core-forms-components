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
package com.adobe.cq.forms.core.components.util;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.forms.core.components.models.form.Field;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Abstract class which can be used as base class for {@link Field} implementations.
 */
public abstract class AbstractFieldImpl extends AbstractBaseImpl implements Field {

    private static final Logger logger = LoggerFactory.getLogger(AbstractFieldImpl.class);
    private static final String PN_PLACEHOLDER = "placeholder";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    protected boolean readOnly;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "default")
    @Nullable
    protected Object[] defaultValue;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_PLACEHOLDER)
    @Nullable
    protected String placeholder;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "displayFormat")
    @Nullable
    protected String displayFormat;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "editFormat")
    @Nullable
    protected String editFormat;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "dataFormat")
    @Nullable
    protected String dataFormat;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "minLength")
    @Nullable
    protected Integer minLength;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "maxLength")
    @Nullable
    protected Integer maxLength;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "maximum")
    @Nullable
    protected Long maximum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "minimum")
    @Nullable
    protected Long minimum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "minimumDate")
    @Nullable
    protected Date minimumDate;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "maximumDate")
    @Nullable
    protected Date maximumDate;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "exclusiveMinimum")
    @Nullable
    protected Long exclusiveMinimum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "exclusiveMaximum")
    @Nullable
    protected Long exclusiveMaximum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "exclusiveMinimumDate")
    @Nullable
    protected Date exclusiveMinimumDate;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "exclusiveMaximumDate")
    @Nullable
    protected Date exclusiveMaximumDate;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "dorExclusion")
    @Default(booleanValues = false)
    protected boolean dorExclusion;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "dorColspan")
    @Nullable
    protected String dorColspan;

    /**
     * Returns dorBindRef of the form field
     *
     * @return dorBindRef of the field
     * @since com.adobe.cq.forms.core.components.util 2.1.0
     */
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "dorBindRef")
    @Nullable
    protected String dorBindRef;

    @SlingObject
    private Resource resource;

    @Override
    public boolean isReadOnly() {
        if (getEditMode()) {
            return false;
        }
        return readOnly;
    }

    @Override
    public boolean isRequired() {
        return required;
    }

    @Override
    public Object[] getDefault() {
        if (defaultValue != null) {
            return Arrays.stream(defaultValue)
                .map(p -> {
                    if (p instanceof Calendar) {
                        return ((Calendar) p).getTime();
                    } else {
                        return p;
                    }
                })
                .toArray();
        }
        return null;
    }

    @Override
    @Nullable
    public String getPlaceHolder() {
        return translate(PN_PLACEHOLDER, placeholder);
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
    @JsonIgnore
    public Map<String, Object> getDorProperties() {
        Map<String, Object> customDorProperties = new LinkedHashMap<>();
        customDorProperties.put("dorExclusion", dorExclusion);
        if (dorColspan != null) {
            customDorProperties.put("dorColspan", dorColspan);
        }
        if (dorBindRef != null) {
            customDorProperties.put("dorBindRef", dorBindRef);
        }
        return customDorProperties;
    }
}
