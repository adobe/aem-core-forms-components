/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.BaseConstraint;
import com.adobe.cq.forms.core.components.models.form.ConstraintType;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.Slider;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
public class SliderImplTest {
    private static final String BASE = "/form/slider";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_SLIDER = CONTENT_ROOT + "/slider";
    private static final String PATH_SLIDER_CUSTOMIZED = CONTENT_ROOT + "/slider-customized";
    private static final String PATH_SLIDER_WITHOUT_FIELDTYPE = CONTENT_ROOT + "/slider-without-fieldtype";
    private static final String PATH_SLIDER_INTEGER_TYPE = CONTENT_ROOT + "/slider-integer-type";
    private static final String PATH_SLIDER_DATALAYER = CONTENT_ROOT + "/slider-datalayer";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_CUSTOMIZED, Slider.class, context);
        assertEquals(FormConstants.RT_FD_FORM_SLIDER_V1, slider.getExportedType());
        Slider sliderMock = Mockito.mock(Slider.class);
        Mockito.when(sliderMock.getExportedType()).thenCallRealMethod();
        assertEquals("", sliderMock.getExportedType());
    }

    @Test
    void testFieldType() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_CUSTOMIZED, Slider.class, context);
        assertEquals(FieldType.RANGE.getValue(), slider.getFieldType());
        assertEquals("range", slider.getFieldType());
    }

    @Test
    void testFieldTypeDefaultsToRangeWhenNotAuthored() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_WITHOUT_FIELDTYPE, Slider.class, context);
        assertEquals("range", slider.getFieldType());
    }

    @Test
    void testTypeIsNumber() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER, Slider.class, context);
        assertEquals(BaseConstraint.Type.NUMBER, slider.getType());
        Slider sliderMock = Mockito.mock(Slider.class);
        Mockito.when(sliderMock.getType()).thenCallRealMethod();
        assertEquals(BaseConstraint.Type.NUMBER, sliderMock.getType());
    }

    @Test
    void testTypeIsNumberWhenNotAuthored() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_WITHOUT_FIELDTYPE, Slider.class, context);
        assertEquals(BaseConstraint.Type.NUMBER, slider.getType());
    }

    @Test
    void testAuthoredIntegerTypeIsKept() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_INTEGER_TYPE, Slider.class, context);
        assertEquals(BaseConstraint.Type.INTEGER, slider.getType());
    }

    @Test
    void testMinimumMaximumAndStep() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER, Slider.class, context);
        assertEquals(0L, slider.getMinimumNumber());
        assertEquals(100L, slider.getMaximumNumber());
        assertEquals(5L, slider.getStep());
    }

    @Test
    void testDecimalMinimumMaximumAndStep() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_CUSTOMIZED, Slider.class, context);
        assertEquals(10L, slider.getMinimumNumber());
        assertEquals(50L, slider.getMaximumNumber());
        assertEquals(0.5, slider.getStep().doubleValue(), 0.0);
    }

    @Test
    void testStepNullWhenNotAuthored() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_WITHOUT_FIELDTYPE, Slider.class, context);
        assertNull(slider.getStep());
        Slider sliderMock = Mockito.mock(Slider.class);
        Mockito.when(sliderMock.getStep()).thenCallRealMethod();
        assertNull(sliderMock.getStep());
    }

    @Test
    void testStepIsNotLeakedAsCustomProperty() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER, Slider.class, context);
        Map<String, Object> properties = slider.getProperties();
        assertFalse(properties.containsKey("step"));
        assertFalse(properties.containsKey("minimum"));
        assertFalse(properties.containsKey("maximum"));
        assertEquals("customPropValue", properties.get("customProp"));
    }

    @Test
    void testGetDefault() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER, Slider.class, context);
        assertNotNull(slider.getDefault());
        assertEquals(1, slider.getDefault().length);
    }

    @Test
    void testGetLabel() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_CUSTOMIZED, Slider.class, context);
        assertEquals("def", slider.getLabel().getValue());
    }

    @Test
    void testGetName() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_CUSTOMIZED, Slider.class, context);
        assertEquals("abc", slider.getName());
    }

    @Test
    void testGetDataRef() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_CUSTOMIZED, Slider.class, context);
        assertEquals("a.b", slider.getDataRef());
    }

    @Test
    void testGetDescription() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_CUSTOMIZED, Slider.class, context);
        assertEquals("dummy", slider.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_CUSTOMIZED, Slider.class, context);
        assertEquals("Custom screen reader text", slider.getScreenReaderText());
    }

    @Test
    void testVisibleEnabledReadOnlyRequiredCustomized() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_CUSTOMIZED, Slider.class, context);
        assertEquals(false, slider.isVisible());
        assertEquals(true, slider.isEnabled());
        assertEquals(false, slider.isReadOnly());
        assertEquals(true, slider.isRequired());
    }

    @Test
    void testVisibleEnabledReadOnlyRequiredDefaults() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER, Slider.class, context);
        assertEquals(true, slider.isVisible());
        assertEquals(true, slider.isEnabled());
        assertEquals(false, slider.isReadOnly());
        assertEquals(false, slider.isRequired());
    }

    @Test
    void testGetConstraintMessages() {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_CUSTOMIZED, Slider.class, context);
        Map<ConstraintType, String> messages = slider.getConstraintMessages();
        assertEquals("required message", messages.get(ConstraintType.REQUIRED));
        assertEquals("too low", messages.get(ConstraintType.MINIMUM));
        assertEquals("too high", messages.get(ConstraintType.MAXIMUM));
        assertEquals("not on step", messages.get(ConstraintType.STEP));
    }

    @Test
    void testJSONExport() throws Exception {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER, Slider.class, context);
        Utils.testJSONExport(slider, Utils.getTestExporterJSONPath(BASE, PATH_SLIDER));
    }

    @Test
    void testJSONExportCustomized() throws Exception {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_CUSTOMIZED, Slider.class, context);
        Utils.testJSONExport(slider, Utils.getTestExporterJSONPath(BASE, PATH_SLIDER_CUSTOMIZED));
    }

    @Test
    void testJSONExportWithoutFieldType() throws Exception {
        Slider slider = Utils.getComponentUnderTest(PATH_SLIDER_WITHOUT_FIELDTYPE, Slider.class, context);
        Utils.testJSONExport(slider, Utils.getTestExporterJSONPath(BASE, PATH_SLIDER_WITHOUT_FIELDTYPE));
    }
}
