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
package com.adobe.cq.forms.core.components.views;

import org.junit.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ViewsTest {

    @Test
    public void testPublish() {
        Views.Publish publish = new Views.Publish();
        assertNotNull(publish);
    }

    @Test
    public void testAuthor() {
        Views.Author author = new Views.Author();
        assertTrue(author instanceof Views.Publish);
    }

    @Test
    public void testDor() {
        Views.DoR dor = new Views.DoR();
        assertTrue(dor instanceof Views.Author);
    }
}
