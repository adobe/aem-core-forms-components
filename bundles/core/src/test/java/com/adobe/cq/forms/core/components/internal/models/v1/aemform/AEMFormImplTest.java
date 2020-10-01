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
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.aemform.AEMForm;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;

@ExtendWith(AemContextExtension.class)
class AEMFormImplTest {

    private static final String BASE = "/aemform";
    private static final String CONTENT_ROOT = "/content";
    private static final String ROOT_PAGE = "/content/aemform";
    private static final String ROOT_PAGE_LANG = "/content/aemform/en_US";
    private static final String GRID = ROOT_PAGE + "/jcr:content/root/responsivegrid";
    private static final String GRID_LANG = ROOT_PAGE_LANG + "/jcr:content/root/responsivegrid";
    private static final String FORM_1 = "/aemform-1";
    private static final String FORM_2 = "/aemform-2";
    private static final String PATH_FORM_1 = GRID + FORM_1;
    private static final String PATH_FORM_2 = GRID + FORM_2;
    private static final String PATH_FORM_LANG = GRID_LANG + FORM_1;

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("core/fd/components/aemform/v1/aemform", aemform.getExportedType());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getExportedType()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getExportedType);
    }

    @Test
    void testGetHeight() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("100px", aemform.getHeight());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getHeight()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getHeight);
    }

    @Test
    void testGetUseIframe() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("true", aemform.getUseIframe());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getUseIframe()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getUseIframe);
    }

    @Test
    void testGetThankYouPage() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("/a/b/c.html", aemform.getThankyouPage());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getThankyouPage()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getThankyouPage);
    }

    @Test
    void testGetThankYouConfig() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("page", aemform.getThankyouConfig());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getThankyouConfig()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getThankyouConfig);
    }

    @Test
    void testGetThankYouMessage() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("", aemform.getThankyouMessage());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getThankyouMessage()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getThankyouMessage);
    }

    @Test
    void testGetThemeName() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("abc-clientlib", aemform.getThemeName());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getThemeName()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getThemeName);
    }

    @Test
    void testIsAdaptiveForm() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        // junit 5 doesn't support power mock yet
        assertEquals(false, aemform.isAdaptiveForm());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.isAdaptiveForm()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::isAdaptiveForm);
    }

    @Test
    void testIsMCDocument() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals(false, aemform.isMCDocument());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.isMCDocument()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::isMCDocument);
    }

    @Test
    void testIsMobileForm() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals(false, aemform.isMobileForm());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.isMobileForm()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::isMobileForm);
    }

    @Test
    void testIsMobileFormSet() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals(false, aemform.isMobileFormset());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.isMobileFormset()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::isMobileFormset);
    }

    @Test
    void testIsFormSelected() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals(false, aemform.isFormSelected());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.isFormSelected()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::isFormSelected);

        AEMForm aemFormMockSelected = Mockito.mock(AEMFormImpl.class);
        Mockito.when(aemFormMockSelected.isFormSelected()).thenCallRealMethod();
        Mockito.when(aemFormMockSelected.getFormType()).thenReturn(AEMForm.FormType.ADAPTIVE_FORM);
        assertEquals(true, aemFormMockSelected.isFormSelected());
    }

    @Test
    void testGetCssClientLib() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("abc.def", aemform.getCssClientlib());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getCssClientlib()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getCssClientlib);
    }

    @Test
    void testGetSubmitType() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("inline", aemform.getSubmitType());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getSubmitType()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getSubmitType);
    }

    @Test
    void testGetSubmitTypeInline() {
        AEMForm aemformLang = getAEMFormUnderTest(PATH_FORM_LANG);
        assertEquals("inline", aemformLang.getSubmitType());
    }

    @Test
    void testGetThemePath() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("/content/dam/formsanddocuments-themes/abc/jcr:content", aemform.getThemePath());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getThemePath()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getThemePath);
    }

    @Test
    void testGetBlankThemePath() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_2);
        assertEquals("", aemform.getThemePath());
        assertEquals("", aemform.getThemeName());
        assertEquals("auto", aemform.getHeight());
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
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getFormEditPagePath()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getFormEditPagePath);
    }

    @Test
    void testGetFormPath_2() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_2);
        assertEquals("", aemform.getFormPagePath());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getFormPagePath()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getFormPagePath);
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
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getFormType()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getFormType);
    }

    @Test
    void testGetLocale() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("", aemform.getLocale());

        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getLocale()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getLocale);

        AEMForm aemFormMock1 = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock1.isAdaptiveForm()).thenReturn(true);
        assertEquals("", aemform.getLocale());
    }

    @Test
    void testGetPageLocale() {
        AEMForm aemformLang = getAEMFormUnderTest(PATH_FORM_LANG);
        assertEquals("en_US", aemformLang.getLocale());
        assertEquals("auto", aemformLang.getHeight());
        assertEquals("", aemformLang.getFormPagePath());
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
