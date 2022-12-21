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

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Panel;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Panel.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_PANEL_CONTAINER_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PanelContainerImpl extends PanelImpl {

    private static String DOR_EXCLUDE_TITLE = "dorExcludeTitle";
    private static String DOR_EXCLUSION = "dorExclusion";
    private static String DOR_EXCLUDE_DESCRIPTION = "dorExcludeDescription";
    private static String BREAK_BEFORE_TEXT = "breakBeforeText";
    private static String BREAK_AFTER_TEXT = "breakAfterText";
    private static String OVERFLOW_TEXT = "overflowText";
    private static String DOR_NUM_COLS = "dorNumCols";
    private static String DOR_LAYOUT_TYPE = "dorLayoutType";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected boolean dorExcludeTitle;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected boolean dorExclusion;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected boolean dorExcludeDescription;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String breakBeforeText;
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String breakAfterText;
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String overflowText;
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String dorNumCols;
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String dorLayoutType;

    @Override
    @JsonIgnore
    @NotNull
    public Map<String, Object> getDorProperties() {
        Map<String, Object> customDorProperties = new LinkedHashMap<>();

        customDorProperties.put(DOR_EXCLUSION, dorExclusion);
        customDorProperties.put(DOR_EXCLUDE_TITLE, dorExcludeTitle);
        customDorProperties.put(DOR_EXCLUDE_DESCRIPTION, dorExcludeDescription);

        if (breakBeforeText != null) {
            customDorProperties.put(BREAK_BEFORE_TEXT, breakBeforeText);
        }
        if (breakAfterText != null) {
            customDorProperties.put(BREAK_AFTER_TEXT, breakAfterText);
        }
        if (overflowText != null) {
            customDorProperties.put(OVERFLOW_TEXT, overflowText);
        }
        if (dorNumCols != null) {
            customDorProperties.put(DOR_NUM_COLS, dorNumCols);
        }
        if (dorLayoutType != null) {
            customDorProperties.put(DOR_LAYOUT_TYPE, dorLayoutType);
        }
        return customDorProperties;
    }

}
