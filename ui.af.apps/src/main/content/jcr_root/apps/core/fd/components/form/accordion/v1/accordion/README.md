<!--
Copyright 2022 Adobe

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
Adaptive Form Accordion (v1)
====
Adaptive Form Accordion component written in HTL.

## Features

* Allows addition of accordion items of varying resource type.
* Allowed components can be configured through policy configuration.
* Toggle accordion panels from accordion header controls.
* Ability to force a single panel to be displayed.
* First Item is expanded by default.
* Allows replacing this component with other component (as mentioned below).

### Use Object
The Accordion component uses the `com.adobe.cq.forms.core.components.models.form.Accordion` Sling model as its Use-object.

### Edit Dialog Properties

The following properties are written to JCR by the Edit Dialog and consumed by the Sling Model.

#### Inherited from all components (base)

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Panel name | `./name` | String | — | Submitted data key for panel data |
| Data reference | `./dataRef` | String | — | JSON-path for data binding |
| Visible | `./visible` | Boolean | *(runtime: true)* | Initial visibility |
| Enabled | `./enabled` | Boolean | *(runtime: true)* | Whether panel is interactive |
| Label | `./jcr:title` | String | — | Panel label text |
| Hide label | `./hideTitle` | Boolean | `false` | Hides label visually |
| Description | `./description` | String | — | Help text / long description |
| Tooltip | `./tooltip` | String | — | Popover tooltip text |
| Required | `./required` | Boolean | `false` | Whether panel requires user interaction |
| Repeatable | `./repeatable` | Boolean | `false` | Whether panel can be repeated |
| Min instances | `./minItems` | Integer | — | Minimum repeatable instances |
| Max instances | `./maxItems` | Integer | — | Maximum repeatable instances |
| Data type | `./type` | String | — | `object` or `array` |

#### Container properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Lazy load | `./lazy` | Boolean | `false` | Defers loading children until navigated to |
| Fragment path | `./fragmentPath` | String | — | Path to fragment definition (required when lazy=true) |

#### Accordion specific properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Read only | `./readOnly` | Boolean | — | When true the accordion and all children render as read-only |
| Wrap data | `./wrapData` | Boolean | — | Forces panel type to `object`; wraps child data under panel name key |
| DOR break before | `./breakBeforeText` | String | — | Document of Record page-break control (break before panel) |
| DOR break after | `./breakAfterText` | String | — | Document of Record page-break control (break after panel) |
| DOR overflow | `./overflowText` | String | — | Document of Record overflow handling text |

#### Child nodes

**`fd:rules`** and **`fd:events`** — JCR child nodes for rules and event handlers. See base schema documentation.

## Client Libraries
The component provides a `core.forms.components.accordion.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property. 

It also provides a `core.forms.components.accordian.v1.editor` editor client library category that includes JavaScript
handling for dialog interaction. It is already included by its edit and policy dialogs.

## BEM Description
```
BLOCK cmp-accordion
    ELEMENT cmp-accordion__item
    ELEMENT cmp-accordion__label
    ELEMENT cmp-accordion__label-container
    ELEMENT cmp-accordion__header
    ELEMENT cmp-accordion__button
        MOD cmp-accordion__button--expanded
    ELEMENT cmp-accordion__title
    ELEMENT cmp-accordion__icon
    ELEMENT cmp-accordion__panel
        MOD cmp-accordion__panel--expanded
        MOD cmp-accordion__panel--hidden
    ELEMENT cmp-accordion__questionmark
    ELEMENT cmp-accordion__shortdescription
    ELEMENT cmp-accordion__longdescription
```
### Note
By placing the class names `cmp-accordion__label` and `cmp-accordion__questionmark` within the `cmp-accordion__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## JavaScript Data Attribute Bindings
The following attributes must be added for the initialization of the accordion component in the form view:
1. `data-cmp-is="accordion"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

The following attributes can be added to the same element to provide options:

```
data-cmp-hook-accordion="item"
data-cmp-hook-accordion="button"
data-cmp-hook-accordion="panel"
```

### Enabling Accordion Editing Functionality
The following properties and child nodes are required in the proxy component to enable full editing functionality for the Accordion:

1. `./cq:isContainer` - set to `{Boolean}true`, marks the Accordion as a container component
2. `./cq:editConfig` - `afterchilddelete`, `afterchildinsert` and `afterchildmove` listeners should be provided via
the edit configuration of the proxy. `_cq_editConfig.xml` contains the recommended actions and can be copied to the proxy component.

## Replace feature:
We support replace feature that allows replacing accordion component to any of the below components:

* Horizontal tabs
* Panel
* Wizard Layout


## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready
