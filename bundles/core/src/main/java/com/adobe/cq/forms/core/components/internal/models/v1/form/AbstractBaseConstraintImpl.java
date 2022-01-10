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

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.models.form.BaseConstraint;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Abstract class which can be used as base class for {@link BaseConstraint} implementations.
 */
public abstract class AbstractBaseConstraintImpl implements BaseConstraint {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String format;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String validationExpression;

    // using old jcr property names to allow easy conversion from foundation to core components
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "mandatory")
    @Default(booleanValues = false)
    protected boolean required;

    @SlingObject
    private Resource resource;

    @JsonIgnore
    protected abstract Type getDefaultType();

    @Override
    public boolean isRequired() {
        return required;
    }

    @Override
    public Type getType() {
        return getDefaultType();
    }

    @Override
    @Nullable
    public String getFormat() {
        return format;
    }

    @Override
    @Nullable
    public String getValidationExpression() {
        return validationExpression;
    }
}
