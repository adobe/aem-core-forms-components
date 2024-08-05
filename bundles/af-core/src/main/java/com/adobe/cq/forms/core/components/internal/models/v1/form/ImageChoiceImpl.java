/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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

import java.util.*;

import javax.annotation.Nullable;
import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.BaseConstraint;
import com.adobe.cq.forms.core.components.models.form.CheckBox;
import com.adobe.cq.forms.core.components.models.form.ImageChoice;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { ImageChoice.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_IMAGECHOICE_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class ImageChoiceImpl extends AbstractFieldImpl implements ImageChoice {

    private final Logger logger = LoggerFactory.getLogger(getClass());
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "orientation")
    @Nullable
    protected String orientationJcr;
    private CheckBox.Orientation orientation;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "selectionType")
    @Nullable
    protected String selectionType;

    @Inject
    @Via("resource")
    @Optional
    protected List<ImageItem> options = new ArrayList<>();

    @PostConstruct
    private void initImageChoiceModel() {
        orientation = CheckBox.Orientation.fromString(orientationJcr);
    }

    @Override
    public Map<String, Object> getCustomLayoutProperties() {
        Map<String, Object> customLayoutProperties = super.getCustomLayoutProperties();
        if (orientation != null) {
            customLayoutProperties.put("orientation", orientation);
        }
        if (selectionType != null) {
            customLayoutProperties.put("selectionType", selectionType);
        }
        return customLayoutProperties;
    }

    @JsonIgnore
    public CheckBox.Orientation getOrientation() {
        return orientation;
    }

    @JsonIgnore
    public String getSelectionType() {
        return selectionType;
    }

    public List<ImageItem> getOptions() {
        options = setImageValueBasedOnSubmissionDataType();
        return options;
    }

    private Map<Object, ImageItem> removeDuplicates() {
        LinkedHashMap<Object, ImageItem> map = new LinkedHashMap<>();
        if (options != null) {
            for (ImageItem item : options) {
                map.put(item.getValue(), item);
            }
        }
        return map;
    }

    private List<ImageItem> setImageValueBasedOnSubmissionDataType() {
        if (options == null) {
            return null;
        } else {
            Map<Object, ImageItem> map = removeDuplicates();
            List<ImageItem> updatedOptions = new ArrayList<>();
            for (Map.Entry<Object, ImageItem> entry : map.entrySet()) {
                Object key = entry.getKey();
                ImageItem item = entry.getValue();
                Object coercedValue = coerceImageValue(type, key);
                item.setImageValue(coercedValue);
                updatedOptions.add(item);
            }
            return updatedOptions;
        }
    }

    private Object coerceImageValue(BaseConstraint.Type type, Object value) {
        if (type.equals(BaseConstraint.Type.NUMBER) || type.equals(BaseConstraint.Type.NUMBER_ARRAY)) {
            return Long.parseLong(value.toString());
        } else if (type.equals(BaseConstraint.Type.BOOLEAN) || type.equals(BaseConstraint.Type.BOOLEAN_ARRAY)) {
            return Boolean.parseBoolean(value.toString());
        }
        return value;
    }

    @Override
    public Type getType() {
        return super.getType();
    }

    @Override
    public Object[] getDefault() {
        Object[] typedDefaultValue = null;
        if (defaultValue != null) {
            typedDefaultValue = ComponentUtils.coerce(type, defaultValue);
        }
        return typedDefaultValue;
    }
}
