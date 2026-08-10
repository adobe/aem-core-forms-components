# Datasource Servlet for Granite UI Selects

Use a datasource servlet when a Granite UI `form/select` (or `form/autocomplete`) needs to be populated dynamically from JCR content at dialog-open time — for example, listing all form fields compatible with a given data type, or listing cloud service configurations.

---

## 1. Servlet Pattern

```java
@Component(service = { Servlet.class }, property = {
    "sling.servlet.resourceTypes=core/fd/components/form/container/v2/container/datasource/myfields",
    "sling.servlet.methods=GET",
    "sling.servlet.extensions=html"
})
public class MyFieldsDataSourceServlet extends AbstractDataSourceServlet {

    @Reference
    private transient ExpressionResolver expressionResolver;

    @NotNull
    @Override
    protected ExpressionResolver getExpressionResolver() {
        return expressionResolver;
    }

    @Override
    protected void doGet(@NotNull SlingHttpServletRequest request,
                         @NotNull SlingHttpServletResponse response) {
        ResourceResolver resolver = request.getResourceResolver();
        // The suffix is the path of the component instance being configured
        String suffix = request.getRequestPathInfo().getSuffix();
        List<Resource> entries = new ArrayList<>();

        if (resolver != null && suffix != null) {
            Resource component = resolver.getResource(suffix);
            Resource form = ComponentUtils.getFormContainer(component);
            if (form != null) {
                collectEntries(form, entries, resolver);
            }
        }

        request.setAttribute(DataSource.class.getName(),
            new SimpleDataSource(entries.iterator()));
    }

    private void collectEntries(Resource parent, List<Resource> result,
                                ResourceResolver resolver) {
        for (Resource child : parent.getChildren()) {
            String rt = child.getValueMap().get("sling:resourceType", String.class);
            if (rt == null) continue;
            // recurse into containers, skip non-interactive types, add data fields
            if (isContainer(rt)) {
                collectEntries(child, result, resolver);
            } else if (isDataField(rt)) {
                ValueMap vm = child.getValueMap();
                String fieldName = vm.get("name", child.getName());
                String label = vm.get("fieldLabel", fieldName);
                result.add(createEntry(resolver, label + " (" + fieldName + ")", fieldName));
            }
        }
    }

    private Resource createEntry(ResourceResolver resolver, String text, String value) {
        Map<String, Object> map = new HashMap<>();
        map.put("text", text);
        map.put("value", value);
        return new ValueMapResource(resolver, "", JcrConstants.NT_UNSTRUCTURED,
            new ValueMapDecorator(map));
    }
}
```

**Required imports:**
```java
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.apache.jackrabbit.JcrConstants;
```

---

## 2. Wiring the Datasource in the Dialog XML

Point the select's datasource node to the servlet's resource type. The suffix is injected automatically by Granite UI as the path of the component being edited.

```xml
<mySelect
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/select"
    fieldLabel="Select a Form Field"
    multiple="{Boolean}true"
    name="./myFieldRef">
    <datasource
        jcr:primaryType="nt:unstructured"
        sling:resourceType="core/fd/components/form/container/v2/container/datasource/myfields"/>
</mySelect>
```

Create the datasource node in the content package:
```
ui.af.apps/.../container/v2/container/datasource/myfields/
└── .content.xml   ← jcr:primaryType="sling:Folder"
```

Register the resource type constant in `FormConstants.java`:
```java
public static final String RT_FD_FORM_MYFIELDS_DATASOURCE_V1 =
    RT_FD_FORM_PREFIX + "container/v2/container/datasource/myfields";
```

---

## 3. Exclusion Pattern for Form Tree Traversal

When collecting compatible form fields, use fragment-matching exclusion sets rather than resource type equality. This handles version suffixes (`/v1/`, `/v2/`) automatically:

```java
private static final Set<String> CONTAINER_FRAGMENTS = new HashSet<>(Arrays.asList(
    "form/container/", "form/panel/", "form/panelcontainer/",
    "form/accordion/", "form/wizard/", "form/tabsontop/",
    "form/verticaltabs/", "form/fragmentcontainer"
));

private static final Set<String> SKIP_FRAGMENTS = new HashSet<>(Arrays.asList(
    "form/text/v", "form/title/", "form/image/", "form/button/",
    "form/actions/", "form/recaptcha", "form/hcaptcha", "form/terms"
));

private static boolean matchesAny(String rt, Set<String> fragments) {
    for (String f : fragments) {
        if (rt.contains(f)) return true;
    }
    return false;
}
```

Use `rt.startsWith(FormConstants.RT_FD_FORM_PREFIX)` to skip non-form components before the exclusion checks.
