/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2021 Adobe
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
package com.adobe.cq.forms.core.components.internal.models.v1.formsportal;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.utils.URIBuilder;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.models.v1.AbstractComponentImpl;
import com.adobe.cq.forms.core.components.models.formsportal.Link;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { Link.class, ComponentExporter.class },
    resourceType = LinkImpl.RESOURCE_TYPE)
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class LinkImpl extends AbstractComponentImpl implements Link {
    // ToDo: Documentation of each method once properties and model is reviewed and final
    public static final String RESOURCE_TYPE = "core/fd/components/formsportal/link/v1/link";
    public static final String QUERY_PARAMS_PATH = "queryParams";
    private static final String PN_PARAM_KEY = "key";
    private static final String PN_PARAM_VALUE = "value";
    public static final Logger logger = LoggerFactory.getLogger(LinkImpl.class);

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String title;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String tooltip;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject

    private String assetType;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String assetPath;

    @ChildResource(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Named(QUERY_PARAMS_PATH)
    private List<Resource> paramsResourceList;

    @SlingObject
    private ResourceResolver resourceResolver;

    private Map<String, String> queryParamsMap;

    @Override
    public String getUrl() {
        String url = getAssetPath();
        if (StringUtils.isBlank(url)) {
            return "#";
        }
        try {
            String formContentPath = url + "/jcr:content";
            if (resourceResolver.getResource(formContentPath) != null) {
                url = formContentPath;
            }
            URIBuilder uriBuilder = null;
            uriBuilder = new URIBuilder(url);
            Map<String, String> queryParams = getQueryParams();
            if (queryParams != null && !uriBuilder.isPathEmpty()) {
                for (String key : queryParams.keySet()) {
                    String value = queryParams.get(key);
                    if (StringUtils.isNotBlank(value)) {
                        uriBuilder.addParameter(key, value);
                    } else {
                        // for empty value
                        uriBuilder.addParameter(key, null);
                    }
                }
            }
            url = uriBuilder.build().toString();
        } catch (URISyntaxException e) {
            logger.error("[FORMS] Link Component Failed to parse assetPath {}", url, e);
        }
        return url;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public String getTooltip() {
        return tooltip;
    }

    @Override
    public String getTarget() {
        String renderLink = getUrl();
        if (StringUtils.isBlank(renderLink) || renderLink.equals("#")) {
            return "_self";
        }
        return "_blank";
    }

    @Override
    public AssetType getAssetType() {
        if (assetType != null) {
            switch (assetType) {
                case "Adaptive Form":
                    return AssetType.ADAPTIVE_FORM;
                default:
                    break;
            }
        }
        return null;
    }

    @Override
    public String getAssetPath() {
        return assetPath;
    }

    private Map<String, String> getQueryParams() {
        if (queryParamsMap == null) {
            populateQueryParams();
        }
        return queryParamsMap;
    }

    private void populateQueryParams() {
        if (paramsResourceList != null) {
            this.queryParamsMap = new HashMap<String, String>();
            for (Resource param : paramsResourceList) {
                ValueMap properties = param.getValueMap();
                this.queryParamsMap.put(properties.get(PN_PARAM_KEY, ""),
                    properties.get(PN_PARAM_VALUE, ""));
            }
        }
    }
}
