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
package com.adobe.cq.forms.core.components.internal.servlets;

import java.io.IOException;
import java.io.InputStream;

import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.servlet.Servlet;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;

import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.day.cq.commons.ImageHelper;
import com.day.cq.commons.ImageResource;
import com.day.cq.wcm.api.WCMMode;
import com.day.cq.wcm.commons.AbstractImageServlet;
import com.day.cq.wcm.foundation.Image;
import com.day.image.Layer;

/**
 * Renders an image
 */

@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.resourceTypes=" + FormConstants.RT_FD_FORM_IMAGE_V1,
        "sling.servlet.methods=GET"
    })
public class StaticImageGETServlet extends AbstractImageServlet {

    @Override
    protected Layer createLayer(ImageContext c)
        throws RepositoryException, IOException {
        // don't create the layer yet. handle everything later
        return null;
    }

    /**
     * {@inheritDoc}
     *
     * Override default ImageResource creation to support assets
     */
    @Override
    protected ImageResource createImageResource(Resource resource) {
        return new Image(resource);
    }

    @Override
    protected void writeLayer(SlingHttpServletRequest req,
        SlingHttpServletResponse resp,
        ImageContext imageContext, Layer layer)
        throws IOException, RepositoryException {

        Image image = new Image(imageContext.resource);
        if (!image.hasContent()) {
            if (imageContext.defaultResource != null) {
                if (isRemovedDiff(imageContext)) {
                    image = new Image(imageContext.diffInfo.getContent());
                } else {
                    image = new Image(imageContext.defaultResource);
                }
            } else {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
        }

        // get style and set constraints
        image.loadStyleData(imageContext.style);

        // get pure layer
        layer = image.getLayer(false, false, false);
        boolean modified = false;

        if (layer != null) {
            // crop
            modified = image.crop(layer) != null;

            // rotate
            modified |= image.rotate(layer) != null;

            // resize
            modified |= image.resize(layer) != null;

            // apply diff if needed (because we create the layer inline)
            modified |= applyDiff(layer, imageContext);
        }

        // don't cache images on authoring instances
        // Cache-Control: no-cache allows caching (e.g. in the browser cache) but
        // will force revalidation using If-Modified-Since or If-None-Match every time,
        // avoiding aggressive browser caching
        if (!WCMMode.DISABLED.equals(WCMMode.fromRequest(req))) {
            resp.setHeader("Cache-Control", "no-cache");
        }
        // Prevent opening svg in new window,and instead enforce download
        if ("image/svg+xml".equals(image.getMimeType())) {
            resp.setHeader("Content-Disposition", "attachment");
        }
        if (modified) {
            String mimeType = image.getMimeType();
            if (ImageHelper.getExtensionFromType(mimeType) == null) {
                // get default mime type
                mimeType = "image/png";
            }
            resp.setContentType(mimeType);
            layer.write(mimeType, mimeType.equals("image/gif") ? 255 : 1.0, resp.getOutputStream());
        } else {
            // do not re-encode layer, just spool
            Property data = image.getData();
            InputStream in = data.getStream();
            resp.setContentLength((int) data.getLength());
            resp.setContentType(image.getMimeType());
            IOUtils.copy(in, resp.getOutputStream());
            in.close();
        }
        resp.flushBuffer();
    }
}
