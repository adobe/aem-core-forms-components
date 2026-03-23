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
Vertical Tabs (v1)
====
Adaptive Form Tabs component written in HTL.

## Features

* Allows addition of tab items of varying resource type.
* Allowed components can be configured through policy configuration.
* Ability to force a single panel to be displayed.
* First tab is selected by default.
* Allows replacing this component with other component (as mentioned below).

### Use Object
The Vertical Tabs component uses the `com.adobe.cq.forms.core.components.models.form.Panel` Sling model as its Use-object.

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

#### Vertical Tabs specific properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Read only | `./readOnly` | Boolean | — | When true the vertical tabs container and all children render as read-only |
| Wrap data | `./wrapData` | Boolean | — | Forces panel type to `object`; wraps child data under panel name key |
| DOR break before | `./breakBeforeText` | String | — | Document of Record page-break control (break before panel) |
| DOR break after | `./breakAfterText` | String | — | Document of Record page-break control (break after panel) |
| DOR overflow | `./overflowText` | String | — | Document of Record overflow handling text |

#### Child nodes

**`fd:rules`** and **`fd:events`** — JCR child nodes for rules and event handlers. See base schema documentation.

## BEM Description
```
BLOCK cmp-verticaltabs
    ELEMENT cmp-verticaltabs__tablist
    ELEMENT cmp-verticaltabs__label
    ELEMENT cmp-verticaltabs__label-container
    ELEMENT cmp-verticaltabs__tabs-container
    ELEMENT cmp-verticaltabs__tab
        MOD cmp-verticaltabs__tab--active
        MOD cmp-verticaltabs__tab--stepped
    ELEMENT cmp-verticaltabs__title
    ELEMENT cmp-verticaltabs__icon
    ELEMENT cmp-verticaltabs__label
    ELEMENT cmp-verticaltabs__shortdescription
    ELEMENT cmp-verticaltabs__longdescription
    ELEMENT cmp-verticaltabs__questionmark
```

### Note
By placing the class names `cmp-verticaltabs__label` and `cmp-verticaltabs__questionmark` within the `cmp-verticaltabs__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## Client Libraries
The component provides a `core.forms.components.verticaltabs.v1.runtime` client library category that contains a JavaScript
component. It should be added to a relevant site client library using the `embed` property.

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the horizontal-tabs component in the form view:
1. `data-cmp-is="adaptiveFormVerticalTabs"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

### Enabling Editing Functionality
The following property is required in the proxy component to enable full editing functionality for the Panel Container:

1. `./cq:isContainer` - set to `{Boolean}true`, marks the Panel Container as a container component

## Replace feature:
We support replace feature that allows replacing accordion component to any of the below components:

* Accordion
* Panel
* Wizard Layout
* Tabs on top

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready

