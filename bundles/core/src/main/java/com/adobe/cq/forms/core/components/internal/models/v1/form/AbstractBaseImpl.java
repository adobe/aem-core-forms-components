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

import java.util.LinkedHashMap;
import java.util.Map;

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
import com.day.cq.commons.jcr.JcrConstants;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Abstract class which can be used as base class for {@link Base} implementations.
 */
public abstract class AbstractBaseImpl extends AbstractBaseConstraintImpl implements Base, BaseConstraint {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = JcrConstants.JCR_DESCRIPTION)
    @Nullable
    protected String description;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "bindRef")
    @Nullable
    protected String dataRef;

    /**
     * Defines the assist priority type. Possible values: {@code custom}, {@code description}, {@code label}, {@code name}
     * 
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    private enum AssistPriority {
        CUSTOM("custom"),
        DESCRIPTION("description"),
        LABEL("label"),
        NAME("name");

        private String value;

        AssistPriority(String value) {
            this.value = value;
        }

        /**
         * Given a {@link String} <code>value</code>, this method returns the enum's value that corresponds to the provided string
         * representation
         *
         * @param value the string representation for which an enum value should be returned
         * @return the corresponding enum value, if one was found
         * @since com.adobe.cq.wcm.core.components.models.form 13.0.0
         */
        public static AssistPriority fromString(String value) {
            for (AssistPriority type : AssistPriority.values()) {
                if (StringUtils.equals(value, type.value)) {
                    return type;
                }
            }
            return null;
        }

        /**
         * Returns the string value of this enum constant.
         *
         * @return the string value of this enum constant
         * @since com.adobe.cq.wcm.core.components.models.form 13.0.0
         */
        public String getValue() {
            return value;
        }

        @Override
        @JsonValue
        public String toString() {
            return value;
        }
    }

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "assistPriority")
    @Nullable
    protected AssistPriority assistPriority;

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

    @SlingObject
    private Resource resource;

    /**
     * Holds the constraint messages
     */
    private Map<ConstraintType, String> constraintMessages = null;

    @JsonIgnore
    protected abstract ViewType getDefaultViewType();

    /**
     * Returns label of the form field
     *
     * @return label of the field
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    public Label getLabel() {
        return new LabelImpl(resource, getName());
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
        String screenReaderText = getName();
        if (AssistPriority.LABEL.equals(assistPriority)) {
            screenReaderText = getLabel().getValue();
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
        return description;
    }

    /**
     * Returns the view type
     *
     * @return the view type
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    public String getViewType() {
        return getDefaultViewType().getValue();
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
    public @NotNull Map<ConstraintType, String> getConstraintsMessages() {
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
            return properties.get(PN_TYPE_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getRequiredConstraintMessage() {
            return properties.get(PN_REQUIRED_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getMinimumConstraintMessage() {
            return properties.get(PN_MINIMUM_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getMaximumConstraintMessage() {
            return properties.get(PN_MAXIMUM_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getMinLengthConstraintMessage() {
            return properties.get(PN_MINLENGTH_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getMaxLengthConstraintMessage() {
            return properties.get(PN_MAXLENGTH_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getStepConstraintMessage() {
            return properties.get(PN_STEP_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getFormatConstraintMessage() {
            return properties.get(PN_FORMAT_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getPatternConstraintMessage() {
            return properties.get(PN_PATTERN_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getMinItemsConstraintMessage() {
            return properties.get(PN_MINITEMS_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getMaxItemsConstraintMessage() {
            return properties.get(PN_MAXITEMS_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getUniqueItemsConstraintMessage() {
            return properties.get(PN_UNIQUEITEMS_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getEnforceEnumConstraintMessage() {
            return properties.get(PN_ENFORCEENUM_MESSAGE, String.class);
        }

        @Override
        @Nullable
        public String getValidationExpressionConstraintMessage() {
            return properties.get(PN_VALIDATIONEXPRESSION_MESSAGE, String.class);
        }
    }

    @Override
    public @NotNull String getExportedType() {
        return resource.getResourceType();
    }
}
