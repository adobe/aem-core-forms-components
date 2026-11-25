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
package com.adobe.cq.forms.core.components.internal.form;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.core.components.util.ComponentUtils;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(AemContextExtension.class)
public class FormsComponentIdGeneratorTest {

    private static final String TEXT_INPUT = "core/fd/components/form/textinput/v1/textinput";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    private static String sha(String value) {
        return DigestUtils.sha256Hex(value).substring(0, 10);
    }

    @Test
    void testGeneratedIdWithoutOccurrenceMatchesWcmId() {
        Resource resource = context.create().resource("/content/form/guideContainer/textinput", "sling:resourceType", TEXT_INPUT);
        String expected = "textinput-" + sha("/content/form/guideContainer/textinput");
        assertEquals(expected, FormsComponentIdGenerator.getId(resource, null));
        assertEquals(expected, FormsComponentIdGenerator.getId(resource, ""));
        assertEquals(ComponentUtils.getId(resource, null, null, null), FormsComponentIdGenerator.getId(resource, ""));
    }

    @Test
    void testGeneratedIdWithOccurrence() {
        Resource resource = context.create().resource("/content/fragment/guideContainer/textinput", "sling:resourceType", TEXT_INPUT);
        assertEquals("textinput-" + sha("/content/form/a" + "/content/fragment/guideContainer/textinput"),
            FormsComponentIdGenerator.getId(resource, "/content/form/a"));
    }

    @Test
    void testPrefixFromResourceType() {
        Resource proxy = context.create().resource("/content/form/guideContainer/ssn", "sling:resourceType",
            "mysite/components/adaptiveForm/textinput");
        assertEquals("textinput-" + sha("/occurrence/content/form/guideContainer/ssn"), FormsComponentIdGenerator.getId(proxy,
            "/occurrence"));
        Resource noSlash = context.create().resource("/content/form/guideContainer/plain", "sling:resourceType", "plain");
        assertEquals("-" + sha("/content/form/guideContainer/plain"), FormsComponentIdGenerator.getId(noSlash, null));
    }

    @Test
    void testAuthoredIdNormalizedLikeWcm() {
        Resource authored = context.create().resource("/content/form/guideContainer/authored", "sling:resourceType", TEXT_INPUT,
            "id", "  my   authored id ");
        assertEquals("my-authored-id", FormsComponentIdGenerator.getId(authored, "/content/form/fragment"));
        assertEquals(ComponentUtils.getId(authored, null, null, null), FormsComponentIdGenerator.getId(authored, "/x"));
        Resource blank = context.create().resource("/content/form/guideContainer/blank", "sling:resourceType", TEXT_INPUT,
            "id", "   ");
        assertEquals(ComponentUtils.getId(blank, null, null, null), FormsComponentIdGenerator.getId(blank, null));
        Resource empty = context.create().resource("/content/form/guideContainer/empty", "sling:resourceType", TEXT_INPUT,
            "id", "");
        assertEquals("textinput-" + sha("/content/form/guideContainer/empty"), FormsComponentIdGenerator.getId(empty, null));
    }
}
