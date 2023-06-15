/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
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
package com.adobe.cq.forms.core.components.internal.servlets.renderconditions;

import java.io.IOException;
import java.util.List;

import javax.annotation.Nonnull;
import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Component;

import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.granite.ui.components.Value;
import com.adobe.granite.ui.components.rendercondition.RenderCondition;
import com.adobe.granite.ui.components.rendercondition.SimpleRenderCondition;
import com.day.cq.wcm.api.policies.ContentPolicy;

@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.resourceTypes=" + FormConstants.RT_FD_FORM_RENDER_CONDITION_CUSTOM_PROPERTIES,
        "sling.servlet.methods=GET",
        "sling.servlet.extensions=html"
    })
public class HasCustomPropertiesServlet extends SlingSafeMethodsServlet {

    @Override
    protected void doGet(@Nonnull SlingHttpServletRequest request, @Nonnull SlingHttpServletResponse response)
        throws ServletException, IOException {
        boolean hasCustomProperties = false;
        ResourceResolver resourceResolver = request.getResourceResolver();
        ContentPolicy policy = ComponentUtils.getPolicy((String) request.getAttribute(Value.CONTENTPATH_ATTRIBUTE), resourceResolver);
        List<String> customPropertyGroups = ComponentUtils.getCustomPropertyGroupsFromPolicy(policy, resourceResolver);
        if (customPropertyGroups.size() > 0) {
            hasCustomProperties = true;
        }
        request.setAttribute(RenderCondition.class.getName(), new SimpleRenderCondition(hasCustomProperties));
    }
}
