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
package com.adobe.cq.forms.core.components.internal.servlet;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.models.factory.ModelFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.forms.core.components.internal.models.v1.formsportal.DraftsAndSubmissionsImpl;
import com.adobe.cq.forms.core.components.models.services.formsportal.Operation;
import com.adobe.cq.forms.core.components.models.services.formsportal.OperationManager;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component(
    service = { Servlet.class },
    property = {
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=" + DraftsAndSubmissionsImpl.RESOURCE_TYPE,
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=" + OperationServlet.OPERATION_SELECTOR,
        ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=" + OperationServlet.EXTENSTION
    })
public class OperationServlet extends SlingSafeMethodsServlet {

    static final String OPERATION_SELECTOR = "execute";
    static final String EXTENSTION = "json";

    private static final Logger LOGGER = LoggerFactory.getLogger(OperationServlet.class);

    @Reference
    private transient ModelFactory modelFactory;

    @Reference
    private transient OperationManager operationManager;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        String opName = request.getParameter(Operation.OPERATION_KEY);

        Map<String, Object> inputMap = request.getParameterMap()
            .entrySet()
            .stream()
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        try {
            new ObjectMapper().writer().writeValue(response.getOutputStream(), execute(opName, inputMap));
        } catch (Exception ex) {
            LOGGER.error("[FP] [Operation] Could not execute operation {}", opName, ex);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
    }

    private Operation.OperationResult execute(String op_name, Map<String, Object> inputMap) {
        Operation op = operationManager.getOperation(op_name);
        if (op == null) {
            throw new UnsupportedOperationException("Could not find operation " + op_name);
        }
        return op.execute(inputMap);
    }
}
