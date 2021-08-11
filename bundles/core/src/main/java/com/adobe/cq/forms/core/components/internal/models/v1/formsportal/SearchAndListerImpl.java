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

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceMetadata;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ResourceWrapper;
import org.apache.sling.api.resource.SyntheticResource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.aem.formsndocuments.assets.models.AdaptiveFormAsset;
import com.adobe.aem.formsndocuments.assets.models.FDAsset;
import com.adobe.aem.formsndocuments.assets.models.FMSearchCriteria;
import com.adobe.aem.formsndocuments.assets.models.FormAsset;
import com.adobe.aem.formsndocuments.assets.service.FMAssetSearch;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.models.formsportal.PortalLister;
import com.adobe.cq.forms.core.components.models.formsportal.SearchAndLister;
import com.day.cq.i18n.I18n;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { SearchAndLister.class, ComponentExporter.class },
    resourceType = SearchAndListerImpl.RESOURCE_TYPE,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class SearchAndListerImpl extends PortalListerImpl implements SearchAndLister {
    public static final String RESOURCE_TYPE = "core/fd/components/formsportal/searchlister/v1/searchlister";

    private static final String PN_CHILD_ASSETFOLDERS = "assetFolders";
    private static final String PN_CHILD_ASSETSOURCES = "assetSource";
    private static final Map<String, QueryStrategy> queryStrategies = new HashMap<>();

    static {
        queryStrategies.put("searchText", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, FMSearchCriteria.Builder builder) {
                int counter = 0;
                int paramCount = params.length;
                while (paramCount-- > 0) {
                    String text = params[counter].getString();
                    if (StringUtils.isNotBlank(text)) {
                        builder.withFullText(text);
                    }
                    counter++;
                }
            }
        });

        queryStrategies.put("title", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, FMSearchCriteria.Builder builder) {
                String title = params[0].getString();
                builder.withPropertyEquals(FMSearchCriteria.Property.TITLE, title);
            }
        });

        queryStrategies.put("description", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, FMSearchCriteria.Builder builder) {
                String description = params[0].getString();
                builder.withPropertyEquals(FMSearchCriteria.Property.DESCRIPTION, description);
            }
        });

        queryStrategies.put("orderby", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, FMSearchCriteria.Builder builder) {
                String orderByValue = params[0].getString();
                builder.sortBy(FMSearchCriteria.Property.getEnum(orderByValue));
                // queryMap.put("orderby", "@" + METADATA_NODE_PATH + "/" + orderByValue);
            }
        });

        queryStrategies.put("sort", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, FMSearchCriteria.Builder builder) {
                builder.sortBy(FMSearchCriteria.SortCriteria.getEnum(params[0].getString()));
            }
        });

        queryStrategies.put("offset", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, FMSearchCriteria.Builder builder) {
                builder.withOffset(Integer.valueOf(params[0].getString()));
            }
        });
    }

    @OSGiService
    private ResourceResolverFactory resourceResolverFactory;

    @OSGiService
    private FMAssetSearch assetSearch;

    @OSGiService
    private FMSearchCriteria.BuilderProvider searchBuilderProvider;

    @Self
    @Required
    private SlingHttpServletRequest request;

    @ChildResource(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Named(PN_CHILD_ASSETFOLDERS)
    @Inject
    private List<Resource> assetFolders;

    @ChildResource(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Named(PN_CHILD_ASSETSOURCES)
    @Inject
    private List<Resource> assetSources;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    @Inject
    private boolean disableSearch;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    @Inject
    private boolean disableSorting;

    private List<Resource> defaultAssetSources;
    private String htmlTooltip = "";
    private String pdfTooltip = "";

    @PostConstruct
    private void init() {
        List<Resource> defaultAssetSourcesList = new ArrayList<>();
        Map<String, Object> valueMap = new HashMap<>();
        valueMap.put("type", "Adaptive Forms");
        valueMap.put("htmlTooltip", "Click Here to view as HTML");
        Resource res = new DefaultValueMapResourceWrapper(new SyntheticResource(resource.getResourceResolver(), new ResourceMetadata(),
            JcrConstants.NT_UNSTRUCTURED), valueMap);
        defaultAssetSourcesList.add(res);
        this.defaultAssetSources = defaultAssetSourcesList;
    }

    @Override
    protected String defaultTitle() {
        return "Forms Portal";
    }

    @Override
    protected List<PortalLister.Item> getItemList() {
        List<PortalLister.Item> result = null;
        try (ResourceResolver resourceResolver = resourceResolverFactory.getServiceResourceResolver(null)) {
            // service resource resolver has fd-user access, ref OSGi configuration file
            result = fetchViaQueryBuilder(resourceResolver);
        } catch (LoginException e) {
            e.printStackTrace();
        }
        return result;
    }

    private List<Resource> getAssetSources() {
        if (assetSources != null) {
            return assetSources;
        } else if (defaultAssetSources != null) {
            return defaultAssetSources;
        }
        return Collections.emptyList();
    }

    private void buildAssetSourcesQuery(FMSearchCriteria.Builder searchBuilder) {
        List<Resource> assetSourcesOrDefault = getAssetSources();
        if (assetSourcesOrDefault != null) {
            I18n i18n = new I18n(request);
            for (Resource source : assetSourcesOrDefault) {
                ValueMap assetSource = source.getValueMap();
                String renderType = assetSource.get("type", String.class);
                if (StringUtils.isBlank(renderType)) {
                    continue;
                } else if (renderType.equals("Adaptive Forms")) {
                    searchBuilder.withAssetType(FormAsset.AssetType.ADAPTIVE_FORM);
                    htmlTooltip = i18n.get(assetSource.get("htmlTooltip", String.class));
                }
            }
        }
    }

    private void buildAssetFolderQuery(FMSearchCriteria.Builder searchBuilder) {
        if (assetFolders != null) {
            for (Resource source : assetFolders) {
                ValueMap assetFolder = source.getValueMap();
                String folderPath = assetFolder.get("folder", String.class);
                if (StringUtils.isNotBlank(folderPath)) {
                    searchBuilder.withLocation(folderPath);
                }
            }
        }
    }

    protected List<PortalLister.Item> fetchViaQueryBuilder(ResourceResolver resourceResolver) {
        RequestParameterMap parameterMap = request.getRequestParameterMap();
        List<PortalLister.Item> resultMap = new ArrayList<>();

        FMSearchCriteria.Builder searchBuilder = searchBuilderProvider.createBuilder();
        searchBuilder.withOffset(0);
        searchBuilder.withMaxSize(getLimit());

        for (Map.Entry<String, RequestParameter[]> entry : parameterMap.entrySet()) {
            QueryStrategy queryStrategy = queryStrategies.get(entry.getKey());
            if (queryStrategy != null) {
                queryStrategy.buildQuery(entry.getValue(), searchBuilder);
            }
        }

        buildAssetSourcesQuery(searchBuilder);
        buildAssetFolderQuery(searchBuilder);

        // the resource resolver will likely close
        try (ResourceResolver subResolver = resourceResolverFactory.getServiceResourceResolver(null)) {
            List<FDAsset> results = assetSearch.searchForms(searchBuilder.build(), subResolver);
            for (FDAsset fmA : results) {
                resultMap.add(fetchResourceProperties(fmA, resourceResolver));
            }
        } catch (LoginException e) {
            e.printStackTrace();
        }

        return resultMap;
    }

    private PortalLister.Item fetchResourceProperties(FDAsset fmAsset, ResourceResolver resolver) {
        String title = "";
        String description = "";
        String path = "";
        String tooltip = "";
        String thubmnail = "";
        if (fmAsset.getAssetType().equals(FDAsset.AssetType.ADAPTIVE_FORM)) {
            AdaptiveFormAsset asset = resolver.getResource(fmAsset.getDamPath()).adaptTo(AdaptiveFormAsset.class);
            title = asset.getTitle();
            description = asset.getDescription();
            path = asset.getRenderLink();
            thubmnail = asset.getThumbnailPath();
            tooltip = htmlTooltip;
        }
        return new PortalListerImpl.Item(title, description, tooltip, path, thubmnail);
    }

    public boolean getSearchDisabled() {
        return disableSearch;
    }

    public boolean getSortDisabled() {
        return disableSorting;
    }

    private interface QueryStrategy {
        void buildQuery(RequestParameter[] params, FMSearchCriteria.Builder builder);
    }

    private static class DefaultValueMapResourceWrapper extends ResourceWrapper {
        private final ValueMap valueMap;

        public DefaultValueMapResourceWrapper(Resource resource, Map<String, Object> properties) {
            super(resource);
            this.valueMap = new ValueMapDecorator(properties);
        }

        @Override
        public <AdapterType> AdapterType adaptTo(Class<AdapterType> type) {
            return type == ValueMap.class ? (AdapterType) this.valueMap : super.adaptTo(type);
        }

        @Override
        public ValueMap getValueMap() {
            return this.valueMap;
        }
    }
}
