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

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    private static final ObjectMapper YAML_MAPPER = new ObjectMapper(new YAMLFactory());

    /** Classpath prefix for all authoring schema YAML resources. */
    private static final String SCHEMA_RESOURCE_ROOT = "/authoring-schema";

    /** Temporary directory where JSON-converted schemas are written for file: URI loading. */
    private static Path SCHEMA_TEMP_DIR;

    private static JsonSchemaFactory SCHEMA_FACTORY;

    @BeforeAll
    static void setUpSchemas() throws Exception {
        SCHEMA_TEMP_DIR = Files.createTempDirectory("jcr-authoring-schema-");

        // Walk every *.yaml file under the authoring-schema classpath directory and
        // convert each one to JSON in a mirrored temp directory tree.
        // This is exhaustive by design: any new schema added to the classpath directory
        // is automatically pre-converted — no list to maintain.
        // (The YAML files on the classpath are copied from docs/authoring-schema/ at
        // build time by the maven-resources-plugin, making docs/ the single source of truth.)
        URL rootUrl = JcrAuthoringSchemaValidationTest.class.getResource(SCHEMA_RESOURCE_ROOT);
        if (rootUrl == null) {
            throw new IllegalStateException(
                    "Authoring schema directory not found on classpath: " + SCHEMA_RESOURCE_ROOT);
        }
        Path resourceRoot = Paths.get(rootUrl.toURI());
        try (java.util.stream.Stream<Path> yamlFiles = Files.walk(resourceRoot)) {
            yamlFiles.filter(p -> p.toString().endsWith(".yaml")).forEach(yamlPath -> {
                try {
                    Path relativePart = resourceRoot.relativize(yamlPath);
                    Path outPath = SCHEMA_TEMP_DIR.resolve(relativePart.toString());
                    Files.createDirectories(outPath.getParent());
                    try (InputStream in = Files.newInputStream(yamlPath)) {
                        ObjectNode schemaNode = (ObjectNode) YAML_MAPPER.readTree(in);
                        // Strip the bare $id so networknt uses the file: URI as identity
                        // and relative $refs resolve correctly against the file system layout.
                        schemaNode.remove("$id");
                        JSON_MAPPER.writerWithDefaultPrettyPrinter().writeValue(outPath.toFile(), schemaNode);
                    }
                } catch (IOException e) {
                    throw new RuntimeException("Failed to convert schema: " + yamlPath, e);
                }
            });
        }

        SCHEMA_FACTORY = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V7);
    }

    /**
     * Load a component schema by its classpath-relative path. Internally this resolves to a file: URI in the temp
     * directory tree so that all relative $refs (../field.authoring.schema.yaml) resolve naturally.
     *
     * @param classpathPath
     *            e.g. /authoring-schema/components/textinput.authoring.schema.yaml
     */
    private JsonSchema loadSchema(String classpathPath) {
        // Map classpath path → temp file path (keeping .yaml extension to match $ref values)
        String relativePart = classpathPath.substring(SCHEMA_RESOURCE_ROOT.length());
        Path schemaFile = SCHEMA_TEMP_DIR
                .resolve(relativePart.startsWith("/") ? relativePart.substring(1) : relativePart);
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
