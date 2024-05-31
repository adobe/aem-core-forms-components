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
package com.adobe.cq.forms.core.components.internal.form;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class FormWhitelist {
    private FormWhitelist() {
        // NOOP
    }

    private static final Logger logger = LoggerFactory.getLogger(FormWhitelist.class);

    public static final String PN_VIEWTYPE = "fd:viewType";
    public static final String PN_FIELDTYPE = "fieldType";
    public static final String PN_DATAREF = "dataRef";
    public static final String PN_NAME = "name";
    public static final String PN_VALUE = "value";
    public static final String PN_VISIBLE = "visible";
    public static final String PN_UNBOUND_FORM_ELEMENT = "unboundFormElement";
    public static final String PN_DOR_EXCLUSION = "dorExclusion";
    public static final String PN_DOR_COLSPAN = "dorColspan";
    public static final String PN_DOR_BINDREF = "dorBindRef";
    public static final String PN_DESCRIPTION = "description";
    public static final String PN_TOOLTIP = "tooltip";
    public static final String PN_DOR_TEMPLATE_TYPE = "fd:formtype";
    public static final String PN_TOOLTIP_VISIBLE = "tooltipVisible";
    public static final String PN_TYPE = "type";
    public static final String PN_DOR_TEMPLATE_REF = "dorTemplateRef";
    public static final String PN_DOR_TYPE = "dorType";
    public static final String PN_VALIDATION_EXPRESSION = "validationExpression";
    public static final String PN_REQUIRED = "required";
    public static final String PN_ASSIST_PRIORITY = "assistPriority";
    public static final String PN_CUSTOM_ASSIST_PRIORITY = "custom";
    public static final String PN_ENABLED = "enabled";
    public static final String PN_REPEATABLE = "repeatable";
    public static final String PN_MIN_OCCUR = "minOccur";
    public static final String PN_MAX_OCCUR = "maxOccur";
    public static final String PN_MIN_ITEMS = "minItems";
    public static final String PN_MAX_ITEMS = "maxItems";
    public static final String PN_LANG = "lang";
    public static final String PN_PLACEHOLDER = "placeholder";
    public static final String PN_READ_ONLY = "readOnly";
    public static final String PN_DEFAULT_VALUE = "default";
    public static final String PN_DISPLAY_FORMAT = "displayFormat";
    public static final String PN_EDIT_FORMAT = "editFormat";
    public static final String PN_DISPLAY_VALUE_EXPRESSION = "displayValueExpression";
    public static final String PN_DATA_FORMAT = "dataFormat";
    public static final String PN_MIN_LENGTH = "minLength";
    public static final String PN_MAX_LENGTH = "maxLength";
    public static final String PN_MINIMUM_DATE = "minimumDate";
    public static final String PN_MAXIMUM_DATE = "maximumDate";
    public static final String PN_MAXIMUM = "maximum";
    public static final String PN_MINIMUM = "minimum";
    public static final String PN_EXCLUSIVE_MINIMUM = "exclusiveMinimum";
    public static final String PN_EXCLUSIVE_MAXIMUM = "exclusiveMaximum";
    public static final String PN_ENFORCE_ENUM = "enforceEnum";
    public static final String PN_ENUM = "enum";
    public static final String PN_ENUM_NAMES = "enumNames";

    public static List<String> getNodeProperties() {
        List<String> nodeProperties = new ArrayList<>();
        Field[] fields = FormWhitelist.class.getDeclaredFields();

        for (Field field : fields) {
            if (field.getType().equals(String.class)) {
                try {
                    nodeProperties.add((String) field.get(null));
                } catch (IllegalAccessException e) {
                    logger.error("Error while accessing field: {}", field.getName(), e);
                }
            }
        }

        return nodeProperties;
    }
}
