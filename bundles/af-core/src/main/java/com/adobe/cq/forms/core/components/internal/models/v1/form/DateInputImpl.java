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

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.*;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.ConstraintType;
import com.adobe.cq.forms.core.components.models.form.DateInput;
import com.adobe.cq.forms.core.components.models.form.DatePlaceholderFields;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;

@Model(
    adaptables = { SlingHttpServletRequest.class,
        Resource.class },
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
    adapters = { DateInput.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_DATE_INPUT_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class DateInputImpl extends AbstractFieldImpl implements DateInput {

    private static final String MONTH = "Month";
    private static final String YEAR = "Year";
    private static final String DAY = "Day";

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
        return null;
    }

    @Override
    public Date getExclusiveMinimumDate() {
        return null;
    }

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "false")
    protected String hideDateLabel;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "default")
    protected Object[] defaultVal;

    @ChildResource
    @Via("resource")
    protected List<DatePlaceholderFields> datePlaceholder;

    public List<DatePlaceholderFields> getDateFormat() {
        return datePlaceholder;
    }

    public String getHideDateLabel() {
        return hideDateLabel;
    }

    @Override
    public HashMap<String, List<String>> getCombinedPlaceholder() {
        LinkedHashMap<String, List<String>> combinedPlaceholder;
        combinedPlaceholder = new LinkedHashMap<>();
        String[] dateArray = getDateArray();
        if (datePlaceholder != null && datePlaceholder.size() > 0) {
            for (DatePlaceholderFields placeholder : datePlaceholder) {
                getDatePlaceholder(placeholder, dateArray, combinedPlaceholder);
            }
        } else {
            addKeyValuePair(combinedPlaceholder, YEAR, YEAR, "YYYY", dateArray[0]);
            addKeyValuePair(combinedPlaceholder, MONTH, MONTH, "MM", dateArray[1]);
            addKeyValuePair(combinedPlaceholder, DAY, DAY, "DD", dateArray[2]);
        }
        return combinedPlaceholder;
    }

    private static void addKeyValuePair(Map<String, List<String>> map, String key, String value1, String value2,
        String value3) {
        List<String> values = new ArrayList<>();
        values.add(value1);
        values.add(value2);
        values.add(value3);
        map.put(key, values);
    }

    private String[] getDateArray() {
        String[] dateArray;
        dateArray = getDefaultValArr();
        return dateArray;
    }

    private void getDatePlaceholder(DatePlaceholderFields placeholder, String[] dateArray,
        LinkedHashMap<String, List<String>> combinedPlaceholder) {
        DatePlaceholderFields placeholderVar = placeholder;
        String[] dateArrayVar = dateArray;
        if (placeholderVar.getHiddenfield().equals(YEAR)) {
            addKeyValuePair(combinedPlaceholder, YEAR,
                placeholderVar.getTitle() != null ? placeholderVar.getTitle() : YEAR,
                placeholderVar.getPlaceholder() != null ? placeholderVar.getPlaceholder() : "YYYY",
                dateArrayVar[0]);

        } else if (placeholderVar.getHiddenfield().equals(MONTH)) {
            addKeyValuePair(combinedPlaceholder, MONTH,
                placeholderVar.getTitle() != null ? placeholderVar.getTitle() : MONTH,
                placeholderVar.getPlaceholder() != null ? placeholderVar.getPlaceholder() : "MM", dateArrayVar[1]);

        } else {
            addKeyValuePair(combinedPlaceholder, DAY,
                placeholderVar.getTitle() != null ? placeholderVar.getTitle() : DAY,
                placeholderVar.getPlaceholder() != null ? placeholderVar.getPlaceholder() : "DD", dateArrayVar[2]);

        }

    }

    private String[] getDefaultValArr() {
        String[] dates = { "", "", "" };
        if (defaultVal != null) {
            String defaultDate = Arrays.toString(defaultVal);
            String[] dateArray = defaultDate.substring(1, defaultDate.length() - 1).split("-");
            return dateArray;
        } else {
            return dates;
        }
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

    @Override
    public Object[] getDefault() {
        if (defaultVal != null) {
            return Arrays.stream(defaultVal)
                .map(p -> {
                    if (p instanceof Calendar) {
                        return ((Calendar) p).getTime();
                    } else {
                        return p;
                    }
                })
                .toArray();
        } else {
            return null;
        }

    }
}
