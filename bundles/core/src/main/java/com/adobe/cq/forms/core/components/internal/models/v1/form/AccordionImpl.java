/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2019 Adobe
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

import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ContainerExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Accordion;

/**
 * V1 Accordion model implementation.
 */
@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Accordion.class, ComponentExporter.class, ContainerExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_ACCORDION_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class AccordionImpl extends PanelImpl implements Accordion {

    /**
     * Flag indicating if single expansion is enabled.
     */
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private boolean singleExpansion;

    /**
     * Array of expanded items.
     */
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String[] expandedItems;

    /**
     * The heading element.
     */
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String headingElement;

    /**
     * The cached node names of the expanded items for which there is a valid matching child resource.
     */
    private String[] expandedItemNames;
    //
    // /**
    // * The cached model IDs of the expanded items for which there is a valid matching child resource.
    // */
    // private String[] expandedItemIds;

    @Override
    public String getFieldType() {
        return FieldType.ACCORDION.getValue();
    }

    public enum Heading {

        H1("h1"),
        H2("h2"),
        H3("h3"),
        H4("h4"),
        H5("h5"),
        H6("h6");

        private String element;

        Heading(String element) {
            this.element = element;
        }

        public static Heading getHeading(String value) {
            for (Heading heading : values()) {
                if (StringUtils.equalsIgnoreCase(heading.element, value)) {
                    return heading;
                }
            }
            return null;
        }

        public String getElement() {
            return element;
        }

    }

    /*
     * /**
     * The {@link Heading} object for the HTML element
     * to use for accordion headers.
     */
    private Heading heading;

    @Override
    public boolean isSingleExpansion() {
        return singleExpansion;
    }

    @Override
    public String[] getExpandedItems() {
        if (expandedItemNames == null) {
            this.expandedItemNames = Optional.ofNullable(this.expandedItems)
                .map(Arrays::stream)
                .orElse(Stream.empty())
                .filter(Objects::nonNull)
                .filter(item -> Objects.nonNull(resource.getChild(item)))
                .toArray(String[]::new);
        }
        return Arrays.copyOf(expandedItemNames, expandedItemNames.length);
    }

    public String getHeadingElement() {
        if (heading == null) {
            heading = Heading.getHeading(headingElement);
            if (heading == null) {
                heading = Heading.H1;
            }
        }
        return heading.getElement();
    }

    /*
     * DataLayerProvider implementation of field getters
     */

    // public String[] getDataLayerShownItems() {
    // if (expandedItems == null) {
    // return new String[0];
    // }
    //
    // if (expandedItemIds == null) {
    // List<String> expandedItemsName = Arrays.asList(expandedItems);
    //
    // expandedItemIds = this.getItems2().stream()
    // .filter(item -> expandedItemsName.contains(item.getName()))
    // .map(Component::getData)
    // .filter(Objects::nonNull)
    // .map(ComponentData::getId)
    // .toArray(String[]::new);
    // }
    //
    // return Arrays.copyOf(expandedItemIds, expandedItemIds.length);
    // }
}
