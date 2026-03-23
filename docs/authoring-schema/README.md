# Authoring Schema

This directory contains YAML-based JSON Schema Draft 7 files documenting
the JCR properties that the Edit Dialog writes for each Adaptive Form
component and that the corresponding Sling Model consumes.

## Why separate from af2-docs schema?

`af2-docs/schema/` describes the **runtime JSON model** that the AF2 runtime
receives. This directory describes the **JCR authoring layer** — what an AEM
author actually stores in the content repository.

## Structure

```
docs/authoring-schema/
├── base.authoring.schema.yaml          # All components (AbstractFormComponentImpl + AbstractBaseImpl)
├── field.authoring.schema.yaml         # All field/leaf components (AbstractFieldImpl)
├── container.authoring.schema.yaml     # Panel/container components
└── components/
    ├── textinput.authoring.schema.yaml
    ├── dropdown.authoring.schema.yaml
    └── ...                              # One file per component
```

## Reading the schemas

Each property entry includes:
- **type** — JSON Schema / JCR type
- **title** — human-readable property name as shown in the dialog
- **description** — behavior notes including JCR property name (e.g. `fd:emptyValue`)
- **default** — value used when the property is absent from the JCR node
- **enum** (where applicable) — allowed values

## Child nodes

`fd:rules` and `fd:events` are JCR child nodes, not flat properties. They appear
in the base schema under those keys with documentation of their internal structure.

- **`fd:rules`**: contains runtime rule expressions (String), visual rule editor AST (String[]), and rule editor metadata (`validationStatus`). The web runtime only reads the plain property-name keys (visible, required, etc.).
- **`fd:events`**: contains event handler expressions. Keys are event names (click, change, etc.); values are String or String[]. Custom events use `custom_eventName` in JCR (renamed to `custom:eventName` at read time).

## Type mapping

| JCR Type   | JSON Schema type    |
|------------|---------------------|
| Boolean    | boolean             |
| String     | string              |
| String[]   | array of string     |
| Long       | integer             |
| Double     | number              |
| Date       | string (date-time)  |

> **Note**: Legacy JCR content may store Boolean properties (e.g. `required`, `hideTitle`,
> `dorExclusion`) as String `"true"`/`"false"`. Sling auto-coerces these transparently.
