/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
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

import java.util.List;
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
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.TermsAndConditions;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { TermsAndConditions.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_TERMS_AND_CONDITIONS_V1 })

@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TermsAndConditionsImpl extends PanelImpl implements TermsAndConditions {

    private static final String CUSTOM_TNC_PROPERTY = "fd:tnc";

    private static final String FIELD_TYPE = "fieldType";

    @JsonIgnore
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = true)
    private boolean showApprovalOption;

    @JsonIgnore
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    private boolean showLink;

    @JsonIgnore
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    private boolean showAsPopup;

    @Override
    public boolean isShowApprovalOption() {
        return showApprovalOption;
    }

    @Override
    public boolean isShowLink() {
        return showLink;
    }

    @Override
    public boolean isShowAsPopup() {
        return showAsPopup;
    }

    @Override
    public @NotNull String getId() {
        return super.getId();
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> properties = super.getProperties();
        if (resource.getValueMap().containsKey(CUSTOM_TNC_PROPERTY)) {
            properties.put(CUSTOM_TNC_PROPERTY, true);
        }
        return properties;
    }

    @Override
    protected List<Resource> getFilteredChildrenResources() {
        List<Resource> childResources = getFilteredChildrenResources(resource);
        // the tnc component will either have links or consent text based upon showLink value
        if (showLink) {
            childResources.removeIf(child -> FieldType.PLAIN_TEXT.getValue().equals(child.getValueMap().get(FIELD_TYPE)));

        } else {
            childResources.removeIf(child -> FieldType.CHECKBOX_GROUP.getValue().equals(child.getValueMap().get(FIELD_TYPE)));
        }
        return childResources;
    }
}
