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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.granite.ui.components.Config;
import com.adobe.granite.ui.components.ExpressionHelper;
import com.adobe.granite.ui.components.ExpressionResolver;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.day.cq.wcm.foundation.forms.FormsManager;

import static org.apache.sling.api.resource.Resource.RESOURCE_TYPE_NON_EXISTING;

/**
 * Abstract data source providing common logic.
 */
public abstract class AbstractDataSourceServlet extends SlingSafeMethodsServlet {

    public final static String GRANITE_DATA = "granite:data";
    public final static String PN_TEXT = "text";
    public final static String PN_VALUE = "value";
    public final static String PN_QTIP = "qtip";

    /**
     * Returns an expression resolver to be used to resolve expressions in the configuration properties
     *
     * @return an expression resolver
     */
    @NotNull
    protected abstract ExpressionResolver getExpressionResolver();

    /**
     * Returns datasource configuration.
     *
     * @param request the request
     * @return datasource configuration.
     */
    Config getConfig(SlingHttpServletRequest request) {
        // get datasource configuration
        Resource datasource = request.getResource().getChild(Config.DATASOURCE);
        if (datasource == null) {
            return null;
        }
        return new Config(datasource);
    }

    /**
     * Reads a parameter from the specified datasource configuration, resolving expressions using the
     * {@link ExpressionResolver}. If the parameter is not found, {@code null} is returned.
     */
    @Nullable
    protected String getParameter(@NotNull Config config, @NotNull String name,
        @NotNull SlingHttpServletRequest request, @Nullable String defaultValue) {
        // get value from configuration
        String value = config.get(name, String.class);
        if (value == null) {
            return defaultValue;
        }

        // evaluate value using the expression helper
        ExpressionHelper expressionHelper = new ExpressionHelper(getExpressionResolver(), request);
        return expressionHelper.getString(value);
    }

    /**
     * Creates a virtual resource to use in a datasource.
     */
    @NotNull
    protected Resource createResource(@NotNull ResourceResolver resolver, @NotNull FormsManager.ComponentDescription desc) {
        ValueMap properties = new ValueMapDecorator(new HashMap<>());
        List<Resource> children = new ArrayList<Resource>();
        properties.put(PN_TEXT, desc.getTitle());
        properties.put(PN_VALUE, desc.getResourceType());
        if (StringUtils.isNotBlank(desc.getHint())) {
            properties.put(PN_QTIP, desc.getHint());
        }
        Resource formMetaDataResource = resolver.getResource(desc.getResourceType());
        if (formMetaDataResource != null) {
            Resource graniteData = formMetaDataResource.getChild(GRANITE_DATA);
            if (graniteData != null) {
                ValueMap graniteDataValueMap = new ValueMapDecorator(graniteData.getValueMap());
                Resource childResource = new ValueMapResource(resolver, formMetaDataResource.getPath() + "/" + GRANITE_DATA,
                    RESOURCE_TYPE_NON_EXISTING, graniteDataValueMap);
                children.add(childResource);
            }
        }
        return new ValueMapResource(resolver, formMetaDataResource != null ? formMetaDataResource.getPath() : null,
            RESOURCE_TYPE_NON_EXISTING, properties, children);
    }
}
