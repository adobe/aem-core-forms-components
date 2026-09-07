/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import org.apache.commons.lang3.StringUtils;

import com.adobe.cq.ui.wcm.commons.config.NextGenDynamicMediaConfig;

/**
 * Utility methods for resolving Next Gen Dynamic Media (NGDM) asset references
 * (of the form {@code /urn:aaid:aem:<asset-id>/<seo-name>.<format>}) into delivery URLs.
 */
public final class NgdmImageUtils {

    private static final String NGDM_REFERENCE_PREFIX = "/urn:";
    private static final String PATH_PLACEHOLDER_ASSET_ID = "{asset-id}";
    private static final String PATH_PLACEHOLDER_SEO_NAME = "{seo-name}";
    private static final String PATH_PLACEHOLDER_FORMAT = "{format}";
    private static final String DEFAULT_NGDM_ASSET_EXTENSION = "jpg";
    private static final int DEFAULT_NGDM_ASSET_WIDTH = 640;

    private NgdmImageUtils() {
    }

    public static boolean isNgdmImageReference(String fileReference) {
        if (StringUtils.isBlank(fileReference) || !fileReference.startsWith(NGDM_REFERENCE_PREFIX)) {
            return false;
        }
        // must have a non-empty asset-id segment and a non-empty seo-name segment, i.e.
        // "/urn:<asset-id>/<seo-name>[.<format>]", otherwise buildNgdmImageSrc() has nothing to parse.
        String withoutLeadingSlash = fileReference.substring(1);
        int slashIndex = withoutLeadingSlash.indexOf('/');
        return slashIndex > 0 && slashIndex < withoutLeadingSlash.length() - 1;
    }

    public static boolean isNgdmSupportAvailable(NextGenDynamicMediaConfig nextGenDynamicMediaConfig) {
        return nextGenDynamicMediaConfig != null && nextGenDynamicMediaConfig.enabled()
            && StringUtils.isNotBlank(nextGenDynamicMediaConfig.getRepositoryId());
    }

    /**
     * Builds the Next Gen Dynamic Media delivery URL for an asset reference of the form
     * {@code /urn:aaid:aem:<asset-id>/<seo-name>.<format>}.
     */
    public static String buildNgdmImageSrc(String fileReference, NextGenDynamicMediaConfig nextGenDynamicMediaConfig) {
        String withoutLeadingSlash = fileReference.substring(1);
        int slashIndex = withoutLeadingSlash.indexOf('/');
        String assetId = withoutLeadingSlash.substring(0, slashIndex);
        String assetFileName = withoutLeadingSlash.substring(slashIndex + 1);

        // split on the LAST dot, not the first: seo-names can legitimately contain dots
        // (e.g. "product.hero.png"), and a first-dot split would truncate the name and
        // produce the wrong extension.
        int lastDotIndex = assetFileName.lastIndexOf('.');
        String assetName = lastDotIndex >= 0 ? assetFileName.substring(0, lastDotIndex) : assetFileName;
        String assetExtension = lastDotIndex >= 0 ? assetFileName.substring(lastDotIndex + 1) : DEFAULT_NGDM_ASSET_EXTENSION;

        String imageDeliveryPath = nextGenDynamicMediaConfig.getImageDeliveryBasePath()
            .replace(PATH_PLACEHOLDER_ASSET_ID, assetId)
            .replace(PATH_PLACEHOLDER_SEO_NAME, assetName)
            .replace(PATH_PLACEHOLDER_FORMAT, assetExtension);

        return "https://" + nextGenDynamicMediaConfig.getRepositoryId() + imageDeliveryPath
            + "?width=" + DEFAULT_NGDM_ASSET_WIDTH + "&preferwebp=true";
    }
}
