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

import java.io.IOException;
import java.math.BigDecimal;
import java.util.AbstractMap;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Predicate;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.annotation.Nonnull;
import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.injectorspecific.*;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.aemds.guide.model.CustomPropertyInfo;
import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.cq.forms.core.components.datalayer.FormComponentData;
import com.adobe.cq.forms.core.components.internal.datalayer.ComponentDataImpl;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.internal.models.v1.form.SignerInfoImpl;
import com.adobe.cq.forms.core.components.models.form.BaseConstraint;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.FormComponent;
import com.adobe.cq.forms.core.components.models.form.Label;
import com.adobe.cq.wcm.core.components.models.Component;
import com.adobe.cq.wcm.core.components.util.ComponentUtils;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.WCMMode;
import com.day.cq.wcm.api.designer.Style;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

public class AbstractFormComponentImpl extends AbstractComponentImpl implements FormComponent {
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DATAREF)
    @Nullable
    protected String dataRef;

    // mandatory property else adapt should fail for adaptive form components
    @ValueMapValue(name = ReservedProperties.PN_FIELDTYPE)
    protected String fieldTypeJcr;
    private FieldType fieldType;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_NAME)
    @Nullable
    protected String name;

    @ValueMapValue(name = ReservedProperties.PN_VALUE)
    @Default(values = "")
    protected String value;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_VISIBLE)
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    protected Boolean visible;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_UNBOUND_FORM_ELEMENT)
    @Nullable
    protected Boolean unboundFormElement;

    @SlingObject
    private Resource resource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DOR_EXCLUSION)
    @Default(booleanValues = false)
    protected boolean dorExclusion;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DOR_COLSPAN)
    @Nullable
    protected String dorColspan;

    @ScriptVariable(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected Style currentStyle;

    @ChildResource(injectionStrategy = InjectionStrategy.OPTIONAL, name = "fd:signerInfo")
    private Resource signerInfoResource;

    /**
     * Returns dorBindRef of the form field
     *
     * @return dorBindRef of the field
     * @since com.adobe.cq.forms.core.components.util 4.0.0
     */
    @JsonIgnore
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DOR_BINDREF)
    @Nullable
    protected String dorBindRef;

    /**
     * Flag indicating if the data layer is enabled.
     */
    private Boolean dataLayerEnabled;

    /**
     * The data layer component data.
     */
    private FormComponentData componentData;

    private static final String STATUS_NONE = "none";
    private static final String STATUS_VALID = "valid";
    private static final String STATUS_INVALID = "invalid";

    private static final String RULES_STATUS_PROP_NAME = "validationStatus";

    private static final String NULL_DATA_REF = "null";

    private static final Logger logger = LoggerFactory.getLogger(AbstractFormComponentImpl.class);

    @PostConstruct
    protected void initBaseModel() {
        // first check if this is in the supported list of field type
        fieldType = FieldType.fromString(fieldTypeJcr);
        if (request != null && i18n == null) {
            i18n = GuideUtils.getI18n(request, resource);
        }
        if (Boolean.TRUE.equals(unboundFormElement)) {
            dataRef = NULL_DATA_REF;
        }
        getName();
    }

    public void setI18n(@Nonnull I18n i18n) {
        this.i18n = i18n;
    }

    public BaseConstraint.Type getType() {
        return null;
    }

    public Label getLabel() {
        return null;
    }

    public String getDescription() {
        return null;
    }

    public String getLinkUrl() {
        return null;
    }

    public String getTitle() {
        return null;
    }

    public String getText() {
        return null;
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
            // setting the default name if name is null.
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
    @Nullable
    public Boolean isVisible() {
        return visible == null || visible;
    }

    @JsonProperty("visible")
    public Boolean getVisibleIfPresent() {
        return visible;
    }

    // API kept for backward compatibility, this is not to be used anymore
    @JsonIgnore
    protected boolean getEditMode() {
        boolean editMode = false;
        if (request != null && request.getPathInfo() != null) {
            String pathInfo = request.getPathInfo();
            boolean matches = Pattern.matches(".+model.*\\.json$", pathInfo);
            // TODO: for some reason sling model wrapper request (through model.json) is giving incorrect wcmmode
            // we anyways dont need to rely on wcmmode while fetching form definition.
            if (!matches) {
                editMode = WCMMode.fromRequest(request) == WCMMode.EDIT || WCMMode.fromRequest(request) == WCMMode.DESIGN;
            }
        }
        return editMode;
    }

    @JsonIgnore
    public @NotNull Map<String, Object> getCustomLayoutProperties() {
        Map<String, Object> customLayoutProperties = new LinkedHashMap<>();
        return customLayoutProperties;
    }

    public static final String CUSTOM_DOR_PROPERTY_WRAPPER = "fd:dor";
    public static final String CUSTOM_SIGNER_PROPERTY_WRAPPER = "fd:signerInfo";
    // used for DOR and SPA editor to work
    public static final String CUSTOM_JCR_PATH_PROPERTY_WRAPPER = "fd:path";

    public static final String CUSTOM_RULE_PROPERTY_WRAPPER = "fd:rules";

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
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> properties = new LinkedHashMap<>();
        Map<String, Object> customProperties = getCustomProperties();
        if (customProperties.size() > 0) {
            customProperties.forEach(properties::putIfAbsent);
        }
        if (getCustomLayoutProperties().size() != 0) {
            properties.put(CUSTOM_PROPERTY_WRAPPER, getCustomLayoutProperties());
        }
        Map<String, Object> dorProperties = getDorProperties();
        if (dorProperties.size() > 0) {
            properties.put(CUSTOM_DOR_PROPERTY_WRAPPER, dorProperties);
        }
        properties.put(CUSTOM_JCR_PATH_PROPERTY_WRAPPER, getPath());
        Map<String, Object> rulesProperties = getRulesProperties();
        if (rulesProperties.size() > 0) {
            properties.put(CUSTOM_RULE_PROPERTY_WRAPPER, rulesProperties);
        }

        if (signerInfoResource != null) {
            properties.put("fd:signerInfo", SignerInfoImpl.getSignerDetails(signerInfoResource));
        }

        return properties;
    }

    @Override
    @NotNull
    public Map<String, String> getRules() {
        String[] VALID_RULES = new String[] { "description", "enabled", "enum", "enumNames",
            "exclusiveMaximum", "exclusiveMinimum", "label", "maximum", "minimum",
            "readOnly", "required", "value", "visible" };

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

    @JsonIgnore
    private Map<String, Object> getRulesProperties() {
        Resource ruleNode = resource.getChild(CUSTOM_RULE_PROPERTY_WRAPPER);
        Map<String, Object> customRulesProperties = new LinkedHashMap<>();
        String status = getRulesStatus(ruleNode);
        if (!STATUS_NONE.equals(status)) {
            customRulesProperties.put(RULES_STATUS_PROP_NAME, getRulesStatus(ruleNode));
        }
        return customRulesProperties;
    }

    /***
     * If atleast one rule is invalid then status of rule for component is considered as invalid
     *
     * @param rulesResource
     * @return
     */
    private String getRulesStatus(Resource rulesResource) {
        if (rulesResource == null) {
            return STATUS_NONE;
        }

        ValueMap props = rulesResource.adaptTo(ValueMap.class);
        if (props == null) {
            return STATUS_NONE;
        }

        String status = props.get("validationStatus", STATUS_NONE);
        if (!(STATUS_NONE.equals(status) || STATUS_VALID.equals(status) || STATUS_INVALID.equals(status))) {
            status = STATUS_INVALID;
        }
        return status;
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
        String[] VALID_EVENTS = new String[] { "click", "submit", "initialize", "load", "change", "submitSuccess", "submitError" };

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
        Set<Map.Entry<String, Object>> eventSet = new HashSet<>();
        eventSet.add(new AbstractMap.SimpleEntry<>("custom_setProperty", "$event.payload"));
        if (eventNode != null) {
            ValueMap eventNodeProps = eventNode.getValueMap();
            eventSet.addAll(eventNodeProps.entrySet());
        }
        Map<String, String[]> userEvents = eventSet.stream()
            .flatMap(this::sanitizeEvent)
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        return userEvents;
    }

    /**
     * Returns the reference to the data model
     *
     * @return reference to the data model
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @Override
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @JsonSerialize(using = DataRefSerializer.class)
    public String getDataRef() {
        return dataRef;
    }

    /**
     * Returns getPath of the form field
     *
     * @return getPath of the field
     * @since com.adobe.cq.forms.core.components.util 3.1.0
     */
    @Override
    @JsonIgnore
    public String getPath() {
        if (resource != null) {
            return resource.getPath();
        } else {
            return "";
        }
    }

    /**
     * Override this method to provide a different data model for your component. This will be called by
     * {@link AbstractComponentImpl#getData()} in case the datalayer is activated.
     *
     * @return The component data.
     */
    @NotNull
    protected FormComponentData getComponentData() {
        return new ComponentDataImpl(this, resource);
    }

    /**
     * See {@link Component#getData()}
     *
     * @return The component data
     */
    @Override
    @Nullable
    public FormComponentData getData() {
        if (componentData == null) {
            if (this.dataLayerEnabled == null) {
                if (this.getCurrentPage() != null) {
                    // Check at page level to allow components embedded via containers in editable templates to inherit the setting
                    this.dataLayerEnabled = com.adobe.cq.wcm.core.components.util.ComponentUtils.isDataLayerEnabled(this.getCurrentPage()
                        .getContentResource());
                } else {
                    this.dataLayerEnabled = ComponentUtils.isDataLayerEnabled(this.resource);
                }
            }
            if (this.dataLayerEnabled) {
                componentData = getComponentData();
            }
        }
        return componentData;
    }

    private static class DataRefSerializer extends JsonSerializer<String> {
        @Override
        public void serialize(String s, JsonGenerator jsonGenerator,
            SerializerProvider serializerProvider) throws IOException {
            if (NULL_DATA_REF.equals(s)) {
                jsonGenerator.writeString((String) null);
            } else {
                jsonGenerator.writeString(s);
            }
        }

        @Override
        public boolean isEmpty(SerializerProvider provider, String value) {
            return (StringUtils.isEmpty(value));
        }
    }

    private boolean isAllowedType(Object value) {
        return value instanceof String || value instanceof String[] || value instanceof Boolean || value instanceof Boolean[]
            || value instanceof Calendar || value instanceof Calendar[] || value instanceof BigDecimal
            || value instanceof BigDecimal[] || value instanceof Long || value instanceof Long[];
    }

    /**
     * Fetches all the custom properties associated with a given component's instance (including additional custom properties)
     *
     * @return {@code Map<String, String>} returns all custom property key value pairs associated with the resource
     */
    private Map<String, Object> getCustomProperties() {
        Map<String, Object> customProperties = new HashMap<>();
        Map<String, String> templateBasedCustomProperties;
        List<String> excludedPrefixes = Arrays.asList("fd:", "jcr:", "sling:");
        Set<String> reservedProperties = ReservedProperties.getReservedProperties();

        ValueMap resourceMap = resource.getValueMap();
        Map<String, Object> nodeBasedCustomProperties = resourceMap.entrySet()
            .stream()
            .filter(entry -> isAllowedType(entry.getValue())
                && !reservedProperties.contains(entry.getKey())
                && excludedPrefixes.stream().noneMatch(prefix -> entry.getKey().startsWith(prefix)))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        nodeBasedCustomProperties.forEach(customProperties::putIfAbsent);
        try {
            templateBasedCustomProperties = Optional.ofNullable(this.resource.adaptTo(CustomPropertyInfo.class))
                .map(CustomPropertyInfo::getProperties)
                .orElse(Collections.emptyMap());
        } catch (NoClassDefFoundError e) {
            logger.info("CustomPropertyInfo class not found. This feature is available in the latest Forms addon.");
            templateBasedCustomProperties = Collections.emptyMap();
        }
        if (!templateBasedCustomProperties.isEmpty()) {
            templateBasedCustomProperties.forEach(customProperties::putIfAbsent);
        }
        return customProperties;
    }

    @Override
    @JsonIgnore
    public Map<String, Object> getDorProperties() {
        Map<String, Object> customDorProperties = new LinkedHashMap<>();
        customDorProperties.put("dorExclusion", dorExclusion);
        if (dorColspan != null) {
            customDorProperties.put("dorColspan", dorColspan);
        }
        if (dorBindRef != null) {
            customDorProperties.put("dorBindRef", dorBindRef);
        }
        return customDorProperties;
    }

}
