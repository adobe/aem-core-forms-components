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

import java.util.AbstractMap;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.annotation.Nonnull;
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
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.FormComponent;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.WCMMode;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class AbstractFormComponentImpl extends AbstractComponentImpl implements FormComponent {
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "dataRef")
    @Nullable
    protected String dataRef;

    // mandatory property else adapt should fail for adaptive form components
    @ValueMapValue(name = "fieldType")
    protected String fieldTypeJcr;
    private FieldType fieldType;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String name;

    @ValueMapValue
    @Default(values = "")
    protected String value;

    @ValueMapValue
    @Default(booleanValues = true)
    protected boolean visible;

    @SlingObject
    private Resource resource;

    protected I18n i18n = null;

    @PostConstruct
    protected void initBaseModel() {
        // first check if this is in the supported list of field type
        fieldType = FieldType.fromString(fieldTypeJcr);
        if (request != null && i18n == null) {
            i18n = GuideUtils.getI18n(request, resource);
        }
    }

    public void setI18n(@Nonnull I18n i18n) {
        this.i18n = i18n;
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

    @JsonIgnore
    public @NotNull Map<String, Object> getCustomProperties() {
        Map<String, Object> customProperties = new LinkedHashMap<>();
        return customProperties;
    }

    public static final String CUSTOM_DOR_PROPERTY_WRAPPER = "fd:dor";

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> customProperties = new LinkedHashMap<>();
        if (getDorProperties().size() > 0) {
            customProperties.put(CUSTOM_DOR_PROPERTY_WRAPPER, getDorProperties());
        }
        if (getCustomProperties().size() != 0) {
            customProperties.put(CUSTOM_PROPERTY_WRAPPER, getCustomProperties());
        }
        return customProperties;
    }

    /**
     * Predicate to check if a map entry is non empty
     * return true if and only if
     * 1) the value is not of type string and non empty or
     * 2) the value is of type string[] and has more than 1 elements
     */
    private final Predicate<Map.Entry<String, Object>> isEntryNonEmpty = obj -> (obj.getValue() instanceof String && ((String) obj
        .getValue()).length() > 0)
        || (obj.getValue() instanceof String[] && ((String[]) obj.getValue()).length > 0);

    @Override
    @NotNull
    public Map<String, String> getRules() {
        String[] VALID_RULES = new String[] { "visible", "value", "enabled", "label", "required" };

        Predicate<Map.Entry<String, Object>> isRuleNameValid = obj -> Arrays.stream(VALID_RULES).anyMatch(validKey -> validKey.equals(obj
            .getKey()));

        Predicate<Map.Entry<String, Object>> isRuleValid = isEntryNonEmpty.and(isRuleNameValid);

        Resource ruleNode = resource.getChild("fd:rules");
        if (ruleNode != null) {
            ValueMap ruleNodeProps = ruleNode.getValueMap();
            Map<String, String> rules = ruleNodeProps.entrySet()
                .stream()
                .filter(isRuleValid)
                .map(entry -> new AbstractMap.SimpleEntry<>(entry.getKey(), (String) entry.getValue()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            return rules;
        }
        return Collections.emptyMap();
    }

    /**
     * Sanitizes the event entry by
     * * removing invalid event names,
     * * removing events where the handler is not of type string or string[]
     * * converts all the event handlers into string[] for easy consumption
     * * updates custom event key (as we cannot save custom:eventName in JCR)
     *
     * @param entry the event entry to manipulate
     * @return the updated event entry
     */
    private Stream<Map.Entry<String, String[]>> sanitizeEvent(Map.Entry<String, Object> entry) {
        String[] VALID_EVENTS = new String[] { "click", "submit", "initialize", "load", "change" };

        Predicate<Map.Entry<String, Object>> isEventNameValid = obj -> obj.getKey().startsWith("custom_") ||
            Arrays.stream(VALID_EVENTS).anyMatch(validKey -> validKey.equals(obj.getKey()));
        Predicate<Map.Entry<String, Object>> isEventValid = isEntryNonEmpty.and(isEventNameValid);

        Stream<Map.Entry<String, String[]>> updatedEntry;
        Object eventValue = entry.getValue();
        String[] arrayEventValue;
        String key = entry.getKey();
        if (key.startsWith("custom_")) {
            key = "custom:" + key.substring("custom_".length());
        }
        if (!isEventValid.test(entry)) {
            updatedEntry = Stream.empty();
        } else {
            if (eventValue instanceof String) {
                arrayEventValue = new String[1];
                arrayEventValue[0] = (String) eventValue;
            } else {
                arrayEventValue = (String[]) eventValue;
            }
            updatedEntry = Stream.of(new AbstractMap.SimpleEntry<>(key, arrayEventValue));
        }
        return updatedEntry;
    }

    @Override
    @NotNull
    public Map<String, String[]> getEvents() {
        Resource eventNode = resource.getChild("fd:events");
        if (eventNode != null) {
            ValueMap eventNodeProps = eventNode.getValueMap();
            Map<String, String[]> events = eventNodeProps.entrySet()
                .stream()
                .flatMap(this::sanitizeEvent)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            return events;
        }
        return Collections.emptyMap();
    }

    @Nullable
    protected String translate(@NotNull String propertyName, @Nullable String propertyValue) {
        // if author mode return the property value
        boolean editMode = i18n == null;
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

}
