/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2025 Adobe
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
package com.adobe.cq.forms.core.components.print.internal.models.v1.form;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.models.form.Caption;
import com.adobe.cq.forms.core.components.models.form.DorContainer;
import com.adobe.cq.forms.core.components.models.form.xfa.Assist;
import com.adobe.cq.forms.core.components.models.form.xfa.Bind;
import com.adobe.cq.forms.core.components.models.form.xfa.Border;
import com.adobe.cq.forms.core.components.models.form.xfa.BreakAfter;
import com.adobe.cq.forms.core.components.models.form.xfa.BreakBefore;
import com.adobe.cq.forms.core.components.models.form.xfa.Desc;
import com.adobe.cq.forms.core.components.models.form.xfa.Event;
import com.adobe.cq.forms.core.components.models.form.xfa.Font;
import com.adobe.cq.forms.core.components.models.form.xfa.Items;
import com.adobe.cq.forms.core.components.models.form.xfa.Keep;
import com.adobe.cq.forms.core.components.models.form.xfa.Margin;
import com.adobe.cq.forms.core.components.models.form.xfa.Para;
import com.adobe.cq.forms.core.components.models.form.xfa.Traversal;
import com.adobe.cq.forms.core.components.models.form.xfa.Ui;
import com.adobe.cq.forms.core.components.models.form.xfa.Value;
import com.adobe.cq.forms.core.components.models.form.xfa.Variables;
import com.adobe.cq.forms.core.components.models.form.xfa.XfaElementType;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.AssistImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.BindImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.BorderImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.BreakAfterImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.BreakBeforeImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.DescImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.EventImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.FontImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.ItemsImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.KeepImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.MarginImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.ParaImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.TraversalImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.UiImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.ValueImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa.VariablesImpl;
import com.adobe.cq.forms.core.components.util.AbstractComponentImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { DorContainer.class, ComponentExporter.class },
    resourceType = { DorContainerImpl.RESOURCE_TYPE })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class DorContainerImpl extends AbstractComponentImpl implements DorContainer {

    protected static final String RESOURCE_TYPE = "core/fd/components/form/dorContainer/v1/dorContainer";

    @SlingObject
    private Resource resource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "type")
    @Nullable
    protected String typeJcr;
    private XfaElementType type;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "name")
    @Nullable
    private String name;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "width")
    @Nullable
    private String width;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "height")
    @Nullable
    private String height;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "left")
    @Nullable
    private String left;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "top")
    @Nullable
    private String top;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "locale")
    @Nullable
    private String locale;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "access")
    @Nullable
    private String access;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "maxH")
    @Nullable
    private String maxH;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "minH")
    @Nullable
    private String minH;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "maxW")
    @Nullable
    private String maxW;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "minW")
    @Nullable
    private String minW;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "layout")
    @Nullable
    private String layout;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "presence")
    @Nullable
    private String presence;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "useHref")
    @Nullable
    private String useHref;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "stock")
    @Nullable
    private String stock;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "short")
    @Nullable
    private String shortValue;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "long")
    @Nullable
    private String longValue;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "margin")
    @Nullable
    private String marginJcr;
    private Margin margin;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "border")
    @Nullable
    private String borderJcr;
    private Border border;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "bind")
    @Nullable
    private String bindJcr;
    private Bind bind;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "value")
    @Nullable
    private String valueJcr;
    private Value value;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "para")
    @Nullable
    private String paraJcr;
    private Para para;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "font")
    @Nullable
    private String fontJcr;
    private Font font;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "items")
    @Nullable
    private String itemsJcr;
    private Items items;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "traversal")
    @Nullable
    private String traversalJcr;
    private Traversal traversal;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "events")
    @Nullable
    private String eventsJcr;
    private List<? extends Event> events;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "desc")
    @Nullable
    private String descJcr;
    private Desc desc;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "breakBefore")
    @Nullable
    private String breakBeforeJcr;
    private BreakBefore breakBefore;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "breakAfter")
    @Nullable
    private String breakAfterJcr;
    private BreakAfter breakAfter;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "keep")
    @Nullable
    private String keepJcr;
    private Keep keep;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "assist")
    @Nullable
    private String assistJcr;
    private Assist assist;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "ui")
    @Nullable
    private String uiJcr;
    private Ui ui;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "variables")
    @Nullable
    private String variablesJcr;
    private Variables variables;

    private Caption caption;

    @Override
    public String getType() {
        return this.type.getValue();
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getWidth() {
        return width;
    }

    @Override
    public String getHeight() {
        return height;
    }

    @Override
    public String getLeft() {
        return left;
    }

    @Override
    public String getTop() {
        return top;
    }

    @Override
    public String getLocale() {
        return locale;
    }

    @Override
    public String getAccess() {
        return access;
    }

    @Override
    public String getMaxH() {
        return maxH;
    }

    @Override
    public String getMinH() {
        return minH;
    }

    @Override
    public String getMaxW() {
        return maxW;
    }

    @Override
    public String getMinW() {
        return minW;
    }

    @Override
    public String getLayout() {
        return layout;
    }

    @Override
    public String getPresence() {
        return presence;
    }

    @Override
    public String getUseHref() {
        return useHref;
    }

    @Override
    public String getStock() {
        return this.stock;
    }

    @Override
    public String getShort() {
        return this.shortValue;
    }

    @Override
    public String getLong() {
        return this.longValue;
    }

    @Override
    public Margin getMargin() {
        return margin;
    }

    @Override
    public Border getBorder() {
        return border;
    }

    @Override
    public Bind getBind() {
        return bind;
    }

    @Override
    public Value getValue() {
        return value;
    }

    @Override
    public Para getPara() {
        return para;
    }

    @Override
    public Font getFont() {
        return font;
    }

    @Override
    public Ui getUi() {
        return ui;
    }

    @Override
    public Items getItems() {
        return items;
    }

    @Override
    public Traversal getTraversal() {
        return traversal;
    }

    @Override
    public List<? extends Event> getEvents() {
        return events;
    }

    @Override
    public Desc getDesc() {
        return desc;
    }

    @Override
    public BreakBefore getBreakBefore() {
        return breakBefore;
    }

    @Override
    public BreakAfter getBreakAfter() {
        return breakAfter;
    }

    @Override
    public Keep getKeep() {
        return keep;
    }

    @Override
    public Assist getAssist() {
        return assist;
    }

    @Override
    public Caption getCaption() {
        return caption;
    }

    @Override
    public Variables getVariables() {
        return variables;
    }

    @PostConstruct
    protected void init() {
        if (StringUtils.isNotEmpty(typeJcr)) {
            type = XfaElementType.fromString(typeJcr);
        }

        if (StringUtils.isNotBlank(marginJcr)) {
            margin = MarginImpl.fromString(marginJcr);
        }

        if (StringUtils.isNotBlank(borderJcr)) {
            border = BorderImpl.fromString(borderJcr);
        }

        if (StringUtils.isNotBlank(bindJcr)) {
            bind = BindImpl.fromString(bindJcr);
        }

        if (StringUtils.isNotBlank(paraJcr)) {
            para = ParaImpl.fromString(paraJcr);
        }

        if (StringUtils.isNotBlank(fontJcr)) {
            font = FontImpl.fromString(fontJcr);
        }
        if (StringUtils.isNotBlank(itemsJcr)) {
            items = ItemsImpl.fromString(itemsJcr);
        }
        if (StringUtils.isNotBlank(traversalJcr)) {
            traversal = TraversalImpl.fromString(traversalJcr);
        }
        if (StringUtils.isNotBlank(eventsJcr)) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                events = objectMapper.readValue(eventsJcr, new TypeReference<List<EventImpl>>() {});
            } catch (JsonProcessingException e) {}
        }
        if (StringUtils.isNotBlank(descJcr)) {
            desc = DescImpl.fromString(descJcr);
        }
        if (StringUtils.isNotBlank(breakBeforeJcr)) {
            breakBefore = BreakBeforeImpl.fromString(breakBeforeJcr);
        }
        if (StringUtils.isNotBlank(breakAfterJcr)) {
            breakAfter = BreakAfterImpl.fromString(breakAfterJcr);
        }
        if (StringUtils.isNotBlank(keepJcr)) {
            keep = KeepImpl.fromString(keepJcr);
        }
        if (StringUtils.isNotBlank(assistJcr)) {
            assist = AssistImpl.fromString(assistJcr);
        }
        if (StringUtils.isNotBlank(valueJcr)) {
            value = ValueImpl.fromString(valueJcr);
        }
        if (StringUtils.isNotBlank(uiJcr)) {
            ui = UiImpl.fromString(uiJcr);
        }

        if (StringUtils.isNotBlank(variablesJcr)) {
            variables = VariablesImpl.fromString(variablesJcr);
        }

        Resource captionResource = resource.getChild("fd:caption");
        this.caption = captionResource != null ? captionResource.adaptTo(Caption.class) : null;
    }

    @Override
    public @NotNull Map<String, ? extends ComponentExporter> getExportedItems() {
        List<Resource> filteredChildrenResources = new ArrayList<>();
        for (Resource child : resource.getChildren()) {
            if (!child.getName().startsWith("fd:")) {
                filteredChildrenResources.add(child);
            }
        }

        Map<String, ComponentExporter> models = new LinkedHashMap<>();
        for (Resource child : filteredChildrenResources) {
            ComponentExporter model = child.adaptTo(ComponentExporter.class);
            if (model != null) {
                models.put(child.getName(), model);
            }
        }
        return models;
    }

    @NotNull
    @Override
    public String[] getExportedItemsOrder() {
        Map<String, ? extends ComponentExporter> models = getExportedItems();
        String[] exportedItemsOrder = null;
        if (!models.isEmpty()) {
            exportedItemsOrder = models.keySet().toArray(ArrayUtils.EMPTY_STRING_ARRAY);
        } else {
            exportedItemsOrder = ArrayUtils.EMPTY_STRING_ARRAY;
        }
        return Arrays.copyOf(exportedItemsOrder, exportedItemsOrder.length);
    }
}
