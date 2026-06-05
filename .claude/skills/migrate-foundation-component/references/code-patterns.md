# Foundation Code Patterns and Core Equivalents

---

## JSP Conditional → HTL

```jsp
<% if (component.getProperty("showBadge", false)) { %><span class="badge"></span><% } %>
```
```html
<span data-sly-test="${model.showBadge}" class="cmp-adaptiveform-{name}__badge"></span>
```

---

## JSP Loop Over Items → HTL

```jsp
<% for (String item : items) { %><li><%= item %></li><% } %>
```
```html
<li data-sly-list.item="${model.items}">${item}</li>
```

---

## Foundation Java Bean Getter → Sling Model

```java
// Foundation
public String getSigningService() {
    return getProperty("signingService", "");
}
```
```java
// Core
@ValueMapValue(name = "signingService", injectionStrategy = InjectionStrategy.OPTIONAL)
@Nullable
private String signingService;

@Override
public String getSigningService() {
    return signingService != null ? signingService : "";
}
```

---

## Foundation jQuery Event → Core JS

```javascript
// Foundation
var $widget = $("[guide-item-value='" + field.dataRef + "']");
$widget.on("change", function(e) { field.value = e.target.value; });
```
```javascript
// Core
setModel(model) {
    super.setModel(model);
    this.widget.addEventListener("change", (e) => {
        this._model.value = e.target.value;
    });
}
```

---

## Foundation XFA `mandatory` → Core `required`

```
Foundation JCR:  mandatory="true"
Core JCR:        required="{Boolean}true"
Core getter:     isRequired()
```

---

## Foundation `assistPriority`/`speak` → Core

These are handled automatically by `AbstractBaseImpl`. Do not port them as explicit properties — the Core base class computes appropriate accessibility attributes from `label`, `description`, and `tooltip`.

---

## Foundation `sOM` Expression → Core

The SOM expression is computed by the Core runtime. Do not set it as a JCR property.

---

## Foundation Dialog Field → Core Dialog Field

```xml
<!-- Foundation (ExtJS / cq:Widget) -->
<items jcr:primaryType="cq:WidgetCollection">
    <myField jcr:primaryType="cq:Widget"
             xtype="textfield"
             fieldLabel="My Field"
             name="./myField"/>
</items>
```
```xml
<!-- Core (Granite UI / Coral) -->
<myField
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
    fieldLabel="My Field"
    name="./myField"/>
```

Key differences:
- No `xtype` — use `sling:resourceType` instead
- No `cq:WidgetCollection` wrapper — use `nt:unstructured` with `jcr:primaryType` only
- Property `name` must start with `./`
