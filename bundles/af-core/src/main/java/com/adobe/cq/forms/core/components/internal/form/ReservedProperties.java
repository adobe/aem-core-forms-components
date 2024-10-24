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
import java.util.HashSet;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.wcm.core.components.models.Component;
import com.adobe.cq.wcm.core.components.models.Title;

public final class ReservedProperties {
    private ReservedProperties() {
        // NOOP
    }

    private static final Logger logger = LoggerFactory.getLogger(ReservedProperties.class);

    public static final String PN_ID = Component.PN_ID;
    public static final String PN_VIEWTYPE = "fd:viewType";
    public static final String PN_FIELDTYPE = "fieldType";
    public static final String PN_DATAREF = "dataRef";
    public static final String PN_NAME = "name";
    public static final String PN_VALUE = "value";
    public static final String PN_ICON = "icon";
    public static final String PN_DATA = "data";
    public static final String PN_SIZE = "size";
    public static final String PN_VISIBLE = "visible";
    public static final String PN_UNBOUND_FORM_ELEMENT = "unboundFormElement";
    public static final String PN_DOR_EXCLUSION = "dorExclusion";
    public static final String PN_DOR_COLSPAN = "dorColspan";
    public static final String PN_DOR_BINDREF = "dorBindRef";
    public static final String PN_DOR_EXCLUDE_TITLE = "dorExcludeTitle";
    public static final String PN_DOR_EXCLUDE_DESC = "dorExcludeDescription";
    public static final String PN_DOR_NUM_COLS = "dorNumCols";
    public static final String PN_DOR_LAYOUT_TYPE = "dorLayoutType";
    public static final String PN_DESCRIPTION = "description";
    public static final String PN_TOOLTIP = "tooltip";
    public static final String PN_DOR_TEMPLATE_TYPE = "fd:formType";
    public static final String PN_TOOLTIP_VISIBLE = "tooltipVisible";
    public static final String PN_TYPE = "type";
    public static final String PN_DOR_TEMPLATE_REF = "dorTemplateRef";
    public static final String PN_DOR_TYPE = "dorType";
    public static final String PN_VALIDATION_EXPRESSION = "validationExpression";
    public static final String PN_REQUIRED = "required";
    public static final String PN_AUTOCOMPLETE = "autocomplete";
    public static final String PN_ASSIST_PRIORITY = "assistPriority";
    public static final String PN_CUSTOM = "custom";
    public static final String PN_ENABLED = "enabled";
    public static final String PN_REPEATABLE = "repeatable";
    public static final String PN_MIN_OCCUR = "minOccur";
    public static final String PN_MAX_OCCUR = "maxOccur";
    public static final String PN_MIN_ITEMS = "minItems";
    public static final String PN_MAX_ITEMS = "maxItems";
    public static final String PN_LANG = "lang";
    public static final String PN_LANG_DISPLAY_VALUE = "langDisplayValue";
    public static final String PN_PLACEHOLDER = "placeholder";
    public static final String PN_READ_ONLY = "readOnly";
    public static final String PN_DEFAULT_VALUE = "default";
    public static final String PN_MULTI_DEFAULT_VALUES = "multiDefaultValues";
    public static final String PN_FORMAT = "format";
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
    public static final String PN_EXCLUDE_MINIMUM = "excludeMinimum";
    public static final String PN_EXCLUDE_MAXIMUM = "excludeMaximum";
    public static final String PN_EXCLUDE_MINIMUM_CHECK = "excludeMinimumCheck";
    public static final String PN_EXCLUDE_MAXIMUM_CHECK = "excludeMaximumCheck";
    public static final String PN_ENFORCE_ENUM = "enforceEnum";
    public static final String PN_ENUM = "enum";
    public static final String PN_ENUM_NAMES = "enumNames";
    public static final String PN_TITLE = "title";
    public static final String PN_HIDE_TITLE = "hideTitle";
    public static final String PN_IS_TITLE_RICH_TEXT = "isTitleRichText";
    public static final String PN_ORIENTATION = "orientation";
    public static final String PN_TYPE_MESSAGE = "typeMessage";
    public static final String PN_REQUIRED_MESSAGE = "mandatoryMessage"; // reusing the same property name as in foundation
    public static final String PN_MINIMUM_MESSAGE = "minimumMessage";
    public static final String PN_MAXIMUM_MESSAGE = "maximumMessage";
    public static final String PN_MINLENGTH_MESSAGE = "minLengthMessage";
    public static final String PN_MAXLENGTH_MESSAGE = "maxLengthMessage";
    public static final String PN_MAX_FILE_SIZE_MESSAGE = "maxFileSizeMessage"; // for fileInput min, max number of files, maximum file size
                                                                                // and accept of file type messages
    public static final String PN_ACCEPT_MESSAGE = "acceptMessage";
    public static final String PN_STEP_MESSAGE = "stepMessage";
    public static final String PN_FORMAT_MESSAGE = "formatMessage";
    public static final String PN_PATTERN = "pattern";
    public static final String PN_PATTERN_MESSAGE = "validatePictureClauseMessage"; // reusing the same property name as in foundation
    public static final String PN_MINITEMS_MESSAGE = "minItemsMessage";
    public static final String PN_MAXITEMS_MESSAGE = "maxItemsMessage";
    public static final String PN_UNIQUE_ITEMS_MESSAGE = "uniqueItemsMessage";
    public static final String PN_ENFORCE_ENUM_MESSAGE = "enforceEnumMessage";
    public static final String PN_VALIDATION_EXPRESSION_MESSAGE = "validateExpMessage"; // reusing the same property name as in foundation
    public static final String PN_MULTISELECT = "multiSelect";
    public static final String PN_MULTISELECTION = "multiSelection";
    public static final String PN_ENABLE_UNCHECKED_VALUE = "enableUncheckedValue";
    public static final String PN_CHECKED_VALUE = "checkedValue";
    public static final String PN_UNCHECKED_VALUE = "uncheckedValue";
    public static final String PN_MAX_FILE_SIZE = "maxFileSize";
    public static final String PN_FILE_ACCEPT = "accept";
    public static final String PN_BUTTON_TEXT = "buttonText";
    public static final String PN_WRAP_DATA = "wrapData";
    public static final String PN_FRAGMENT_PATH = "fragmentPath";
    public static final String PN_BUTTON_TYPE = "buttonType";
    public static final String PN_THANK_YOU_MSG_V1 = "thankyouMessage";
    public static final String PN_THANK_YOU_MSG_V2 = "thankYouMessage";
    public static final String PN_THANK_YOU_OPTION = "thankYouOption";
    public static final String PN_RUNTIME_DOCUMENT_PATH = FormContainer.PN_RUNTIME_DOCUMENT_PATH;
    public static final String PN_CLOUD_SERVICE_PATH = "cloudServicePath";
    public static final String PN_RECAPTCHA_CLOUD_SERVICE_PATH = "rcCloudServicePath";
    public static final String PN_RECAPTCHA_SIZE = "recaptchaSize";
    public static final String PN_BREAK_BEFORE_TEXT = "breakBeforeText";
    public static final String PN_BREAK_AFTER_TEXT = "breakAfterText";
    public static final String PN_OVERFLOW_TEXT = "overflowText";
    public static final String PN_ALT_TEXT = "altText";
    public static final String PN_IMAGE_SRC = "imageSrc";
    public static final String PN_FILE_REF = "fileReference";
    public static final String PN_SHOW_APPROVAL_OPTION = "showApprovalOption";
    public static final String PN_SHOW_LINK = "showLink";
    public static final String PN_SHOW_AS_POPUP = "showAsPopup";
    public static final String PN_TEXT_IS_RICH = "textIsRich";
    public static final String PN_MULTILINE = "multiLine";
    public static final String PN_DESIGN_DEFAULT_TYPE = Title.PN_DESIGN_DEFAULT_TYPE;
    public static final String PN_TITLE_LINK_DISABLED = Title.PN_TITLE_LINK_DISABLED;
    public static final String PN_DRAG_DROP_TEXT = "dragDropText";
    public static final String PN_DRAG_DROP_TEXT_V3 = "fd:dragDropText";
    public static final String PN_CLIENTLIB_REF = "clientLibRef";
    public static final String PN_REDIRECT = "redirect";
    public static final String PN_PREFILL_SERVICE = "prefillService";
    public static final String PN_SPEC_VERSION = "specVersion";
    public static final String PN_RICH_TEXT = "richText";
    public static final String PN_OPTIONS_RICH_TEXT = "areOptionsRichText";
    public static final String PN_EXCLUDE_FROM_DOR = "excludeFromDor";
    public static final String PN_MANDATORY = "mandatory";
    public static final String PN_HTML_ELEMENT_TYPE_V2 = "fd:htmlelementType";
    public static final String FD_AUTO_SAVE_PROPERTY_WRAPPER = "fd:autoSave";
    public static final String FD_ENABLE_AUTO_SAVE = "fd:enableAutoSave";
    public static final String FD_AUTO_SAVE_STRATEGY_TYPE = "fd:autoSaveStrategyType";
    public static final String FD_AUTO_SAVE_INTERVAL = "fd:autoSaveInterval";
    private static final Set<String> reservedProperties = aggregateReservedProperties();

    private static Set<String> aggregateReservedProperties() {
        Set<String> reservedProperties = new HashSet<>();
        Field[] fields = ReservedProperties.class.getDeclaredFields();

        for (Field field : fields) {
            if (field.getType().equals(String.class)) {
                try {
                    reservedProperties.add((String) field.get(null));
                } catch (IllegalAccessException e) {
                    logger.error("[AF] Error while accessing field: {}", field.getName(), e);
                }
            }
        }

        return reservedProperties;
    }

    public static Set<String> getReservedProperties() {
        return reservedProperties;
    }
}
