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
Adaptive Form Panel Container (v1)
====
Adaptive Form Panel Container component written in HTL.

## Features

* Configurable layout type.
* Configurable background image and background color:
    * Background images and colors can be enabled through policy configuration.
    * Color swatches for background color can be defined through policy configuration.
    * Background color can be restricted to only allow swatches through policy configuration.
* Allowed components can be configured through policy configuration.
* Style System support.
* Allows replacing this component with other component (as mentioned below).

### Use Object
The Panel Container component uses the `com.adobe.cq.wcm.core.components.models.LayoutContainer` Sling model as its Use-object.

### Component Policy Configuration Properties
The following configuration properties are used:

1. `./layout` - defines the layout type, either `simple` (default) or `responsiveGrid`
2. `./layoutDisabled` - if set to true, it is not allowed to change the layout in the edit dialog
3. `./backgroundImageEnabled` - defines whether to display a background image option.
4. `./backgroundColorEnabled` - defines whether to display a background color option.
5. `./backgroundColorSwatchesOnly` -  defines whether or not to display swatches in the background color picker.
6. `./allowedColorSwatches` - defines a list of background color swatches that are allowed to be selected by an author.

It is also possible to define the allowed components for the Panel Container.

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

#### Panel Container specific properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Read only | `./readOnly` | Boolean | — | When true the panel and all children render as read-only |
| Wrap data | `./wrapData` | Boolean | — | Forces panel type to `object`; wraps child data under panel name key |
| DOR break before | `./breakBeforeText` | String | — | Document of Record page-break control (break before panel) |
| DOR break after | `./breakAfterText` | String | — | Document of Record page-break control (break after panel) |
| DOR overflow | `./overflowText` | String | — | Document of Record overflow handling text |

#### Style Properties
1. `./backgroundImageReference` - defines the Panel Container background image.
2. `./backgroundColor` - defines the Panel Container background color.
3. `./cq:styleIds` - defines the selector (as provided in design dialog)

#### Accessibility
1. `./assistPriority` - defines where to pick accessibility information for the Panel Container. This can be one of 'Description', 'Title', 'Name', 'Custom' or 'None'
2. `./custom` - defines custom accessibility information for the Panel Container, if assistPriority is custom.
3. `./roleAttribute` - defines a role attribute for the Panel Container.

#### Child nodes

**`fd:rules`** and **`fd:events`** — JCR child nodes for rules and event handlers. See base schema documentation.

## Client Libraries
The component provides a `core.forms.components.panelcontainer.v1.runtime` client library category that contains a JavaScript
component. It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.panelcontainer.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-container
  ELEMENT cmp-container__label
  ELEMENT cmp-container__label-container
  ELEMENT cmp-container__questionmark
  ELEMENT cmp-container__shortdescription
  ELEMENT cmp-container__longdescription
```

### Note
By placing the class names `cmp-container__label` and `cmp-container__questionmark` within the `cmp-container__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## JavaScript Data Attribute Bindings
The following attributes must be added for the initialization of the panel-container component in the form view:  
 1. `data-cmp-is="adaptiveFormPanel"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

### Enabling Panel Container Editing Functionality
The following property is required in the proxy component to enable full editing functionality for the Panel Container:

1. `./cq:isContainer` - set to `{Boolean}true`, marks the Panel Container as a container component

## Replace feature:
We support replace feature that allows replacing accordion component to any of the below components:

* Accordion
* Horizontal tabs
* Wizard Layout

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready

