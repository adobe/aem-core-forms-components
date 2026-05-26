/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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
package com.adobe.cq.forms.core.components.internal.servlets;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.Servlet;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.granite.ui.components.Config;
import com.adobe.granite.ui.components.ExpressionResolver;
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;

/**
 * Datasource servlet that returns compatible input-type form field components from the current form. Used to populate
 * the email, phone, and country-code field dropdowns in the Electronic Signature signer configuration dialog.
 *
 * <p>
 * Container/layout components are traversed but not included in results. Non-interactive display components (text-draw,
 * title, image, buttons) are skipped. Intermediate layout nodes (for example responsive grid) are traversed. A
 * {@code filter} property on the dialog datasource node restricts results by {@code fieldType}.
 */
@Component(service = { Servlet.class }, property = {
        "sling.servlet.resourceTypes=" + FormConstants.RT_FD_FORM_FIELDS_DATASOURCE_V1, "sling.servlet.methods=GET",
        "sling.servlet.extensions=html" })
public class FormFieldDataSourceServlet extends AbstractDataSourceServlet {

    static final String PN_FILTER = "filter";

    private static final Set<String> NON_INPUT_FIELD_TYPES = Collections
            .unmodifiableSet(new HashSet<>(Arrays.asList(FieldType.FORM.getValue(), FieldType.PANEL.getValue(),
                    FieldType.BUTTON.getValue(), FieldType.PLAIN_TEXT.getValue())));

    /**
     * Resource-type fragments that identify container/layout components. These are traversed but not added to the
     * result list.
     */
    private static final Set<String> CONTAINER_RT_FRAGMENTS = new HashSet<>(
            Arrays.asList("form/container/", "form/panel/", "form/panelcontainer/", "form/accordion/", "form/wizard/",
                    "form/tabsontop/", "form/verticaltabs/", "form/fragmentcontainer"));

    /**
     * Resource-type fragments for non-data components that should be skipped entirely (no result entry, no recursion).
     */
    private static final Set<String> SKIP_RT_FRAGMENTS = new HashSet<>(
            Arrays.asList("form/text/v", "form/title/", "form/image/", "form/button/", "form/actions/",
                    "form/adobesignblock", "form/recaptcha", "form/hcaptcha", "form/terms"));

    private static final Map<String, Set<String>> FILTER_TO_FIELD_TYPES;

    static {
        Map<String, Set<String>> map = new HashMap<>();
        map.put(FieldFilter.EMAIL.getValue(), Collections.unmodifiableSet(
                new HashSet<>(Arrays.asList(FieldType.TEXT_INPUT.getValue(), FieldType.EMAIL.getValue()))));
        map.put(FieldFilter.PHONE.getValue(), Collections.unmodifiableSet(
                new HashSet<>(Arrays.asList(FieldType.TELEPHONE.getValue(), FieldType.TEXT_INPUT.getValue()))));
        map.put(FieldFilter.COUNTRY_CODE.getValue(),
                Collections.unmodifiableSet(new HashSet<>(Arrays.asList(FieldType.TELEPHONE.getValue(),
                        FieldType.TEXT_INPUT.getValue(), FieldType.NUMBER_INPUT.getValue()))));
        FILTER_TO_FIELD_TYPES = Collections.unmodifiableMap(map);
    }

    enum FieldFilter {
        ALL("all"), EMAIL("email"), PHONE("phone"), COUNTRY_CODE("countryCode");

        private final String value;

        FieldFilter(String value) {
            this.value = value;
        }

        String getValue() {
            return value;
        }

        @NotNull
        static FieldFilter fromString(@Nullable String value) {
            if (StringUtils.isBlank(value)) {
                return ALL;
            }
            for (FieldFilter filter : values()) {
                if (StringUtils.equals(filter.value, value)) {
                    return filter;
                }
            }
            return ALL;
        }
    }

    @Reference
    private transient ExpressionResolver expressionResolver;

    @NotNull
    @Override
    protected ExpressionResolver getExpressionResolver() {
        return expressionResolver;
    }

    @Override
    protected void doGet(@NotNull SlingHttpServletRequest request, @NotNull SlingHttpServletResponse response) {
        ResourceResolver resourceResolver = request.getResourceResolver();
        String componentInstancePath = DatasourceComponentPathResolver.resolve(request);
        List<Resource> resources = new ArrayList<>();
        FieldFilter fieldFilter = resolveFieldFilter(request);

        if (componentInstancePath != null) {
            Resource componentInstance = resourceResolver.getResource(componentInstancePath);
            Resource formInstance = ComponentUtils.getFormContainer(componentInstance);
            if (formInstance != null) {
                collectFormFields(formInstance, resources, resourceResolver, fieldFilter);
            }
        }

        request.setAttribute(DataSource.class.getName(), new SimpleDataSource(resources.iterator()));
    }

    @NotNull
    FieldFilter resolveFieldFilter(@NotNull SlingHttpServletRequest request) {
        Config config = getConfig(request);
        if (config != null) {
            return FieldFilter.fromString(getParameter(config, PN_FILTER, request, null));
        }
        return FieldFilter.fromString(request.getResource().getValueMap().get(PN_FILTER, String.class));
    }

    private void collectFormFields(Resource parent, List<Resource> result, ResourceResolver resolver,
            FieldFilter fieldFilter) {
        for (Resource child : parent.getChildren()) {
            String rt = child.getValueMap().get("sling:resourceType", String.class);
            if (rt != null && rt.startsWith(FormConstants.RT_FD_FORM_PREFIX)) {
                if (matchesAny(rt, SKIP_RT_FRAGMENTS)) {
                    continue;
                }
                if (matchesAny(rt, CONTAINER_RT_FRAGMENTS)) {
                    collectFormFields(child, result, resolver, fieldFilter);
                    continue;
                }
            }
            if (isInputFormField(child, rt)) {
                ValueMap vm = child.getValueMap();
                String fieldName = vm.get("name", child.getName());
                if (StringUtils.isNotBlank(fieldName) && matchesFieldFilter(vm, rt, fieldFilter)) {
                    String fieldLabel = vm.get("fieldLabel", vm.get("jcr:title", fieldName));
                    result.add(createDropdownEntry(resolver, fieldLabel + " (" + fieldName + ")", fieldName));
                }
            }
            if (child.hasChildren()) {
                collectFormFields(child, result, resolver, fieldFilter);
            }
        }
    }

    private boolean isInputFormField(Resource resource, @Nullable String resourceType) {
        ValueMap vm = resource.getValueMap();
        if (resourceType != null && resourceType.startsWith(FormConstants.RT_FD_FORM_PREFIX)) {
            if (matchesAny(resourceType, SKIP_RT_FRAGMENTS) || matchesAny(resourceType, CONTAINER_RT_FRAGMENTS)) {
                return false;
            }
            return StringUtils.isNotBlank(vm.get("name", String.class));
        }
        String fieldType = vm.get("fieldType", String.class);
        if (StringUtils.isBlank(fieldType) || NON_INPUT_FIELD_TYPES.contains(fieldType)) {
            return false;
        }
        return StringUtils.isNotBlank(vm.get("name", String.class));
    }

    boolean matchesFieldFilter(ValueMap fieldProperties, String resourceType, FieldFilter fieldFilter) {
        if (fieldFilter == FieldFilter.ALL) {
            return true;
        }
        Set<String> allowedFieldTypes = FILTER_TO_FIELD_TYPES.get(fieldFilter.getValue());
        if (allowedFieldTypes == null) {
            return true;
        }
        String fieldType = resolveFieldType(fieldProperties, resourceType);
        return allowedFieldTypes.contains(fieldType);
    }

    @NotNull
    String resolveFieldType(ValueMap fieldProperties, String resourceType) {
        String fieldType = fieldProperties.get("fieldType", String.class);
        if (StringUtils.isNotBlank(fieldType)) {
            return fieldType;
        }
        if (resourceType != null) {
            if (resourceType.contains("emailinput")) {
                return FieldType.EMAIL.getValue();
            }
            if (resourceType.contains("telephoneinput")) {
                return FieldType.TELEPHONE.getValue();
            }
            if (resourceType.contains("numberinput")) {
                return FieldType.NUMBER_INPUT.getValue();
            }
            if (resourceType.contains("textinput")) {
                return FieldType.TEXT_INPUT.getValue();
            }
        }
        return FieldType.TEXT_INPUT.getValue();
    }

    private static boolean matchesAny(String resourceType, Set<String> fragments) {
        for (String fragment : fragments) {
            if (resourceType.contains(fragment)) {
                return true;
            }
        }
        return false;
    }

    private Resource createDropdownEntry(ResourceResolver resolver, String displayValue, String dataValue) {
        Map<String, Object> map = new HashMap<>();
        map.put("text", displayValue);
        map.put("value", dataValue);
        ValueMap vm = new ValueMapDecorator(map);
        return new ValueMapResource(resolver, "", JcrConstants.NT_UNSTRUCTURED, vm);
    }
}