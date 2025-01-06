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
Adaptive Form Turnstile (v1)
====
Adaptive Form Cloudflare Turnstile field component written in HTL.

## Features

* Provides the following type of input:
  * Turnstile
* The following widgets are supported for Turnstile: 
  * Managed
  * Non-Interactive
  * Invisible
* Styles
* Custom constraint messages for the above types

### Use Object
The Form Text component uses the `com.adobe.cq.forms.core.components.models.form.Turnstile` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Recaptcha component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./mandatoryMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
5. `./cloudServicePath` - defines the path of cloud configuration resource for Turnstile
6. `./size` - defines the size attribute of Turnstile

## Client Libraries
The component provides a `core.forms.components.turnstile.v1.runtime` client library category that contains the Javascript runtime for the component.
It should be added to a relevant site client library using the `embed` property.


## BEM Description
```
BLOCK cmp-adaptiveform-turnstile
    ELEMENT cmp-adaptiveform-turnstile__label
    ELEMENT cmp-adaptiveform-turnstile__widget
    ELEMENT cmp-adaptiveform-turnstile__errormessage
```

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the hCaptcha component in the form view:
1. `data-cmp-is="adaptiveFormTurnstile"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`



The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not 
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not
