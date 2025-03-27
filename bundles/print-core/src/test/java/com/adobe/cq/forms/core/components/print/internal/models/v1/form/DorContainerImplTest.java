/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2025 Adobe
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
package com.adobe.cq.forms.core.components.print.internal.models.v1.form;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.form.CheckBox;
import com.adobe.cq.forms.core.components.models.form.DatePicker;
import com.adobe.cq.forms.core.components.models.form.NumberInput;
import com.adobe.cq.forms.core.components.models.form.Panel;
import com.adobe.cq.forms.core.components.models.form.RadioButton;
import com.adobe.cq.forms.core.components.models.form.StaticImage;
import com.adobe.cq.forms.core.components.models.form.Text;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
public class DorContainerImplTest {

    private static final String BASE = "/form";
    private static final String CHECKBOX_BASE = BASE + "/checkbox";
    private static final String DATEPICKER_BASE = BASE + "/datepicker";
    private static final String NUMBERINPUT_BASE = BASE + "/numberinput";
    private static final String PANEL_BASE = BASE + "/panel";
    private static final String IMAGE_BASE = BASE + "/image";
    private static final String TEXT_BASE = BASE + "/text";
    private static final String TEXTINPUT_BASE = BASE + "/textinput";
    private static final String RADIOBUTTON_BASE = BASE + "/radiobutton";

    private static final String CONTENT_ROOT = "/content";
    private static final String CHECKBOX_CONTENT_ROOT = CONTENT_ROOT + "/checkbox";
    private static final String DATEPICKER_CONTENT_ROOT = CONTENT_ROOT + "/datepicker";
    private static final String NUMBERINPUT_CONTENT_ROOT = CONTENT_ROOT + "/numberinput";
    private static final String PANEL_CONTENT_ROOT = CONTENT_ROOT + "/panel";
    private static final String IMAGE_CONTENT_ROOT = CONTENT_ROOT + "/image";
    private static final String TEXT_CONTENT_ROOT = CONTENT_ROOT + "/text";
    private static final String TEXTINPUT_CONTENT_ROOT = CONTENT_ROOT + "/textinput";
    private static final String RADIOBUTTON_CONTENT_ROOT = CONTENT_ROOT + "/radiobutton";

    private static final String PATH_CHECKBOX_WITH_DORCONTAINER = CHECKBOX_CONTENT_ROOT + "/checkbox-with-dorcontainer";
    private static final String PATH_DATEPICKER_WITH_DORCONTAINER = DATEPICKER_CONTENT_ROOT + "/datepicker-with-dorcontainer";
    private static final String PATH_NUMBER_INPUT_WITH_DORCONTAINER = NUMBERINPUT_CONTENT_ROOT + "/numberinput-with-dorcontainer";
    private static final String PATH_PANEL_WITH_DORCONTAINER = PANEL_CONTENT_ROOT + "/panel-with-dorcontainer";
    private static final String PATH_IMAGE_WITH_DORCONTAINER = IMAGE_CONTENT_ROOT + "/image-with-dorcontainer";
    private static final String PATH_TEXT_WITH_DORCONTAINER = TEXT_CONTENT_ROOT + "/text-with-dorcontainer";
    private static final String PATH_TEXTINPUT_WITH_DORCONTAINER = TEXTINPUT_CONTENT_ROOT + "/textinput-with-dorcontainer";
    private static final String PATH_RADIOBUTTON_WITH_DORCONTAINER = RADIOBUTTON_CONTENT_ROOT + "/radiobutton-with-dorcontainer";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(CHECKBOX_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CHECKBOX_CONTENT_ROOT);
        context.load().json(DATEPICKER_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, DATEPICKER_CONTENT_ROOT);
        context.load().json(NUMBERINPUT_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, NUMBERINPUT_CONTENT_ROOT);
        context.load().json(PANEL_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, PANEL_CONTENT_ROOT);
        context.load().json(IMAGE_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, IMAGE_CONTENT_ROOT);
        context.load().json(TEXT_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, TEXT_CONTENT_ROOT);
        context.load().json(TEXTINPUT_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, TEXTINPUT_CONTENT_ROOT);
        context.load().json(RADIOBUTTON_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, RADIOBUTTON_CONTENT_ROOT);

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
    void testJSONExportOfCheckBoxWithDorContainer() throws Exception {
        CheckBox checkbox = Utils.getComponentUnderTest(PATH_CHECKBOX_WITH_DORCONTAINER, CheckBox.class, context);
        Utils.testJSONExport(checkbox, Utils.getTestExporterJSONPath(CHECKBOX_BASE, PATH_CHECKBOX_WITH_DORCONTAINER));
    }

    @Test
    void testJSONExportOfDatePickerWithDorContainer() throws Exception {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER_WITH_DORCONTAINER, DatePicker.class, context);
        Utils.testJSONExport(datePicker, Utils.getTestExporterJSONPath(DATEPICKER_BASE, PATH_DATEPICKER_WITH_DORCONTAINER));
    }

    @Test
    void testJSONExportOfNumberInputWithDorContainer() throws Exception {
        NumberInput numberInput = Utils.getComponentUnderTest(PATH_NUMBER_INPUT_WITH_DORCONTAINER, NumberInput.class, context);
        Utils.testJSONExport(numberInput, Utils.getTestExporterJSONPath(NUMBERINPUT_BASE, PATH_NUMBER_INPUT_WITH_DORCONTAINER));
    }

    @Test
    void testJSONExportOfPanelWithDorContainer() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_WITH_DORCONTAINER, Panel.class, context);
        Utils.testJSONExport(panel, Utils.getTestExporterJSONPath(PANEL_BASE, PATH_PANEL_WITH_DORCONTAINER));
    }

    @Test
    void testJSONExportOfImageWithDorContainer() throws Exception {
        StaticImage image = Utils.getComponentUnderTest(PATH_IMAGE_WITH_DORCONTAINER, StaticImage.class, context);
        Utils.testJSONExport(image, Utils.getTestExporterJSONPath(IMAGE_BASE, PATH_IMAGE_WITH_DORCONTAINER));
    }

    @Test
    void testJSONExportOfTextWithDorContainer() throws Exception {
        Text text = Utils.getComponentUnderTest(PATH_TEXT_WITH_DORCONTAINER, Text.class, context);
        Utils.testJSONExport(text, Utils.getTestExporterJSONPath(TEXT_BASE, PATH_TEXT_WITH_DORCONTAINER));
    }

    @Test
    void testJSONExportOfTextInputWithDorContainer() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_WITH_DORCONTAINER, TextInput.class, context);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(TEXTINPUT_BASE, PATH_TEXTINPUT_WITH_DORCONTAINER));
    }

    @Test
    void testJSONExportOfRadioButtonWithDorContainer() throws Exception {
        RadioButton radioButton = Utils.getComponentUnderTest(PATH_RADIOBUTTON_WITH_DORCONTAINER, RadioButton.class, context);
        Utils.testJSONExport(radioButton, Utils.getTestExporterJSONPath(RADIOBUTTON_BASE, PATH_RADIOBUTTON_WITH_DORCONTAINER));
    }
}
