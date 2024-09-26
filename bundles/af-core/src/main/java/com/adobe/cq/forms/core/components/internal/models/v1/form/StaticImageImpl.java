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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.io.IOException;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.jcr.RepositoryException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.StaticImage;
import com.adobe.cq.forms.core.components.util.AbstractFormComponentImpl;
import com.day.cq.wcm.foundation.Image;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { StaticImage.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_IMAGE_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class StaticImageImpl extends AbstractFormComponentImpl implements StaticImage {

    public static final String DAM_REPO_PATH = "fd:repoPath";

    private Image image;

    @SlingObject
    private Resource resource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_ALT_TEXT)
    @Nullable
    protected String altText;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_IMAGE_SRC)
    @Nullable
    protected String imageSrc;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DESCRIPTION)
    @org.jetbrains.annotations.Nullable
    protected String description; // long description as per current spec

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_FILE_REF)
    @Nullable
    protected String fileReference;

    /**
     * Returns the source where the image is present.
     *
     * @return String representing source of the image.
     */
    @Override
    public String getImageSrc() throws RepositoryException, IOException {
        image = new Image(this.resource);
        boolean containsData = (image.getData() != null);
        if (containsData) {
            image.setSelector(".img");
            return image.getSrc();
        } else {
            return null;
        }
    }

    @Override
    public String getValue() {
        try {
            return getImageSrc();
        } catch (Exception e) {

        }
        return null;
    }

    /**
     * Returns the alternate text of the Image configured in the authoring dialog.
     * 
     * @return String representing alternate text
     */
    @Override
    @Nullable
    public String getAltText() {
        return translate("altText", altText);
    }

    @Override
    public String getDataRef() {
        return null;
    }

    @Override
    @JsonIgnore
    public String getDescription() {
        return description;
    }

    @Override
    @JsonIgnore
    public String getLinkUrl() {
        try {
            return getImageSrc();
        } catch (RepositoryException | IOException e) {
            return null;
        }
    }

    @Override
    public @Nonnull Map<String, Object> getProperties() {
        Map<String, Object> properties = super.getProperties();
        if (fileReference != null && fileReference.length() > 0) {
            properties.put(DAM_REPO_PATH, fileReference);
        }
        return properties;
    }

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.IMAGE);
    }
}
