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

import javax.annotation.Nullable;
import javax.annotation.PostConstruct;

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
import com.adobe.cq.forms.core.components.models.form.NumberInput;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { NumberInput.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_NUMBER_INPUT_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class NumberInputImpl extends AbstractFieldImpl implements NumberInput {

    // TODO
    // Lead Digits and Frac Digits is not implemented today, based on the use-case
    // it would be implemented on crispr spec, even locale would have to be handled**/

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "exclusiveMinimum")
    @Nullable
    @Default(booleanValues = false)
    protected Object exclusiveMinimum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "exclusiveMaximum")
    @Nullable
    @Default(booleanValues = false)
    protected Object exclusiveMaximum;

    /** Adding this for backward compatibility, not to be changed anymore **/
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "excludeMaximumCheck")
    @Nullable
    private Boolean excludeMaximumCheck;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "excludeMinimumCheck")
    @Nullable
    private Boolean excludeMinimumCheck;
    /** End **/
    private Long exclusiveMinimumVaue;
    private Long exclusiveMaximumValue;

    @Override
    @Nullable
    public Long getMinimum() {
        return minimum;
    }

    @Override
    @Nullable
    public Long getMaximum() {
        return maximum;
    }

    @Override
    @Nullable
    public Long getExclusiveMaximum() {
        return exclusiveMaximumValue;
    }

    @Override
    @Nullable
    public Long getExclusiveMinimum() {
        return exclusiveMinimumVaue;
    }

    @Override
    public Type getType() {
        Type superType = super.getType();
        if (Type.STRING.equals(superType)) {
            return Type.NUMBER;
        } else {
            return superType;
        }
    }

    @PostConstruct
    private void initNumberInput() {
        exclusiveMaximumValue = ComponentUtils.getExclusiveValue(exclusiveMaximum, maximum, excludeMaximumCheck);
        exclusiveMinimumVaue = ComponentUtils.getExclusiveValue(exclusiveMinimum, minimum, excludeMinimumCheck);
        // in json either, exclusiveMaximum or maximum should be present
        if (exclusiveMaximumValue != null) {
            maximum = null;
        }
        if (exclusiveMinimumVaue != null) {
            minimum = null;
        }
    }
}
