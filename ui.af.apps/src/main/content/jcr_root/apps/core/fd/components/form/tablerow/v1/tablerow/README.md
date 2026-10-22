<!--
Copyright 2026 Adobe

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
Adaptive Form Table Row (v1)
====
Adaptive Form Table Row component written in HTL. Renders a `<tr>` data row inside the table body, and supports repeatable rows with add/remove controls.

## Features

* Renders a data row as a semantic `<tr>` with one `<td>` per child component
* Repeatable rows — add/remove buttons are injected into the last cell when the row is configured as repeatable (`minOccur`/`maxOccur`)
* Add/remove button visibility is controlled by `minOccur` and `maxOccur` constraints at runtime
* Visible, enabled, and read-only state binding for rules engine

### Use Object
The Adaptive Form Table Row component uses the `com.adobe.cq.forms.core.components.models.form.Panel` Sling Model for its Use-object (`TableRowImpl`), which exports `fd:viewType = "table-row"` for Document of Record rendering.

### Edit Dialog Properties
The following properties are written to JCR for this component and are expected to be available as `Resource` properties:

1. `./name` - defines the name of the row panel, used as the field name in the form model
2. `./minOccur` - minimum number of row instances; the remove button is hidden when this count is reached
3. `./maxOccur` - maximum number of row instances; the add button is hidden when this count is reached

## Client Libraries
The component provides a `core.forms.components.tablerow.v1.runtime` client library category that contains the JavaScript runtime for the component.
It should be added to a relevant site client library using the `embed` property.

## Repeatable Row Behaviour

At runtime, `TableRow` extends `FormView.FormPanel` and overrides two methods to integrate with the table's `<tbody>` structure:

- `getRepeatableDomWrapper()` — returns the `<tr>` element as the repeatable unit
- `getRepeatableInstancesContainerElement()` — returns the parent `<tbody>` as the insertion container

When a row is added or removed, the AF `InstanceManager` inserts/removes `<tr>` elements directly inside `<tbody>`, keeping the DOM structure valid. After a column sort, `TableView#syncInstanceManagerOrderAfterSort()` realigns `InstanceManager.children` to match the reordered DOM rows.

## BEM Description
```
BLOCK cmp-adaptiveform-tablerow
    MODIFIER cmp-adaptiveform-tablerow__root
    ELEMENT cmp-adaptiveform-tablecell
        MODIFIER cmp-adaptiveform-tablecell--with-row-controls
    ELEMENT cmp-adaptiveform-tablerow__runtime-controls
        ELEMENT cmp-adaptiveform-tablerow__add-button
        ELEMENT cmp-adaptiveform-tablerow__remove-button
```

## JavaScript Data Attribute Bindings

Apply a `data-cmp-is="adaptiveFormTableRow"` attribute to the `<tr>` element to enable initialization.

The following attributes are required for initialization:
1. `data-cmp-is="adaptiveFormTableRow"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

The following are optional attributes:
1. `data-cmp-visible` - boolean indicating whether the row is currently visible
2. `data-cmp-enabled` - boolean indicating whether the row is currently enabled
3. `data-cmp-readonly` - boolean indicating whether the row is currently read-only

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready
