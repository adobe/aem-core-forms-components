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

import java.util.Date;
import java.util.Map;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.jetbrains.annotations.NotNull;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.ConstraintType;
import com.adobe.cq.forms.core.components.models.form.DatePicker;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { DatePicker.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_DATE_PICKER_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class DatePickerImpl extends AbstractFieldImpl implements DatePicker {

    @SlingObject
    private Resource resource;

    @Override
    public Date getMinimumDate() {
        return ComponentUtils.clone(minimumDate);
    }

    @Override
    public Date getMaximumDate() {
        return ComponentUtils.clone(maximumDate);
    }

    @Override
    public Date getExclusiveMaximumDate() {
        return ComponentUtils.clone(exclusiveMaximumDate);
    }

    @Override
    public Date getExclusiveMinimumDate() {
        return ComponentUtils.clone(exclusiveMinimumDate);
    }

    public @NotNull Map<ConstraintType, String> getConstraintMessages() {
        Map<ConstraintType, String> res = super.getConstraintMessages();
        String msg = getConstraintMessage(ConstraintType.MINIMUM);
        if (msg != null) {
            res.put(ConstraintType.MINIMUM, msg);
        }
        msg = getConstraintMessage(ConstraintType.MAXIMUM);
        if (msg != null) {
            res.put(ConstraintType.MAXIMUM, msg);
        }
        return res;
    }
}
