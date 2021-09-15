/*
 * Copyright 2021 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.adobe.cq.forms.core.components.internal.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;

import javax.json.Json;
import javax.json.JsonReader;
import javax.servlet.ServletException;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpStatus;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.settings.SlingSettingsService;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.components.internal.services.formsportal.OpenDraftOperation;
import com.adobe.cq.forms.core.components.internal.services.formsportal.OperationManagerImpl;
import com.adobe.cq.forms.core.components.models.formsportal.DraftsAndSubmissions;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.fd.fp.api.exception.FormsPortalException;
import com.adobe.fd.fp.api.models.DraftModel;
import com.adobe.fd.fp.api.service.DraftService;
import io.wcm.testing.mock.aem.junit5.AemContext;

import static org.junit.jupiter.api.Assertions.*;

class OperationServletTest {

    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    private OperationServlet servlet;

    @BeforeEach
    void setUp() throws FormsPortalException {
        String modelID = "abc123";
        OperationManagerImpl operationManager = new OperationManagerImpl();
        ModelFactory modelFactory = Mockito.mock(ModelFactory.class);
        DraftsAndSubmissions dummy = Mockito.mock(DraftsAndSubmissions.class);
        OpenDraftOperation operation = new OpenDraftOperation();
        servlet = new OperationServlet();

        Mockito.when(dummy.getType()).thenReturn("DRAFT");

        DraftModel draftModel = Mockito.spy(new DraftModel());
        draftModel.setDraftId(modelID);
        draftModel.setFormPath("/content/forms/af/fakepath");

        DraftService draftService = Mockito.mock(DraftService.class);
        Mockito.when(draftService.getAllDraft(Mockito.any())).thenReturn(Collections.singletonList(draftModel));
        Mockito.when(draftService.getDraft(modelID)).thenReturn(draftModel);

        Mockito.when(modelFactory.createModel(Mockito.any(), Mockito.eq(DraftsAndSubmissions.class))).thenReturn(dummy);
        context.registerService(SlingSettingsService.class, Mockito.mock(SlingSettingsService.class));
        context.registerService(DraftService.class, draftService);
        context.registerService(ModelFactory.class, modelFactory);
        context.registerInjectActivateService(operationManager);
        context.registerInjectActivateService(operation);
        context.registerInjectActivateService(servlet);
    }

    @Test
    void testGET() throws ServletException, IOException {
        MockSlingHttpServletResponse response = context.response();
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("operation=openDraft&operation_model_id=abc123");
        servlet.doGet(request, response);
        String res = response.getOutputAsString();
        Assertions.assertNotNull(res);
        Assertions.assertEquals(HttpStatus.SC_OK, response.getStatus());

        InputStream is = OperationServletTest.class.getResourceAsStream("/servlets/operation-servlet-sample.json");
        JsonReader expected = Json.createReader(is);
        JsonReader actual = Json.createReader(IOUtils.toInputStream(response.getOutputAsString(), response.getCharacterEncoding()));
        Assertions.assertEquals(expected.read(), actual.read());
    }
}
