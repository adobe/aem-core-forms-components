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
Adaptive Form Table (v1)
====
Adaptive Form Table component written in HTL that allows authors to capture data in a tabular format with rows and columns.

## Features

* Ability to contain `tableheader` and `tablerow` child components
* Configurable column widths via comma-separated proportions
* Optional column sorting
* Short description / long description / question mark help pattern
* Visible and enabled state binding for rules engine

### Use Object
The Adaptive Form Table component uses the `com.adobe.cq.forms.core.components.models.form.Panel` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this component
2. `./hideTitle` - if set to `true`, the label of this component will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./description` - defines a help message rendered below the table title

<!-- upcoming features  -->
<!-- 5. `./columnWidth` - defines proportional column widths as comma-separated values (e.g., `1,2,1`)
6. `./enableSorting` - if set to `true`, enables column sorting on the rendered table -->

## Client Libraries
The component provides a `core.forms.components.table.v1.runtime` client library category that contains the JavaScript runtime for the component.
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.table.v1.editor` editor client library category that includes
JavaScript handling for authoring interactions. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-table
    ELEMENT cmp-adaptiveform-table__title
    ELEMENT cmp-adaptiveform-table__help-container
    ELEMENT cmp-adaptiveform-table__shortdescription
    ELEMENT cmp-adaptiveform-table__longdescription
    ELEMENT cmp-adaptiveform-table__questionmark
    ELEMENT cmp-adaptiveform-table__widget
    ELEMENT cmp-adaptiveform-table__head
    ELEMENT cmp-adaptiveform-table__body
```

## JavaScript Data Attribute Bindings

Apply a `data-cmp-is="adaptiveFormTable"` attribute to the `cmp-adaptiveform-table` block to enable initialization of the JavaScript component.

The following attributes are required for initialization:
1. `data-cmp-is="adaptiveFormTable"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

The following are optional attributes that can be added to the component:
1. `data-cmp-visible` having a boolean value to indicate whether the component is currently visible or not
2. `data-cmp-enabled` having a boolean value to indicate whether the component is currently enabled or not

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready
