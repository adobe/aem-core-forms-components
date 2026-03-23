<!--
Copyright 2024 Adobe

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
Adaptive Form Review (v1)
====
Adaptive Form Review field component written in HTL.

## Features

* Provides the review all Components/Panel:
* Styles

### Use Object
The Form Review component uses the `com.adobe.cq.forms.core.components.models.form.Review` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Review component and are expected to be available as `Resource` properties.

See [`docs/authoring-schema/components/review.authoring.schema.yaml`](../../../../../../../../../../docs/authoring-schema/components/review.authoring.schema.yaml) for the full machine-readable schema.

#### Base properties (inherited)

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Field label | `./jcr:title` | String | — | Visible label rendered next to the review component |
| Hide label | `./hideTitle` | Boolean | `false` | When true the label is hidden but available to screen readers |
| Field name | `./name` | String | — | Data key submitted with form data |
| Visible | `./visible` | Boolean | — | Whether the review component is visible on initial render |
| Enabled | `./enabled` | Boolean | — | Whether the review component is enabled |
| Description | `./description` | String | — | Help text rendered as short/long description |

#### Review-specific properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Linked panels | `./fd:linkedPanels` | String[] | — | Array of panel paths or names to display in the review. When absent or empty the component reviews the entire form. Injected by ReviewImpl via `@ValueMapValue` with name `"fd:linkedPanels"`. Written to the JSON model properties map by `getProperties()`. |
| Edit mode action | `./fd:editModeAction` | String | — | Specifies what can be edited in review mode: fields, panels, both, or none. Injected by ReviewImpl via `@ValueMapValue` with name `"fd:editModeAction"`. Written to the JSON model properties map by `getProperties()`. |

#### Child nodes

| Node | Description |
|------|-------------|
| `fd:rules` | Rule expressions and visual rule editor AST blobs |
| `fd:events` | Event handler expressions (click, change, initialize, etc.) |
## Client Libraries
The component provides a `core.forms.components.review.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.review.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-review
    ELEMENT cmp-adaptiveform-review__container
        ELEMENT cmp-adaptiveform-review__panel
            MODIFIER cmp-adaptiveform-review__panel--repeatable
                ELEMENT cmp-adaptiveform-review__label-container
                    ELEMENT cmp-adaptiveform-review__label
                    ELEMENT cmp-adaptiveform-review__edit-button
                ELEMENT cmp-adaptiveform-review__value
        ELEMENT cmp-adaptiveform-review__field
            ELEMENT cmp-adaptiveform-review__label
            ELEMENT cmp-adaptiveform-review__value
            ELEMENT cmp-adaptiveform-review__edit-button
        ELEMENT cmp-adaptiveform-review__text
            ELEMENT cmp-adaptiveform-review__label
```