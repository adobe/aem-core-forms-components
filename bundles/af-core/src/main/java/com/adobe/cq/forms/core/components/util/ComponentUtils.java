/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe
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
package com.adobe.cq.forms.core.components.util;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.http.util.EntityUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.BaseConstraint;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.policies.ContentPolicy;
import com.day.cq.wcm.api.policies.ContentPolicyManager;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

import static com.adobe.cq.forms.core.components.internal.form.FormConstants.FORM_FIELD_TYPE;

/**
 * Utility helper functions for components.
 */
public class ComponentUtils {

    private static final String EDGE_DELIVERY_FRAGMENT_CONTAINER_REL_PATH = "root/section/form";
    private static final String[] EDGE_DELIVERY_RESOURCE_TYPES = new String[] { "core/franklin/components/page/v1/page" };
    private static final Logger logger = LoggerFactory.getLogger(ComponentUtils.class);

    /**
     * Private constructor to prevent instantiation of utility class.
     */
    private ComponentUtils() {
        // NOOP
    }

    /**
     * Returns the base64 encoded path
     *
     * @param path page path
     * @return base64 encoded path
     */
    @NotNull
    public static String getEncodedPath(@NotNull String path) {
        return new String(Base64.getEncoder().encode(path.getBytes(StandardCharsets.UTF_8)), StandardCharsets.UTF_8);
    }

    /**
     * Checks if the given resource if a core adaptive form container
     *
     * @param resource reference to the {@link Resource}
     * @return true, if it is an adaptive form container, false otherwise
     */
    @NotNull
    public static boolean isAFContainer(@NotNull Resource resource) {
        String fieldType = resource.getValueMap().get("fieldType", String.class);
        return FORM_FIELD_TYPE.equals(fieldType);
    }

    /**
     * Returns the form container resource
     *
     * @param resource reference to the {@link Resource}
     * @return form container resource, null if no form container found
     */
    public static Resource getFormContainer(Resource resource) {
        if (resource == null) {
            return null;
        }
        if (isAFContainer(resource)) {
            return resource;
        }
        return getFormContainer(resource.getParent());
    }

    /**
     * Translates the given property as per the {@link I18n} object passed
     *
     * @param propertyValue value of the property (for example, in case of array type property, one needs to pass the value stored in array
     *            index)
     * @param propertyName name of the property
     * @param resource reference to the {@link Resource}
     * @param i18n reference to the {@link I18n} object
     * @return translated value
     */
    @NotNull
    public static String translate(@NotNull String propertyValue, @NotNull String propertyName, @NotNull Resource resource,
        @Nullable I18n i18n) {
        return translate(propertyValue, propertyName, resource.getValueMap(), i18n);
    }

    /**
     * Translates the given property as per the {@link I18n} object passed
     *
     * @param propertyValue value of the property (for example, in case of array type property, one needs to pass the value stored in array
     *            index)
     * @param propertyName name of the property
     * @param valueMap reference to the {@link ValueMap}
     * @param i18n reference to the {@link I18n} object
     * @return translated value
     */
    @NotNull
    public static String translate(@NotNull String propertyValue, @NotNull String propertyName, @NotNull ValueMap valueMap,
        @Nullable I18n i18n) {
        String translatedValue = propertyValue;
        if (i18n != null) {
            translatedValue = GuideUtils.translateOrReturnOriginal(propertyValue, propertyName, i18n, valueMap);
        }
        return translatedValue;
    }

    /**
     * Returns clone of the date object (mutable) provided as input
     *
     * @param date date
     * @return clone of date object
     */
    public static Date clone(@Nullable Date date) {
        return Optional.ofNullable(date)
            .map(Date::getTime)
            .map(Date::new)
            .orElse(null);
    }

    /**
     * Retrieves the exclusive value based on certain conditions.
     *
     * @param exclusiveValue The exclusive value to be checked.
     * @param value The actual value to be returned if conditions are met.
     * @param exclusiveValueCheck An additional check for exclusive value.
     * @return The exclusive value if conditions are met; otherwise, null.
     */
    public static <T> T getExclusiveValue(Object exclusiveValue, T value, Object exclusiveValueCheck) {
        // Check if exclusive value is a boolean and true, and value is not null
        if (exclusiveValue instanceof Boolean && (Boolean.TRUE.equals(exclusiveValue) || Boolean.TRUE.equals(exclusiveValueCheck))
            && value != null) {
            // If so, return the value
            return (T) value;
        } else if (exclusiveValue instanceof Long) { // special case
            // If exclusive value is already a long, return it directly
            return (T) exclusiveValue;
        } else if (exclusiveValue instanceof String) {
            // Check if exclusive value is a boolean string and true, and value is not null
            if (((String) exclusiveValue).equalsIgnoreCase("true") && value != null) {
                return (T) value;
            } else {
                return null;
            }
        } else if (Boolean.TRUE.equals(exclusiveValueCheck) && value != null) { // backward compatibility case // not to be changed
            // If so, return the value
            return (T) value;
        } else {
            // Handle other cases or return null if desired
            return null;
        }
    }

    /**
     * Parses a given string value into a Number.
     * The method attempts to parse the string as a Long first, and if that fails,
     * it attempts to parse it as a Float. If both parsing attempts fail, it returns null.
     *
     * @param value the string value to be parsed, can be null
     * @return the parsed Number (Long or Float), or null if the value cannot be parsed
     */
    public static Number parseNumber(@Nullable String value) {
        try {
            return value != null ? Long.parseLong(value) : null;
        } catch (NumberFormatException e) {
            try {
                return Float.parseFloat(value);
            } catch (NumberFormatException ex) {
                return null;
            }
        }
    }

    @NotNull
    public static Object[] coerce(@NotNull BaseConstraint.Type type, @NotNull Object[] objArr) {
        if (type.equals(type.NUMBER) || type.equals(type.NUMBER_ARRAY)) {
            return Arrays.stream(objArr)
                .filter(Objects::nonNull)
                .map(Object::toString)
                .map(Long::parseLong)
                .toArray(Long[]::new);
        } else if (type.equals(type.BOOLEAN) || type.equals(type.BOOLEAN_ARRAY)) {
            return Arrays.stream(objArr)
                .filter(Objects::nonNull)
                .map(Object::toString)
                .map(Boolean::parseBoolean)
                .toArray(Boolean[]::new);
        } else {
            return ArrayUtils.clone(objArr);
        }
    }

    public static ContentPolicy getPolicy(String contentPath, ResourceResolver resourceResolver) {
        ContentPolicy policy = null;
        Resource contentResource = resourceResolver.getResource(contentPath);
        ContentPolicyManager policyManager = resourceResolver.adaptTo(ContentPolicyManager.class);
        if (contentResource != null && policyManager != null) {
            policy = policyManager.getPolicy(contentResource);
        }
        return policy;
    }

    public static Resource getFragmentContainer(ResourceResolver resourceResolver, @NotNull String fragmentPath) {
        String fragmentRef = fragmentPath;
        if (StringUtils.contains(fragmentPath, "/content/dam/formsanddocuments")) {
            fragmentRef = GuideUtils.convertFMAssetPathToFormPagePath(fragmentPath);
        }
        Resource pageContentResource = resourceResolver.getResource(fragmentRef + "/" + JcrConstants.JCR_CONTENT);
        if (pageContentResource != null) {
            if (Arrays.stream(EDGE_DELIVERY_RESOURCE_TYPES).anyMatch(pageContentResource::isResourceType)) {
                return pageContentResource.getChild(EDGE_DELIVERY_FRAGMENT_CONTAINER_REL_PATH);
            }
            return pageContentResource.getChild("guideContainer");
        }
        return null;
    }

    public static boolean isFragmentComponent(Resource resource) {
        return resource != null && resource.getValueMap().get(FormConstants.PROP_FRAGMENT_PATH, String.class) != null;
    }

    /**
     * Determines whether submit properties should be included in the form
     * definition.
     * 
     * <p>
     * This method checks if the request contains x-adobe-form-definition attribute
     * or header and if it is equal to submission
     * that indicates submit properties should be included in the form definition.
     * </p>
     *
     * @param request the {@link SlingHttpServletRequest} to check
     * @return true if submit properties should be included, false otherwise
     */
    public static boolean shouldIncludeSubmitProperties(SlingHttpServletRequest request) {
        if (request == null) {
            return false;
        }
        String submissionHeaderName = FormConstants.FORM_DEFINITION_SUBMISSION;
        return submissionHeaderName.equals(request.getAttribute(FormConstants.X_ADOBE_FORM_DEFINITION)) ||
            submissionHeaderName.equals(request.getHeader(FormConstants.X_ADOBE_FORM_DEFINITION));
    }

    /**
     * Retrieves a list of supported submit actions from the Adobe Forms service.
     * 
     * <p>
     * This method makes an HTTP GET request to the Adobe Forms service to fetch
     * the list of supported submit actions. The response is expected to be a
     * JSON object containing a "submissions" array of action names, which is then
     * converted to a list.
     * </p>
     * 
     * <p>
     * If the request fails or an error occurs during processing, an error is logged
     * and an empty list is returned.
     * </p>
     *
     * @param clientBuilderFactory The HTTP client builder factory used to create
     *            the HTTP client
     * @return A list of supported submit action names, or an empty list if the
     *         request fails
     */
    public static List<String> getSupportedSubmitActions(HttpClientBuilderFactory clientBuilderFactory) {
        String supportedSubmitActionsUrl = "https://forms.adobe.com/adobe/forms/af/submit";
        List<String> supportedSubmitActions = new ArrayList<>();
        if (clientBuilderFactory == null) {
            logger.error("clientBuilderFactory is null");
            return supportedSubmitActions;
        }
        try {
            RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(5000)
                .setSocketTimeout(5000)
                .setConnectionRequestTimeout(5000)
                .build();
            CloseableHttpClient httpClient = clientBuilderFactory.newBuilder()
                .setDefaultRequestConfig(requestConfig)
                .build();
            HttpGet httpGet = new HttpGet(supportedSubmitActionsUrl);
            try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
                if (isSuccessfulResponse(response)) {
                    String responseBody = EntityUtils.toString(response.getEntity());
                    JsonNode rootNode = new ObjectMapper().readTree(responseBody);
                    ArrayNode submissionsNode = (ArrayNode) rootNode.get("supported");
                    if (submissionsNode != null && submissionsNode.isArray()) {
                        submissionsNode.forEach(submission -> {
                            String submissionText = submission.asText();
                            supportedSubmitActions.add(submissionText);
                        });
                    } else {
                        logger.error("supported node was null or not an array");
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error while fetching supported submit actions", e);
        }
        return supportedSubmitActions;
    }

    private static boolean isSuccessfulResponse(CloseableHttpResponse response) {
        return response.getStatusLine() != null
            && response.getStatusLine().getStatusCode() == java.net.HttpURLConnection.HTTP_OK;
    }

}
