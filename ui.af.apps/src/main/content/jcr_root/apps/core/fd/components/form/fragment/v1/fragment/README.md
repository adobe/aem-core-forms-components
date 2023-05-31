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
Adaptive Form Fragment (v1)
====
Adaptive Form Fragment component written in HTL.

## Features


### Use Object
The Form Text component uses the `com.adobe.cq.forms.core.components.models.form.Fragment` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Text component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./default` - defines the default value of the field
5. `./description` - defines a help message that can be rendered in the field as a hint for the user
6. `./required` - if set to `true`, this field will be marked as required, not allowing the form to be submitted until the field has a value
7. `./requiredMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
8. `./readOnly` - if set to `true`, the filed will be read only

## Client Libraries
The component provides a `core.forms.components.fragment.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.fragment.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-fragment
    ELEMENT cmp-adaptiveform-fragment__label
    ELEMENT cmp-adaptiveform-fragment__widget
    ELEMENT cmp-adaptiveform-fragment__questionmark
    ELEMENT cmp-adaptiveform-fragment__shortdescription
    ELEMENT cmp-adaptiveform-fragment__longdescription
    ELEMENT cmp-adaptiveform-fragment__errormessage
```

## Replace feature:


## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the fragment component in the form view:  
 1. `data-cmp-is="adaptiveFormFragment"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`
 3. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
 4. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not