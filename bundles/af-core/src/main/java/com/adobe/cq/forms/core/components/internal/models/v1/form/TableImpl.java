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

import java.util.ArrayList;
import java.util.Collections;
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
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.Panel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Panel.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_TABLE_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TableImpl extends PanelImpl {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_COLUMN_WIDTH)
    @Nullable
    protected String columnWidth;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_ENABLE_SORTING)
    @Nullable
    protected Boolean enableSorting;

    /**
     * When {@code true}, runtime (publish) enables client-side column sorting.
     * Omitted from JSON when {@code false} (see {@link JsonInclude.Include#NON_DEFAULT}).
     */
    @JsonProperty("enableSorting")
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    public boolean isEnableSorting() {
        return Boolean.TRUE.equals(enableSorting);
    }

    /**
     * Returns the raw comma-separated column width string from JCR (e.g. "1,1,4").
     * Used in edit mode as the {@code data-column-widths} attribute.
     */
    @JsonIgnore
    public String getColumnWidth() {
        return columnWidth;
    }

    /**
     * True when {@link #getColumnWidthColStyles()} would return a non-empty list (valid authored widths).
     */
    @JsonIgnore
    public boolean isColumnWidthsConfigured() {
        return !getColumnWidthColStyles().isEmpty();
    }

    /**
     * One entry per column for {@code <col style="...">}: {@code width: N%} (no HTL string concatenation).
     * For example, proportional {@code "1,1,4"} becomes {@code width: 16%}, {@code width: 16%}, {@code width: 66%}.
     */
    @Override
    @NotNull
    public String getExportedType() {
        return ReservedProperties.VT_TABLE;
    }

    @Override
    @JsonIgnore
    @NotNull
    public Map<String, Object> getDorProperties() {
        Map<String, Object> props = new LinkedHashMap<>(super.getDorProperties());
        if (columnWidth != null && !columnWidth.isEmpty()) {
            // Pass authored proportional widths into fd:dor so DoRTableElement can compute
            // proportional XFA column widths (e.g. "1,2,1" → relative pixel widths).
            props.put(ReservedProperties.PN_DOR_COLUMN_WIDTHS, columnWidth);
        }
        return props;
    }

    @JsonIgnore
    public List<String> getColumnWidthColStyles() {
        if (columnWidth == null || columnWidth.isEmpty()) {
            return Collections.emptyList();
        }
        String[] parts = columnWidth.split(",");
        int[] values = new int[parts.length];
        int sum = 0;
        for (int i = 0; i < parts.length; i++) {
            try {
                values[i] = Integer.parseInt(parts[i].trim());
            } catch (NumberFormatException e) {
                values[i] = 1;
            }
            sum += values[i];
        }
        if (sum == 0) {
            return Collections.emptyList();
        }
        List<String> result = new ArrayList<>();
        for (int v : values) {
            int pct = (int) Math.floor((v * 100.0) / sum);
            result.add("width: " + pct + "%");
        }
        return result;
    }
}
