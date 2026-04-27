# Editor Hook Patterns

Use this file when Phase 1.7 of `SKILL.md` flagged any of:

- Custom toolbar actions on the editbar (handlers referenced from `_cq_editConfig.xml` `<cq:actionConfigs>`)
- Drop-target restrictions that need runtime logic (beyond a static `accept` regex)
- Conditional actions whose visibility depends on the editable's state
- Replace-component policy overrides (e.g. allowing a component to be replaced with one whose `fieldType` family normally wouldn't match)
- Suppressing default toolbar actions on a specific editable

Editor hooks are author-time JavaScript that runs in the AEM Sites/Forms editor, not at form runtime. They live in the **shared container clientlib** and are registered under the `CQ.FormsCoreComponents.editorhooks.*` namespace.

---

## Where editor hook files live

```
ui.apps/src/main/content/jcr_root/apps/core/wcm/components/container/v2/container/clientlibs/editorhook/
├── .content.xml          (clientlib definition; do not modify)
├── js.txt                (manifest — register every new hook file here)
└── js/
    ├── {existing}hook.js
    └── {newhook}.js      (your file)
```

**Do not** create a new clientlib for a single component's hook. The container clientlib is already a dependency of the editor across all form components — adding to its `js.txt` makes the new handlers immediately available.

---

## Skeleton: register a handler under the shared namespace

**Path:** `ui.apps/.../editorhook/js/{componentname}editorhook.js`

```javascript
/*******************************************************************************
 * Copyright {currentYear} Adobe
 ******************************************************************************/
(function ($, ns, channel, window) {
    "use strict";

    ns.editorhooks = ns.editorhooks || {};

    /**
     * Action handler — called when an editbar action is clicked.
     * Signature: (editable: Granite.author.Editable) => void | Promise
     */
    ns.editorhooks.{handlerName} = function (editable) {
        // 1. Read state from `editable` (path, type, parent, dom)
        // 2. Mutate JCR via Granite.author.persistence.* (sync) or Granite.author.editableHelper.* (async)
        // 3. Call Granite.author.responsive.EditableActions.REFRESH.execute(editable.parent || editable)
        //    so the overlay repaints
    };

    /**
     * Condition function — called to decide whether an action is visible.
     * Signature: (editable: Granite.author.Editable) => boolean
     * Must be cheap — runs every time the editbar repaints.
     */
    ns.editorhooks.{conditionName} = function (editable) {
        // Inspect editable.type, editable.dom, editable.parent
        // Return true to show the action, false to hide it
        return /* boolean */ true;
    };

    /**
     * Toolbar suppression — prevent a default action from appearing on a specific editable.
     * Listen for the relevant editor lifecycle event and short-circuit when the editable
     * matches the target type/path.
     */
    // channel.on("cq-editor-loaded", function () { ... });

})(jQuery, CQ.FormsCoreComponents = CQ.FormsCoreComponents || {}, jQuery(document), this);
```

Then add the file to `ui.apps/.../editorhook/js.txt`:

```
#base=js
{componentname}editorhook.js
```

**Reference the handler / condition from `_cq_editConfig.xml`** using the full namespace path:

```xml
<addrow
    jcr:primaryType="nt:unstructured"
    condition="function(editable){return CQ.FormsCoreComponents.editorhooks.{conditionName}(editable);}"
    handler="CQ.FormsCoreComponents.editorhooks.{handlerName}"
    icon="tableRowAdd"
    text="Add Row"/>
```

---

## Pattern A — Custom action that mutates child JCR structure

For actions that add, remove, or reorder children (e.g. add a row, duplicate a section, move up/down):

1. Resolve the target parent path from `editable.path` (often `editable.path.replace(/\/[^/]+$/, '')`).
2. Build the new child node payload — typically a copy of an existing sibling's properties, or a fresh node from a known template.
3. Persist via `Granite.author.persistence.createParagraph(...)`, `.deleteParagraph(...)`, or `.moveParagraph(...)`.
4. Call `Granite.author.responsive.EditableActions.REFRESH.execute(editable.parent)` to repaint.
5. Return the resulting promise so the editor can chain status indicators.

Keep handlers under ~100 LOC. If the logic outgrows that, split into named helper functions in the same IIFE — still under `ns.editorhooks.*` so they can be unit-tested.

---

## Pattern B — Conditional action visibility

The `condition` attribute in `_cq_editConfig.xml` is a `function(editable)` that returns a boolean. Conditions run **every time the editbar repaints**, so:

- Inspect `editable.type` (the resourceType), `editable.dom` (the DOM node), and `editable.parent` (the parent Editable).
- Avoid DOM traversal beyond the immediate parent — anything more expensive belongs in cached helpers.
- Compose conditions with `&&` directly in the XML attribute when they're independent boolean predicates; extract a single named helper when they share a precondition.

Example helpers (define once, reuse from multiple actions):

```javascript
ns.editorhooks.is{ChildType} = function (editable) {
    return editable && editable.type === "core/fd/components/form/{childtype}/v1/{childtype}";
};

ns.editorhooks.isFirst{ChildType} = function (editable) {
    if (!ns.editorhooks.is{ChildType}(editable)) return false;
    var siblings = editable.parent && editable.parent.children;
    return siblings && siblings[0] === editable;
};

ns.editorhooks.isLast{ChildType} = function (editable) {
    if (!ns.editorhooks.is{ChildType}(editable)) return false;
    var siblings = editable.parent && editable.parent.children;
    return siblings && siblings[siblings.length - 1] === editable;
};
```

---

## Pattern C — Replace-component policy override

The default replace dialog only offers components in the same `fieldType` family. To allow free replacement inside a specific container (e.g. any field type can replace any cell), patch the replace policy by extending the existing `replacehook.js` rather than writing a new file. Keep the override scoped:

```javascript
// In replacehook.js — extend, don't fork
var originalCompute = ns.editorhooks.computeAllowedComponents;
ns.editorhooks.computeAllowedComponents = function (editable) {
    if (editable.parent && editable.parent.type === "core/fd/components/form/{ParentType}/v1/{ParentType}") {
        // inside our container — return the full set of form components, ignoring fieldType family
        return ns.editorhooks.getAllFormComponents(editable);
    }
    return originalCompute.apply(this, arguments);
};
```

This pattern keeps the default behavior for every other component intact.

---

## Pattern D — Suppress a default toolbar action on a specific editable

Listen for the editor's toolbar-rendering event and remove the unwanted action from the editable's toolbar:

```javascript
channel.on("cq-editor-loaded cq-overlays-repositioned", function () {
    Granite.author.editables.forEach(function (editable) {
        if (editable.type === "core/fd/components/form/{TargetType}/v1/{TargetType}") {
            // Editor-specific suppression goes here.
            // For example, hide the Delete action by setting editable.config.actions accordingly.
        }
    });
});
```

Use this sparingly — narrowing `cq:actions` in the component's own `_cq_editConfig.xml` is preferable when the action should always be hidden for that resource type.

---

## Common pitfalls

- **Forgetting to add the file to `js.txt`** — the handler will be `undefined` at runtime, the editbar action will silently do nothing.
- **Calling `REFRESH` on the wrong editable** — call it on the **parent**, not on a child being deleted (the child no longer exists).
- **Heavy work in `condition` functions** — they run on every repaint. Cache results on `editable._cache` if needed; never make synchronous AJAX calls.
- **Mutating shared runtime files** to support an authoring-only feature — author-time logic must stay in editor hooks; runtime files like `FormPanel.js` are reserved for runtime concerns.
- **Inventing a new namespace** — always register under `CQ.FormsCoreComponents.editorhooks.*`. Other namespaces won't be discoverable from `_cq_editConfig.xml` strings without additional wiring.
