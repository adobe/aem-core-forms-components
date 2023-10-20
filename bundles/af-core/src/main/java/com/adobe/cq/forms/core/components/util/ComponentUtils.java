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
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.BaseConstraint;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.policies.ContentPolicy;
import com.day.cq.wcm.api.policies.ContentPolicyManager;

import static com.adobe.cq.forms.core.components.internal.form.FormConstants.FORM_FIELD_TYPE;

/**
 * Utility helper functions for components.
 */
public class ComponentUtils {
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
        return resourceResolver.getResource(fragmentRef + "/" + JcrConstants.JCR_CONTENT + "/guideContainer");
    }

    public static boolean isFragmentComponent(Resource resource) {
        return resource != null && resource.getValueMap().get(FormConstants.PROP_FRAGMENT_PATH, String.class) != null;
    }

}
