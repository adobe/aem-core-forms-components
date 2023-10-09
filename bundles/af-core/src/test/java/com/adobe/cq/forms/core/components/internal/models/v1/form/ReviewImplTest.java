package com.adobe.cq.forms.core.components.internal.models.v1.form;

import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.forms.core.Utils;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import com.adobe.cq.forms.core.components.models.form.Review;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
public class ReviewImplTest {

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();
    private static final String BASE = "/custom-review";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_REVIEW = CONTENT_ROOT + "/review";

    @BeforeEach
    void setUp() throws Exception {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testGetEditAction() {
        Review review = Utils.getComponentUnderTest(PATH_REVIEW, ReviewImpl.class, context);
        assertEquals("field", review.getEditAction());
    }

    @Test
    public void testGetLinkedPanelsWithNonNullArray() throws IOException {
        Review review = Utils.getComponentUnderTest(PATH_REVIEW, ReviewImpl.class, context);
        String[] linkedPanels = review.getLinkedPanels();
        String[] expectedLinkedPanels = context.resourceResolver().getResource(PATH_REVIEW).getValueMap().get("linkedPanels", String[].class);
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
        assertEquals(properties.size(), 3);
        assertEquals("/content/review", properties.get("fd:path"));
        assertEquals("field", properties.get("editAction"));

    }

}
