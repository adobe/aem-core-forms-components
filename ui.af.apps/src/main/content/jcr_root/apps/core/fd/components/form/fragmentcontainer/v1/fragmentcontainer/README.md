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
Adaptive Form Fragment Container (v2)
====
Adaptive Form Fragment container written in HTL.

## Features
* Ability to drop other adaptive form components

### Use Object
The Adaptive Form Fragment Container component uses the `com.adobe.cq.forms.core.components.models.form.FragmentContainer` Sling Model for its Use-object.

### Component Policy Configuration Properties
The following configuration properties are used:

1. `./components` - defines the allowed components that can be dropped onto a Form Container associated to this component policy
2. `./columns` - defines the number of columns for the container's grid for a Form Container associated to this component policy

### Edit Dialog Properties
The following properties are written to JCR for this Adaptive Form Container component and are expected to be available as `Resource` 
properties:

1. `./clientLibRef` - defines the client library category, which has the custom functions which can be consumed in visual rule editor.
2. `./schemaType` - defines the schema type of form
3. `./schemaRef` - defines the schema reference of form

## Client Libraries

The component provides a `core.forms.components.container.v2.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

The component provides a `core.forms.components.container.v2.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveformfragment-container
    ELEMENT cmp-adaptiveformfragment-container__wrapper
```

## JavaScript Data Attribute Bindings

Apply a `data-cmp-is="adaptiveformfragment"` attribute to the `cmp-adaptiveformfragment-container` block to enable initialization of the JavaScript component.
