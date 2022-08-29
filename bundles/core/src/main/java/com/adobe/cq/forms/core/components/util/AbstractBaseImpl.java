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
package com.adobe.cq.forms.core.components.util;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.BaseConstraint;
import com.adobe.cq.forms.core.components.models.form.Label;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.WCMMode;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Abstract class which can be used as base class for {@link Base} implementations.
 */
public abstract class AbstractBaseImpl extends AbstractComponentImpl implements Base, BaseConstraint {

    private I18n i18n = null;
    private static final String PN_DESCRIPTION = "description";
    private static final String PN_TOOLTIP = "tooltip";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_DESCRIPTION)
    @Nullable
    protected String description; // long description as per current spec

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_TOOLTIP)
    @Nullable
    protected String tooltip;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "tooltipVisible")
    @Default(booleanValues = false)
    protected boolean tooltipVisible;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "type") // needs to be implemented in dialog
    @Nullable
    protected String typeJcr; // todo: note this should never be array, we infer array types based on other metadata
    private Type type;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "dataRef")
    @Nullable
    protected String dataRef;

    // mandatory property else adapt should fail for adaptive form components
    @ValueMapValue(name = "fieldType")
    protected String fieldTypeJcr;
    private FieldType fieldType;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String format;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String validationExpression;

    // using old jcr property names to allow easy conversion from foundation to core components
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "required")
    @Default(booleanValues = false)
    protected boolean required;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "assistPriority")
    @Nullable
    protected String assistPriorityJcr;
    private AssistPriority assistPriority;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "custom")
    @Nullable
    protected String customAssistPriorityMsg;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String name;

    @ValueMapValue
    @Default(values = "")
    protected String value;

    @ValueMapValue
    @Default(booleanValues = true)
    protected boolean visible;

    @ValueMapValue
    @Default(booleanValues = true)
    protected boolean enabled;

    /** Adding in base since it can also be used for fields and panels **/
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    protected Integer minItems;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    protected Integer maxItems;

    /** End **/

    @SlingObject
    private Resource resource;

    /**
     * Holds the constraint messages
     */
    private Map<ConstraintType, String> constraintMessages = null;

    @PostConstruct
    protected void initBaseModel() {
        assistPriority = AssistPriority.fromString(assistPriorityJcr);
        type = Type.fromString(typeJcr);
        // first check if this is in the supported list of field type
        fieldType = FieldType.fromString(fieldTypeJcr);
        if (request != null) {
            i18n = GuideUtils.getI18n(request, resource);
        }
    }

    /**
     * Returns label of the form field
     *
     * @return label of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    public Label getLabel() {
        return new LabelImpl(resource, getName(), i18n);
    }

    /**
     * Returns the name of the form field
     *
     * @return name of the form field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    public String getName() {
        if (name == null) {
            name = getDefaultName();
        }
        return name;
    }

    protected String getDefaultName() {
        return StringEscapeUtils.escapeHtml4(GuideUtils.getGuideName(resource));
    }

    @Override
    public @Nullable String getTooltip() {
        return translate(PN_TOOLTIP, tooltip);
    }

    @Override
    public boolean isTooltipVisible() {
        return tooltipVisible;
    }

    @JsonIgnore
    public @NotNull Map<String, Object> getCustomProperties() {
        Map<String, Object> customProperties = new LinkedHashMap<>();
        if (tooltip != null) {
            customProperties.put("tooltipVisible", tooltipVisible);
        }
        return customProperties;
    }

    /**
     * Returns the reference to the data model
     *
     * @return reference to the data model
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    @Nullable
    public String getDataRef() {
        return dataRef;
    }

    @Override
    @Nullable
    public String getScreenReaderText() {
        // needs to be represented as json formula since labels, name, description can be dynamic, and hence
        // screen reader text can be dynamic
        String screenReaderText = null; // only if assist priority is set in JCR, we return screenReaderText to the client
        if (AssistPriority.LABEL.equals(assistPriority)) {
            Label label = getLabel();
            if (label != null) {
                screenReaderText = "$label.$value";
            }
        } else if (AssistPriority.NAME.equals(assistPriority)) {
            screenReaderText = "$name";
        } else if (AssistPriority.DESCRIPTION.equals(assistPriority)) {
            screenReaderText = "$description";
        } else if (AssistPriority.CUSTOM.equals(assistPriority)) {
            screenReaderText = "'" + customAssistPriorityMsg + "'"; // json formula string literal
        }
        return screenReaderText;
    }

    @Override
    @Nullable
    public String getHtmlScreenReaderText() {
        // this can be used in sightly to compute initial html
        String screenReaderText = getName();
        if (AssistPriority.LABEL.equals(assistPriority)) {
            Label label = getLabel();
            if (label != null) {
                screenReaderText = label.getValue();
            }
        } else if (AssistPriority.NAME.equals(assistPriority)) {
            screenReaderText = getName();
        } else if (AssistPriority.DESCRIPTION.equals(assistPriority)) {
            screenReaderText = getDescription();
        } else if (AssistPriority.CUSTOM.equals(assistPriority)) {
            screenReaderText = customAssistPriorityMsg;
        }
        return screenReaderText;
    }

    /**
     * Returns the description of the field
     *
     * @return the description of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    @Nullable
    public String getDescription() {
        return translate(PN_DESCRIPTION, description);
    }

    /**
     * Returns the view type
     *
     * @return the view type
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    public String getFieldType() {
        return fieldType.getValue();
    }

    /**
     * Returns {@code true} if form field should be visible, otherwise {@code false}.
     *
     * @return {@code true} if form field should be visible, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    public boolean isVisible() {
        return visible;
    }

    /**
     * Returns {@code true} if form field should be enabled, otherwise {@code false}.
     *
     * @return {@code true} if form field should be enabled, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public @NotNull Map<ConstraintType, String> getConstraintMessages() {
        if (constraintMessages == null) {
            constraintMessages = new LinkedHashMap<>();
            ConstraintMessages msgs = new ConstraintMessagesProvider();
            put(ConstraintType.TYPE, msgs.getTypeConstraintMessage());
            put(ConstraintType.REQUIRED, msgs.getRequiredConstraintMessage());
            if (this.getType().equals(Type.STRING)) {
                put(ConstraintType.MIN_LENGTH, msgs.getMinLengthConstraintMessage());
                put(ConstraintType.MAX_LENGTH, msgs.getMaxLengthConstraintMessage());
                put(ConstraintType.PATTERN, msgs.getPatternConstraintMessage());
                put(ConstraintType.FORMAT, msgs.getFormatConstraintMessage());
                String format = this.getFormat();
                if (format != null && format.equals(Format.DATE.toString())) {
                    put(ConstraintType.MINIMUM, msgs.getMinimumConstraintMessage());
                    put(ConstraintType.MAXIMUM, msgs.getMaximumConstraintMessage());
                }
            }

            if (this.getType().equals(Type.NUMBER)) {
                put(ConstraintType.MINIMUM, msgs.getMinimumConstraintMessage());
                put(ConstraintType.MAXIMUM, msgs.getMaximumConstraintMessage());
            }

            // todo: add the following conditionally
            put(ConstraintType.STEP, msgs.getStepConstraintMessage());
            put(ConstraintType.MIN_ITEMS, msgs.getMinItemsConstraintMessage());
            put(ConstraintType.MAX_ITEMS, msgs.getMaxItemsConstraintMessage());
            put(ConstraintType.ENFORCE_ENUM, msgs.getEnforceEnumConstraintMessage());
            put(ConstraintType.VALIDATION_EXPRESSION, msgs.getValidationExpressionConstraintMessage());
            put(ConstraintType.UNIQUE_ITEMS, msgs.getUniqueItemsConstraintMessage());
        }
        return constraintMessages;
    }

    /**
     * Put non-blank named values in constraint messages map.
     */
    private void put(ConstraintType name, String value) {
        if (StringUtils.isNotBlank(value)) {
            constraintMessages.put(name, value);
        }
    }

    /**
     * Provides constraint messages configured for a form field
     */
    private interface ConstraintMessages {

        String getTypeConstraintMessage();

        String getRequiredConstraintMessage();

        String getMinimumConstraintMessage();

        String getMaximumConstraintMessage();

        String getMinLengthConstraintMessage();

        String getMaxLengthConstraintMessage();

        String getStepConstraintMessage();

        String getFormatConstraintMessage();

        String getPatternConstraintMessage();

        String getMinItemsConstraintMessage();

        String getMaxItemsConstraintMessage();

        String getUniqueItemsConstraintMessage();

        String getEnforceEnumConstraintMessage();

        String getValidationExpressionConstraintMessage();
    }

    private class ConstraintMessagesProvider implements ConstraintMessages {

        private static final String PN_TYPE_MESSAGE = "typeMessage";
        private static final String PN_REQUIRED_MESSAGE = "mandatoryMessage"; // reusing the same property name as in foundation
        private static final String PN_MINIMUM_MESSAGE = "minimumMessage";
        private static final String PN_MAXIMUM_MESSAGE = "maximumMessage";
        private static final String PN_MINLENGTH_MESSAGE = "minLengthMessage";
        private static final String PN_MAXLENGTH_MESSAGE = "maxLengthMessage";
        private static final String PN_STEP_MESSAGE = "stepMessage";
        private static final String PN_FORMAT_MESSAGE = "formatMessage";
        private static final String PN_PATTERN_MESSAGE = "validatePictureClauseMessage"; // reusing the same property name as in foundation
        private static final String PN_MINITEMS_MESSAGE = "minItemsMessage";
        private static final String PN_MAXITEMS_MESSAGE = "maxItemsMessage";
        private static final String PN_UNIQUEITEMS_MESSAGE = "uniqueItemsMessage";
        private static final String PN_ENFORCEENUM_MESSAGE = "enforceEnumMessage";
        private static final String PN_VALIDATIONEXPRESSION_MESSAGE = "validateExpMessage"; // reusing the same property name as in
                                                                                            // foundation

        private ValueMap properties = resource.getValueMap();

        @Override
        @Nullable
        public String getTypeConstraintMessage() {
            return translate(PN_TYPE_MESSAGE, properties.get(PN_TYPE_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getRequiredConstraintMessage() {
            return translate(PN_REQUIRED_MESSAGE, properties.get(PN_REQUIRED_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getMinimumConstraintMessage() {
            return translate(PN_MINIMUM_MESSAGE, properties.get(PN_MINIMUM_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getMaximumConstraintMessage() {
            return translate(PN_MAXIMUM_MESSAGE, properties.get(PN_MAXIMUM_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getMinLengthConstraintMessage() {
            return translate(PN_MINLENGTH_MESSAGE, properties.get(PN_MINLENGTH_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getMaxLengthConstraintMessage() {
            return translate(PN_MAXLENGTH_MESSAGE, properties.get(PN_MAXLENGTH_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getStepConstraintMessage() {
            return translate(PN_STEP_MESSAGE, properties.get(PN_STEP_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getFormatConstraintMessage() {
            return translate(PN_FORMAT_MESSAGE, properties.get(PN_FORMAT_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getPatternConstraintMessage() {
            return translate(PN_PATTERN_MESSAGE, properties.get(PN_PATTERN_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getMinItemsConstraintMessage() {
            return translate(PN_MINITEMS_MESSAGE, properties.get(PN_MINITEMS_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getMaxItemsConstraintMessage() {
            return translate(PN_MAXITEMS_MESSAGE, properties.get(PN_MAXITEMS_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getUniqueItemsConstraintMessage() {
            return translate(PN_UNIQUEITEMS_MESSAGE, properties.get(PN_UNIQUEITEMS_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getEnforceEnumConstraintMessage() {
            return translate(PN_ENFORCEENUM_MESSAGE, properties.get(PN_ENFORCEENUM_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getValidationExpressionConstraintMessage() {
            return translate(PN_VALIDATIONEXPRESSION_MESSAGE, properties.get(PN_VALIDATIONEXPRESSION_MESSAGE, String.class));
        }
    }

    @Override
    public @NotNull String getExportedType() {
        return resource.getResourceType();
    }

    @Override
    public Type getType() {
        return type;
    }

    @Override
    @Nullable
    public String getFormat() {
        return format;
    }

    @Override
    @Nullable
    public String getValidationExpression() {
        return validationExpression;
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> customProperties = new LinkedHashMap<>();
        if (getCustomProperties().size() != 0) {
            customProperties.put(CUSTOM_PROPERTY_WRAPPER, getCustomProperties());
        }
        return customProperties;
    }

    @Nullable
    protected String translate(@NotNull String propertyName, @Nullable String propertyValue) {
        // if author mode return the property value
        boolean editMode = true;
        if (request != null) {
            editMode = WCMMode.fromRequest(request) == WCMMode.EDIT || WCMMode.fromRequest(request) == WCMMode.DESIGN;
        }
        if (editMode) {
            return propertyValue;
        }
        if (StringUtils.isBlank(propertyValue)) {
            return null;
        }
        return ComponentUtils.translate(propertyValue, propertyName, resource, i18n);
    }
}
