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

import javax.jcr.RepositoryException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.StaticImage;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.day.cq.wcm.foundation.Image;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { StaticImage.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_IMAGE_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class StaticImageImpl extends AbstractFieldImpl implements StaticImage {

    private Image image;

    @SlingObject
    private Resource resource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String altText;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String imageSrc;

    /**
     * Returns the source where the image is present.
     *
     * @return String representing source of the image.
     */
    @Override
    public String getImageSrc() throws RepositoryException, IOException {
        System.out.println(" starting for image data empty:");
        image = new Image(this.resource);

        Boolean containsData = (image.getData() != null);
        System.out.println(" Check for image data :" + String.valueOf(containsData));
        if (containsData) {
            image.setSelector(".img");
            System.out.println(" Check for image data full :" + image.getSrc());
            return image.getSrc();
        } else {
            System.out.println(" Check for image data empty:");
            return "";
        }
    }

    /**
     * Returns the alternate text of the Image configured in the authoring dialog.
     * 
     * @return String representing alternate text
     */
    @Override
    public String getAltText() {
        return altText;
    }

}
