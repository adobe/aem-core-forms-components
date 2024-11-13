/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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
package com.adobe.cq.forms.core.components.it.service;

import com.adobe.cq.forms.core.components.models.form.FormStructureParser;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.day.cq.replication.AgentConfig;
import com.day.cq.replication.ReplicationAction;
import com.day.cq.replication.ReplicationException;
import com.day.cq.replication.ReplicationResult;
import com.day.cq.replication.ReplicationTransaction;
import com.day.cq.replication.TransportContext;
import com.day.cq.replication.TransportHandler;
import com.day.cq.wcm.api.NameConstants;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.serviceusermapping.ServiceUserMapped;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Agent needs to be configured as per this, https://medium.com/@toimrank/aem-transporthandler-e761accaec51
 * https://blog.developer.adobe.com/reimagining-replication-agents-on-aem-as-a-cloud-service-a4437b7eeb60
 */

@Component(
        service = TransportHandler.class,
        property = {
                "service.ranking:Integer=1000"
        }
)
public class HeadlessTransportHandler implements TransportHandler {

    // todo: embedding credentials in source code risks unauthorized access
    private static final String CLIENT_ID = "your_client_id";
    private static final String CLIENT_SECRET = "your_client_secret";

    private static final Logger LOG = LoggerFactory.getLogger(HeadlessTransportHandler.class);
    private static final Map<String, Object> AUTH;
    private final static String URI = "corecomponentsitheadless";
    /**
     * The Sling ServiceUserMapper service allows for mapping Service IDs comprised of the Service
     * Names defined by the providing bundles and optional Subservice Name to ResourceResolver and/or
     * JCR Repository user IDs. This mapping is configurable such that system administrators are in
     * full control of assigning users to services. cf. http://sling.apache.org/documentation/the-sling-engine/service-authentication.html#implementation
     */
    private final static String USER_MAPPED_SUB_SERVICE_NAME = "core-components-it-replication-sub-service";

    static {
        AUTH = new HashMap<>();
        // name of subservice, this is part of ui.config
        AUTH.put(ResourceResolverFactory.SUBSERVICE, USER_MAPPED_SUB_SERVICE_NAME);
    }

    @Reference
    private HttpClientBuilderFactory clientBuilderFactory;
    @Reference
    private ResourceResolverFactory resourceResolverFactory;

    private CloseableHttpClient httpClient;

    @Activate
    protected void activate() {
        PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager();
        connectionManager.setDefaultMaxPerRoute(100);
        connectionManager.setMaxTotal(100);

        httpClient = clientBuilderFactory.newBuilder()
                .setConnectionManager(connectionManager)
                .setDefaultRequestConfig(RequestConfig.custom()
                        .setConnectTimeout(30000)
                        .setSocketTimeout(30000)
                        .setConnectionRequestTimeout(30000)
                        .build())
                .build();
    }

    @Deactivate
    protected void deactivate() {
        try {
            httpClient.close();
        } catch (IOException ex) {
            LOG.warn("[HeadlessTransportHandler] Failed to release http client: {}", ex.getMessage(), ex);
        }
    }

    @Override
    public boolean canHandle(AgentConfig agentConfig) {
        return StringUtils.equals(agentConfig.getTransportURI(), URI);
        // for oauth 2, hence commenting this
        //&& StringUtils.isNotEmpty(agentConfig.getTransportUser())
        // && StringUtils.isNotEmpty(agentConfig.getTransportPassword());

    }

    @Override
    public ReplicationResult deliver(TransportContext transportContext, ReplicationTransaction replicationTransaction)
            throws ReplicationException {
        ReplicationAction action = replicationTransaction.getAction();
        Function<String, HttpRequestBase> requestSupplier;

        switch (action.getType()) {
            case ACTIVATE:
                requestSupplier = HttpPost::new;
                break;
            case DEACTIVATE:
            case DELETE:
                requestSupplier = HttpDelete::new;
                break;
            default:
                LOG.debug("[HeadlessTransportHandler] Unsupported replication action type: {}", action);
                return new ReplicationResult(true, 405, "Method Not Allowed");
        }

        AgentConfig agentConfig = transportContext.getConfig();
        /*
        String transportUri = agentConfig.getTransportURI();
        String transportAuth = agentConfig.getTransportUser() + ':' + agentConfig.getTransportPassword();
        byte[] encodedAuth = Base64.encodeBase64(transportAuth.getBytes(StandardCharsets.ISO_8859_1));
        Header authHeader = new BasicHeader(HttpHeaders.AUTHORIZATION, "Basic " + new String(encodedAuth));
        Function<String, HttpRequestBase> authenticatedRequestSupplier = uri -> {
            HttpRequestBase request = requestSupplier.apply(uri);
            request.addHeader(authHeader);
            return request;
        }; */

        try (ResourceResolver resourceResolver = resourceResolverFactory.getServiceResourceResolver(AUTH)) {
            for (String path : action.getPaths()) {
                Resource resource = resourceResolver.getResource(path);
                if (resource == null || (!resource.isResourceType(NameConstants.NT_PAGE))) {
                    LOG.warn("[HeadlessTransportHandler] Resource not found or not a cq:Page {}. Skipping", path);
                    continue;
                }
                // get the model json from the resource
                FormStructureParser parser = resource.adaptTo(FormStructureParser.class);
                if (parser != null) {
                    boolean isFormContainerPresent = parser.containsFormContainer();
                    if (!isFormContainerPresent) {
                        LOG.warn("[HeadlessTransportHandler] No form container present inside page {}. Skipping", path);
                        continue;
                    } else {
                        Resource formContainerResource = getFormContainerResourceFromPage(resource);
                        if (formContainerResource != null) {
                            FormStructureParser parser2 = formContainerResource.adaptTo(FormStructureParser.class);
                            if (parser2 != null ) {
                                String formModelJson = parser2.getFormDefinition();
                                // todo: publish this form model json to the external system
                                LOG.info("[HeadlessTransportHandler] Form Model JSON: {}", formModelJson);
                                /**
                                 OAuth2Client oauth2Client = new OAuth2Client(
                                 "https://example.com/oauth2/token",
                                 "your_client_id",
                                 "your_client_secret",
                                 "https://example.com/api/publish",
                                 httpClient
                                 );
                                 oauth2Client.publishOrDeleteFormModelJson(formModelJson, requestSupplier);
                                 **/
                            } else {
                                LOG.warn("[HeadlessTransportHandler] Form structure parser not found for form container resource {}. Skipping", formContainerResource.getPath());
                            }
                        } else {
                            LOG.warn("[HeadlessTransportHandler] Form container resource not found for path {}. Skipping", path);
                        }
                    }
                } else {
                    LOG.warn("[HeadlessTransportHandler] Unable to adaptTo FormStructureParser for page {}. Skipping", path);
                }
            }
            return ReplicationResult.OK;
        } catch (LoginException /*| IOException */  ex) {
            throw new ReplicationException("Failed to get delivery url for: " + action, ex);
        }
    }

    private static Resource getFormContainerResourceFromPage(Resource resource) {
        if (resource == null) {
            return null;
        }
        if (ComponentUtils.isAFContainer(resource)) {
            return resource;
        }
        for (Resource child : resource.getChildren()) {
            Resource formContainerResource = getFormContainerResourceFromPage(child);
            if (formContainerResource != null) {
                return formContainerResource;
            }
        }
        return null;
    }

    private static class NotOk extends IOException {
        NotOk(int status) {
            super("status code = " + status);
        }
    }
}
