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

import java.util.Set;

import org.junit.jupiter.api.Test;

import com.adobe.cq.forms.core.Utils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.ValidationMessage;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Validates that well-formed JCR property maps (as JSON) conform to the YAML authoring schemas.
 *
 * The schemas live in docs/authoring-schema/ and are mirrored into src/test/resources/authoring-schema/ so they are
 * accessible on the classpath.
 *
 * Strategy: during test setup we convert each YAML schema to JSON and write it to a temp directory on disk. We then
 * load schemas via file: URIs so networknt can resolve relative $refs (../field.authoring.schema.yaml) naturally using
 * standard URI resolution — no custom fetchers or URI factories are required.
 *
 * This is the JCR analog to the af2-docs runtime schema validation: instead of validating the exported JSON model, we
 * validate the JCR ValueMap (what you author in the dialog and what Sling reads via @ValueMapValue) against the schema
 * that documents those properties.
 */
public class JcrAuthoringSchemaValidationTest {

    private static final ObjectMapper JSON_MAPPER = new ObjectMapper();

    private JsonSchema loadSchema(String classpathPath) {
        return Utils.loadAuthoringSchema(classpathPath);
    }

    // -----------------------------------------------------------------------
    // TextInput
    // -----------------------------------------------------------------------

    @Test
    void minimalTextInputNodeConformsToAuthoringSchema() throws Exception {
        JsonSchema schema = loadSchema("/authoring-schema/components/textinput.authoring.schema.yaml");

        // Minimal valid textinput JCR node (matches the "textinput" fixture in test-content.json)
        String fixtureJson = "{\"name\": \"abc\", \"fieldType\": \"text-input\"}";
        JsonNode fixture = JSON_MAPPER.readTree(fixtureJson);

        Set<ValidationMessage> errors = schema.validate(fixture);
        assertTrue(errors.isEmpty(),
            "Minimal textinput JCR node should conform to authoring schema but got: " + errors);
    }

    @Test
    void fullTextInputNodeConformsToAuthoringSchema() throws Exception {
        JsonSchema schema = loadSchema("/authoring-schema/components/textinput.authoring.schema.yaml");

        // Full customized textinput — mirrors "textinput-customized" from test-content.json
        String fixtureJson = "{" + "\"name\": \"abc\"," + "\"jcr:title\": \"def\"," + "\"hideTitle\": false,"
            + "\"dorExclusion\": true," + "\"dorColspan\": \"4\"," + "\"description\": \"dummy\","
            + "\"visible\": false," + "\"readOnly\": false," + "\"enabled\": true," + "\"required\": true,"
            + "\"assistPriority\": \"custom\"," + "\"dataRef\": \"a.b\","
            + "\"custom\": \"Custom screen reader text\"," + "\"tooltip\": \"test-short-description\","
            + "\"fieldType\": \"text-input\"" + "}";
        JsonNode fixture = JSON_MAPPER.readTree(fixtureJson);

        Set<ValidationMessage> errors = schema.validate(fixture);
        assertTrue(errors.isEmpty(), "Full textinput JCR node should conform to authoring schema but got: " + errors);
    }

    // -----------------------------------------------------------------------
    // Dropdown
    // -----------------------------------------------------------------------

    @Test
    void minimalDropdownNodeConformsToAuthoringSchema() throws Exception {
        JsonSchema schema = loadSchema("/authoring-schema/components/dropdown.authoring.schema.yaml");

        // Mirrors the "dropdown" fixture from dropdown/test-content.json
        String fixtureJson = "{" + "\"name\": \"abc\"," + "\"jcr:title\": \"def\"," + "\"fieldType\": \"drop-down\","
            + "\"enum\": [0, 1, 2]," + "\"enumNames\": [\"m\", \"f\", \"o\"]" + "}";
        JsonNode fixture = JSON_MAPPER.readTree(fixtureJson);

        Set<ValidationMessage> errors = schema.validate(fixture);
        assertTrue(errors.isEmpty(), "Minimal dropdown JCR node should conform to authoring schema but got: " + errors);
    }

    @Test
    void multiselectDropdownNodeConformsToAuthoringSchema() throws Exception {
        JsonSchema schema = loadSchema("/authoring-schema/components/dropdown.authoring.schema.yaml");

        // Mirrors the "multiselect-dropdown" fixture from dropdown/test-content.json
        String fixtureJson = "{" + "\"name\": \"abc\"," + "\"jcr:title\": \"def\"," + "\"hideTitle\": true,"
            + "\"description\": \"dummy\"," + "\"visible\": false," + "\"fieldType\": \"drop-down\","
            + "\"type\": \"number[]\"," + "\"multiSelect\": true," + "\"enum\": [0, 1, 2],"
            + "\"enumNames\": [\"m\", \"f\", \"o\"]" + "}";
        JsonNode fixture = JSON_MAPPER.readTree(fixtureJson);

        Set<ValidationMessage> errors = schema.validate(fixture);
        assertTrue(errors.isEmpty(),
            "Multiselect dropdown JCR node should conform to authoring schema but got: " + errors);
    }

    // -----------------------------------------------------------------------
    // PanelContainer
    // -----------------------------------------------------------------------

    @Test
    void minimalPanelContainerNodeConformsToAuthoringSchema() throws Exception {
        JsonSchema schema = loadSchema("/authoring-schema/components/panelcontainer.authoring.schema.yaml");

        // Mirrors the "panelcontainer" fixture from panelcontainer/test-content.json
        String fixtureJson = "{" + "\"name\": \"abc\"," + "\"jcr:title\": \"dependent names\","
            + "\"fieldType\": \"panel\"" + "}";
        JsonNode fixture = JSON_MAPPER.readTree(fixtureJson);

        Set<ValidationMessage> errors = schema.validate(fixture);
        assertTrue(errors.isEmpty(),
            "Minimal panelcontainer JCR node should conform to authoring schema but got: " + errors);
    }

    @Test
    void customizedPanelContainerNodeConformsToAuthoringSchema() throws Exception {
        JsonSchema schema = loadSchema("/authoring-schema/components/panelcontainer.authoring.schema.yaml");

        // Mirrors the "panelcontainer-customized" fixture (flat properties only, no child nodes)
        String fixtureJson = "{" + "\"name\": \"abc\"," + "\"jcr:title\": \"dependent names\","
            + "\"description\": \"dependent names description\"," + "\"tooltip\": \"dependent names tooltip\","
            + "\"fieldType\": \"panel\"," + "\"dorExclusion\": true," + "\"dorExcludeTitle\": false,"
            + "\"dorExcludeDescription\": false," + "\"visible\": false," + "\"enabled\": false,"
            + "\"required\": true," + "\"readOnly\": true," + "\"breakBeforeText\": \"Following Previous\","
            + "\"breakAfterText\": \"Continue Filling Parent\"," + "\"overflowText\": \"None\"" + "}";
        JsonNode fixture = JSON_MAPPER.readTree(fixtureJson);

        Set<ValidationMessage> errors = schema.validate(fixture);
        assertTrue(errors.isEmpty(),
            "Customized panelcontainer JCR node should conform to authoring schema but got: " + errors);
    }
}
