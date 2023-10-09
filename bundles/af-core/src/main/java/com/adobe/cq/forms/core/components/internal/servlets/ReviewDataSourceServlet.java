/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    private static final Logger LOGGER = LoggerFactory.getLogger(ReviewDataSourceServlet.class);

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
            FormContainer formContainer = formInstance.adaptTo(FormContainer.class);
            List<Base> panels = (List<Base>) getPanels(formContainer);
            for (Base panel : panels) {
                String id = panel != null ? panel.getId() : "";
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
                if (id != null && title != null) {
                    resources.add(getResourceForDropdownDisplay(resourceResolver, title, id));
                } else {
                    LOGGER.warn("[AF] id or title is null");
                }
            }
        }
        SimpleDataSource actionTypeDataSource = new SimpleDataSource(resources.iterator());
        request.setAttribute(DataSource.class.getName(), actionTypeDataSource);
    }

    private List<? extends ComponentExporter> getPanels(FormComponent formContainer) {
        if (formContainer instanceof FormContainer) {
            while (formContainer instanceof Container && ((Container) formContainer).getItems().size() == 1) {
                formContainer = (FormComponent) ((Container) formContainer).getItems().get(0);
            }
            if (formContainer instanceof Container) {
                return ((Container) formContainer).getItems();
            }
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
