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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.Container;
import com.adobe.cq.forms.core.components.models.form.FormComponent;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.Label;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.granite.ui.components.ExpressionResolver;
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;

@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.resourceTypes=" + FormConstants.RT_FD_FORM_REVIEW_DATASOURCE_V1,
        "sling.servlet.methods=GET",
        "sling.servlet.extensions=html"
    })
public class ReviewDataSourceServlet extends AbstractDataSourceServlet {

    /**
     * Defines the form meta data type. Possible values: {@code submitAction},
     * {@code prefillServiceProvider}
     *
     * @todo: Add other metadata types here like fragment, actions etc
     */
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
        if (resourceResolver != null) {
            Resource componentInstance = resourceResolver.getResource(componentInstancePath);
            Resource formInstance = ComponentUtils.getFormContainer(componentInstance);
            if (formInstance != null) {
                FormContainer formContainer = formInstance.adaptTo(FormContainer.class);
                List<Base> panels = ((List<Base>) getMultipleChildPanels(formContainer))
                    .stream().filter(x -> "panel".equals(x.getFieldType())).collect(Collectors.toList());
                for (Base panel : panels) {
                    String name = panel != null ? panel.getName() : "";
                    String title = "";
                    if (panel != null) {
                        Label label = panel.getLabel();
                        if (label != null) {
                            String value = label.getValue();
                            if (value != null) {
                                title = value;
                            }
                        }
                    }
                    if (name != null && title != null) {
                        resources.add(getResourceForDropdownDisplay(resourceResolver, title, name));
                    }
                }
            }
        }
        SimpleDataSource actionTypeDataSource = new SimpleDataSource(resources.iterator());
        request.setAttribute(DataSource.class.getName(), actionTypeDataSource);
    }

    /**
     * Retrieves a list of child panels that have at least two siblings.
     * If a panel has fewer than two siblings, it will not be included in the returned list.
     *
     * @param formContainer the top-level form container
     * @return a list of panels with at least two siblings
     */
    private List<? extends ComponentExporter> getMultipleChildPanels(FormComponent formContainer) {
        while (formContainer instanceof Container && ((Container) formContainer).getItems().size() == 1) {
            formContainer = (FormComponent) ((Container) formContainer).getItems().get(0);
        }
        if (formContainer instanceof Container) {
            return ((Container) formContainer).getItems();
        }
        return new ArrayList<>();
    }

    private SyntheticResource getResourceForDropdownDisplay(ResourceResolver resourceResolver, String displayValue,
        String dataValue) {
        Map<String, Object> dropdownMap = new HashMap<>();
        dropdownMap.put("text", displayValue);
        dropdownMap.put("value", dataValue);
        ValueMap dropdownEntryVm = new ValueMapDecorator(dropdownMap);
        return new ValueMapResource(resourceResolver, "", JcrConstants.NT_UNSTRUCTURED, dropdownEntryVm);
    }
}
