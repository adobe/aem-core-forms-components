# Composite Multifield in Granite UI Dialogs

Use a `composite="true"` multifield when each item in a repeatable list has multiple named sub-fields (e.g., a list of signers each with email, authentication method, and phone number). Each item is stored as a child JCR node under the multifield's named path.

---

## 1. XML Structure

```xml
<myMultifield
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/multifield"
    composite="true"
    fieldDescription="Add one or more items."
    fieldLabel="Items"
    name="./items/item">
    <field
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/container"
        name="./items/item">
        <items jcr:primaryType="nt:unstructured">
            <!-- Sub-fields — note: NO "./" prefix on name attributes here -->
            <title
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                fieldLabel="Title"
                name="title"/>
            <mode
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/form/select"
                fieldLabel="Mode"
                name="mode">
                <items jcr:primaryType="nt:unstructured">
                    <opt1 jcr:primaryType="nt:unstructured" text="Option A" value="A"/>
                    <opt2 jcr:primaryType="nt:unstructured" text="Option B" value="B"/>
                </items>
            </mode>
        </items>
    </field>
</myMultifield>
```

**Critical rules:**
- `composite="true"` (not `composite="{Boolean}true"`) — the literal string form is required.
- The `field` container's `name` must match the multifield's `name` exactly (including the `./` prefix).
- Sub-field `name` attributes inside the template do NOT use `./` prefix — they are relative to the multifield item node automatically.
- The `granite:class` on the `field` container provides the JS hook for the whole item row.

---

## 2. JCR Storage

Each item is stored as a numbered child of the multifield node:
```
./items/item/item0/title = "First item title"
./items/item/item0/mode  = "A"
./items/item/item1/title = "Second item title"
./items/item/item1/mode  = "B"
```

---

## 3. Reading in a Sling Model

```java
@ChildResource(injectionStrategy = InjectionStrategy.OPTIONAL, name = "items")
private Resource itemsResource;

@PostConstruct
private void init() {
    if (itemsResource != null) {
        Resource itemContainer = itemsResource.getChild("item");
        if (itemContainer != null) {
            List<MyItemModel> list = new ArrayList<>();
            for (Resource child : itemContainer.getChildren()) {
                MyItemModel m = child.adaptTo(MyItemModel.class);
                if (m != null) list.add(m);
            }
            items = Collections.unmodifiableList(list);
        }
    }
}
```

The item model class must be annotated with `adaptables = { Resource.class }` (not `SlingHttpServletRequest.class`) since it adapts from child resources, not from a request.

---

## 4. JS Selector for Sub-Fields

Inside a `coral-collection:add` handler, `e.detail.item` is the `coral-multifield-item` element. The item div (from `granite:class` on the `field` container) is a child of it — find it with `$(e.detail.item).find(".your-item-class")`. The template HTML is fully rendered (including `granite:class` values) when the event fires, but Coral sub-components (`coral-select`, `coral-radiogroup`) may still be upgrading — use `Coral.commons.ready(e.detail.item, callback)` before reading `coral-select.value`.

**Also see:** `references/editor-clientlib.md` for the full JS boilerplate pattern including listener registration order, default-off field hiding, and `getSelectValue` helpers.
