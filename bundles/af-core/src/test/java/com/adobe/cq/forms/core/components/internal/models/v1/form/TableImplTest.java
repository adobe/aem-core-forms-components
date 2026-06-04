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

import java.util.HashSet;
import java.util.List;
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
import com.adobe.cq.forms.core.components.models.form.Panel;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
public class TableImplTest {

    private static final String BASE = "/form/table";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_TABLE = CONTENT_ROOT + "/table";
    private static final String PATH_TABLE_WITH_COLUMN_WIDTH = CONTENT_ROOT + "/table-with-column-width";
    private static final String PATH_TABLE_WITH_SORTING = CONTENT_ROOT + "/table-with-sorting";
    private static final String PATH_TABLE_WITH_EQUAL_WIDTHS = CONTENT_ROOT + "/table-with-equal-widths";
    private static final String PATH_TABLE_WITH_INVALID_WIDTH = CONTENT_ROOT + "/table-with-invalid-width";
    private static final String PATH_TABLE_WITH_NEGATIVE_WIDTH = CONTENT_ROOT + "/table-with-negative-width";
    private static final String PATH_TABLE_WITH_ZERO_WIDTHS = CONTENT_ROOT + "/table-with-zero-widths";
    private static final String PATH_TABLEHEADER = CONTENT_ROOT + "/tableheader";
    private static final String PATH_TABLEROW = CONTENT_ROOT + "/tablerow";

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
    void testGetDorProperties_noColumnWidthWhenNotAuthored() throws Exception {
        Panel table = Utils.getComponentUnderTest(PATH_TABLE, Panel.class, context);
        Map<String, Object> dorProps = table.getDorProperties();
        assertNull(dorProps.get("columnWidth"),
            "columnWidth must be absent when no columnWidth is authored");
    }

    @Test
    void testGetDorProperties_columnWidthPassedThroughWhenAuthored() throws Exception {
        Panel table = Utils.getComponentUnderTest(PATH_TABLE_WITH_COLUMN_WIDTH, Panel.class, context);
        Map<String, Object> dorProps = table.getDorProperties();
        assertEquals("1,2,1", dorProps.get("columnWidth"),
            "columnWidth must carry the authored proportional value");
    }

    @Test
    void testExportedType_table() throws Exception {
        Panel table = Utils.getComponentUnderTest(PATH_TABLE, Panel.class, context);
        assertEquals("table", table.getExportedType());
    }

    @Test
    void testExportedType_tableHeader() throws Exception {
        Panel header = Utils.getComponentUnderTest(PATH_TABLEHEADER, Panel.class, context);
        assertEquals("table-header", header.getExportedType());
    }

    @Test
    void testExportedType_tableRow() throws Exception {
        Panel row = Utils.getComponentUnderTest(PATH_TABLEROW, Panel.class, context);
        assertEquals("table-row", row.getExportedType());
    }

    @Test
    void testIsEnableSorting_falseWhenNotAuthored() throws Exception {
        TableImpl table = (TableImpl) Utils.getComponentUnderTest(PATH_TABLE, Panel.class, context);
        assertFalse(table.isEnableSorting(), "enableSorting must be false when not authored");
    }

    @Test
    void testIsEnableSorting_trueWhenAuthored() throws Exception {
        TableImpl table = (TableImpl) Utils.getComponentUnderTest(PATH_TABLE_WITH_SORTING, Panel.class, context);
        assertTrue(table.isEnableSorting(), "enableSorting must be true when authored");
    }

    @Test
    void testGetColumnWidthColStyles_emptyWhenNotAuthored() throws Exception {
        TableImpl table = (TableImpl) Utils.getComponentUnderTest(PATH_TABLE, Panel.class, context);
        assertTrue(table.getColumnWidthColStyles().isEmpty());
        assertFalse(table.isColumnWidthsConfigured());
    }

    @Test
    void testGetColumnWidthColStyles_sumsTo100() throws Exception {
        TableImpl table = (TableImpl) Utils.getComponentUnderTest(PATH_TABLE_WITH_EQUAL_WIDTHS, Panel.class, context);
        List<String> styles = table.getColumnWidthColStyles();
        assertEquals(3, styles.size());
        int total = styles.stream()
            .mapToInt(s -> Integer.parseInt(s.replace("width: ", "").replace("%", "").trim()))
            .sum();
        assertEquals(100, total, "column widths must sum to 100%");
        assertTrue(table.isColumnWidthsConfigured());
    }

    @Test
    void testGetColumnWidthColStyles_proportionalWidths() throws Exception {
        TableImpl table = (TableImpl) Utils.getComponentUnderTest(PATH_TABLE_WITH_COLUMN_WIDTH, Panel.class, context);
        List<String> styles = table.getColumnWidthColStyles();
        assertEquals(3, styles.size());
        int total = styles.stream()
            .mapToInt(s -> Integer.parseInt(s.replace("width: ", "").replace("%", "").trim()))
            .sum();
        assertEquals(100, total, "proportional widths must sum to 100%");
    }

    @Test
    void testGetColumnWidthColStyles_invalidValueTreatedAs1() throws Exception {
        TableImpl table = (TableImpl) Utils.getComponentUnderTest(PATH_TABLE_WITH_INVALID_WIDTH, Panel.class, context);
        List<String> styles = table.getColumnWidthColStyles();
        assertEquals(2, styles.size(), "invalid token should be treated as 1");
        int total = styles.stream()
            .mapToInt(s -> Integer.parseInt(s.replace("width: ", "").replace("%", "").trim()))
            .sum();
        assertEquals(100, total, "widths must sum to 100% even with invalid token");
    }

    @Test
    void testGetColumnWidthColStyles_negativeValueTreatedAs0() throws Exception {
        TableImpl table = (TableImpl) Utils.getComponentUnderTest(PATH_TABLE_WITH_NEGATIVE_WIDTH, Panel.class, context);
        List<String> styles = table.getColumnWidthColStyles();
        assertEquals(3, styles.size(), "negative value should be clamped to 0");
        int total = styles.stream()
            .mapToInt(s -> Integer.parseInt(s.replace("width: ", "").replace("%", "").trim()))
            .sum();
        assertEquals(100, total, "widths must sum to 100% even with negative token");
    }

    @Test
    void testGetColumnWidthColStyles_allZeroReturnsEmpty() throws Exception {
        TableImpl table = (TableImpl) Utils.getComponentUnderTest(PATH_TABLE_WITH_ZERO_WIDTHS, Panel.class, context);
        assertTrue(table.getColumnWidthColStyles().isEmpty(), "all-zero widths must return empty list");
        assertFalse(table.isColumnWidthsConfigured());
    }
}
