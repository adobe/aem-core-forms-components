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
package com.adobe.cq.forms.core.components.internal.models.v2.formsportal;

import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.models.formsportal.Link;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { Link.class, ComponentExporter.class },
    resourceType = LinkImpl.RESOURCE_TYPE)
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class LinkImpl extends com.adobe.cq.forms.core.components.internal.models.v1.formsportal.LinkImpl {

    public static final String RESOURCE_TYPE = "core/fd/components/formsportal/link/v2/link";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String adaptiveFormPath;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String pdfPath;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String otherAssetPath;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String externalLinkPath;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String assetType;

    @Override
    public String getAssetPath() {
        switch (getAssetType()) {
            case ADAPTIVE_FORM:
                return adaptiveFormPath;
            case PDF:
                return pdfPath;
            case OTHERS:
                return otherAssetPath;
            case EXTERNAL_LINK:
                return externalLinkPath;
            case NONE:
                break;
        }
        return super.getAssetPath();
    }

    @Override
    public AssetType getAssetType() {
        if (assetType != null) {
            switch (assetType) {
                case "PDF":
                    return AssetType.PDF;
                case "Others":
                    return AssetType.OTHERS;
                case "External":
                    return AssetType.EXTERNAL_LINK;
                default:
                    break;
            }
        }
        return super.getAssetType();
    }
}
