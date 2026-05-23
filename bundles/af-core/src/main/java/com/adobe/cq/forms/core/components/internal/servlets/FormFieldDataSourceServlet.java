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
package com.adobe.cq.forms.core.components.internal.servlets;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.Servlet;

import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.jetbrains.annotations.NotNull;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.granite.ui.components.ExpressionResolver;
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;

/**
 * Datasource servlet that returns all compatible input-type form field components from the
 * current form. Used to populate the email, phone, and country-code autocomplete dropdowns
 * in the Electronic Signature signer configuration dialog.
 *
 * <p>Container/layout components are traversed but not included in results.
 * Non-interactive display components (text-draw, title, image, buttons) are skipped.
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.resourceTypes=" + FormConstants.RT_FD_FORM_FIELDS_DATASOURCE_V1,
        "sling.servlet.methods=GET",
        "sling.servlet.extensions=html"
    })
public class FormFieldDataSourceServlet extends AbstractDataSourceServlet {

    /**
     * Resource-type fragments that identify container/layout components.
     * These are traversed but not added to the result list.
     */
    private static final Set<String> CONTAINER_RT_FRAGMENTS = new HashSet<>(Arrays.asList(
        "form/container/", "form/panel/", "form/panelcontainer/",
        "form/accordion/", "form/wizard/", "form/tabsontop/",
        "form/verticaltabs/", "form/fragmentcontainer"
    ));

    /**
     * Resource-type fragments for non-data components that should be skipped entirely
     * (no result entry, no recursion).
     */
    private static final Set<String> SKIP_RT_FRAGMENTS = new HashSet<>(Arrays.asList(
        "form/text/v", "form/title/", "form/image/",
        "form/button/", "form/actions/",
        "form/adobesignblock", "form/recaptcha", "form/hcaptcha", "form/terms"
    ));

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
        String componentInstancePath = request.getRequestPathInfo().getSuffix();
        List<Resource> resources = new ArrayList<>();

        if (resourceResolver != null && componentInstancePath != null) {
            Resource componentInstance = resourceResolver.getResource(componentInstancePath);
            Resource formInstance = ComponentUtils.getFormContainer(componentInstance);
            if (formInstance != null) {
                collectFormFields(formInstance, resources, resourceResolver);
            }
        }

        request.setAttribute(DataSource.class.getName(), new SimpleDataSource(resources.iterator()));
    }

    private void collectFormFields(Resource parent, List<Resource> result, ResourceResolver resolver) {
        for (Resource child : parent.getChildren()) {
            String rt = child.getValueMap().get("sling:resourceType", String.class);
            if (rt == null || !rt.startsWith(FormConstants.RT_FD_FORM_PREFIX)) {
                continue;
            }
            if (matchesAny(rt, SKIP_RT_FRAGMENTS)) {
                continue;
            }
            if (matchesAny(rt, CONTAINER_RT_FRAGMENTS)) {
                collectFormFields(child, result, resolver);
            } else {
                ValueMap vm = child.getValueMap();
                String fieldName = vm.get("name", child.getName());
                String fieldLabel = vm.get("fieldLabel", fieldName);
                if (fieldName != null && !fieldName.isEmpty()) {
                    result.add(createDropdownEntry(resolver, fieldLabel + " (" + fieldName + ")", fieldName));
                }
                if (child.hasChildren()) {
                    collectFormFields(child, result, resolver);
                }
            }
        }
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
