/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2025 Adobe
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
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import javax.annotation.Nullable;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.*;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.adobe.xfa.ut.StringUtils;
import com.fasterxml.jackson.annotation.JsonFormat;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { DateTime.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_DATETIME_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class DateTimeImpl extends AbstractFieldImpl implements DateTime {
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String pattern;

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.DATETIME_INPUT);
    }

    @Override
    public String getMinimumDateTime() {
        return getFormattedDate(minimumDateTime);
    }

    @Override
    public String getMaximumDateTime() {
        return getFormattedDate(maximumDateTime);
    }

    private String getFormattedDate(String dateTime) {
        if (!StringUtils.isEmpty(dateTime)) {
            OffsetDateTime formattedTime = OffsetDateTime.parse(dateTime);
            return formattedTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));
        }
        return dateTime;

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

    @Override
    @Nullable
    public String getFormat() {
        return "date-time";
    }

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Base.DATE_TIME_FORMATTER, timezone = "UTC")
    @Override
    public Object[] getDefault() {
        return defaultValue != null ? defaultValue.clone() : null;
    }

    /**
     * Returns the server timezone identifier for client-side consumption.
     *
     * @return server timezone identifier (e.g., "America/New_York", "Asia/Kolkata")
     * @since com.adobe.cq.forms.core.components.models.form 5.12.0
     */
    @Override
    public String getServerTimezone() {
        ZoneId serverZone = ZoneId.systemDefault();

        return serverZone.getId();
    }

}
