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

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Panel;
import com.adobe.cq.forms.core.components.util.AbstractContainerImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Panel.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_PANEL_V1, FormConstants.RT_FD_FORM_ACCORDION_V1, FormConstants.RT_FD_FORM_TABS_ON_TOP_V1,
        FormConstants.RT_FD_FORM_WIZARD_V1, FormConstants.RT_FD_FORM_VERTICAL_TABS_V1 })

@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PanelImpl extends AbstractContainerImpl implements Panel {

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

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "wrapData")
    @JsonIgnore
    protected boolean wrapData;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected Boolean readOnly;

    @JsonIgnore
    @Override
    public Boolean isRequired() {
        return false; // overriding since base is defining isRequired, to avoid creating a new interface, added jsonIgnore here
    }

    @Override
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public Type getType() {
        if (wrapData || getDataRef() != null) {
            return Type.OBJECT;
        }
        return null;
    }

    @Override
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Nullable
    public Boolean isReadOnly() {
        return readOnly;
    }

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

    @JsonIgnore
    public boolean isTreeStyleTab() {
        // Determine if this panel is a tree-style vertical tab, incase of v3 that also needs to be added here
        return resource.isResourceType(FormConstants.RT_FD_FORM_VERTICAL_TABS_V2);
    }

    @JsonIgnore
    public boolean isParentnotTreeStyleTab() {
        // Ensure that resource.getParent() is not null
        Resource parentResource = resource.getParent();
        if (parentResource != null) {
            // Determine if this panel is a tree-style vertical tab
            return !parentResource.isResourceType(FormConstants.RT_FD_FORM_VERTICAL_TABS_V2);
        } else {
            // Handle the case where resource.getParent() is null
            return true;
        }
    }

    @JsonIgnore
    public List<ComponentExporter> getChildrenOfVerticalTab() {
        List<ComponentExporter> children = new ArrayList<>();
        collectChildrenOfVerticalTab(this, children);
        return children;
    }

    @JsonIgnore
    private void collectChildrenOfVerticalTab(ComponentExporter container, List<ComponentExporter> children) {
        if (container instanceof PanelImpl) {
            PanelImpl panel = (PanelImpl) container;
            if (panel.isTreeStyleTab()) {
                List<? extends ComponentExporter> tabChildren = panel.getItems();
                for (ComponentExporter child : tabChildren) {
                    children.add(child);
                }
            }
        }
    }

}
