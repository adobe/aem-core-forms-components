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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;
import java.util.UUID;

import javax.annotation.Nullable;
import javax.inject.Named;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Datepicker;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { Datepicker.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_DATE_PICKER_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class DatepickerImpl extends AbstractFieldImpl implements Datepicker {

    @ScriptVariable
    private ValueMap properties;

    @Self
    private SlingHttpServletRequest request;


    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Named("exclusiveMaximum")
    protected Boolean isMaxDateExcluded;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Named("exclusiveMinimum")
    protected Boolean isMinDateExcluded;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Named("maximum")
    protected String maxDateInString;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Named("minimum")
    protected String minDateInString;

    @Override
    @Nullable
    @JsonProperty(value = "maximum")
    public String getMaxDate() {
        return this.maxDateInString;
    }

    @Override
    @Nullable
    @JsonProperty(value = "minimum")
    public String getMinDate() {
        return this.minDateInString;
    }

    @Override
    public String getId() {
        return request.getResource().getPath();
    }

    public String getFormat() {
        return "date";
    }

    /**
     * Utility function to convert string value to date.
     * 
     * @param dateInString
     *            value of date in String.
     * @return date string converted to date format.
     */
    private Date convertStringToDate(String dateInString) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date;
        try {
            date = formatter.parse(dateInString);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        return date;
    }

    /**
     * Utility function to convert date to string.
     * 
     * @param date
     *            value of date in date format.
     * @return dateInString date converted to string
     */
    private String convertDateToString(Date date) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String dateInString;
        dateInString = formatter.format(date);
        return dateInString;
    }

    /**
     * Utility function to add or subtract days in date.
     * 
     * @param date
     *            the base date to which days are to be added.
     * @param days
     *            number of days to be added or substracted from date.
     * @return newDate which is computed after adding/substracting given days.
     */
    private Date addDaysToDate(Date date, int days) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, days);
        return cal.getTime();
    }

    @Override
    protected FieldType getDefaultFieldType() {
        return FieldType.DATE_INPUT;
    }

    @Override
    protected Type getDefaultType() {
        return Type.STRING;
    }

    @Override
    public String getFormContainer() {
        Resource parent = request.getResource().getParent();
        if (parent != null) {
            return parent.getPath();
        }
        return null;
    }


}
