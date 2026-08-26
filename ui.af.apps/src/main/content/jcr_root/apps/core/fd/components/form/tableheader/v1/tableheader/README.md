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
Adaptive Form Table Header (v1)
====
Adaptive Form Table Header component written in HTL. Renders the `<thead><tr>` row of the table with one `<th>` per child cell component.

## Features

* Renders column header cells as semantic `<th>` elements with `scope="col"`
* Per-column sort button — shown or hidden based on parent table's `enableSorting` and per-cell `disableSorting`
* Header cell merge (colspan) — individual cells can span multiple columns via `./colspan`
* Visible and enabled state binding for rules engine

### Use Object
The Adaptive Form Table Header component uses the `com.adobe.cq.forms.core.components.models.form.Panel` Sling Model for its Use-object (`TableHeaderImpl`), which exports `fd:viewType = "table-header"` for Document of Record rendering.

### Edit Dialog Properties
The following properties are written to JCR for each child cell of the table header and are expected to be available as `Resource` properties:

1. `./name` - defines the name of the header cell, used as the field name in the form model
2. `./jcr:title` - defines the display label for the column header
3. `./disableSorting` - if set to `true`, hides the sort button for this column even when the parent table has `./enableSorting` enabled
4. `./colspan` - number of columns this header cell spans; rendered as HTML `colspan` attribute and tracked as `data-colspan` for authoring toolbar calculations

## Client Libraries
The component provides a `core.forms.components.tableheader.v1.runtime` client library category that contains the JavaScript runtime for the component.
It should be added to a relevant site client library using the `embed` property.

## BEM Description
```
BLOCK cmp-adaptiveform-tableheader
    ELEMENT cmp-adaptiveform-tablehead
        ELEMENT cmp-adaptiveform-table__sort-header-inner
            ELEMENT cmp-adaptiveform-table__sort-button
                MODIFIER cmp-adaptiveform-table__sort-button--asc
                MODIFIER cmp-adaptiveform-table__sort-button--desc
```

## JavaScript Data Attribute Bindings

Apply a `data-cmp-is="adaptiveFormTableHeader"` attribute to the `<tr>` element to enable initialization.

The following attributes are required for initialization:
1. `data-cmp-is="adaptiveFormTableHeader"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

The following are optional attributes:
1. `data-cmp-visible` - boolean indicating whether the header row is currently visible
2. `data-cmp-enabled` - boolean indicating whether the header row is currently enabled

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready
