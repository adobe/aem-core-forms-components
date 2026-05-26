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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.Servlet;

import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.SyntheticResource;
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
 * Datasource servlet that returns Adobe Sign Block component names from the current form, used to populate the
 * "signFieldBlocks" and "signerAfFieldsBlock" dropdowns in the Electronic Signature signer configuration dialog.
 */
@Component(service = { Servlet.class }, property = {
        "sling.servlet.resourceTypes=" + FormConstants.RT_FD_FORM_ADOBESIGN_FIELDS_DATASOURCE_V1,
        "sling.servlet.methods=GET", "sling.servlet.extensions=html" })
public class AdobeSignFieldsDataSourceServlet extends AbstractDataSourceServlet {

    /**
     * Resource type for the Adobe Sign Block v1 component — matches the constant added via the adobesignblock branch.
     */
    private static final String RT_ADOBE_SIGN_BLOCK = "core/fd/components/form/adobesignblock/v1/adobesignblock";

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

        if (componentInstancePath != null) {
            Resource componentInstance = resourceResolver.getResource(componentInstancePath);
            Resource formInstance = ComponentUtils.getFormContainer(componentInstance);
            if (formInstance != null) {
                collectAdobeSignBlocks(formInstance, resources, resourceResolver);
            }
        }

        SimpleDataSource dataSource = new SimpleDataSource(resources.iterator());
        request.setAttribute(DataSource.class.getName(), dataSource);
    }

    /**
     * Recursively walks the form resource tree and collects all Adobe Sign Block components.
     */
    private void collectAdobeSignBlocks(Resource parent, List<Resource> result, ResourceResolver resourceResolver) {
        for (Resource child : parent.getChildren()) {
            String resourceType = child.getValueMap().get("sling:resourceType", String.class);
            if (RT_ADOBE_SIGN_BLOCK.equals(resourceType)) {
                String name = child.getName();
                String title = child.getValueMap().get("name", name);
                result.add(createDropdownEntry(resourceResolver, title, name));
            }
            if (child.hasChildren()) {
                collectAdobeSignBlocks(child, result, resourceResolver);
            }
        }
    }

    private SyntheticResource createDropdownEntry(ResourceResolver resourceResolver, String displayValue,
            String dataValue) {
        Map<String, Object> map = new HashMap<>();
        map.put("text", displayValue);
        map.put("value", dataValue);
        ValueMap vm = new ValueMapDecorator(map);
        return new ValueMapResource(resourceResolver, "", JcrConstants.NT_UNSTRUCTURED, vm);
    }
}