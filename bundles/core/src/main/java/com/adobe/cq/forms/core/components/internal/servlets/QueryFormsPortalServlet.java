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
package com.adobe.cq.forms.core.components.internal.servlets;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.jcr.Session;
import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.vault.util.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.forms.core.components.internal.models.v1.formsportal.SearchAndListerImpl;
import com.day.cq.i18n.I18n;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.SearchResult;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component(
    service = Servlet.class,
    property = {
        "sling.servlet.methods=" + HttpConstants.METHOD_GET,
        "sling.servlet.resourceTypes=" + SearchAndListerImpl.RESOURCE_TYPE,
        "sling.servlet.selectors=" + QueryFormsPortalServlet.SELECTOR,
        "sling.servlet.extensions=" + QueryFormsPortalServlet.EXTENSION
    })
public class QueryFormsPortalServlet extends SlingAllMethodsServlet {
    public static final String SELECTOR = "fpquery";
    public static final String EXTENSION = "json";

    private static final Logger LOGGER = LoggerFactory.getLogger(QueryFormsPortalServlet.class);

    private static final String METADATA_NODE_PATH = JcrConstants.JCR_CONTENT + "/metadata";

    private static final String QB_GROUP = "_group.";
    private static final String QB_PATH = "_path";
    private static final String QB_FULLTEXT = "_fulltext";
    private static final String QB_FULLTEXT_RELPATH = "_fulltext.relPath";
    private static final String DEFAULT_PATH = "/content/dam/formsanddocuments";

    @Reference
    private QueryBuilder queryBuilder;

    @Reference
    private ResourceResolverFactory resourceResolverFactory;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        Map<String, Object> results = new HashMap<>();
        try {
            I18n i18n = new I18n(request);
            RequestParameterMap parameterMap = request.getRequestParameterMap();
            Resource requester = request.getResource();
            ResourceResolver resourceResolver = resourceResolverFactory.getServiceResourceResolver(null);
            results.put("data", queryFormsAssets(i18n, parameterMap, resourceResolver, results, requester));
            results.put("success", "true");
        } catch (Exception ex) {
            LOGGER.error("Exception while processing FP Query {}", ex.getMessage(), ex);
            results.put("success", "false");
        }
        new ObjectMapper().writeValue(response.getWriter(), results);
    }

    private List<Map<String, Object>> queryFormsAssets(I18n i18n, RequestParameterMap parameterMap,
        ResourceResolver serviceResourceResolver, Map<String, Object> results, Resource requester) {
        Session session = serviceResourceResolver.adaptTo(Session.class);
        List<Map<String, Object>> resultMap = new ArrayList<>();
        Map<String, String> queryMap = new HashMap<>();

        queryMap.put("type", "dam:Asset");

        int predicateID = 0;    // used across all parameters

        for (Map.Entry<String, RequestParameter[]> entry : parameterMap.entrySet()) {
            String paramName = entry.getKey();
            RequestParameter[] paramValue = entry.getValue();
            int paramCount = paramValue.length;

            if (paramName.equals("searchText")) {
                int counter = 0;
                while (paramCount-- > 0) {
                    String text = paramValue[counter].getString();
                    if (StringUtils.isNotBlank(text)) {
                        queryMap.put(predicateID + QB_FULLTEXT, text);
                        queryMap.put(predicateID + QB_FULLTEXT_RELPATH, METADATA_NODE_PATH);
                        predicateID++;
                    }
                    counter++;
                }
            } else if (paramName.equals("title")) {
                String title = paramValue[0].getString();
                queryMap.put(predicateID + QB_GROUP + "0" + QB_FULLTEXT, title);
                queryMap.put(predicateID + QB_GROUP + "0" + QB_FULLTEXT_RELPATH, METADATA_NODE_PATH + "/@title");
                queryMap.put(predicateID + QB_GROUP + "1" + QB_FULLTEXT, title);
                queryMap.put(predicateID + QB_GROUP + "1" + QB_FULLTEXT_RELPATH, METADATA_NODE_PATH + "/@dc:title");
                queryMap.put(predicateID + QB_GROUP + "p.or", "true");
            } else if (paramName.equals("description")) {
                String description = paramValue[0].getString();
                queryMap.put(predicateID + QB_GROUP + "0" + QB_FULLTEXT, description);
                queryMap.put(predicateID + QB_GROUP + "0" + QB_FULLTEXT_RELPATH, METADATA_NODE_PATH + "/@description");
                queryMap.put(predicateID + QB_GROUP + "1" + QB_FULLTEXT, description);
                queryMap.put(predicateID + QB_GROUP + "1" + QB_FULLTEXT_RELPATH, METADATA_NODE_PATH + "/@dc:description");
                queryMap.put(predicateID + QB_GROUP + "p.or", "true");
            } else if (paramName.equals("tags")) {
                int tagID = 0;
                while (paramCount-- > 0) {
                    queryMap.put(predicateID + "_tagid", paramValue[tagID].getString());
                    queryMap.put(predicateID + "_tagid.property", METADATA_NODE_PATH + "/cq:tags");
                    predicateID++;
                    tagID++;
                }
            } else if (paramName.equals("orderby")) {
                String orderByValue = paramValue[0].getString();
                if (orderByValue.equals("name")) {
                    orderByValue = "title";
                }
                queryMap.put("orderby", "@" + METADATA_NODE_PATH + "/" + orderByValue);
            } else if (paramName.equals("sort")) {
                queryMap.put("orderby.sort", paramValue[0].getString());
            } else if (paramName.equals("offset")) {
                queryMap.put("p.offset", paramValue[0].getString());
            } else if (paramName.equals("limit")) {
                queryMap.put("p.limit", paramValue[0].getString());
            }
            predicateID++;
        }

        Resource assetSources = requester.getChild("assetSource");
        Resource assetFolders = requester.getChild("assetFolders");

        if (assetSources != null) {
            int counter = 1;
            for (Resource source : assetSources.getChildren()) {
                ValueMap assetSource = source.getValueMap();
                String renderType = assetSource.get("type", String.class);
                String typeValue = null;
                String renderKey = null;
                if (StringUtils.isBlank(renderType)) {
                    continue;
                } else if (renderType.equals("Adaptive Forms")) {
                    typeValue = "guide";
                    renderKey = "HTML";
                    results.put("htmlTooltip", i18n.get(assetSource.get("htmlTooltip", String.class)));
                } else if (renderType.equals("PDF Forms")) {
                    typeValue = "pdfForm";
                    renderKey = "PDF";
                    results.put("pdfTooltip", i18n.get(assetSource.get("pdfTooltip", String.class)));
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

        if (assetFolders != null) {
            int counter = 0;
            for (Resource source : assetFolders.getChildren()) {
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

        PredicateGroup predicateGroup = PredicateGroup.create(queryMap);
        Query query = queryBuilder.createQuery(predicateGroup, session);
        SearchResult searchResult = query.getResult();

        long totalMatches = searchResult.getTotalMatches();
        long currentHits = searchResult.getHits().size();
        long startIndex = searchResult.getStartIndex();
        if (startIndex + currentHits < totalMatches) {
            results.put("nextOffset", startIndex + currentHits);
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

    private Map<String, Object> fetchResourceProperties(Resource r) {
        Map<String, Object> result = new HashMap<>();
        ValueMap valueMap = r.getValueMap();
        ValueMap metaDataMap = null;
        if (r.getChild(METADATA_NODE_PATH) != null) {
            metaDataMap = r.getChild(METADATA_NODE_PATH).getValueMap();
        }
        String title = null;
        if (metaDataMap != null && metaDataMap.containsKey("title")) {
            title = metaDataMap.get("title", String.class);
        } else if (valueMap.containsKey(JcrConstants.JCR_TITLE)) {
            title = valueMap.get(JcrConstants.JCR_TITLE, String.class);
        }
        String description = null;
        if (metaDataMap != null && metaDataMap.containsKey("dc:description")) {
            description = metaDataMap.get("dc:description", String.class);
        } else if (metaDataMap != null && metaDataMap.containsKey("description")) {
            description = metaDataMap.get("description", String.class);
        } else if (valueMap.containsKey(JcrConstants.JCR_DESCRIPTION)) {
            description = valueMap.get(JcrConstants.JCR_DESCRIPTION, String.class);
        }
        if (StringUtils.isNotBlank(description)) {
            result.put("description", description);
        }
        if (StringUtils.isNotBlank(title)) {
            result.put("title", title);
        }
        result.put("path", r.getPath() + "/" + JcrConstants.JCR_CONTENT);
        return result;
    }
}
