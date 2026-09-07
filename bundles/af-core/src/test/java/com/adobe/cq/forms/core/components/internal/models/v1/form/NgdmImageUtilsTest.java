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

import org.junit.jupiter.api.Test;

import com.adobe.cq.forms.core.testing.MockNextGenDynamicMediaConfig;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class NgdmImageUtilsTest {

    @Test
    void isNgdmImageReference_WithUrnPrefix_ReturnsTrue() {
        assertTrue(NgdmImageUtils.isNgdmImageReference("/urn:aaid:aem:e82c3c87-1453-48f5-844b-1822fb610911/cutfruits.png"));
    }

    @Test
    void isNgdmImageReference_WithDamPath_ReturnsFalse() {
        assertFalse(NgdmImageUtils.isNgdmImageReference("/content/dam/some-asset.png"));
    }

    @Test
    void isNgdmImageReference_WithNullOrBlank_ReturnsFalse() {
        assertFalse(NgdmImageUtils.isNgdmImageReference(null));
        assertFalse(NgdmImageUtils.isNgdmImageReference(""));
        assertFalse(NgdmImageUtils.isNgdmImageReference("   "));
    }

    @Test
    void isNgdmImageReference_WithMissingSeoNameSegment_ReturnsFalse() {
        assertFalse(NgdmImageUtils.isNgdmImageReference("/urn:aaid:aem:e82c3c87-1453-48f5-844b-1822fb610911"));
        assertFalse(NgdmImageUtils.isNgdmImageReference("/urn:aaid:aem:e82c3c87-1453-48f5-844b-1822fb610911/"));
    }

    @Test
    void isNgdmSupportAvailable_WithEnabledConfigAndRepositoryId_ReturnsTrue() {
        MockNextGenDynamicMediaConfig config = new MockNextGenDynamicMediaConfig();
        config.setEnabled(true);
        config.setRepositoryId("testrepo");

        assertTrue(NgdmImageUtils.isNgdmSupportAvailable(config));
    }

    @Test
    void isNgdmSupportAvailable_WithDisabledConfig_ReturnsFalse() {
        MockNextGenDynamicMediaConfig config = new MockNextGenDynamicMediaConfig();
        config.setEnabled(false);
        config.setRepositoryId("testrepo");

        assertFalse(NgdmImageUtils.isNgdmSupportAvailable(config));
    }

    @Test
    void isNgdmSupportAvailable_WithBlankRepositoryId_ReturnsFalse() {
        MockNextGenDynamicMediaConfig config = new MockNextGenDynamicMediaConfig();
        config.setEnabled(true);
        config.setRepositoryId("");

        assertFalse(NgdmImageUtils.isNgdmSupportAvailable(config));
    }

    @Test
    void isNgdmSupportAvailable_WithNullConfig_ReturnsFalse() {
        assertFalse(NgdmImageUtils.isNgdmSupportAvailable(null));
    }

    @Test
    void buildNgdmImageSrc_BuildsExpectedDeliveryUrl() {
        MockNextGenDynamicMediaConfig config = new MockNextGenDynamicMediaConfig();
        config.setRepositoryId("testrepo");

        String src = NgdmImageUtils.buildNgdmImageSrc(
            "/urn:aaid:aem:e82c3c87-1453-48f5-844b-1822fb610911/cutfruits.png", config);

        assertEquals("https://testrepo/adobe/dynamicmedia/deliver/urn:aaid:aem:e82c3c87-1453-48f5-844b-1822fb610911/cutfruits.png?width=640&preferwebp=true",
            src);
    }

    @Test
    void buildNgdmImageSrc_WithNoFormatSuffix_FallsBackToDefaultExtension() {
        MockNextGenDynamicMediaConfig config = new MockNextGenDynamicMediaConfig();
        config.setRepositoryId("testrepo");

        String src = NgdmImageUtils.buildNgdmImageSrc(
            "/urn:aaid:aem:e82c3c87-1453-48f5-844b-1822fb610911/cutfruits", config);

        assertEquals("https://testrepo/adobe/dynamicmedia/deliver/urn:aaid:aem:e82c3c87-1453-48f5-844b-1822fb610911/cutfruits.jpg?width=640&preferwebp=true",
            src);
    }

    @Test
    void buildNgdmImageSrc_WithMultipleDotsInSeoName_KeepsFullNameAndCorrectExtension() {
        MockNextGenDynamicMediaConfig config = new MockNextGenDynamicMediaConfig();
        config.setRepositoryId("testrepo");

        String src = NgdmImageUtils.buildNgdmImageSrc(
            "/urn:aaid:aem:e82c3c87-1453-48f5-844b-1822fb610911/product.hero.png", config);

        assertEquals("https://testrepo/adobe/dynamicmedia/deliver/urn:aaid:aem:e82c3c87-1453-48f5-844b-1822fb610911/product.hero.png?width=640&preferwebp=true",
            src);
    }
}
