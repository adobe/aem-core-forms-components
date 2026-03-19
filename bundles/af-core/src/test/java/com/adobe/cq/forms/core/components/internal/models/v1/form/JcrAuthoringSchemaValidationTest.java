/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Validates that well-formed JCR property maps (as JSON) conform to the YAML authoring schemas.
 *
 * The schemas live in docs/authoring-schema/ and are mirrored into
 * src/test/resources/authoring-schema/ so they are accessible on the classpath.
 *
 * Strategy: during test setup we convert each YAML schema to JSON and write it to a temp
 * directory on disk. We then load schemas via file: URIs so networknt can resolve relative
 * $refs (../field.authoring.schema.yaml) naturally using standard URI resolution — no custom
 * fetchers or URI factories are required.
 *
 * This is the JCR analog to the af2-docs runtime schema validation: instead of validating
 * the exported JSON model, we validate the JCR ValueMap (what you author in the dialog
 * and what Sling reads via @ValueMapValue) against the schema that documents those properties.
 */
public class JcrAuthoringSchemaValidationTest {

    private static final ObjectMapper JSON_MAPPER = new ObjectMapper();
    private static final ObjectMapper YAML_MAPPER = new ObjectMapper(new YAMLFactory());

    /** Classpath prefix for all authoring schema YAML resources. */
    private static final String SCHEMA_RESOURCE_ROOT = "/authoring-schema";

    /**
     * All schema classpath paths that need to be converted and placed on disk.
     * Listed in dependency order (parents before children) so relative $refs
     * resolve correctly when networknt encounters them.
     */
    private static final List<String> ALL_SCHEMA_PATHS = Arrays.asList(
        // Root schemas (no parent $refs)
        "/authoring-schema/base.authoring.schema.yaml",
        // Field and container hierarchies
        "/authoring-schema/field.authoring.schema.yaml",
        "/authoring-schema/container.authoring.schema.yaml",
        "/authoring-schema/panelimpl.authoring.schema.yaml",
        // Component schemas
        "/authoring-schema/components/textinput.authoring.schema.yaml",
        "/authoring-schema/components/dropdown.authoring.schema.yaml",
        "/authoring-schema/components/checkboxgroup.authoring.schema.yaml",
        "/authoring-schema/components/panelcontainer.authoring.schema.yaml",
        "/authoring-schema/components/accordion.authoring.schema.yaml",
        "/authoring-schema/components/tabsontop.authoring.schema.yaml",
        "/authoring-schema/components/verticaltabs.authoring.schema.yaml",
        "/authoring-schema/components/wizard.authoring.schema.yaml"
    );

    /** Temporary directory where JSON-converted schemas are written for file: URI loading. */
    private static Path SCHEMA_TEMP_DIR;

    /** Temp subdirectory mirroring the /authoring-schema/components/ classpath layout. */
    private static Path SCHEMA_TEMP_COMPONENTS_DIR;

    private static JsonSchemaFactory SCHEMA_FACTORY;

    @BeforeAll
    static void setUpSchemas() throws Exception {
        // Create a temp directory tree that mirrors the classpath layout
        SCHEMA_TEMP_DIR = Files.createTempDirectory("jcr-authoring-schema-");
        SCHEMA_TEMP_COMPONENTS_DIR = SCHEMA_TEMP_DIR.resolve("components");
        Files.createDirectories(SCHEMA_TEMP_COMPONENTS_DIR);

        // Convert each YAML schema to JSON and write to the temp tree.
        // Strip the bare $id field so networknt uses the file: URI as identity
        // and relative $refs resolve correctly against the file system layout.
        for (String classpathPath : ALL_SCHEMA_PATHS) {
            InputStream yamlStream = JcrAuthoringSchemaValidationTest.class.getResourceAsStream(classpathPath);
            if (yamlStream == null) {
                throw new IllegalStateException("Schema YAML not found on classpath: " + classpathPath);
            }
            ObjectNode schemaNode = (ObjectNode) YAML_MAPPER.readTree(yamlStream);
            // Strip the bare $id (e.g. "textinput.authoring.schema") — networknt
            // will use the file: URI as the schema identity instead.
            schemaNode.remove("$id");

            // Derive the output path: strip the /authoring-schema prefix, keep .yaml extension.
            // We write JSON content to a .yaml-named file so relative $refs
            // (e.g. ../field.authoring.schema.yaml) resolve to the correct file on disk.
            String relativePart = classpathPath.substring(SCHEMA_RESOURCE_ROOT.length()); // e.g. /base.authoring.schema.yaml
            Path outPath = SCHEMA_TEMP_DIR.resolve(relativePart.startsWith("/") ? relativePart.substring(1) : relativePart);
            Files.createDirectories(outPath.getParent());
            JSON_MAPPER.writerWithDefaultPrettyPrinter().writeValue(outPath.toFile(), schemaNode);
        }

        SCHEMA_FACTORY = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V7);
    }

    /**
     * Load a component schema by its classpath-relative path.
     * Internally this resolves to a file: URI in the temp directory tree so that
     * all relative $refs (../field.authoring.schema.yaml) resolve naturally.
     *
     * @param classpathPath e.g. /authoring-schema/components/textinput.authoring.schema.yaml
     */
    private JsonSchema loadSchema(String classpathPath) {
        // Map classpath path → temp file path (keeping .yaml extension to match $ref values)
        String relativePart = classpathPath.substring(SCHEMA_RESOURCE_ROOT.length());
        Path schemaFile = SCHEMA_TEMP_DIR.resolve(relativePart.startsWith("/") ? relativePart.substring(1) : relativePart);
        URI fileUri = schemaFile.toUri();
        return SCHEMA_FACTORY.getSchema(fileUri);
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
        String fixtureJson = "{"
            + "\"name\": \"abc\","
            + "\"jcr:title\": \"def\","
            + "\"hideTitle\": false,"
            + "\"dorExclusion\": true,"
            + "\"dorColspan\": \"4\","
            + "\"description\": \"dummy\","
            + "\"visible\": false,"
            + "\"readOnly\": false,"
            + "\"enabled\": true,"
            + "\"required\": true,"
            + "\"assistPriority\": \"custom\","
            + "\"dataRef\": \"a.b\","
            + "\"custom\": \"Custom screen reader text\","
            + "\"tooltip\": \"test-short-description\","
            + "\"fieldType\": \"text-input\""
            + "}";
        JsonNode fixture = JSON_MAPPER.readTree(fixtureJson);

        Set<ValidationMessage> errors = schema.validate(fixture);
        assertTrue(errors.isEmpty(),
            "Full textinput JCR node should conform to authoring schema but got: " + errors);
    }

    // -----------------------------------------------------------------------
    // Dropdown
    // -----------------------------------------------------------------------

    @Test
    void minimalDropdownNodeConformsToAuthoringSchema() throws Exception {
        JsonSchema schema = loadSchema("/authoring-schema/components/dropdown.authoring.schema.yaml");

        // Mirrors the "dropdown" fixture from dropdown/test-content.json
        String fixtureJson = "{"
            + "\"name\": \"abc\","
            + "\"jcr:title\": \"def\","
            + "\"fieldType\": \"drop-down\","
            + "\"enum\": [0, 1, 2],"
            + "\"enumNames\": [\"m\", \"f\", \"o\"]"
            + "}";
        JsonNode fixture = JSON_MAPPER.readTree(fixtureJson);

        Set<ValidationMessage> errors = schema.validate(fixture);
        assertTrue(errors.isEmpty(),
            "Minimal dropdown JCR node should conform to authoring schema but got: " + errors);
    }

    @Test
    void multiselectDropdownNodeConformsToAuthoringSchema() throws Exception {
        JsonSchema schema = loadSchema("/authoring-schema/components/dropdown.authoring.schema.yaml");

        // Mirrors the "multiselect-dropdown" fixture from dropdown/test-content.json
        String fixtureJson = "{"
            + "\"name\": \"abc\","
            + "\"jcr:title\": \"def\","
            + "\"hideTitle\": true,"
            + "\"description\": \"dummy\","
            + "\"visible\": false,"
            + "\"fieldType\": \"drop-down\","
            + "\"type\": \"number[]\","
            + "\"multiSelect\": true,"
            + "\"enum\": [0, 1, 2],"
            + "\"enumNames\": [\"m\", \"f\", \"o\"]"
            + "}";
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
        String fixtureJson = "{"
            + "\"name\": \"abc\","
            + "\"jcr:title\": \"dependent names\","
            + "\"fieldType\": \"panel\""
            + "}";
        JsonNode fixture = JSON_MAPPER.readTree(fixtureJson);

        Set<ValidationMessage> errors = schema.validate(fixture);
        assertTrue(errors.isEmpty(),
            "Minimal panelcontainer JCR node should conform to authoring schema but got: " + errors);
    }

    @Test
    void customizedPanelContainerNodeConformsToAuthoringSchema() throws Exception {
        JsonSchema schema = loadSchema("/authoring-schema/components/panelcontainer.authoring.schema.yaml");

        // Mirrors the "panelcontainer-customized" fixture (flat properties only, no child nodes)
        String fixtureJson = "{"
            + "\"name\": \"abc\","
            + "\"jcr:title\": \"dependent names\","
            + "\"description\": \"dependent names description\","
            + "\"tooltip\": \"dependent names tooltip\","
            + "\"fieldType\": \"panel\","
            + "\"dorExclusion\": true,"
            + "\"dorExcludeTitle\": false,"
            + "\"dorExcludeDescription\": false,"
            + "\"visible\": false,"
            + "\"enabled\": false,"
            + "\"required\": true,"
            + "\"readOnly\": true,"
            + "\"breakBeforeText\": \"Following Previous\","
            + "\"breakAfterText\": \"Continue Filling Parent\","
            + "\"overflowText\": \"None\""
            + "}";
        JsonNode fixture = JSON_MAPPER.readTree(fixtureJson);

        Set<ValidationMessage> errors = schema.validate(fixture);
        assertTrue(errors.isEmpty(),
            "Customized panelcontainer JCR node should conform to authoring schema but got: " + errors);
    }
}
