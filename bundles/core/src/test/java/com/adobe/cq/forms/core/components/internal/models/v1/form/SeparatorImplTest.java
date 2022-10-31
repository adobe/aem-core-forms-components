/*
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * ~ Copyright 2022 Adobe
 * ~
 * ~ Licensed under the Apache License, Version 2.0 (the "License");
 * ~ you may not use this file except in compliance with the License.
 * ~ You may obtain a copy of the License at
 * ~
 * ~ http://www.apache.org/licenses/LICENSE-2.0
 * ~
 * ~ Unless required by applicable law or agreed to in writing, software
 * ~ distributed under the License is distributed on an "AS IS" BASIS,
 * ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * ~ See the License for the specific language governing permissions and
 * ~ limitations under the License.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.core.components.models.Separator;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(AemContextExtension.class)
class SeparatorImplTest {

    private static final String BASE = "/form/separator";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_SEPARATOR = CONTENT_ROOT + "/separator";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        Separator separator = Utils.getComponentUnderTest(PATH_SEPARATOR, Separator.class, context);
        assertEquals(FormConstants.RT_FD_FORM_SEPARATOR_V1, ((SeparatorImpl) separator)
            .getExportedType());
        Utils.testJSONExport(separator, Utils.getTestExporterJSONPath(BASE, "separator"));
    }
}
