/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe
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
package com.adobe.cq.forms.core;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.stream.Stream;

import javax.json.Json;
import javax.json.JsonReader;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.jetbrains.annotations.NotNull;

import com.adobe.cq.forms.core.components.internal.models.v2.form.FormContainerImpl;
import com.adobe.cq.forms.core.components.models.form.FormComponent;
import com.adobe.cq.forms.core.components.views.Views;
import com.adobe.cq.wcm.core.components.internal.jackson.DefaultMethodSkippingModuleProvider;
import com.adobe.cq.wcm.core.components.internal.jackson.PageModuleProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.google.common.base.Joiner;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;
import io.wcm.testing.mock.aem.junit5.AemContext;

import static org.junit.Assert.*;

/**
 * Testing utilities.
 */
public class Utils {

    public static InputStream getJson(Object model, Class<? extends Views.Publish> viewType) {
        Writer writer = new StringWriter();
        ObjectMapper mapper = new ObjectMapper();
        PageModuleProvider pageModuleProvider = new PageModuleProvider();
        mapper.registerModule(pageModuleProvider.getModule());
        DefaultMethodSkippingModuleProvider defaultMethodSkippingModuleProvider = new DefaultMethodSkippingModuleProvider();
        mapper.registerModule(defaultMethodSkippingModuleProvider.getModule());
        try {
            mapper.writerWithView(viewType).writeValue(writer, model);
        } catch (IOException e) {
            fail(String.format("Unable to generate JSON export for model %s: %s", model.getClass().getName(),
                    e.getMessage()));
        }
        return IOUtils.toInputStream(writer.toString());
    }

    public static InputStream getCompleteJson(Object model) {
        Writer writer = new StringWriter();
        ObjectMapper mapper = new ObjectMapper();
        PageModuleProvider pageModuleProvider = new PageModuleProvider();
        mapper.registerModule(pageModuleProvider.getModule());
        DefaultMethodSkippingModuleProvider defaultMethodSkippingModuleProvider = new DefaultMethodSkippingModuleProvider();
        mapper.registerModule(defaultMethodSkippingModuleProvider.getModule());
        try {
            mapper.writerWithView(Views.Author.class).writeValue(writer, model);
        } catch (IOException e) {
            fail(String.format("Unable to generate JSON export for model %s: %s", model.getClass().getName(),
                    e.getMessage()));
        }
        return IOUtils.toInputStream(writer.toString());
    }

    /**
     * Provided a {@code model} object and an {@code expectedJsonResource} identifying a JSON file in the class path,
     * this method will test the JSON export of the model and compare it to the JSON object provided by the
     * {@code expectedJsonResource}.
     *
     * @param model
     *            the Sling Model
     * @param expectedJsonResource
     *            the class path resource providing the expected JSON object
     */
    public static void testJSONExport(Object model, String expectedJsonResource,
            Class<? extends Views.Publish> viewType) {
        InputStream modeInputStream = getJson(model, viewType);
        JsonReader outputReader = Json.createReader(modeInputStream);
        InputStream is = Utils.class.getResourceAsStream(expectedJsonResource);
        if (is != null) {
            JsonReader expectedReader = Json.createReader(is);
            assertEquals(expectedReader.read(), outputReader.read());
        } else {
            fail("Unable to find test file " + expectedJsonResource + ".");
        }
        IOUtils.closeQuietly(is);
        // this is added so that other components like form portal, aem form etc don't
        // get validated against schema
        if (model instanceof FormComponent) {
            Utils.testSchemaValidation(model);
        }
    }

    /**
     * Provided a {@code model} object and an {@code expectedJsonResource} identifying a JSON file in the class path,
     * this method will test the JSON export of the model and compare it to the JSON object provided by the
     * {@code expectedJsonResource}.
     *
     * @param model
     *            the Sling Model
     * @param expectedJsonResource
     *            the class path resource providing the expected JSON object
     */
    public static void testJSONExport(Object model, String expectedJsonResource) {
        testJSONExport(model, expectedJsonResource, Views.Publish.class);
    }

    /**
     * The given model is validated against adaptive form specification
     *
     * @param model
     *            reference to the sling model
     */
    public static void testSchemaValidation(@NotNull Object model) {
        // we check complete json in schema validation, to validate complete model json
        InputStream jsonStream = getCompleteJson(model);
        // create instance of the ObjectMapper class
        ObjectMapper objectMapper = new ObjectMapper();
        // create an instance of the JsonSchemaFactory using version flag
        JsonSchemaFactory schemaFactory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V7);
        try {
            InputStream schemaStream = Utils.class.getResourceAsStream("/schema/0.15.2/adaptive-form.schema.json");
            JsonSchema schema = schemaFactory.getSchema(schemaStream);
            // read data from the stream and store it into JsonNode
            JsonNode json = objectMapper.readTree(jsonStream);
            // if there is a version bump of schema, then it needs to be validated against its corresponding sling model
            // here
            // by explicitly checking the model implementation
            if (!(model instanceof FormContainerImpl)) {
                InputStream formContainerTemplate = Utils.class.getResourceAsStream("/schema/0.15.2/form.json");
                JsonNode formContainerTemplateNode = objectMapper.readTree(formContainerTemplate);
                ((ObjectNode) formContainerTemplateNode).putArray("items").add(json);
                json = formContainerTemplateNode;
            }
            // create set of validation message and store result in it
            Set<ValidationMessage> validationResult = schema.validate(json);
            // show the validation errors
            if (!validationResult.isEmpty()) {
                // show all the validation error
                fail(String.format("Error found during schema validation : %s", Joiner.on(" ").join(validationResult)));
            }
        } catch (IOException ex) {
            fail(String.format("Unable to validate form model definition : %s", ex.getMessage()));
        }
    }

    /**
     * Loads a JCR authoring schema by its YAML classpath path. The schema and all its $ref dependencies are resolved
     * via a shared temp-directory cache initialised on first call — no pre-flattened JSON copies are needed.
     *
     * @param yamlClasspathPath
     *            e.g. "/authoring-schema/components/textinput.authoring.schema.yaml"
     * 
     * @return the loaded {@link JsonSchema} ready for validation
     */
    public static JsonSchema loadAuthoringSchema(@NotNull String yamlClasspathPath) {
        return SchemaCache.load(yamlClasspathPath);
    }

    /**
     * Validates the JCR ValueMap of a resource against the JCR authoring schema for a component. The schema is loaded
     * from the shared {@link SchemaCache} which resolves all $ref chains at runtime — no pre-flattened JSON schema
     * files are needed in source control.
     *
     * @param resource
     *            the Sling resource whose ValueMap to validate
     * @param yamlClasspathPath
     *            classpath path to the component YAML authoring schema, e.g.
     *            "/authoring-schema/components/textinput.authoring.schema.yaml"
     */
    public static void testJcrSchemaValidation(@NotNull Resource resource, @NotNull String yamlClasspathPath) {
        try {
            JsonSchema schema = SchemaCache.load(yamlClasspathPath);
            JsonNode jcrNode = new ObjectMapper().valueToTree(resource.getValueMap());
            Set<ValidationMessage> errors = schema.validate(jcrNode);
            if (!errors.isEmpty()) {
                fail(String.format("JCR authoring schema validation failed for %s: %s", resource.getPath(),
                        Joiner.on(" ").join(errors)));
            }
        } catch (Exception ex) {
            fail("Unable to validate JCR node against authoring schema: " + ex.getMessage());
        }
    }

    /**
     * Provided a test base folder ({@code testBase}) and a virtual resource path ({@code testResourcePath}), this
     * method generates the class path resource path for the JSON files that represent the expected exporter output for
     * a component. The returned value is generated using the following concatenation operation:
     *
     * <pre>
     *     testBase + '/exporter-' + fileName(testResourcePath) + '.json'
     * </pre>
     *
     * For example:
     *
     * <pre>
     *     testBase = '/form/button'
     *     testResourcePath = '/content/buttons/button'
     *     output = '/form/button/exporter-button.json'
     * </pre>
     *
     * @param testBase
     *            the test base folder (under the {@code src/test/resources} folder)
     * @param testResourcePath
     *            the test resource path in the virtual repository
     * 
     * @return the expected class path location of the JSON exporter file
     */
    public static String getTestExporterJSONPath(String testBase, String testResourcePath) {
        return testBase + "/exporter-" + FilenameUtils.getName(testResourcePath) + ".json";
    }

    /**
     * Set internal state on a private field.
     *
     * @param target
     *            target object to set the private field
     * @param field
     *            name of the private field
     * @param value
     *            value of the private field
     */
    @SuppressWarnings("squid:S00112")
    public static void setInternalState(Object target, String field, Object value) {
        Class<?> c = target.getClass();
        try {
            Field f = getFieldFromHierarchy(c, field);
            f.setAccessible(true);
            f.set(target, value);
        } catch (IllegalAccessException | RuntimeException e) {
            throw new RuntimeException(
                    "Unable to set internal state on a private field. Please report to mockito mailing list.", e);
        }
    }

    private static Field getFieldFromHierarchy(Class<?> clazz, String field) {
        Field f = getField(clazz, field);
        while (f == null && clazz != Object.class) {
            clazz = clazz.getSuperclass();
            f = getField(clazz, field);
        }
        if (f == null) {
            throw new IllegalArgumentException("You want me to get this field: '" + field + "' on this class: '"
                    + clazz.getSimpleName() + "' but this field is not declared withing hierarchy of this class!");
        }
        return f;
    }

    private static Field getField(Class<?> clazz, String field) {
        try {
            return clazz.getDeclaredField(field);
        } catch (NoSuchFieldException e) {
            return null;
        }
    }

    public static <T> T getComponentUnderTest(String resourcePath, Class<T> clazz, AemContext context) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        assertNotNull("resource adaptation should not be null", context.currentResource().adaptTo(clazz));
        assertNotNull("request adaptation should not be null", request.adaptTo(clazz));
        return request.adaptTo(clazz);
    }

    public static Method getPrivateMethod(Class clazz, String privateMethodName) {
        try {
            Method method = clazz.getDeclaredMethod(privateMethodName);
            method.setAccessible(true);
            return method;
        } catch (NoSuchMethodException e) {
            return null;
        }
    }

    /**
     * Lazily initialises a shared temp-directory tree of JSON-converted authoring schemas. All *.yaml files under the
     * /authoring-schema classpath directory are converted once per JVM and written to a mirrored temp directory so
     * networknt can resolve relative $refs via file: URIs — no pre-flattened JSON copies needed in source control.
     */
    private static final class SchemaCache {

        private static final String SCHEMA_ROOT = "/authoring-schema";

        static final Path TEMP_DIR;
        static final JsonSchemaFactory FACTORY = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V7);

        static {
            try {
                TEMP_DIR = Files.createTempDirectory("jcr-authoring-schema-");
                ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
                ObjectMapper jsonMapper = new ObjectMapper();
                URL rootUrl = SchemaCache.class.getResource(SCHEMA_ROOT);
                if (rootUrl == null) {
                    throw new IllegalStateException(
                            "Authoring schema directory not found on classpath: " + SCHEMA_ROOT);
                }
                Path resourceRoot = Paths.get(rootUrl.toURI());
                try (Stream<Path> walk = Files.walk(resourceRoot)) {
                    walk.filter(p -> p.toString().endsWith(".yaml")).forEach(yamlPath -> {
                        try {
                            Path rel = resourceRoot.relativize(yamlPath);
                            Path out = TEMP_DIR.resolve(rel.toString());
                            Files.createDirectories(out.getParent());
                            try (InputStream in = Files.newInputStream(yamlPath)) {
                                ObjectNode node = (ObjectNode) yamlMapper.readTree(in);
                                node.remove("$id");
                                jsonMapper.writerWithDefaultPrettyPrinter().writeValue(out.toFile(), node);
                            }
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to convert schema: " + yamlPath, e);
                        }
                    });
                }
            } catch (Exception e) {
                throw new ExceptionInInitializerError(e);
            }
        }

        static JsonSchema load(String yamlClasspathPath) {
            String rel = yamlClasspathPath.substring(SCHEMA_ROOT.length());
            if (rel.startsWith("/")) {
                rel = rel.substring(1);
            }
            return FACTORY.getSchema(TEMP_DIR.resolve(rel).toUri());
        }
    }
}
