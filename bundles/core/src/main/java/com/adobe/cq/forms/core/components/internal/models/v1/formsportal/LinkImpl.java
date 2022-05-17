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
import java.util.SortedSet;
import java.util.TreeSet;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.utils.URIBuilder;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.models.formsportal.Link;
import com.adobe.cq.wcm.core.components.util.AbstractComponentImpl;
import com.day.cq.wcm.api.WCMMode;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { Link.class, ComponentExporter.class },
    resourceType = LinkImpl.RESOURCE_TYPE)
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class LinkImpl extends AbstractComponentImpl implements Link {
    public static final String RESOURCE_TYPE = "core/fd/components/formsportal/link/v1/link";
    private static final String QUERY_PARAMS_PATH = "queryParams";
    private static final String PN_PARAM_KEY = "key";
    private static final String PN_PARAM_VALUE = "value";
    private static final Logger logger = LoggerFactory.getLogger(LinkImpl.class);
    private static final String QP_AF_DEFAULT_MODE_KEY = WCMMode.class.getSimpleName().toLowerCase();
    private static final String QP_AF_DEFAULT_MODE_VALUE = WCMMode.DISABLED.name().toLowerCase();

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

    @Self(injectionStrategy = InjectionStrategy.OPTIONAL)
    private SlingHttpServletRequest request;

    private Map<String, String> queryParamsMap;

    private SortedSet<FormsLinkProcessor> processorsList = new TreeSet<>();

    @Override
    public String getAssetPathWithQueryParams() {
        String url = processorsList.stream()
            .filter(processor -> processor.accepts(this))
            .findFirst().map(processor -> processor.processLink(this, request))
            .orElse(getAssetPath());

        if (StringUtils.isBlank(url)) {
            return "#";
        }
        try {
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
    public AssetType getAssetType() {
        if ("Adaptive Form".equals(assetType)) {
            return AssetType.ADAPTIVE_FORM;
        }
        return AssetType.NONE;
    }

    @Override
    public String getAssetPath() {
        return assetPath;
    }

    protected Map<String, String> getQueryParams() {
        if (queryParamsMap == null || this.queryParamsMap.isEmpty()) {
            populateQueryParams();
        }
        return queryParamsMap;
    }

    protected void populateQueryParams() {
        this.queryParamsMap = new HashMap<String, String>();
        if (paramsResourceList != null) {
            for (Resource param : paramsResourceList) {
                ValueMap properties = param.getValueMap();
                this.queryParamsMap.put(properties.get(PN_PARAM_KEY, ""),
                    properties.get(PN_PARAM_VALUE, ""));
            }
        }
    }

    protected abstract static class FormsLinkProcessor implements Comparable<FormsLinkProcessor> {
        // has to be a class in order to implement Comparable
        // accepts a LinkImpl and is protected to allow implementation by subclasses (i.e future versions of Link component)
        public abstract Boolean accepts(LinkImpl link);

        public abstract String processLink(LinkImpl link, SlingHttpServletRequest request);

        public abstract Integer priority();

        @Override
        public int compareTo(FormsLinkProcessor o) {
            if (o != null) {
                return o.priority() - this.priority();
            }
            return 0;
        }
    }

    protected void addFormsLinkProcessor(FormsLinkProcessor processor) {
        this.processorsList.add(processor);
    }

    @PostConstruct
    protected void init() {
        this.addFormsLinkProcessor(new FormsLinkProcessor() {
            // Adaptive Forms and PDF processor
            @Override
            public Boolean accepts(LinkImpl link) {
                return (AssetType.ADAPTIVE_FORM.equals(link.getAssetType())
                    || AssetType.PDF.equals(link.getAssetType())) && StringUtils.isNotBlank(link.getAssetPath());
            }

            @Override
            public String processLink(LinkImpl link, SlingHttpServletRequest request) {
                String givenPath = link.getAssetPath();
                String builtPath = givenPath + "/" + JcrConstants.JCR_CONTENT;
                ResourceResolver resourceResolver = request.getResourceResolver();
                if (resourceResolver.getResource(builtPath) != null) {
                    Map<String, String> params = link.getQueryParams();
                    if (AssetType.ADAPTIVE_FORM.equals(link.getAssetType()) && !params.containsKey(QP_AF_DEFAULT_MODE_KEY)) {
                        builtPath += "?" + QP_AF_DEFAULT_MODE_KEY + "=" + QP_AF_DEFAULT_MODE_VALUE;
                    }
                    givenPath = builtPath;
                }
                return givenPath;
            }

            @Override
            public Integer priority() {
                return Integer.MIN_VALUE + 1;
            }
        });
    }
}
