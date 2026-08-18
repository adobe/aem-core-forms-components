# AF2 Runtime Internals

Reference guide for the AF2 form initialization pipeline. Use this to understand how the runtime works and to orient quickly when debugging failures.

---

## 1. Bundle Composition

The Cypress IT test pages load a single minified JS bundle that contains code compiled from **two sources**:

| Source | Role |
|---|---|
| `ui.af.apps/.../formcontainerview.js` | Production `FormContainerV2` |
| `it/apps/.../formcontainerview.js` | IT test `FormContainerV2` (older version) |

Both register an `onDocumentReady` handler that calls `Utils.setupFormContainer`. This means **`setupFormContainer` is invoked twice per page load** against the same DOM element in IT test pages.

`setupFormContainer` guards against this with a data attribute set synchronously before any async work:

```javascript
// ui.frontend/src/utils.js
} else if (elements[i].dataset.cmpAdaptiveformcontainerInitialized) {
    continue;
} else {
    elements[i].dataset.cmpAdaptiveformcontainerInitialized = 'true';
    // ... rest of init
```

Setting the flag synchronously (before any `await`) is important — it prevents a second concurrent call from slipping through before the first one finishes.

---

## 2. Form Initialization Flow

```
onDocumentReady()
  └─ Utils.setupFormContainer(createFormContainer, selector, IS)
       └─ for each formContainer DOM element:
            ├─ [guard: skip if data-cmp-adaptiveformcontainer-initialized is set]
            ├─ mark element initialized (synchronous, before any await)
            ├─ fetch form JSON  (HTTPAPILayer.getFormDefinition)
            ├─ createFormContainer({ _formJson, _prefillData, _path, _element })
            │    └─ new FormContainerV2(...)
            │         └─ createFormInstance(_formJson)        ← af2-web-runtime
            │              └─ Container._initialize()         ← builds model tree
            │                   └─ for repeatable children: creates N instances
            ├─ formContainer.subscribe()
            └─ Utils.initializeAllFields(formContainer)
                 └─ for each field selector (in defined order):
                      └─ Utils.#createFormContainerFields(elements, creator, formContainer)
                           └─ for each matching DOM element:
                                ├─ [guard: skip if already in formContainer._fields]
                                ├─ [guard: skip if data-cmp-adaptiveformcontainer-path ≠ form path]
                                ├─ creator({ element, formContainer })  → fieldView
                                └─ formContainer.addField(fieldView)
                                     ├─ _fields[id] = fieldView
                                     ├─ model = formContainer.getModel(id)   ← undefined if wrong container
                                     ├─ fieldView.setModel(model)            ← crashes if model undefined
                                     ├─ fieldView.syncMarkupWithModel()
                                     ├─ parent resolution (deferred if parent view not yet added)
                                     └─ fieldView.subscribe()
```

### Critical invariant

Every DOM element processed by `initializeAllFields` must have its ID present in the form container's model. If `getModel(id)` returns `undefined`, `fieldView.setModel(undefined)` crashes immediately at `model.getState()`.

This invariant is enforced by two guards in `#createFormContainerFields`:
1. `formContainer.getField(elementId) == null` — skip already-registered fields
2. `formPathInField == formPath` — skip fields that belong to a different form container

If either guard is missing or bypassed, the invariant can be violated.

---

## 3. Model and View Lifecycle

### Model tree (`af2-web-runtime`)

`createFormInstance(_formJson)` builds the complete model tree synchronously. Each node gets a stable ID (from the JSON for top-level items, or UUID-based for dynamically created instances). All nodes are registered in `form._fields` indexed by ID.

### View registration (`FormContainer.addField`)

Views are registered lazily — they're created by `initializeAllFields` scanning the DOM after the model is built. The model always exists before any view is created.

### Parent–child view resolution

`addField` resolves parent views as fields are registered:
- If the parent view already exists in `_fields`, set it immediately.
- If not, defer: add to `_deferredParents[parentId]`. When the parent view is later registered, deferred children are resolved.

This handles the case where child DOM elements appear before their parent in the DOM scan order.

---

## 4. Repeatable Containers

### What "repeatable" means

A panel with `type='array'` and `items.length === 1` in the JSON is a repeatable container. The server sends **exactly one item** (the template) regardless of `minOccur`. The client creates all required instances.

### Model initialization

`Container._initialize` detects a repeatable child when `type === 'array'` AND `items.length === 1`.

```
initialItems = Math.max(1, minItems)

for i in range(initialItems):
    if i === 0:  _addChild(template, cloneIds=false)  → preserves template IDs
    else:        _addChild(template, cloneIds=true)   → generates UUID-based IDs
```

All instances are registered in `form._fields`. `_addChild` also mutates `itemJson.id = retVal.id` on the template — so after the loop the template JSON carries the ID of the first created instance.

### DOM synchronization (`InstanceManager`)

When the first instance's **view** calls `setParent`, `InstanceManager.setRepeatableParentView` fires. This triggers `#syncInstancesHTML()` which:

1. Iterates model instances that have no corresponding DOM element (instances 1+)
2. Clones the template HTML
3. Replaces all `id` and `for` attributes with UUID-based values matching the model
4. Inserts the new HTML into the DOM

**Important**: this DOM mutation happens **during** `initializeAllFields`, not after. Any code that scans the DOM for field elements after this point will see the UUID-based elements.

### Timing hazard

If two `setupFormContainer` calls process the same form element (double-init scenario), the sequence is:

1. Form1 runs `initializeAllFields` → InstanceManager inserts UUID DOM elements (using Form1's UUIDs)
2. Form2 runs `initializeAllFields` → finds those UUID DOM elements → `getModel(UUID)` on Form2's model (which has **different** UUIDs) → `undefined` → crash

The `data-cmp-adaptiveformcontainer-initialized` guard (§1) prevents this by ensuring only one `setupFormContainer` call ever processes a given element.

---

## 5. Form JSON Formats

The runtime supports two JSON representations of container children, depending on server configuration:

### Sling format (`:items` / `:itemsOrder`)

```json
{
  ":items": { "field1": { "fieldType": "text-input", ... } },
  ":itemsOrder": ["field1"]
}
```

`sitesModelToFormModel` (af2-web-runtime) converts this to the `items` array format before model construction. It only fires when **both** `:items` AND `:itemsOrder` are present.

### Items array format (`items`)

```json
{
  "items": [{ "fieldType": "text-input", ... }]
}
```

Used when `FT_FORMS-24358` is enabled. `sitesModelToFormModel` is a no-op and `items` passes through directly.

Both formats produce identical model trees. The difference is JSON size and the conversion step — `createFormInstance` behavior is the same either way.

### Verifying the server output

```bash
curl -s -u admin:admin \
  "http://localhost:4502/<pagePath>/_jcr_content/guideContainer.model.json" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(':items:', ':items' in d, '  items:', 'items' in d)"
```

---

## 6. Key Source Files

### Java (server-side)

| File | Role |
|---|---|
| `bundles/af-core/.../util/AbstractContainerImpl.java` | `getExportedItems`, `getExportedItemsOrder`, `getExportedItemsArray` |
| `bundles/af-core/.../util/AbstractFormComponentImpl.java` | `getEvents` — per-component event injection |
| `bundles/af-core/.../form/internal/FragmentImpl.java` | Fragment event/rule merging |
| `bundles/af-core/.../form/FeatureToggleConstants.java` | All feature toggle ID constants |
| `it/config/.../DynamicToggleProviderImpl.cfg.json` | OSGi config that wires toggles as JVM system properties |

### JavaScript (this repo)

| File | Role |
|---|---|
| `ui.frontend/src/utils.js` | `setupFormContainer`, `initializeAllFields`, `#createFormContainerFields` |
| `ui.frontend/src/view/FormContainer.js` | `addField`, `getModel`, `getAllFields`, `subscribe` |
| `ui.frontend/src/view/InstanceManager.js` | `setRepeatableParentView`, `#syncInstancesHTML`, `#addChildInstance` |
| `ui.af.apps/.../formcontainerview.js` | Production `onDocumentReady` + `FormContainerV2` |
| `it/apps/.../formcontainerview.js` | IT test `onDocumentReady` + `FormContainerV2` (also in bundle) |

### JavaScript (af2-web-runtime, external)

| File | Role |
|---|---|
| `packages/forms-next-core/src/Container.ts` | `_initialize`, `_addChild`, `_canHaveRepeatingChildren` |
| `packages/forms-next-core/src/utils/FormCreationUtils.ts` | Creates `InstanceManager` for repeatable children |

---

## 7. Debugging

For common failure patterns, debugging checklists, and resolved issues, see [`docs/debugging/known-issues.md`](../debugging/known-issues.md).
