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
import java.util.stream.IntStream;

import javax.annotation.Nullable;
import javax.swing.*;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.models.form.TelephoneDropdown;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.fasterxml.jackson.annotation.JsonProperty;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { TelephoneDropdown.class, ComponentExporter.class },
    resourceType = "core/fd/components/form/telephonedropdown/v1/telephonedropdown")
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TelephoneDropdownImpl extends TextInputImpl implements TelephoneDropdown {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "pattern")
    @Nullable
    protected String pattern;
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    private boolean enforceEnum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "AllCountryCodes")
    @Default(booleanValues = true)
    private boolean countryCodes;
    private static final String PN_PLACEHOLDER_ = "placeholdercode";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_PLACEHOLDER_)
    @Nullable
    protected String placeholdercode;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "enum")
    @Nullable
    protected String[] enums; // todo: this needs to be thought through ?

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "enumNames")
    @Nullable
    protected String[] enumNames;

    public boolean isEnforceEnum() {
        return enforceEnum;
    }

    public boolean isChecked() {
        return countryCodes;
    }

    @Nullable
    @JsonProperty("placeholdercode")
    public String getPlaceHoldercode() {
        return placeholdercode;
    }

    private Map<Object, String> removeDuplicates() {

        Object[] enumArray = this.enums;
        String[] enumNamesArray = this.enumNames;

        LinkedHashMap<Object, String> map = new LinkedHashMap<>();

        if (enumArray != null && enumNamesArray != null && enumArray.length == enumNamesArray.length) {
            map = IntStream.range(0, enumArray.length).collect(LinkedHashMap::new, (m, i) -> m.put(enumArray[i], enumNamesArray[i]),
                LinkedHashMap::putAll);
        }

        return map;

    }

    public Object[] getEnums() {
        if (enums == null) {
            return null;
        } else {
            // todo: we can only typecast to number or boolean if type is present in JCR, for array types, we need to store the type of each
            // array element in JCR
            // todo: and compute based on it (hence using typeJcr below)
            // may expose internal representation of mutable object, hence cloning
            Map<Object, String> map = removeDuplicates();
            String[] enumValue = map.keySet().toArray(new String[0]);
            return ComponentUtils.coerce(type, enumValue);
        }
    }

    public String[] getEnumNames() {
        if (enumNames != null) {
            Map<Object, String> map = removeDuplicates();
            String[] enumName = map.values().toArray(new String[0]);
            return Arrays.stream(enumName)
                .map(p -> {
                    return this.translate("enumNames", p);
                })
                .toArray(String[]::new);
        }
        return null;
    }

    public Object[] getDefault() {
        Object[] typedDefaultValue = null;
        try {
            if (defaultValue != null) {
                typedDefaultValue = ComponentUtils.coerce(type, defaultValue);
            }
        } catch (Exception exception) {
            logger.error("Error while type casting default value to value type. Exception: ", exception);
        }
        return typedDefaultValue;
    }

    private Map<String, String> countryDropdown;
    private List<Map.Entry<String, String>> countryDropdownEntries;

    public void countryCode() {
        countryDropdown = new HashMap<>();
        // Add country codes here
        countryDropdown.put("EN", "+567");
        countryDropdown.put("VN", "+91");
        // Add more as needed

        // Convert the Map to a List of entries
        countryDropdownEntries = new ArrayList<>(countryDropdown.entrySet());
    }

    public List<Map.Entry<String, String>> getCountryDropdown() {
        countryCode();
        return countryDropdownEntries;
    }

    @Nullable
    public String getPattern() {
        return pattern;
    }

}
