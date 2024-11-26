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
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.concurrent.locks.ReentrantLock;

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
import java.io.StringReader;
import java.util.function.Function;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * Uses the OAuth2 Client Credentials flow with a signed JWT (client assertion) for certificate-based authentication.
 * The token request payload includes grant_type, client_id, client_assertion_type, client_assertion, and resource.
 * The signed JWT includes claims such as iss, sub, aud, jti, iat, and exp.
 * The JWT is signed using a private key and includes a certificate thumbprint in the header.
 *
 * Uses a signed JWT (client assertion) with a private key and certificate thumbprint.
 * Provides enhanced security by using certificate-based authentication and a signed JWT.
 */
public class OAuth2Client {
    private static final Logger LOG = LoggerFactory.getLogger(OAuth2Client.class);

    private final String tokenEndpoint;
    private final String clientId;
    private final String privateKey;
    private final String certificateThumbprint;
    private final String resource;
    private final CloseableHttpClient httpClient;

    private String accessToken;
    private long tokenExpirationTime;
    private final ReentrantLock lock = new ReentrantLock();

    public OAuth2Client(String tokenEndpoint, String clientId, String privateKey, String certificateThumbprint, String resource, CloseableHttpClient httpClient) {
        this.tokenEndpoint = tokenEndpoint;
        this.clientId = clientId;
        this.privateKey = privateKey;
        this.certificateThumbprint = certificateThumbprint;
        this.resource = resource;
        this.httpClient = httpClient;
    }

    public void publishOrDeleteFormModelJson(String formModelJson, String apiEndpoint, Function<String, HttpRequestBase> requestSupplier) throws IOException {
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

        String clientAssertion = generateClientAssertion();

        String payload = "grant_type=client_credentials&client_id=" + clientId + "&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=" + clientAssertion + "&resource=" + resource;

        post.setEntity(new StringEntity(payload));

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
        return fetchOAuth2Token(); // Assuming the same flow for refresh token
    }

    private String parseToken(String responseBody) {
        try (JsonReader jsonReader = Json.createReader(new StringReader(responseBody))) {
            JsonObject jsonObject = jsonReader.readObject();
            long expiresIn = jsonObject.getJsonNumber("expires_in").longValue();
            tokenExpirationTime = System.currentTimeMillis() + (expiresIn * 1000) - 60000; // 1 minute buffer
            return jsonObject.getString("access_token");
        }
    }

    private String generateClientAssertion() {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        // Create the JWT claims
        JsonObject claims = Json.createObjectBuilder()
                .add("iss", clientId)
                .add("sub", clientId)
                .add("aud", tokenEndpoint)
                .add("jti", java.util.UUID.randomUUID().toString())
                .add("iat", nowMillis / 1000)
                .add("exp", (nowMillis / 1000) + 300) // 5 minutes expiration
                .build();

        // Create the JWT header
        JsonObject header = Json.createObjectBuilder()
                .add("alg", "RS256")
                .add("x5t", certificateThumbprint)
                .build();

        // Sign the JWT
        return Jwts.builder()
                .setHeaderParam("x5t", certificateThumbprint)
                .setClaims(claims)
                .setHeaderParam("typ", "JWT")
                .signWith(SignatureAlgorithm.RS256, getPrivateKey())
                .compact();
    }

    private PrivateKey getPrivateKey() {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(privateKey);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePrivate(spec);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load private key", e);
        }
    }

    private static class NotOk extends IOException {
        NotOk(int status) {
            super("status code = " + status);
        }
    }
}