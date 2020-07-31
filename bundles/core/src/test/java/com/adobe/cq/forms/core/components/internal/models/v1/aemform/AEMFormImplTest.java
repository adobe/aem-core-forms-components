/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe
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
package com.adobe.cq.forms.core.components.internal.models.v1.aemform;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.powermock.core.classloader.annotations.PrepareForTest;

import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.aemform.AEMForm;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;

@ExtendWith(AemContextExtension.class)
@PrepareForTest(GuideUtils.class)
class AEMFormImplTest {

    private static final String BASE = "/aemform";
    private static final String CONTENT_ROOT = "/content";
    private static final String ROOT_PAGE = "/content/aemform";
    private static final String GRID = ROOT_PAGE + "/jcr:content/root/responsivegrid";
    private static final String FORM_1 = "/aemform-1";
    private static final String FORM_2 = "/aemform-2";
    private static final String PATH_FORM_1 = GRID + FORM_1;
    private static final String PATH_FORM_2 = GRID + FORM_2;

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("core/wcm/components/aemform/v1/aemform", aemform.getExportedType());
    }

    @Test
    void testGetHeight() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("100px", aemform.getHeight());
    }

    @Test
    void testGetThankYouPage() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("/a/b/c.html", aemform.getThankyouPage());
    }

    @Test
    void testGetThankYouConfig() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("page", aemform.getThankyouConfig());
    }

    @Test
    void testGetThankYouMessage() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("", aemform.getThankyouMessage());
    }

    @Test
    void testIsAdaptiveForm() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        // PowerMockito.mockStatic(GuideUtils.class);
        // when(GuideUtils.isValidFormResource(any(ResourceResolver.class), any(String.class),
        // any(String.class))).thenReturn(true);
        assertEquals(false, aemform.isAdaptiveForm());
    }

    @Test
    void testIsMCDocument() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        // PowerMockito.mockStatic(GuideUtils.class);
        // when(GuideUtils.isValidFormResource(any(ResourceResolver.class), any(String.class),
        // any(String.class))).thenReturn(true);
        assertEquals(false, aemform.isMCDocument());
    }

    @Test
    void testIsMobileForm() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        // PowerMockito.mockStatic(GuideUtils.class);
        // when(GuideUtils.isValidFormResource(any(ResourceResolver.class), any(String.class),
        // any(String.class))).thenReturn(true);
        assertEquals(false, aemform.isMobileForm());
    }

    @Test
    void testIsMobileFormSet() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        // PowerMockito.mockStatic(GuideUtils.class);
        // when(GuideUtils.isValidFormResource(any(ResourceResolver.class), any(String.class),
        // any(String.class))).thenReturn(true);
        assertEquals(false, aemform.isMobileFormset());
    }

    @Test
    void testIsFormSelected() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        // PowerMockito.mockStatic(GuideUtils.class);
        // when(GuideUtils.isValidFormResource(any(ResourceResolver.class), any(String.class),
        // any(String.class))).thenReturn(true);
        assertEquals(false, aemform.isFormSelected());
    }

    @Test
    void testGetCssClientLib() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("abc.def", aemform.getCssClientlib());
    }

    @Test
    void testGetSubmitType() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("inline", aemform.getSubmitType());
    }

    @Test
    void testGetThemePath() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("/content/dam/formsanddocuments-themes/abc/jcr:content", aemform.getThemePath());
    }

    @Test
    void testGetFormPagePath() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("/content/forms/af/abc", aemform.getFormPagePath());
    }

    @Test
    void testGetFormEditPagePath() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("/content/forms/af/abc", aemform.getFormEditPagePath());
    }

    @Test
    void testGetFormPath_2() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_2);
        assertEquals("", aemform.getFormPagePath());
    }

    @Test
    void testGetThankYouPage_2() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_2);
        assertEquals("", aemform.getThankyouPage());
    }

    @Test
    void testGetFormType() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals(AEMForm.FormType.NO_FORM_SELECTED, aemform.getFormType());
    }

    @Test
    void testGetLocale() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("", aemform.getLocale());
    }

    @Test
    void testJSONExport() throws Exception {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        Utils.testJSONExport(aemform, Utils.getTestExporterJSONPath(BASE, PATH_FORM_1));
    }

    private AEMForm getAEMFormUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(AEMForm.class);
    }
}
