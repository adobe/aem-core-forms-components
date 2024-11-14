/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.form.Review;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
public class ReviewImplTest {

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();
    private static final String TEST_BASE = "/form/review";
    private static final String APPS_ROOT = "/apps";
    private static final String PATH_REVIEW = "/apps/formcontainer/wizard/panel2/review";

    @BeforeEach
    void setUp() throws Exception {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, APPS_ROOT);
    }

    @Test
    void testGetEditAction() {
        Review review = Utils.getComponentUnderTest(PATH_REVIEW, ReviewImpl.class, context);
        assertEquals("field", review.getEditModeAction());
    }

    @Test
    public void testGetLinkedPanelsWithNonNullArray() throws IOException {
        Review review = Utils.getComponentUnderTest(PATH_REVIEW, ReviewImpl.class, context);
        String[] linkedPanels = review.getLinkedPanels();
        String[] expectedLinkedPanels = context.resourceResolver().getResource(PATH_REVIEW).getValueMap().get("fd:linkedPanels",
            String[].class);
        assertNotNull(expectedLinkedPanels);
        assertArrayEquals(expectedLinkedPanels, linkedPanels);
    }

    @Test
    public void testGetLinkedPanelsWithNullArray() {
        Review review = new ReviewImpl();
        String[] linkedPanels = review.getLinkedPanels();
        assertNotNull(linkedPanels);
        assertEquals(0, linkedPanels.length);
    }

    @Test
    void testGetProperties() {
        Review review = Utils.getComponentUnderTest(PATH_REVIEW, ReviewImpl.class, context);
        Map<String, Object> properties = review.getProperties();
        assertEquals("/apps/formcontainer/wizard/panel2/review", properties.get("fd:path"));
        assertEquals("field", properties.get("fd:editModeAction"));

    }

}
