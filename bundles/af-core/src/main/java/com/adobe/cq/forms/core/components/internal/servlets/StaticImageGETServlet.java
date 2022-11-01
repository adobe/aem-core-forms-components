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
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.jetbrains.annotations.Nullable;
import org.osgi.service.component.annotations.Component;

import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.StaticImage;
import com.day.cq.commons.ImageHelper;
import com.day.cq.commons.ImageResource;
import com.day.cq.wcm.api.WCMMode;
import com.day.cq.wcm.commons.AbstractImageServlet;
import com.day.cq.wcm.foundation.Image;
import com.day.image.Layer;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
        throws ServletException, IOException {
        String extension = request.getRequestPathInfo().getExtension();
        if ("json".equals(extension)) {
            StaticImage staticImage = request.adaptTo(StaticImage.class);
            if (staticImage != null) {
                ObjectMapper mapper = new ObjectMapper();
                response.setContentType("application/json");
                response.getWriter().write(mapper.writeValueAsString(staticImage));
            }
        } else {
            super.doGet(request, response);
        }

    }

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
        image = getImage(resp, imageContext, image);
        if (image == null)
            return;

        layer = getLayer(imageContext, image);
        boolean modified = false;

        modified = isModified(req, resp, imageContext, layer, image, modified);
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

            extracted(resp, image);
        }
        resp.flushBuffer();
    }

    protected boolean isModified(SlingHttpServletRequest req, SlingHttpServletResponse resp, ImageContext imageContext, Layer layer,
        Image image, boolean modified) throws RepositoryException {
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
        return modified;
    }

    protected Layer getLayer(ImageContext imageContext, Image image) throws IOException, RepositoryException {
        Layer layer = null;
        try {
            // get style and set constraints
            if (image != null) {
                image.loadStyleData(imageContext.style);

                // get pure layer
                layer = image.getLayer(false, false, false);
            }
        } catch (Exception e) {
            System.out.println("Exception occured while rendering image " + e);
        }
        return layer;
    }

    @Nullable
    protected Image getImage(SlingHttpServletResponse resp, ImageContext imageContext, Image image) throws IOException {
        if (!image.hasContent()) {
            if (imageContext.defaultResource != null) {
                if (isRemovedDiff(imageContext)) {
                    image = new Image(imageContext.diffInfo.getContent());
                } else {
                    image = new Image(imageContext.defaultResource);
                }
            } else {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
                return null;
            }
        }
        return image;
    }

    protected void extracted(SlingHttpServletResponse resp, Image image) throws RepositoryException, IOException {
        Property data = image.getData();
        if (data != null) {
            InputStream in = data.getStream();
            resp.setContentLength((int) data.getLength());
            resp.setContentType(image.getMimeType());
            IOUtils.copy(in, resp.getOutputStream());
            in.close();
        }
    }
}
