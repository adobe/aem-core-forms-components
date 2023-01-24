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
Adaptive Form Container (v1)
====
Adaptive Form container written in HTL.

## Features
* Form submit actions like sending emails, submit to rest end point
* Thank you page
* Thank you message
* Ability to select form model definition as a dam asset

### Use Object
The Adaptive Form Container component uses the `com.adobe.cq.forms.core.components.models.form.FormContainer` Sling Model for its Use-object.

### Component Policy Configuration Properties
The following configuration properties are used:

1. `./components` - defines the allowed components that can be dropped onto a Form Container associated to this component policy

### Edit Dialog Properties
The following properties are written to JCR for this Adaptive Form Container component and are expected to be available as `Resource` 
properties:

1. `./action` - defines the action that will be performed by the form
2. `./thankyouMessage` - defines the thank you message to shown after submission
3. `./formModelDocumentPath` - json document defining the form model

## Client Libraries

The component provides a `core.forms.components.container.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-formcontainer
    ELEMENT cmp-formcontainer__content
```

## JavaScript Data Attribute Bindings

Apply a `data-cmp-is="formcontainer"` attribute to the `cmp-formcontainer` block to enable initialization of the JavaScript component.