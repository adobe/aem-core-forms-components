---
applyTo: "**/.content.xml,**/_cq_dialog/**,**/_cq_design_dialog/**"
---

# Content XML & Dialog Review Rules

## Proxy Component Pattern (CRITICAL)
- `sling:resourceType` on content nodes must NEVER contain version numbers (e.g., `/v1/`, `/v2/`)
- Version numbers are only allowed in `sling:resourceSuperType` on the proxy component node
- If this is a new component definition, verify the proxy pattern is followed

## Dialog Structure
- Dialog root must be `cq:dialog` with `sling:resourceType="cq/gui/components/authoring/dialog"`
- Use tabs for dialogs with more than 5 fields
- Field names (`./propertyName`) must be camelCase
- Required fields must have `required="{Boolean}true"`
- Non-obvious fields should include `fieldDescription` help text

## Content Package Rules
- Use Granite UI components (Coral 3) for dialog fields
- Proper XML namespace declarations required
- No hardcoded `/content/*` paths — use relative paths or path browser with `rootPath`
- `jcr:primaryType` must be set correctly (`nt:unstructured` for dialog nodes)
