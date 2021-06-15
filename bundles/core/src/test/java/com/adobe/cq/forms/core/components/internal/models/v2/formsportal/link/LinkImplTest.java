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
package com.adobe.cq.forms.core.components.internal.models.v2.formsportal.link;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.formsportal.Link;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
public class LinkImplTest {

    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    private static final String TEST_BASE = "/link";
    private static final String CONTENT_ROOT = "/content";
    private static final String ROOT_PAGE = CONTENT_ROOT + "/fplink";
    private static final String EMPTY_LINK_PATH = ROOT_PAGE + "/linkcomponent-v2-empty";
    private static final String LINK2_PATH = ROOT_PAGE + "/linkcomponent-v2";
    private static final String LINK2_PATH_WITH_EXTERNAL_LINK = ROOT_PAGE + "/linkcomponent-v2-external";
    private static final String LINK2_PATH_WITH_PDF = ROOT_PAGE + "/linkcomponent-v2-pdf";
    private static final String LINK2_PATH_WITH_OTHERS = ROOT_PAGE + "/linkcomponent-v2-others";

    @BeforeEach
    public void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    public void testExportedType() {
        Link component = getLinkUnderTest(LINK2_PATH);
        Assertions.assertEquals("core/fd/components/formsportal/link/v2/link", component.getExportedType());
    }

    @Test
    public void testExportedJson() {
        Link component = getLinkUnderTest(LINK2_PATH);
        Utils.testJSONExport(component, Utils.getTestExporterJSONPath(TEST_BASE, LINK2_PATH));
    }

    @Test
    public void testEmptyLinkComponent() {
        Link link = getLinkUnderTest(EMPTY_LINK_PATH);
        Assertions.assertEquals(null, link.getAssetPath());
        Assertions.assertEquals("#", link.getAssetPathWithQueryParams());
        Assertions.assertEquals(null, link.getTitle());
        Assertions.assertEquals(null, link.getTooltip());
        Assertions.assertEquals(Link.AssetType.NONE, link.getAssetType());
    }

    @Test
    public void testLinkComponent() {
        Link link = getLinkUnderTest(LINK2_PATH);
        Assertions.assertEquals("/content/dam/formsanddocuments/sample-form", link.getAssetPath());
        Assertions.assertEquals("/content/dam/formsanddocuments/sample-form/jcr:content?wcmmode=disabled", link
            .getAssetPathWithQueryParams());
        Assertions.assertEquals("Link Component", link.getTitle());
        Assertions.assertEquals("Some Hover Tooltip Text", link.getTooltip());
        Assertions.assertEquals("Test Aria Label", link.getAccessibilityLabel());
        Assertions.assertEquals(Link.AssetType.ADAPTIVE_FORM, link.getAssetType());
    }

    @Test
    public void testLinkComponentWithExternal() {
        Link link = getLinkUnderTest(LINK2_PATH_WITH_EXTERNAL_LINK);
        Assertions.assertEquals("https://www.adobe.com/", link.getAssetPath());
        Assertions.assertEquals("https://www.adobe.com/?hello=world", link.getAssetPathWithQueryParams());
        Assertions.assertEquals("Link Component", link.getTitle());
        Assertions.assertEquals("Some Hover Tooltip Text", link.getTooltip());
        Assertions.assertEquals(Link.AssetType.EXTERNAL_LINK, link.getAssetType());
    }

    @Test
    public void testOthersAssetType() {
        Link link = getLinkUnderTest(LINK2_PATH_WITH_OTHERS);
        Assertions.assertEquals(Link.AssetType.OTHERS, link.getAssetType());
    }

    @Test
    public void testPDFAssetType() {
        Link link = getLinkUnderTest(LINK2_PATH_WITH_PDF);
        Assertions.assertEquals(Link.AssetType.PDF, link.getAssetType());
    }

    private Link getLinkUnderTest(String resourcePath) {
        MockSlingHttpServletRequest mockRequest = context.request();
        mockRequest.setResource(context.currentResource(resourcePath));
        return mockRequest.adaptTo(Link.class);
    }
}
