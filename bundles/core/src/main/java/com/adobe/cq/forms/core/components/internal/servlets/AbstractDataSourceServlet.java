package com.adobe.cq.forms.core.components.internal.servlets;

import com.adobe.granite.ui.components.Config;
import com.adobe.granite.ui.components.ExpressionHelper;
import com.adobe.granite.ui.components.ExpressionResolver;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.day.cq.wcm.foundation.forms.FormsManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceMetadata;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.apache.sling.api.resource.Resource.RESOURCE_TYPE_NON_EXISTING;

/**
 * Abstract data source providing common logic.
 */
public abstract class AbstractDataSourceServlet extends SlingSafeMethodsServlet {

    /**
     * Name of the resource property containing the path to a component. The servlet uses the content fragment
     * referenced by the component. The value may contain expressions.
     */
    public final static String PN_COMPONENT_PATH = "componentPath";

    public final static String GRANITE_DATA = "granite:data";

    /**
     * Returns an expression resolver to be used to resolve expressions in the configuration properties (see
     * {@link #PN_COMPONENT_PATH}).
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
     * Get value map corresponding to resource of the component.
     *
     * @param config  datasource configuration
     * @param request the request
     * @return value map.
     */
    ValueMap getComponentValueMap(Config config, SlingHttpServletRequest request) {
        if (config == null) {
            return null;
        }
        String componentPath = getParameter(config, PN_COMPONENT_PATH, request);
        if (componentPath == null) {
            return null;
        }

        // get component resource
        Resource component = request.getResourceResolver().getResource(componentPath);
        if (component == null) {
            return null;
        }
        return component.getValueMap();
    }

    /**
     * Reads a parameter from the specified datasource configuration, resolving expressions using the
     * {@link ExpressionResolver}. If the parameter is not found, {@code null} is returned.
     */
    @Nullable
    protected String getParameter(@NotNull Config config, @NotNull String name,
                                  @NotNull SlingHttpServletRequest request) {
        // get value from configuration
        String value = config.get(name, String.class);
        if (value == null) {
            return null;
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
        properties.put("text", desc.getTitle());
        properties.put("value", desc.getResourceType());
        if (StringUtils.isNotBlank(desc.getHint())) {
            properties.put("qtip", desc.getHint());
        }
        Resource formMetaDataResource = resolver.getResource(desc.getResourceType());
        Resource graniteData = formMetaDataResource.getChild("granite:data");
        if (graniteData != null) {
            ValueMap graniteDataValueMap = new ValueMapDecorator(graniteData.getValueMap());
            Resource childResource = new ValueMapResource(resolver, formMetaDataResource.getPath() + "/" + GRANITE_DATA, RESOURCE_TYPE_NON_EXISTING, graniteDataValueMap);
            children.add(childResource);
        }

        return new ValueMapResource(resolver, formMetaDataResource.getPath(), RESOURCE_TYPE_NON_EXISTING, properties, children);
    }
}

