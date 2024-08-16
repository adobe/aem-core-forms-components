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

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.Field;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Abstract class which can be used as base class for {@link Field} implementations.
 */
public abstract class AbstractFieldImpl extends AbstractBaseImpl implements Field {

    private static final Logger logger = LoggerFactory.getLogger(AbstractFieldImpl.class);

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_READ_ONLY)
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    protected Boolean readOnly;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DEFAULT_VALUE)
    @Nullable
    protected Object[] defaultValue;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_PLACEHOLDER)
    @Nullable
    protected String placeholder;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DISPLAY_FORMAT)
    @Nullable
    protected String displayFormat;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_EDIT_FORMAT)
    @Nullable
    protected String editFormat;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DISPLAY_VALUE_EXPRESSION)
    @Nullable
    protected String displayValueExpression;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DATA_FORMAT)
    @Nullable
    protected String dataFormat;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MIN_LENGTH)
    @Nullable
    protected Integer minLength;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MAX_LENGTH)
    @Nullable
    protected Integer maxLength;

    /** number and date constraint **/

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MINIMUM_DATE)
    @Nullable
    protected Date minimumDate;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MAXIMUM_DATE)
    @Nullable
    protected Date maximumDate;

    /** Do not do any changes, this is just present for backward compatibility **/
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MAXIMUM)
    @Nullable
    protected Long maximum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MINIMUM)
    @Nullable
    protected Long minimum;
    /** Do not do any changes, this is just present for backward compatibility **/

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MAXIMUM)
    @Nullable
    protected String maximumAsStr;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_MINIMUM)
    @Nullable
    protected String minimumAsStr;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_EXCLUSIVE_MINIMUM)
    @Default(booleanValues = false)
    protected boolean exclusiveMinimum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_EXCLUSIVE_MAXIMUM)
    @Default(booleanValues = false)
    protected boolean exclusiveMaximum;

    /** number and date constraint **/

    @SlingObject
    private Resource resource;

    @Override
    @Nullable
    public Boolean isReadOnly() {
        return readOnly != null ? readOnly : Boolean.FALSE;
    }

    @JsonProperty("readOnly")
    public Boolean getReadOnlyIfPresent() {
        return readOnly;
    }

    @Override
    @Nullable
    public Boolean isRequired() {
        return required != null ? required : Boolean.FALSE;
    }

    @JsonProperty("required")
    public Boolean getRequiredIfPresent() {
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
        return translate(ReservedProperties.PN_PLACEHOLDER, placeholder);
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
    public String getDisplayValueExpression() {
        return displayValueExpression;
    }

    @Override
    @Nullable
    public String getDataFormat() {
        return dataFormat;
    }

}
