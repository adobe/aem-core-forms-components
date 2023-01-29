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
package com.adobe.cq.forms.core.components.it.servlets;

import com.day.cq.commons.jcr.JcrConstants;
import com.adobe.cq.forms.core.components.it.service.DataManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.propertytypes.ServiceDescription;
import com.adobe.forms.common.service.ContentType;
import com.adobe.forms.common.service.FileAttachmentWrapper;
import org.apache.commons.io.IOUtils;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.OutputStream;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
@Component(service=Servlet.class,
        property={
                "sling.servlet.methods=" + HttpConstants.METHOD_GET,
                "sling.servlet.resourceTypes="+ "core/fd/components/form/container/v2/container",
                "sling.servlet.selectors=" + FileAttachmentServlet.SELECTOR
        })
@ServiceDescription("Adaptive Form File Attachment Retrieve Servlet")
public class FileAttachmentServlet extends SlingSafeMethodsServlet {

    public static final String SELECTOR = "file.get";
    private static final long serialVersionUID = 1L;

    @Reference
    DataManager dataManager;

    @Override
    protected void doGet(final SlingHttpServletRequest req,
                         final SlingHttpServletResponse resp) throws ServletException, IOException {
        final Resource resource = req.getResource();
        // /content/forms/af/abc/jcr:content/guideContainer.file.get/fileAttachmentUuid/fileName
        String suffix         = req.getRequestPathInfo().getSuffix();
        byte[] responseObj    = null;
        String[] suffixParts  = StringUtils.split(suffix,"/");
        if (suffixParts != null && suffixParts.length > 1 && StringUtils.isNotBlank(suffixParts[0]) && dataManager != null) {
            String fileUuid = suffixParts[0];
            FileAttachmentWrapper attachment = (FileAttachmentWrapper) dataManager.get(fileUuid);
            String contentType               = attachment.getContentType();
            responseObj                      = IOUtils.toByteArray(attachment.getInputStream());
            if(contentType != null && !contentType.trim().isEmpty()){
                resp.setContentType(contentType);
            }
            OutputStream os;
            os = resp.getOutputStream();
            os.write(responseObj);
            os.close();
        }
    }
}