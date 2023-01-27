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
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.models.form.AssistPriority;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.BaseConstraint;
import com.adobe.cq.forms.core.components.models.form.ConstraintType;
import com.adobe.cq.forms.core.components.models.form.Label;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Abstract class which can be used as base class for {@link Base} implementations.
 */
public abstract class AbstractBaseImpl extends AbstractFormComponentImpl implements Base, BaseConstraint {

    private static final String PN_DESCRIPTION = "description";

    private static final String PN_TOOLTIP = "tooltip";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String dorTemplateRef;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String dorType;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    @Named("fd:formtype")
    protected String dorTemplateType;

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
    protected Type type;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String validationExpression;

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

    @ValueMapValue
    @Default(booleanValues = true)
    protected boolean enabled;

    /** Adding in base since it can also be used for fields and panels **/
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    protected Boolean repeatable;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    protected Integer minOccur;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    protected Integer maxOccur;

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
        super.initBaseModel();
        assistPriority = AssistPriority.fromString(assistPriorityJcr);
        type = Type.fromString(typeJcr);
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

    @Override
    public @Nullable String getTooltip() {
        return translate(PN_TOOLTIP, tooltip);
    }

    @Override
    public boolean isTooltipVisible() {
        return tooltipVisible;
    }

    @JsonIgnore
    public @NotNull Map<String, Object> getCustomLayoutProperties() {
        Map<String, Object> customLayoutProperties = super.getCustomLayoutProperties();
        if (tooltip != null) {
            customLayoutProperties.put("tooltipVisible", tooltipVisible);
        }
        return customLayoutProperties;
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
     * Returns {@code true} if form field should be enabled, otherwise {@code false}.
     *
     * @return {@code true} if form field should be enabled, otherwise {@code false}
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    public boolean isEnabled() {
        if (getEditMode()) {
            return true;
        }
        return enabled;
    }

    /**
     * Returns the text contained in the short description rich text string.
     */
    @JsonIgnore
    public String getTooltipText() {
        String tooltip = getTooltip();
        if (StringUtils.isNotEmpty(tooltip)) {
            tooltip = tooltip.replaceAll("<\\/?[^>]+(>|$)|&nbsp;", "");
            return tooltip;
        }
        return "";
    }

    protected String getConstraintMessage(ConstraintType type) {
        String propName = type.getMessageProperty();
        ValueMap properties = resource.getValueMap();
        return translate(propName, properties.get(propName, String.class));
    }

    @Override
    public @NotNull Map<ConstraintType, String> getConstraintMessages() {
        if (constraintMessages == null) {
            constraintMessages = new LinkedHashMap<>();
            ConstraintMessages msgs = new ConstraintMessagesProvider();
            putConstraintMessage(ConstraintType.TYPE, msgs.getTypeConstraintMessage());
            putConstraintMessage(ConstraintType.REQUIRED, msgs.getRequiredConstraintMessage());
            Type type = this.getType();
            if (type != null) {
                if (type.equals(Type.STRING)) {
                    putConstraintMessage(ConstraintType.MIN_LENGTH, msgs.getMinLengthConstraintMessage());
                    putConstraintMessage(ConstraintType.MAX_LENGTH, msgs.getMaxLengthConstraintMessage());
                    putConstraintMessage(ConstraintType.PATTERN, msgs.getPatternConstraintMessage());
                    putConstraintMessage(ConstraintType.FORMAT, msgs.getFormatConstraintMessage());
                }

                if (type.equals(Type.NUMBER)) {
                    putConstraintMessage(ConstraintType.MINIMUM, msgs.getMinimumConstraintMessage());
                    putConstraintMessage(ConstraintType.MAXIMUM, msgs.getMaximumConstraintMessage());
                }
            }
            putConstraintMessage(ConstraintType.MAXFILE_SIZE, msgs.getMaxFileSizeConstraintMessage());
            putConstraintMessage(ConstraintType.ACCEPT, msgs.getAcceptConstraintMessage());

            // todo: add the following conditionally
            putConstraintMessage(ConstraintType.STEP, msgs.getStepConstraintMessage());
            putConstraintMessage(ConstraintType.MIN_ITEMS, msgs.getMinItemsConstraintMessage());
            putConstraintMessage(ConstraintType.MAX_ITEMS, msgs.getMaxItemsConstraintMessage());
            putConstraintMessage(ConstraintType.ENFORCE_ENUM, msgs.getEnforceEnumConstraintMessage());
            putConstraintMessage(ConstraintType.VALIDATION_EXPRESSION, msgs.getValidationExpressionConstraintMessage());
            putConstraintMessage(ConstraintType.UNIQUE_ITEMS, msgs.getUniqueItemsConstraintMessage());
        }
        return constraintMessages;
    }

    /**
     * Put non-blank named values in constraint messages map.
     */
    private void putConstraintMessage(ConstraintType name, String value) {
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

        String getMaxFileSizeConstraintMessage();

        String getAcceptConstraintMessage();

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
        // for fileInput min, max number of files, maximum file size and accept of file type messages
        private static final String PN_MAXFILESIZE_MESSAGE = "maxFileSizeMessage";
        private static final String PN_ACCEPT_MESSAGE = "acceptMessage";

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
        public String getMaxFileSizeConstraintMessage() {
            return translate(PN_MAXFILESIZE_MESSAGE, properties.get(PN_MAXFILESIZE_MESSAGE, String.class));
        }

        @Override
        @Nullable
        public String getAcceptConstraintMessage() {
            return translate(PN_ACCEPT_MESSAGE, properties.get(PN_ACCEPT_MESSAGE, String.class));
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
    public String getValidationExpression() {
        return validationExpression;
    }
}
