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
import java.util.LinkedHashSet;
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
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.granite.ui.components.ExpressionResolver;
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

/**
 * Datasource servlet that lists Adobe Sign cloud configurations available for the current form.
 *
 * <p>
 * Configs from the site-specific {@code cq:conf} hierarchy are listed first, followed by configs from
 * {@code /conf/global}. Duplicates (same config path appearing at multiple levels) are suppressed.
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.resourceTypes=" + FormConstants.RT_FD_FORM_ADOBESIGN_CLOUDCONFIG_DATASOURCE_V1,
        "sling.servlet.methods=GET", "sling.servlet.extensions=html" })
public class AdobeSignCloudConfigDataSourceServlet extends AbstractDataSourceServlet {

    private static final String ADOBESIGN_CLOUDCONFIGS_REL_PATH = "/settings/cloudconfigs/echosign";
    private static final String GLOBAL_CONF_PATH = "/conf/global";

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
                String confPath = resolveConfPath(formInstance, resourceResolver);
                Set<String> seen = new LinkedHashSet<>();
                if (StringUtils.isNotBlank(confPath) && !GLOBAL_CONF_PATH.equals(confPath)) {
                    collectConfigs(confPath, resourceResolver, resources, seen);
                }
                collectConfigs(GLOBAL_CONF_PATH, resourceResolver, resources, seen);
            }
        }

        request.setAttribute(DataSource.class.getName(), new SimpleDataSource(resources.iterator()));
    }

    @Nullable
    private String resolveConfPath(Resource formResource, ResourceResolver resolver) {
        PageManager pageManager = resolver.adaptTo(PageManager.class);
        if (pageManager == null) {
            return null;
        }
        Page page = pageManager.getContainingPage(formResource);
        while (page != null) {
            Resource content = page.getContentResource();
            if (content != null) {
                String conf = content.getValueMap().get("cq:conf", String.class);
                if (StringUtils.isNotBlank(conf)) {
                    return conf;
                }
            }
            page = page.getParent();
        }
        return null;
    }

    private void collectConfigs(String confPath, ResourceResolver resolver, List<Resource> result, Set<String> seen) {
        Resource folder = resolver.getResource(confPath + ADOBESIGN_CLOUDCONFIGS_REL_PATH);
        if (folder == null) {
            return;
        }
        for (Resource config : folder.getChildren()) {
            String path = config.getPath();
            if (seen.contains(path)) {
                continue;
            }
            seen.add(path);
            Resource jcrContent = config.getChild(JcrConstants.JCR_CONTENT);
            String title = jcrContent != null ? jcrContent.getValueMap().get("jcr:title", config.getName())
                : config.getName();
            result.add(createDropdownEntry(resolver, title, path));
        }
    }

    private Resource createDropdownEntry(ResourceResolver resolver, String displayValue, String dataValue) {
        Map<String, Object> map = new HashMap<>();
        map.put("text", displayValue);
        map.put("value", dataValue);
        ValueMap vm = new ValueMapDecorator(map);
        return new ValueMapResource(resolver, "", JcrConstants.NT_UNSTRUCTURED, vm);
    }
}
