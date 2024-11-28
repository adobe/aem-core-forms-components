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
Adaptive Form Password (v1)
====
Adaptive Form Password field component written in HTL.

## Features

* Provides the following type of input:
  * password

* Custom constraint messages for the above types
* Styles
* Allows replacing this component with other component (as mentioned below).

### Use Object
The Form Password component uses the `com.adobe.cq.forms.core.components.models.form.Password` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Password component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./description` - defines a help message that can be rendered in the field as a hint for the user
5. `./dataRef` - defines bind reference with model
6. `./placeholder` - defines place holder for the field
7. `./unboundFormElement` - defines if the field is unbound
8. `./required` - if set to `true`, this field will be marked as required, not allowing the form to be submitted until the field has a value
9. `./requiredMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
10. `./readOnly` - if set to `true`, the filed will be read only
11. `./maxLength` - define maximum characters permitted
12. `./minLength` - define minimum characters permitted
13. `./maxLengthMessage` - define maximum characters of error message permitted
14. `./pattern` - define regular expression permitted
15. `./minLengthMessage` - define minimum characters of error message permitted
16. `./validatePictureClauseMessage` - define error message if wrong pattern is entered.

## Client Libraries
The component provides a `core.forms.components.password.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.password.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-password
    ELEMENT cmp-adaptiveform-password__label
    ELEMENT cmp-adaptiveform-password__label-container
    ELEMENT cmp-adaptiveform-password__widget
    ELEMENT cmp-adaptiveform-password__questionmark
    ELEMENT cmp-adaptiveform-password__shortdescription
    ELEMENT cmp-adaptiveform-password__longdescription
    ELEMENT cmp-adaptiveform-password__errormessage
    ELEMENT cmp-adaptiveform-password__eyeicon
    ELEMENT cmp-adaptiveform-password__input-wrapper
```

### Note
By placing the class names `cmp-adaptiveform-password__label` and `cmp-adaptiveform-password__questionmark` within the `cmp-adaptiveform-password__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## Replace feature:
We support replace feature that allows replacing Password component to any of the below components:

* Email Input
* Number Input
* Telephone Input
* Text Box
* Email Input

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the password component in the form view:  
 1. `data-cmp-is="adaptiveFormPassword"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`


The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not 
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not