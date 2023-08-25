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
package com.adobe.cq.forms.core.components.internal.form;

import java.util.List;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.components.models.form.FormClientLibManager;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
public class FormClientLibManagerImplTest {
    private static final String BASE = "/form/formclientlibmanager";
    private static final String CONTENT_ROOT = "/content";
    private static final String JCR_CONTENT_PATH = CONTENT_ROOT + "/myTestPage/jcr:content";

    private static final String FORM_CONTAINER_PATH = JCR_CONTENT_PATH + "/formcontainer";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    public void testGetClientLibRefList() {
        String path = FORM_CONTAINER_PATH + "/datepicker";
        FormClientLibManager formClientLibManager = getFormClientLibManagerUnderTest();
        List<String> clientLibs = formClientLibManager.getClientLibRefList();
        Assertions.assertEquals(0, clientLibs.size());
        formClientLibManager = getFormClientLibManagerUnderTest(path);
        clientLibs = formClientLibManager.getClientLibRefList();
        Assertions.assertEquals(0, clientLibs.size());
        formClientLibManager.addClientLibRef("abc");
        clientLibs = formClientLibManager.getClientLibRefList();
        Assertions.assertEquals(1, clientLibs.size());
        formClientLibManager = new FormClientLibManagerImpl();
        clientLibs = formClientLibManager.getClientLibRefList();
        Assertions.assertEquals(0, clientLibs.size());
        formClientLibManager.addClientLibRef("abc");
        Assertions.assertEquals(0, clientLibs.size());
    }

    private FormClientLibManager getFormClientLibManagerUnderTest() {
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(FormClientLibManager.class);
    }

    private FormClientLibManager getFormClientLibManagerUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(FormClientLibManager.class);
    }
}
