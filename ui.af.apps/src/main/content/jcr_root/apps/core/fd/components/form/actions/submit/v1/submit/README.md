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
Adaptive Form Submit Button (v1)
====
Adaptive Form Submit Button component written in HTL.

## Features

* Accessibility friendly 
* Custom description/tooltip for help
* Out of the box Submit rule in the button to submit the form
* Allows replacing this component with other component (as mentioned below).
* Shows a loader on the form container during submission

### Use Object
The submit button component uses the `com.adobe.cq.forms.core.components.models.form.Button` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this submit button component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./name` - defines the name of the field, which will be submitted with the form data
3. `./description` - defines a help message that can be rendered in the field as a hint for the user

### Sling Property
The button has a default property of `buttonType` set to `submit` which is used to describe the type of the button.

## Client Libraries
The component provides a `core.forms.components.button.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

### Loader behavior on submit

When the Submit button is activated and the form begins submission, the form container gets a loading state so users receive visual feedback:

- The form element `form.cmp-adaptiveform-container` toggles the CSS class `cmp-adaptiveform-container--submitting` for the duration of the network request.
- The loading class is removed and the loader hides when validation fails, the submission succeeds, or an error occurs.


## BEM Description
```
BLOCK cmp-adaptiveform-button
    ELEMENT cmp-adaptiveform-button__widget
    ELEMENT cmp-adaptiveform-button__text
    ELEMENT cmp-adaptiveform-button__icon
    ELEMENT cmp-adaptiveform-button__questionmark
    ELEMENT cmp-adaptiveform-button__shortdescription
    ELEMENT cmp-adaptiveform-button__longdescription
```

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the button component in the form view:  
 1. `data-cmp-is="adaptiveFormButton"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`


The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not 
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not

## Replace feature:
We support replace feature that allows replacing Reset Button component to any of the below components:

* Button
* Date Picker
* Email Input
* Number Input
* Reset Button
* Telephone Input
* Text Box
* Text Input
 
## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready