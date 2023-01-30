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
Adaptive Form Container (v2)
====
Adaptive Form container written in HTL.

## Features
* Form submit actions like sending emails, submit to rest end point
* Configurable list of allowed components
* Thank you page
* Thank you message
* Ability to drop other adaptive form components

### Use Object
The Adaptive Form Container component uses the `com.adobe.cq.forms.core.components.models.form.FormContainer` Sling Model for its Use-object.

### Component Policy Configuration Properties
The following configuration properties are used:

1. `./components` - defines the allowed components that can be dropped onto a Form Container associated to this component policy
2. `./columns` - defines the number of columns for the container's grid for a Form Container associated to this component policy

### Edit Dialog Properties
The following properties are written to JCR for this Adaptive Form Container component and are expected to be available as `Resource` 
properties:

1. `./action` - defines the action that will be performed by the form
2. `./thankyouMessage` - defines the thank you message to shown after submission
3. `./redirect` - if left empty the form will be rendered after submission, otherwise the user will be redirected to the page stored by this
property

## Client Libraries

The component provides a `core.forms.components.container.v2.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

The component provides a `core.forms.components.container.v2.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-container
    ELEMENT cmp-adaptiveform-container__wrapper
```

## JavaScript Data Attribute Bindings

Apply a `data-cmp-is="adaptiveFormContainer"` attribute to the `cmp-adaptiveform-container` block to enable initialization of the JavaScript component.
