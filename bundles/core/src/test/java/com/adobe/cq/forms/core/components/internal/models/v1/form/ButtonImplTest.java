package com.adobe.cq.forms.core.components.internal.models.v1.form;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.*;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import static org.junit.Assert.assertEquals;

@ExtendWith(AemContextExtension.class)
public class ButtonImplTest {
    private static final String BASE = "/form/button";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_BUTTON_1 = CONTENT_ROOT + "/button";
    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        Button button = Utils.getComponentUnderTest(PATH_BUTTON_1, Button.class, context);
        assertEquals(FormConstants.RT_FD_FORM_BUTTON_V1, button.getExportedType());
        Button buttonMock = Mockito.mock(Button.class);
        Mockito.when(buttonMock.getExportedType()).thenCallRealMethod();
        assertEquals("", buttonMock.getExportedType());
    }

    @Test
    void testFieldType() {
        Button button = Utils.getComponentUnderTest(PATH_BUTTON_1, Button.class, context);
        assertEquals(Base.FieldType.BUTTON.getValue(), button.getFieldType());
    }

    @Test
    void testGetName() {
        Button button = Utils.getComponentUnderTest(PATH_BUTTON_1, Button.class, context);
        assertEquals("test-button", button.getName());
        Button buttonMock = Mockito.mock(Button.class);
        Mockito.when(buttonMock.getName()).thenCallRealMethod();
        assertEquals(null, buttonMock.getName());
    }

    @Test
    void testGetDataRef() {
        Button button = Utils.getComponentUnderTest(PATH_BUTTON_1, Button.class, context);
        assertEquals("test-button-ref", button.getDataRef());
        Button buttonMock = Mockito.mock(Button.class);
        Mockito.when(buttonMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, buttonMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        Button button = Utils.getComponentUnderTest(PATH_BUTTON_1, Button.class, context);
        assertEquals("test-description", button.getDescription());
        Button buttonMock = Mockito.mock(Button.class);
        Mockito.when(buttonMock.getDescription()).thenCallRealMethod();
        assertEquals(null, buttonMock.getDescription());
    }

    @Test
    void testIsVisible() {
        Button button = Utils.getComponentUnderTest(PATH_BUTTON_1, Button.class, context);
        assertEquals(false, button.isVisible());
        Button buttonMock = Mockito.mock(Button.class);
        Mockito.when(buttonMock.isVisible()).thenCallRealMethod();
        assertEquals(true, buttonMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        Button button = Utils.getComponentUnderTest(PATH_BUTTON_1, Button.class, context);
        assertEquals(true, button.isEnabled());
        Button buttonMock = Mockito.mock(Button.class);
        Mockito.when(buttonMock.isEnabled()).thenCallRealMethod();
        assertEquals(true, buttonMock.isEnabled());
    }

    @Test
    void testGetTooltip() {
        Button button = Utils.getComponentUnderTest(PATH_BUTTON_1, Button.class, context);
        assertEquals("test-short-description", button.getTooltip());
        Button buttonMock = Mockito.mock(Button.class);
        Mockito.when(buttonMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, buttonMock.getTooltip());
    }
}
