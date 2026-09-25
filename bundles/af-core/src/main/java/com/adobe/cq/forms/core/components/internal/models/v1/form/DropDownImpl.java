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

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.BaseConstraint.Type;
import com.adobe.cq.forms.core.components.models.form.DropDown;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.util.AbstractOptionsFieldImpl;

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

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_PATTERN)
    @Nullable
    protected String pattern;

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
    public Type getType() {
        Type baseType = super.getType();
        if (baseType == null) {
            return null;
        }

        String typeValue = baseType.getValue();

        // Handle multiSelect logic: append [] if multiSelect is true and not already array type
        // or remove [] if multiSelect is false and it's currently array type
        if (isMultiSelect()) {
            if (!typeValue.endsWith("[]")) {
                typeValue += "[]";
            }
        } else {
            if (typeValue.endsWith("[]")) {
                typeValue = typeValue.substring(0, typeValue.length() - 2);
            }
        }

        return Type.fromString(typeValue);
    }

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.DROP_DOWN);
    }

    /**
     * String length/pattern constraints are only meaningful for a single-select (string-typed) drop-down,
     * e.g. a searchable drop-down where {@code enforceEnum} is disabled and free text is allowed. For a
     * multi-select drop-down the value type is an array, so these constraints are not applicable and are
     * omitted from the model (mirroring the runtime, which strips them for non-string types).
     */
    @Override
    public Integer getMinLength() {
        return isMultiSelect() ? null : minLength;
    }

    @Override
    public Integer getMaxLength() {
        return isMultiSelect() ? null : maxLength;
    }

    @Override
    public String getPattern() {
        return isMultiSelect() ? null : pattern;
    }

    /**
     * Drop-down does not support the {@code format} string constraint (there is no authorable format for an
     * enumerated field), so this always returns {@code null} and is omitted from the exported model.
     */
    @Override
    public String getFormat() {
        return null;
    }
}
