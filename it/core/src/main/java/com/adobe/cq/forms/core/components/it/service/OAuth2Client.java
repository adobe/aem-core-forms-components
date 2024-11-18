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

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Function;


public class OAuth2Client {
    private static final Logger LOG = LoggerFactory.getLogger(OAuth2Client.class);

    private final String tokenEndpoint;
    private final String clientId;
    private final String clientSecret;
    private final String apiEndpoint;
    private final CloseableHttpClient httpClient;

    private String accessToken;
    private long tokenExpirationTime;
    private final ReentrantLock lock = new ReentrantLock();

    public OAuth2Client(String tokenEndpoint, String clientId, String clientSecret, String apiEndpoint, CloseableHttpClient httpClient) {
        this.tokenEndpoint = tokenEndpoint;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.apiEndpoint = apiEndpoint;
        this.httpClient = httpClient;
    }

    public void publishOrDeleteFormModelJson(String formModelJson, Function<String, HttpRequestBase> requestSupplier) throws IOException {
        String token = getValidToken();
        HttpRequestBase request = requestSupplier.apply(apiEndpoint);
        request.setHeader("Authorization", "Bearer " + token);
        request.setHeader("Content-Type", "application/json");
        if (request instanceof HttpPost) {
            ((HttpPost) request).setEntity(new StringEntity(formModelJson));
        }

        try (CloseableHttpResponse response = httpClient.execute(request)) {
            if (response.getStatusLine().getStatusCode() == 401) {
                // Token expired, refresh and retry
                token = refreshOAuth2Token();
                request.setHeader("Authorization", "Bearer " + token);
                try (CloseableHttpResponse retryResponse = httpClient.execute(request)) {
                    if (retryResponse.getStatusLine().getStatusCode() != 200) {
                        throw new NotOk(retryResponse.getStatusLine().getStatusCode());
                    }
                }
            } else if (response.getStatusLine().getStatusCode() != 200) {
                throw new NotOk(response.getStatusLine().getStatusCode());
            }
        }
    }

    private String getValidToken() throws IOException {
        lock.lock();
        try {
            if (accessToken == null || System.currentTimeMillis() >= tokenExpirationTime) {
                accessToken = fetchOAuth2Token();
            }
            return accessToken;
        } finally {
            lock.unlock();
        }
    }

    private String fetchOAuth2Token() throws IOException {
        HttpPost post = new HttpPost(tokenEndpoint);
        post.setHeader("Content-Type", "application/x-www-form-urlencoded");
        post.setEntity(new StringEntity("grant_type=client_credentials&client_id=" + clientId + "&client_secret=" + clientSecret));

        try (CloseableHttpResponse response = httpClient.execute(post)) {
            if (response.getStatusLine().getStatusCode() == 200) {
                String responseBody = EntityUtils.toString(response.getEntity());
                return parseToken(responseBody);
            } else {
                throw new NotOk(response.getStatusLine().getStatusCode());
            }
        }
    }

    private String refreshOAuth2Token() throws IOException {
        HttpPost post = new HttpPost(tokenEndpoint);
        post.setHeader("Content-Type", "application/x-www-form-urlencoded");
        post.setEntity(new StringEntity("grant_type=refresh_token&refresh_token=your_refresh_token&client_id=" + clientId + "&client_secret=" + clientSecret));

        try (CloseableHttpResponse response = httpClient.execute(post)) {
            if (response.getStatusLine().getStatusCode() == 200) {
                String responseBody = EntityUtils.toString(response.getEntity());
                return parseToken(responseBody);
            } else {
                throw new NotOk(response.getStatusLine().getStatusCode());
            }
        }
    }

    private String parseToken(String responseBody) {
        try (JsonReader jsonReader = Json.createReader(new StringReader(responseBody))) {
            JsonObject jsonObject = jsonReader.readObject();
            long expiresIn = jsonObject.getJsonNumber("expires_in").longValue();
            tokenExpirationTime = System.currentTimeMillis() + (expiresIn * 1000) - 60000; // 1 minute buffer
            return jsonObject.getString("access_token");
        }
    }

    private static class NotOk extends IOException {
        NotOk(int status) {
            super("status code = " + status);
        }
    }
}
