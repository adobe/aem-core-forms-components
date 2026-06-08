# Editor Clientlib for Dialog Interactivity

When a FormContainer dialog tab (or any complex author dialog) needs JavaScript-driven conditional field visibility, add an editor clientlib alongside the dialog. This is separate from the component's `runtime` clientlib — it runs only in the AEM author UI.

---

## 1. Clientlib Structure

```
ui.af.apps/.../form/container/v2/container/
└── clientlibs/
    └── editor/
        ├── .content.xml           ← cq:ClientLibraryFolder
        ├── js.txt
        └── js/
            └── myTabDialog.js
```

**`.content.xml`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    allowProxy="{Boolean}true"
    categories="[core.forms.components.container.v2.editor]"/>
```

Wire it to the dialog by adding the category to `extraClientlibs` on the dialog's `.content.xml`:
```xml
extraClientlibs="[core.forms.components.container.v1.editor,core.forms.components.container.v2.editor]"
```

---

## 2. JS Boilerplate

```javascript
(function($, channel, Coral) {
    "use strict";

    var SELECTORS = {
        myTab: ".cmp-adaptiveform-container__mytab",
        enableCheckbox: ".cmp-adaptiveform-container__enable-feature",
        configSection: ".cmp-adaptiveform-container__config-section",
        sourceSelect: ".cmp-adaptiveform-container__source-select",
        autocompleteField: ".cmp-adaptiveform-container__autocomplete",
        textField: ".cmp-adaptiveform-container__text-input"
    };

    /**
     * Returns the value from a coral-select, handling granite:class on a wrapper.
     */
    function getSelectValue($el) {
        var cs = $el.is("coral-select") ? $el[0] : $el.find("coral-select")[0];
        return cs ? (cs.value || "") : "";
    }

    /**
     * Show/hide a field's fieldwrapper, capped at a known boundary to prevent
     * accidentally hiding parent containers.
     */
    function setVisible($el, visible, $boundary) {
        var $candidate = $el.closest(".coral-Form-fieldwrapper");
        var useWrapper = $candidate.length && (!$boundary || $.contains($boundary[0], $candidate[0]));
        (useWrapper ? $candidate : $el).toggle(visible);
    }

    function applySourceRules($item) {
        var val = getSelectValue($item.find(SELECTORS.sourceSelect));
        // Treat "" same as the default option to handle pre-Coral-upgrade state
        setVisible($item.find(SELECTORS.autocompleteField), val === "form" || val === "", $item);
        setVisible($item.find(SELECTORS.textField), val === "typed", $item);
    }

    function initDialog(dialog) {
        var $dialog = $(dialog);
        if (!$dialog.find(SELECTORS.myTab).length) return;

        // CRITICAL: register all listeners BEFORE any code that adds multifield items.
        // Coral.commons.ready may fire synchronously — if a listener is not yet registered
        // when an item is programmatically added, its coral-collection:add event is missed.
        $dialog.on("change", SELECTORS.enableCheckbox, function() {
            $dialog.find(SELECTORS.configSection).toggle(isEnabled($dialog));
        });

        $dialog.on("change", SELECTORS.sourceSelect, function(e) {
            applySourceRules($(e.target).closest(".your-item-class"));
        });

        $dialog.on("coral-collection:add", "coral-multifield[name='./items/item']", function(e) {
            var newItem = e.detail.item;
            // Immediately hide default-off fields BEFORE Coral upgrades sub-components.
            // This prevents a flash where all fields appear simultaneously.
            var $imm = $(newItem).find(".your-item-class");
            if ($imm.length) {
                setVisible($imm.find(SELECTORS.textField), false, $imm);
            }
            Coral.commons.ready(newItem, function() {
                var $item = $(newItem).find(".your-item-class");
                if ($item.length) {
                    applySourceRules($item);
                }
            });
        });

        // Initialize existing items (for re-opened dialogs with saved data).
        // We are inside Coral.commons.ready(dialog), so all existing Coral selects are ready.
        $dialog.find(".your-item-class").each(function() {
            var $item = $(this);
            setVisible($item.find(SELECTORS.textField), false, $item); // default-off pre-hide
            applySourceRules($item);
        });

        // Initialize top-level checkbox state
        $dialog.find(SELECTORS.configSection).toggle(isEnabled($dialog));
    }

    channel.on("dialog-ready", function() {
        var dialog = $(".cq-dialog")[0];
        if (dialog) {
            Coral.commons.ready(dialog, function() {
                initDialog(dialog);
            });
        }
    });

})(jQuery, jQuery(document), Coral);
```

---

## 3. Key Patterns

| Pattern | Rule |
|---------|------|
| Listener registration order | Always register `coral-collection:add` and other listeners BEFORE any code that triggers item insertion. `Coral.commons.ready` may fire synchronously. |
| Default-off fields in new items | Immediately hide them on `e.detail.item` before calling `Coral.commons.ready`. The DOM is ready; Coral sub-components are not. |
| `getSelectValue` | Never read `$("coral-select").val()` — use `coralSelect.value` (the DOM property). Wrap so it handles both direct select and granite:class wrapper. |
| `val === ""` as default | When a select has no `emptyText` and the first item is the default, Coral returns the first item's value when upgraded. Before upgrade, it returns `""`. Treat both the same in your rules function. |
| `setVisible` boundary | Cap `.closest(".coral-Form-fieldwrapper")` at a known container boundary so it never traverses up to a parent container fieldwrapper and hides more than intended. |
| Dialog submit validation | Use `channel.on("cq-dialog-submit.namespaced", function(e) { if (!valid) { e.preventDefault(); e.stopImmediatePropagation(); } })` for required-field validation. |

---

## 4. Select Default Behavior (no `emptyText`)

Omitting `emptyText` from a Granite UI `form/select` makes the first `<items>` child the pre-selected default. No placeholder is shown. This is the correct pattern when there is always a valid default (e.g., "From Form Field", "None"). Only add `emptyText="Select"` when forcing the author to make an explicit choice before saving.
