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

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Image;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { TextInput.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_IMAGE_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class ImageImpl extends AbstractFieldImpl implements Image {

    /*
     * @Override
     * public String getSrcset() {
     * 
     * if (!StringUtils.isEmpty(srcSet)) {
     * return srcSet;
     * }
     * 
     * if (useAssetDelivery) {
     * srcSet = AssetDeliveryHelper.getSrcSet(assetDelivery, resource, imageName, extension, smartSizes,
     * jpegQuality);
     * if (!StringUtils.isEmpty(srcSet)) {
     * return srcSet;
     * }
     * }
     * 
     * int[] widthsArray = getWidths();
     * String srcUritemplate = getSrcUriTemplate();
     * String[] srcsetArray = new String[widthsArray.length];
     * if (widthsArray.length > 0 && srcUritemplate != null) {
     * srcUritemplate = StringUtils.replace(srcUriTemplate, URI_WIDTH_PLACEHOLDER_ENCODED, URI_WIDTH_PLACEHOLDER);
     * if (srcUritemplate.contains(URI_WIDTH_PLACEHOLDER)) {
     * // in case of dm image and auto smartcrop the srcset needs to generated client side
     * if (dmImage && StringUtils.equals(smartCropRendition, SMART_CROP_AUTO)) {
     * srcSet = EMPTY_PIXEL;
     * } else {
     * for (int i = 0; i < widthsArray.length; i++) {
     * if (srcUritemplate.contains("=" + URI_WIDTH_PLACEHOLDER)) {
     * srcsetArray[i] =
     * srcUritemplate.replace("{.width}", String.format("%s", widthsArray[i])) + " " + widthsArray[i] + "w";
     * } else {
     * srcsetArray[i] =
     * srcUritemplate.replace("{.width}", String.format(".%s", widthsArray[i])) + " " + widthsArray[i] + "w";
     * }
     * }
     * srcSet = StringUtils.join(srcsetArray, ',');
     * }
     * return srcSet;
     * }
     * }
     * return null;
     * }
     */

}
