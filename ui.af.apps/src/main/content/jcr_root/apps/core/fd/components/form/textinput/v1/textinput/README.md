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
Adaptive Form Text Input (v1)
====
Adaptive Form Text input field component written in HTL.

## Features

* Provides the following type of input:
  * text
  * textarea
* Custom constraint messages for the above types
* Styles
* Allows replacing this component with other component (as mentioned below).

### Use Object
The Form Text component uses the `com.adobe.cq.forms.core.components.models.form.TextInput` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Text component and are expected to be available as `Resource` properties:

1.  `./jcr:title` - defines the label to use for this field
2.  `./hideTitle` - if set to `true`, the label of this field will be hidden
3.  `./name` - defines the name of the field, which will be submitted with the form data
4.  `./default` - defines the default value of the field
5.  `./description` - defines a help message that can be rendered in the field as a hint for the user
6.  `./required` - if set to `true`, this field will be marked as required, not allowing the form to be submitted until the field has a value
7.  `./requiredMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
8.  `./readOnly` - if set to `true`, the filed will be read only
9.  `./maxLength` - defines the maximum length of input allowed for the field.
10. `./minLength` - defines the minimum length of input allowed for the field.
11. `./maxLengthMessage` - defines the maximum length error message for the field.
12. `./minLengthMessage` - defines the minimum length error message for the field.


### Behavior of `maxLength` and `maxLengthMessage`

The `maxLength` property in HTML5 compliant fields, such as those used in the Adaptive Form Text Input component, restricts users from typing more characters than specified. This restriction aligns with HTML5 standards to ensure the input length does not exceed the defined maximum. However, there are scenarios, particularly in custom widgets or headless implementations, where it might be necessary to allow input beyond the `maxLength`.

To accommodate such use-cases, while still adhering to HTML5 compliance within the core component, the `maxLengthMessage` property is provided. This property allows developers to define a custom error message that is displayed when the input exceeds the `maxLength`, offering a way to guide users even when custom logic permits them to enter more characters than the standard limit.


## Client Libraries
The component provides a `core.forms.components.textinput.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.textinput.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-textinput
    ELEMENT cmp-adaptiveform-textinput__label
    ELEMENT cmp-adaptiveform-textinput__label-container
    ELEMENT cmp-adaptiveform-textinput__widget
    ELEMENT cmp-adaptiveform-textinput__questionmark
    ELEMENT cmp-adaptiveform-textinput__shortdescription
    ELEMENT cmp-adaptiveform-textinput__longdescription
    ELEMENT cmp-adaptiveform-textinput__errormessage
```

### Note
By placing the class names `cmp-adaptiveform-textinput__label` and `cmp-adaptiveform-textinput__questionmark` within the `cmp-adaptiveform-textinput__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## Replace feature:
We support replace feature that allows replacing Reset Button component to any of the below components:

* Button
* Date Picker
* Email Input
* Number Input
* Reset Button
* Submit Button
* Telephone Input
* Text Box

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the text-input component in the form view:  
 1. `data-cmp-is="adaptiveFormTextInput"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`


The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not 
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not