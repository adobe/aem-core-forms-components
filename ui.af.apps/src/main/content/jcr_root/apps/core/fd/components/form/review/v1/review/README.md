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
Adaptive Form Review (v1)
====
Adaptive Form Review field component written in HTL.

## Features

* Provides the review all Components/Panel:
* Styles

### Use Object
The Form Review component uses the `com.adobe.cq.forms.core.components.models.form.Review` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Review component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
3. `./linkedPanels` - defines linked panels for reviewing the panel. If no panel is linked, the component will review the entire form.
3. `./editAction` - defines the edit action for editing the fields, panels, field & panel, or none
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
    ELEMENT cmp-adaptiveform-review__field
    ELEMENT cmp-adaptiveform-review__label
    ELEMENT cmp-adaptiveform-review__value
    ELEMENT cmp-adaptiveform-review__edit-button
```