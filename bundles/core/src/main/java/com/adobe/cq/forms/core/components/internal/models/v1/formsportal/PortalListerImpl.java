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
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Session;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.vault.util.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.forms.core.components.internal.models.v1.AbstractComponentImpl;
import com.adobe.cq.forms.core.components.models.formsportal.PortalLister;
import com.day.cq.i18n.I18n;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.SearchResult;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { PortalLister.class, ComponentExporter.class },
    resourceType = PortalListerImpl.RESOURCE_TYPE,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PortalListerImpl extends AbstractComponentImpl implements PortalLister {
    public static final String RESOURCE_TYPE = "core/fd/components/formsportal/portallister/v1/portallister";

    private static final String QB_GROUP = "_group.";
    private static final String QB_PATH = "_path";
    private static final String QB_FULLTEXT = "_fulltext";
    private static final String QB_FULLTEXT_RELPATH = "_fulltext.relPath";
    private static final String DEFAULT_PATH = "/content/dam/formsanddocuments";
    private static final Logger LOGGER = LoggerFactory.getLogger(PortalListerImpl.class);
    private static final String METADATA_NODE_PATH = JcrConstants.JCR_CONTENT + "/metadata";
    private static final String PN_CHILD_ASSETFOLDERS = "assetFolders";
    private static final String PN_CHILD_ASSETSOURCES = "assetSource";
    private static final Map<String, QueryStrategy> queryStrategies = new HashMap<>();
    static {
        queryStrategies.put("searchText", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, int predicateID, Map<String, String> queryMap) {
                int counter = 0;
                int paramCount = params.length;
                while (paramCount-- > 0) {
                    String text = params[counter].getString();
                    if (StringUtils.isNotBlank(text)) {
                        queryMap.put(predicateID + QB_FULLTEXT, text);
                        queryMap.put(predicateID + QB_FULLTEXT_RELPATH, METADATA_NODE_PATH);
                        predicateID++;
                    }
                    counter++;
                }
            }
        });

        queryStrategies.put("title", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, int predicateID, Map<String, String> queryMap) {
                String title = params[0].getString();
                queryMap.put(predicateID + QB_GROUP + "0" + QB_FULLTEXT, title);
                queryMap.put(predicateID + QB_GROUP + "0" + QB_FULLTEXT_RELPATH, METADATA_NODE_PATH + "/@title");
                queryMap.put(predicateID + QB_GROUP + "1" + QB_FULLTEXT, title);
                queryMap.put(predicateID + QB_GROUP + "1" + QB_FULLTEXT_RELPATH, METADATA_NODE_PATH + "/@dc:title");
                queryMap.put(predicateID + QB_GROUP + "p.or", "true");
            }
        });

        queryStrategies.put("description", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, int predicateID, Map<String, String> queryMap) {
                String description = params[0].getString();
                queryMap.put(predicateID + QB_GROUP + "0" + QB_FULLTEXT, description);
                queryMap.put(predicateID + QB_GROUP + "0" + QB_FULLTEXT_RELPATH, METADATA_NODE_PATH + "/@description");
                queryMap.put(predicateID + QB_GROUP + "1" + QB_FULLTEXT, description);
                queryMap.put(predicateID + QB_GROUP + "1" + QB_FULLTEXT_RELPATH, METADATA_NODE_PATH + "/@dc:description");
                queryMap.put(predicateID + QB_GROUP + "p.or", "true");
            }
        });

        queryStrategies.put("tags", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, int predicateID, Map<String, String> queryMap) {
                int tagID = 0;
                int paramCount = params.length;
                while (paramCount-- > 0) {
                    queryMap.put(predicateID + "_tagid", params[tagID].getString());
                    queryMap.put(predicateID + "_tagid.property", METADATA_NODE_PATH + "/cq:tags");
                    predicateID++;
                    tagID++;
                }
            }
        });

        queryStrategies.put("orderby", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, int predicateID, Map<String, String> queryMap) {
                String orderByValue = params[0].getString();
                if (orderByValue.equals("name")) {
                    orderByValue = "title";
                }
                queryMap.put("orderby", "@" + METADATA_NODE_PATH + "/" + orderByValue);
            }
        });

        queryStrategies.put("sort", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, int predicateID, Map<String, String> queryMap) {
                queryMap.put("orderby.sort", params[0].getString());
            }
        });

        queryStrategies.put("offset", new QueryStrategy() {
            public void buildQuery(RequestParameter[] params, int predicateID, Map<String, String> queryMap) {
                queryMap.put("p.offset", params[0].getString());
            }
        });
    }

    @OSGiService
    private QueryBuilder queryBuilder;

    @OSGiService
    private ResourceResolverFactory resourceResolverFactory;

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

    @ValueMapValue
    @Inject
    @Default(longValues = 8)
    private long limit;

    private String htmlTooltip = "";
    private String pdfTooltip = "";
    private Long nextOffset = 0l;

    private String getAssetType() {
        // Decide on how to expose this method in authoring?
        return "dam:Asset";
    }

    private String getDataSource() {
        // Decide on how to expose this method in authoring?
        return "AEM";
    }

    @Override
    public List<PortalLister.Item> getItemList() {
        // call implementation depending on data source
        List<PortalLister.Item> result = null;
        if ("AEM".equals(getDataSource())) {
            try (ResourceResolver resourceResolver = resourceResolverFactory.getServiceResourceResolver(null)) {
                result = fetchViaQueryBuilder(resourceResolver);
            } catch (LoginException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    @Override
    public Long getNextOffset() {
        return nextOffset;
    }

    @Override
    public String getLimit() {
        String limitParam = request.getParameter("limit");
        if (StringUtils.isNotBlank(limitParam)) {
            return limitParam;
        }
        return String.valueOf(limit);
    }

    private void buildAssetSourcesQuery(int predicateID, Map<String, String> queryMap) {
        if (assetSources != null) {
            I18n i18n = new I18n(request);
            int counter = 1;
            for (Resource source : assetSources) {
                ValueMap assetSource = source.getValueMap();
                String renderType = assetSource.get("type", String.class);
                String typeValue = null;
                String renderKey = null;
                if (StringUtils.isBlank(renderType)) {
                    continue;
                } else if (renderType.equals("Adaptive Forms")) {
                    typeValue = "guide";
                    renderKey = "HTML";
                    htmlTooltip = i18n.get(assetSource.get("htmlTooltip", String.class));
                } else if (renderType.equals("PDF Forms")) {
                    typeValue = "pdfForm";
                    renderKey = "PDF";
                    pdfTooltip = i18n.get(assetSource.get("pdfTooltip", String.class));
                }

                String typePrefix = "group." + predicateID + QB_GROUP + counter + "_property";
                queryMap.put(typePrefix, "./jcr:content/type");
                queryMap.put(typePrefix + ".value", typeValue);
                queryMap.put(typePrefix + ".operation", "equals");
                counter++;

                typePrefix = "group." + predicateID + QB_GROUP + counter + "_property";
                queryMap.put(typePrefix, "./jcr:content/metadata/allowedRenderFormat");
                queryMap.put(typePrefix + ".0_value", "BOTH");      // this is ANDed with set renderKey
                queryMap.put(typePrefix + ".1_value", renderKey);
                queryMap.put(typePrefix + ".operation", "equals");

                counter++;
                predicateID++;
            }
            queryMap.put("group.p.or", "true");
        }
    }

    private void buildAssetFolderQuery(int predicateID, Map<String, String> queryMap) {
        if (assetFolders != null) {
            int counter = 0;
            for (Resource source : assetFolders) {
                ValueMap assetFolder = source.getValueMap();
                String folderPath = assetFolder.get("folder", String.class);
                if (StringUtils.isNotBlank(folderPath)) {
                    queryMap.put(predicateID + QB_GROUP + counter + QB_PATH, folderPath);
                    counter++;
                }
            }
        } else {
            // default search path
            queryMap.put(predicateID + QB_GROUP + "0" + QB_PATH, DEFAULT_PATH);
        }
        queryMap.put(predicateID + "_group.p.or", Boolean.TRUE.toString());
        predicateID++;
    }

    protected List<PortalLister.Item> fetchViaQueryBuilder(ResourceResolver resourceResolver) {
        RequestParameterMap parameterMap = request.getRequestParameterMap();
        Session session = null;
        // service resource resolver has fd-user access, ref OSGi configuration file
        session = resourceResolver.adaptTo(Session.class);
        List<PortalLister.Item> resultMap = new ArrayList<>();
        Map<String, String> queryMap = new HashMap<>();

        queryMap.put("type", getAssetType());
        queryMap.put("p.limit", getLimit());

        int predicateID = 0;    // used across all parameters
        for (Map.Entry<String, RequestParameter[]> entry : parameterMap.entrySet()) {
            QueryStrategy queryStrategy = queryStrategies.get(entry.getKey());
            if (queryStrategy != null) {
                queryStrategy.buildQuery(entry.getValue(), predicateID, queryMap);
            }
            predicateID++;
        }

        buildAssetSourcesQuery(predicateID, queryMap);
        buildAssetFolderQuery(predicateID, queryMap);

        PredicateGroup predicateGroup = PredicateGroup.create(queryMap);
        Query query = queryBuilder.createQuery(predicateGroup, session);
        SearchResult searchResult = query.getResult();

        long totalMatches = searchResult.getTotalMatches();
        long currentHits = searchResult.getHits().size();
        long startIndex = searchResult.getStartIndex();
        if (startIndex + currentHits < totalMatches) {
            nextOffset = startIndex + currentHits;
        }

        // Query builder has a leaking resource resolver, so the following work around is required.
        ResourceResolver leakingResourceResolver = null;
        try {
            Iterator<Resource> resourceIterator = searchResult.getResources();
            while (resourceIterator.hasNext()) {
                Resource resource = resourceIterator.next();
                if (leakingResourceResolver == null) {
                    // Get a reference to QB's leaking resource resolver
                    leakingResourceResolver = resource.getResourceResolver();
                }
                resultMap.add(fetchResourceProperties(resource));
            }
        } finally {
            if (leakingResourceResolver != null) {
                // Always close the leaking query builder resource resolver
                leakingResourceResolver.close();
            }
        }

        return resultMap;
    }

    private PortalLister.Item fetchResourceProperties(Resource r) {
        ValueMap valueMap = r.getValueMap();
        ValueMap metaDataMap = null;
        if (r.getChild(METADATA_NODE_PATH) != null) {
            metaDataMap = r.getChild(METADATA_NODE_PATH).getValueMap();
        }
        String title = null;
        String description = null;
        String path = r.getPath() + "/" + JcrConstants.JCR_CONTENT;
        String tooltip = "";

        if (metaDataMap != null && metaDataMap.containsKey("title")) {
            title = metaDataMap.get("title", String.class);
        } else if (valueMap.containsKey(JcrConstants.JCR_TITLE)) {
            title = valueMap.get(JcrConstants.JCR_TITLE, String.class);
        }
        if (metaDataMap != null && metaDataMap.containsKey("dc:description")) {
            description = metaDataMap.get("dc:description", String.class);
        } else if (metaDataMap != null && metaDataMap.containsKey("description")) {
            description = metaDataMap.get("description", String.class);
        } else if (valueMap.containsKey(JcrConstants.JCR_DESCRIPTION)) {
            description = valueMap.get(JcrConstants.JCR_DESCRIPTION, String.class);
        }

        if (metaDataMap != null && metaDataMap.containsKey("allowedRenderFormat")) {
            if (metaDataMap.get("allowedRenderFormat").equals("HTML")) {
                tooltip = htmlTooltip;
            } else {
                tooltip = pdfTooltip;
            }
        }

        return new Item(title, description, tooltip, path);
    }

    private class Item implements PortalLister.Item {
        private String title;
        private String description;
        private String tooltip;
        private String formLink;

        public Item(String title, String description, String tooltip, String formLink) {
            this.title = title;
            this.description = description;
            this.tooltip = tooltip;
            this.formLink = formLink;
        }

        @Override
        public String getTitle() {
            return title;
        }

        @Override
        public String getDescription() {
            return description;
        }

        @Override
        public String getTooltip() {
            return tooltip;
        }

        @Override
        public String getFormLink() {
            return formLink;
        }
    }

    private interface QueryStrategy {
        void buildQuery(RequestParameter[] params, int predicateID, Map<String, String> queryMap);
    }
}
