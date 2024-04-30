package com.adobe.cq.forms.core.components.internal.models.v1.form;

import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.components.models.form.FormUtil;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
public class FormUtilTest {
    private static final String BASE = "/form/formutil";
    private static final String CONTENT_ROOT = "/content";
    private static final String JCR_CONTENT_PATH = CONTENT_ROOT + "/myTestPage/jcr:content";
    private static final String FORM_CONTAINER_PATH = JCR_CONTENT_PATH + "/formcontainerv2";
    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        context.registerService(SlingModelFilter.class, new SlingModelFilter() {

            private final Set<String> IGNORED_NODE_NAMES = new HashSet<String>() {
                {
                    add(NameConstants.NN_RESPONSIVE_CONFIG);
                    add(MSMNameConstants.NT_LIVE_SYNC_CONFIG);
                    add("cq:annotations");
                }
            };

            @Override
            public Map<String, Object> filterProperties(Map<String, Object> map) {
                return map;
            }

            @Override
            public Iterable<Resource> filterChildResources(Iterable<Resource> childResources) {
                return StreamSupport
                        .stream(childResources.spliterator(), false)
                        .filter(r -> !IGNORED_NODE_NAMES.contains(r.getName()))
                        .collect(Collectors.toList());
            }
        });
    }

    @Test
    void testGetIsEdgeDeliveryRequest() throws Exception {
        context.currentResource(FORM_CONTAINER_PATH);
        MockSlingHttpServletRequest request = context.request();
        request.setAttribute("com.adobe.aem.wcm.franklin.internal.servlets.FranklinDeliveryServlet", false);
        FormUtil formUtil = request.adaptTo(FormUtil.class);
        assertFalse(formUtil.isEdgeDeliveryRequest());
    }

    @Test
    void testGetIsEdgeDeliveryRequestTrue() throws Exception {
        context.currentResource(FORM_CONTAINER_PATH);
        MockSlingHttpServletRequest request = context.request();
        request.setAttribute("com.adobe.aem.wcm.franklin.internal.servlets.FranklinDeliveryServlet", true);
        FormUtil formUtil = request.adaptTo(FormUtil.class);
        assertTrue(formUtil.isEdgeDeliveryRequest());
    }
}
