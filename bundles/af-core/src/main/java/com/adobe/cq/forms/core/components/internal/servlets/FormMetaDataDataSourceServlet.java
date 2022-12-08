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
package com.adobe.cq.forms.core.components.internal.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
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

import com.adobe.aemds.guide.model.FormMetaData;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.granite.ui.components.Config;
import com.adobe.granite.ui.components.ExpressionResolver;
import com.adobe.granite.ui.components.Value;
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.day.cq.wcm.api.policies.ContentPolicy;
import com.day.cq.wcm.foundation.forms.FormsManager;

@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.resourceTypes=" + FormConstants.RT_FD_FORM_CONTAINER_DATASOURCE_V1,
        "sling.servlet.methods=GET",
        "sling.servlet.extensions=html"
    })
public class FormMetaDataDataSourceServlet extends AbstractDataSourceServlet {

    private static final String TYPE = "type";
    private static final String DATA_MODEL = "guideDataModel";

    private static final String FIELD_TYPE = "fieldType";
    private static final String ALLOWED_FORMAT = "allowedFormat";
    private static final String ALLOWED_CUSTOM_FORMAT = "allowedCustomFormats";

    private static final String CUSTOM_FORMAT_KEY = "customFormatKey";
    private static final String CUSTOM_FORMAT_VALUE = "customFormatValue";
    private static final String NN_DIALOG = "cq:dialog";

    /**
     * Defines the form meta data type. Possible values: {@code submitAction}, {@code prefillServiceProvider}
     *
     * @todo: Add other metadata types here like fragment, actions etc
     */
    public enum FormMetaDataType {
        SUBMIT_ACTION("submitAction"),
        PREFILL_ACTION("prefillServiceProvider"),
        FORMATTERS("formatters");

        private String value;

        FormMetaDataType(String value) {
            this.value = value;
        }

        /**
         * Given a {@link String} <code>value</code>, this method returns the enum's value that corresponds to the provided string
         * representation. If no representation is found,
         *
         * @param value the string representation for which an enum value should be returned
         * @return the corresponding enum value, if one was found
         */
        public static FormMetaDataType fromString(String value) {
            for (FormMetaDataType type : FormMetaDataType.values()) {
                if (StringUtils.equals(value, type.value)) {
                    return type;
                }
            }
            return null;
        }

        /**
         * Returns the string value of this enum constant.
         *
         * @return the string value of this enum constant
         */
        public String getValue() {
            return value;
        }

        @Override
        public String toString() {
            return value;
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
    protected void doGet(@NotNull SlingHttpServletRequest request, @NotNull SlingHttpServletResponse response)
        throws ServletException, IOException {
        Config config = getConfig(request);
        SimpleDataSource actionTypeDataSource = null;
        if (config != null) {
            FormMetaDataType type = FormMetaDataType.fromString(getParameter(config, TYPE, request, null));
            String dataModel = getParameter(config, DATA_MODEL, request, "");
            actionTypeDataSource = new SimpleDataSource(getDataSourceResources(
                request, request.getResourceResolver(), type, dataModel).iterator());
        }
        request.setAttribute(DataSource.class.getName(), actionTypeDataSource);
    }

    private List<Resource> getDataSourceResources(HttpServletRequest request, ResourceResolver resourceResolver, FormMetaDataType type,
        String dataModel) {
        List<Resource> resources = new ArrayList<>();
        FormMetaData formMetaData = resourceResolver.adaptTo(FormMetaData.class);
        if (formMetaData != null) {
            Iterator<FormsManager.ComponentDescription> metaDataList = null;
            switch (type) {
                case FORMATTERS:
                    ContentPolicy policy = ComponentUtils.getPolicy((String) request.getAttribute(Value.CONTENTPATH_ATTRIBUTE),
                        resourceResolver);
                    resources.add(getResourceForDropdownDisplay(resourceResolver, "Select", ""));
                    if (policy != null) {
                        ValueMap props = policy.getProperties();
                        if (props != null) {
                            for (Map.Entry<String, Object> entry : props.entrySet()) {
                                if (entry.getKey().startsWith(ALLOWED_FORMAT)) {
                                    String[] arr = entry.getValue().toString().split("=", 2);
                                    resources.add(getResourceForDropdownDisplay(resourceResolver, arr[0], arr[1]));
                                }
                            }
                        }
                        Map<String, String> allowedCustomFormattersMap = this.getAllowedCustomFormatters(policy, resourceResolver);
                        for (Map.Entry<String, String> entry : allowedCustomFormattersMap.entrySet()) {
                            resources.add(getResourceForDropdownDisplay(resourceResolver, entry.getKey(), entry.getValue()));
                        }
                    }
                    resources.add(getResourceForDropdownDisplay(resourceResolver, "Custom", "custom"));
                    break;
                case SUBMIT_ACTION:
                    // filter the submit actions by uniqueness and data model
                    Set<String> uniques = new HashSet<>();
                    metaDataList = StreamSupport.stream(Spliterators.spliteratorUnknownSize(formMetaData.getSubmitActions(),
                        Spliterator.ORDERED), false)
                        .filter(e -> uniques.add(e.getResourceType())) // In case of overlay, we honor only one
                        .filter(e -> {
                            // only return submit action based on data model configured
                            return resourceResolver.getResource(e.getResourceType()).getValueMap().get(DATA_MODEL, "").toLowerCase()
                                .contains(dataModel.toLowerCase());
                        })
                        .collect(Collectors.toList()).iterator();
                    resources = this.getResourceListFromComponentDescription(metaDataList, resourceResolver);
                    break;
                case PREFILL_ACTION:
                    metaDataList = formMetaData.getPrefillActions();
                    resources = this.getResourceListFromComponentDescription(metaDataList, resourceResolver);
                    break;
            }
        }
        return resources;
    }

    private Map<String, String> getAllowedCustomFormatters(ContentPolicy policy, ResourceResolver resourceResolver) {
        Resource policyResource = resourceResolver.resolve(policy.getPath());
        Map<String, String> allowedCustomFormattersMap = new HashMap<>();
        List<Resource> allowedcustomFormattersResourceList = StreamSupport.stream(policyResource.getChildren().spliterator(), false).filter(
            (childResource) -> childResource.getName().equals(ALLOWED_CUSTOM_FORMAT)).collect(Collectors.toList());

        allowedcustomFormattersResourceList.forEach((allowedcustomFormattersResource) -> {
            allowedcustomFormattersResource.getChildren().forEach(allowedCustomFormatters -> {
                String customFormatKey = "";
                String customFormatValue = "";
                for (Map.Entry<String, Object> entry : allowedCustomFormatters.getValueMap().entrySet()) {
                    if (entry.getKey().equals(CUSTOM_FORMAT_KEY)) {
                        customFormatKey = entry.getValue().toString();
                    } else if (entry.getKey().equals(CUSTOM_FORMAT_VALUE)) {
                        customFormatValue = entry.getValue().toString();
                    }
                }
                if (!customFormatKey.isEmpty() && !customFormatValue.isEmpty()) {
                    allowedCustomFormattersMap.put(customFormatKey, customFormatValue);
                }
            });
        });
        return allowedCustomFormattersMap;
    }

    private SyntheticResource getResourceForDropdownDisplay(ResourceResolver resourceResolver, String key, String value) {
        Map<String, Object> dropdownMap = new HashMap<>();
        dropdownMap.put("text", key);
        dropdownMap.put("value", value);
        ValueMap dropdownEntryVm = new ValueMapDecorator(dropdownMap);
        return new ValueMapResource(resourceResolver, "", JcrConstants.NT_UNSTRUCTURED, dropdownEntryVm);
    }

    private List<Resource> getResourceListFromComponentDescription(
        Iterator<FormsManager.ComponentDescription> metaDataList,
        ResourceResolver resourceResolver) {
        List<Resource> resources = new ArrayList<>();
        if (metaDataList != null) {
            while (metaDataList.hasNext()) {
                FormsManager.ComponentDescription description = metaDataList.next();
                Resource syntheticResource = createResource(resourceResolver, description);
                resources.add(syntheticResource);
            }
        }
        return resources;
    }
}
