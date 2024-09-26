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

import java.util.Arrays;
import java.util.Map;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Review;
import com.adobe.cq.forms.core.components.util.AbstractBaseImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Review.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_REVIEW_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class ReviewImpl extends AbstractBaseImpl implements Review {

    private static final String LINKED_PANEL_PROPERTY = "linkedPanels";
    private static final String EDIT_ACTION_PROPERTY = "editAction";

    @JsonIgnore
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "linkedPanels")
    @Nullable
    private String[] linkedPanels;

    public String[] getLinkedPanels() {
        return linkedPanels != null ? Arrays.copyOf(linkedPanels, linkedPanels.length) : new String[] {};
    }

    @JsonIgnore
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "editAction")
    @Nullable
    private String editAction;

    public String getEditAction() {
        return editAction;
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> customProperties = super.getProperties();
        customProperties.put(LINKED_PANEL_PROPERTY, getLinkedPanels());
        customProperties.put(EDIT_ACTION_PROPERTY, getEditAction());
        return customProperties;
    }
}
