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
package com.adobe.cq.forms.core.components.internal.datalayer;

import java.util.Calendar;
import java.util.Date;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.forms.core.components.datalayer.FormComponentData;
import com.adobe.cq.forms.core.components.internal.models.v2.form.FormContainerImpl;
import com.adobe.cq.forms.core.components.models.form.FormComponent;
import com.adobe.cq.forms.core.components.models.form.Label;
import com.adobe.cq.forms.core.components.util.AbstractFormComponentImpl;
import com.day.cq.commons.jcr.JcrConstants;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ComponentDataImpl implements FormComponentData {

    private static final Logger LOGGER = LoggerFactory.getLogger(ComponentDataImpl.class);

    protected final FormComponent component;

    protected final Resource resource;

    public ComponentDataImpl(FormComponent component, Resource resource) {
        this.component = component;
        this.resource = resource;
    }

    private AbstractFormComponentImpl getComponentAsFormComponent() {
        if (component instanceof AbstractFormComponentImpl) {
            return (AbstractFormComponentImpl) component;
        }
        return null;
    }

    @Override
    public String getId() {
        return component.getId();
    }

    @Override
    public String getType() {
        return resource.getResourceType();
    }

    @Override
    public Date getLastModifiedDate() {
        ValueMap valueMap = resource.adaptTo(ValueMap.class);
        Calendar lastModified = null;

        if (valueMap != null) {
            lastModified = valueMap.get(JcrConstants.JCR_LASTMODIFIED, Calendar.class);

            if (lastModified == null) {
                lastModified = valueMap.get(JcrConstants.JCR_CREATED, Calendar.class);
            }
        }

        if (lastModified != null) {
            return lastModified.getTime();
        }

        return null;
    }

    @Override
    public String getText() {
        AbstractFormComponentImpl formComponent = getComponentAsFormComponent();
        if (formComponent != null) {
            return formComponent.getText();
        }
        return null;
    }

    @Override
    public String getLinkUrl() {
        AbstractFormComponentImpl formComponent = getComponentAsFormComponent();
        if (formComponent != null) {
            return formComponent.getLinkUrl();
        }
        return null;
    }

    @Override
    public String getTitle() {
        if (component instanceof FormContainerImpl) {
            return ((FormContainerImpl) component).getTitle();
        }
        AbstractFormComponentImpl formComponent = getComponentAsFormComponent();
        if (formComponent != null) {
            Label label = formComponent.getLabel();
            if (label != null) {
                return label.getValue();
            }
        }
        return null;
    }

    @Override
    public String getDescription() {
        AbstractFormComponentImpl formComponent = getComponentAsFormComponent();
        if (formComponent != null) {
            return formComponent.getDescription();
        }
        return null;
    }

    @Override
    public String getParentId() {
        return null;
    }

    public String getFieldType() {
        AbstractFormComponentImpl formComponent = getComponentAsFormComponent();
        if (formComponent != null) {
            return formComponent.getFieldType();
        }
        return null;
    }

    @Override
    @Nullable
    public final String getJson() {
        try {
            return String.format("{\"%s\":%s}",
                this.getId(),
                new ObjectMapper().writeValueAsString(this));
        } catch (JsonProcessingException e) {
            LOGGER.error("Unable to generate dataLayer JSON string", e);
        }
        return null;
    }

}
