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

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.adobe.cq.forms.core.components.models.form.FormStructureParser;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.Header;
import org.apache.http.HttpHeaders;
import org.apache.http.StatusLine;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicHeader;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.day.cq.replication.AgentConfig;
import com.day.cq.replication.ReplicationAction;
import com.day.cq.replication.ReplicationException;
import com.day.cq.replication.ReplicationResult;
import com.day.cq.replication.ReplicationTransaction;
import com.day.cq.replication.TransportContext;
import com.day.cq.replication.TransportHandler;
import com.day.cq.wcm.api.NameConstants;

/**
 * Agent needs to be configured as per this, https://medium.com/@toimrank/aem-transporthandler-e761accaec51
 * URL: http://localhost:4502/etc/replication/agents.author.html
 */

@Component(
        service = TransportHandler.class,
        property = {
                "service.ranking:Integer=1000"
        }
)
public class HeadlessTransportHandler implements TransportHandler {

    private static final Logger LOG = LoggerFactory.getLogger(HeadlessTransportHandler.class);
    private static final Map<String, Object> AUTH;
    private final static String URI = "jpmcbcmtest";

    static {
        AUTH = new HashMap<>();
        AUTH.put(ResourceResolverFactory.SUBSERVICE, "replication");
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
            LOG.warn("Failed to release http client: {}", ex.getMessage(), ex);
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
                LOG.debug("Unsupported replication action type: {}", action);
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
                    LOG.warn("Resource not found or not a cq:Page {}. Skipping", path);
                    continue;
                }
                // get the model json from the resource
                FormStructureParser parser = resource.adaptTo(FormStructureParser.class);
                if (parser != null) {
                    String formContainerPath = parser.getFormContainerPath();
                    if (StringUtils.isBlank(formContainerPath)) {
                        LOG.warn("No form container found for page {}. Skipping", path);
                        continue;
                    } else {
                        Resource formContainerResource = resourceResolver.getResource(formContainerPath);
                        String formModelJson = formContainerResource.adaptTo(FormStructureParser.class).getFormDefinition();
                        // todo: publish this form model json to the external system
                    }
                } else {
                    LOG.warn("No form structure parser found for page {}. Skipping", path);
                }
            }

            return ReplicationResult.OK;
        } catch (LoginException ex) {
            throw new ReplicationException("Failed to get delivery url for: " + action, ex);
        }
    }

    private static class NotOk extends IOException {
        NotOk(int status) {
            super("status code = " + status);
        }
    }
}
