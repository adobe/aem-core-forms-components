<!--
Copyright 2023 Adobe

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
Adaptive Form Fragment (v1)
====
Adaptive Form Fragment component written in HTL.

## Features
Allow referencing a fragment resource.

### Use Object
The Fragment component uses the `com.adobe.cq.forms.core.components.models.form.Fragment` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Fragment component and are expected to be available as `Resource` properties.

See [`docs/authoring-schema/components/fragment.authoring.schema.yaml`](../../../../../../../../../../docs/authoring-schema/components/fragment.authoring.schema.yaml) for the full machine-readable schema.

#### Base properties (inherited)

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Field label | `./jcr:title` | String | — | Visible label rendered next to the panel |
| Hide label | `./hideTitle` | Boolean | `false` | When true the label is hidden but available to screen readers |
| Panel name | `./name` | String | — | Data key submitted with form data |
| Data binding | `./dataRef` | String | — | JSON-path binding; set to `null` to opt out |
| Visible | `./visible` | Boolean | — | Whether the fragment panel is visible on initial render |
| Enabled | `./enabled` | Boolean | — | Whether the fragment panel is enabled |
| Description | `./description` | String | — | Help text rendered as short/long description |
| Tooltip | `./tooltip` | String | — | Shown in a popover on the question-mark icon |
| Assistive priority | `./assistPriority` | String | — | Screen-reader announcement priority (`description`, `title`, `name`, `custom`) |
| Custom assistive text | `./custom` | String | — | Used when assistPriority is set to `custom` |

#### Container properties (inherited)

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Fragment path | `./fragmentPath` | String | — | Path to the referenced fragment resource. FragmentImpl resolves child components from this path via `ReservedProperties.PN_FRAGMENT_PATH` |
| Lazy load | `./lazy` | Boolean | `false` | When true the fragment's children are not loaded until the user navigates to this panel |

#### Child nodes

| Node | Description |
|------|-------------|
| `fd:rules` | Rule expressions and visual rule editor AST blobs |
| `fd:events` | Event handler expressions (click, change, initialize, etc.) |

## Client Libraries
The component provides a `core.forms.components.fragment.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.fragment.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-fragment
    ELEMENT cmp-adaptiveform-fragment__label
    ELEMENT cmp-adaptiveform-fragment__label-container
    ELEMENT cmp-adaptiveform-fragment__widget
    ELEMENT cmp-adaptiveform-fragment__questionmark
    ELEMENT cmp-adaptiveform-fragment__shortdescription
    ELEMENT cmp-adaptiveform-fragment__longdescription
    ELEMENT cmp-adaptiveform-fragment__errormessage
```

### Note
By placing the class names `cmp-adaptiveform-fragment__label` and `cmp-adaptiveform-fragment__questionmark` within the `cmp-adaptiveform-fragment__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the fragment component in the form view:  
 1. `data-cmp-is="adaptiveFormFragment"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`
