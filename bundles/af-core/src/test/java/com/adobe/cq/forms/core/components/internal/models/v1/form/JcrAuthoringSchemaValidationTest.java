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

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URI;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SchemaValidatorsConfig;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;
import com.networknt.schema.uri.URIFetcher;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Validates that well-formed JCR property maps (as JSON) conform to the YAML authoring schemas.
 *
 * The schemas live in docs/authoring-schema/ and are mirrored into
 * src/test/resources/authoring-schema/ so they are accessible on the classpath.
 *
 * Strategy: we register a custom URIFetcher that handles the "authoring-schema" scheme.
 * All $ref values in the YAML files are relative paths (e.g. ../field.authoring.schema.yaml).
 * We also patch each schema's $id to be an absolute authoring-schema: URI so that the
 * networknt resolver can anchor relative $refs correctly.
 *
 * This is the JCR analog to the af2-docs runtime schema validation: instead of validating
 * the exported JSON model, we validate the JCR ValueMap (what you author in the dialog
 * and what Sling reads via @ValueMapValue) against the schema that documents those properties.
 */
public class JcrAuthoringSchemaValidationTest {

    private static final ObjectMapper JSON_MAPPER = new ObjectMapper();
    private static final ObjectMapper YAML_MAPPER = new ObjectMapper(new YAMLFactory());

    /** Scheme name we register for our custom classpath+yaml fetcher. */
    private static final String SCHEME = "authoring-schema";

    /**
     * All schema classpath paths that need to be served by the custom fetcher.
     * When networknt resolves a $ref it will call our fetcher for any URI
     * with scheme "authoring-schema".
     */
    private static final List<String> ALL_SCHEMA_PATHS = Arrays.asList(
        "/authoring-schema/base.authoring.schema.yaml",
        "/authoring-schema/field.authoring.schema.yaml",
        "/authoring-schema/container.authoring.schema.yaml",
        "/authoring-schema/panelimpl.authoring.schema.yaml",
        "/authoring-schema/components/textinput.authoring.schema.yaml",
        "/authoring-schema/components/dropdown.authoring.schema.yaml",
        "/authoring-schema/components/checkboxgroup.authoring.schema.yaml",
        "/authoring-schema/components/panelcontainer.authoring.schema.yaml",
        "/authoring-schema/components/accordion.authoring.schema.yaml",
        "/authoring-schema/components/tabsontop.authoring.schema.yaml",
        "/authoring-schema/components/verticaltabs.authoring.schema.yaml",
        "/authoring-schema/components/wizard.authoring.schema.yaml"
    );

    private static JsonSchemaFactory SCHEMA_FACTORY;

    /** In-memory cache: absolute authoring-schema URI → JSON bytes (YAML converted to JSON). */
    private static final Map<String, byte[]> SCHEMA_CACHE = new HashMap<>();

    @BeforeAll
    static void setUpFactory() throws Exception {
        /*
         * Pre-read every schema YAML and convert to JSON bytes. Also patch each schema's
         * $id to be an absolute authoring-schema: URI so networknt can resolve
         * relative $refs against it.
         */
        for (String classpathPath : ALL_SCHEMA_PATHS) {
            InputStream yamlStream = JcrAuthoringSchemaValidationTest.class.getResourceAsStream(classpathPath);
            if (yamlStream == null) {
                throw new IllegalStateException("Missing schema on classpath: " + classpathPath);
            }
            ObjectNode schemaNode = (ObjectNode) YAML_MAPPER.readTree(yamlStream);

            // Patch $id to absolute URI so $ref resolution works
            String absoluteId = SCHEME + ":" + classpathPath;
            schemaNode.put("$id", absoluteId);

            byte[] jsonBytes = JSON_MAPPER.writeValueAsBytes(schemaNode);
            SCHEMA_CACHE.put(absoluteId, jsonBytes);
        }

        /*
         * Register a custom URIFetcher for our "authoring-schema" scheme.
         * The fetcher resolves the URI path against our pre-populated cache.
         */
        URIFetcher fetcher = uri -> {
            String key = uri.toString();
            byte[] bytes = SCHEMA_CACHE.get(key);
            if (bytes == null) {
                // Try to load on-demand (e.g. for paths not pre-loaded)
                String path = uri.getPath();
                InputStream stream = JcrAuthoringSchemaValidationTest.class.getResourceAsStream(path);
                if (stream == null) {
                    throw new java.io.IOException("Schema not found in cache or classpath: " + key);
                }
                ObjectNode node = (ObjectNode) YAML_MAPPER.readTree(stream);
                node.put("$id", key);
                bytes = JSON_MAPPER.writeValueAsBytes(node);
                SCHEMA_CACHE.put(key, bytes);
            }
            return new ByteArrayInputStream(bytes);
        };

        SCHEMA_FACTORY = JsonSchemaFactory.builder(
            JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V7))
            .uriFetcher(fetcher, SCHEME)
            .build();
    }

    /**
     * Load a YAML schema from the cache using its absolute authoring-schema: URI.
     * The factory will call our fetcher for any $ref it encounters during validation.
     */
    private JsonSchema loadSchema(String classpathPath) throws Exception {
        String absoluteId = SCHEME + ":" + classpathPath;
        byte[] jsonBytes = SCHEMA_CACHE.get(absoluteId);
        if (jsonBytes == null) {
            throw new IllegalArgumentException("Schema not pre-loaded: " + classpathPath);
        }
        URI schemaUri = URI.create(absoluteId);
        JsonNode schemaNode = JSON_MAPPER.readTree(jsonBytes);
        return SCHEMA_FACTORY.getSchema(schemaUri, schemaNode);
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
