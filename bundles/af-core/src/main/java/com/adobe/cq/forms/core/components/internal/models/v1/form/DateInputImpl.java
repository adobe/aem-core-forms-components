/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.ConstraintType;
import com.adobe.cq.forms.core.components.models.form.DateInput;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { DateInput.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_DATE_INPUT_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class DateInputImpl extends AbstractFieldImpl implements DateInput {

    /** Default XFA picture clause applied when {@code dateDisplayFormat} is not authored. */
    private static final String DEFAULT_DATE_DISPLAY_FORMAT = "date{D/M/YYYY}";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_EXCLUDE_MINIMUM)
    @Default(booleanValues = false)
    protected boolean excludeMinimum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_EXCLUDE_MAXIMUM)
    @Default(booleanValues = false)
    protected boolean excludeMaximum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_PLACEHOLDER_DAY)
    @Nullable
    private String placeholderDay;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_PLACEHOLDER_MONTH)
    @Nullable
    private String placeholderMonth;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_PLACEHOLDER_YEAR)
    @Nullable
    private String placeholderYear;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DATE_DISPLAY_FORMAT)
    @Nullable
    private String dateDisplayFormat;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_TITLE_DAY)
    @Nullable
    private String titleDay;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_TITLE_MONTH)
    @Nullable
    private String titleMonth;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_TITLE_YEAR)
    @Nullable
    private String titleYear;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_HIDE_TITLE_DATE)
    @Default(booleanValues = false)
    private boolean hideTitleDate;

    private Date exclusiveMinimumValue;
    private Date exclusiveMaximumValue;

    @PostConstruct
    private void initDateInputModel() {
        exclusiveMaximumValue = ComponentUtils.getExclusiveValue(exclusiveMaximum, maximumDate, excludeMaximum);
        exclusiveMinimumValue = ComponentUtils.getExclusiveValue(exclusiveMinimum, minimumDate, excludeMinimum);
        if (exclusiveMaximumValue != null) {
            maximumDate = null;
        }
        if (exclusiveMinimumValue != null) {
            minimumDate = null;
        }
    }

    /**
     * Intentionally shares the {@code date-input} field type with {@code DatePickerImpl}
     * (the calendar widget). The field type is the data contract — both produce a date
     * value — while the rendered widget differs. Consumers (rule engine, themes) treat
     * them uniformly and use the resource type ({@code :type}) as the discriminator.
     */
    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.DATE_INPUT);
    }

    @Override
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String getPlaceholderDay() {
        return placeholderDay;
    }

    @Override
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String getPlaceholderMonth() {
        return placeholderMonth;
    }

    @Override
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String getPlaceholderYear() {
        return placeholderYear;
    }

    @Override
    @JsonIgnore // widget render-time concern; not part of the (closed-enum) AF JSON model schema
    public String getDateDisplayFormat() {
        // Apply the default in the model (not just in HTL) so Java/HTL consumers always
        // get a usable picture clause instead of null.
        return dateDisplayFormat == null ? DEFAULT_DATE_DISPLAY_FORMAT : dateDisplayFormat;
    }

    @Override
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String getTitleDay() {
        return titleDay;
    }

    @Override
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String getTitleMonth() {
        return titleMonth;
    }

    @Override
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String getTitleYear() {
        return titleYear;
    }

    @Override
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    public boolean isHideTitleDate() {
        return hideTitleDate;
    }

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
        return ComponentUtils.clone(exclusiveMaximumValue);
    }

    @Override
    public Date getExclusiveMinimumDate() {
        return ComponentUtils.clone(exclusiveMinimumValue);
    }

    @Override
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
