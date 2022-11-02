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
Adaptive Form File Input (v1)
====
Adaptive Form File input field component written in HTL.

## Features

* Provides the following type of input:
  * file
* Custom constraint messages for the above types
* Styles

### Use Object
The Form File component uses the `com.adobe.cq.forms.core.components.models.form.FileInput` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form File component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./default` - defines the default value of the field
5. `./description` - defines a help message that can be rendered in the field as a hint for the user
6. `./required` - if set to `true`, this field will be marked as required, not allowing the form to be submitted until the field has a value
7. `./requiredMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
8. `./readOnly` - if set to `true`, the filed will be read only
9. `./multiSelection` - if set to `true`, the filed will allow to add multiple files in single selection or multiple selections
10. `./minItems` - if value is selected/provided this will check for minimum number of files that can be attached
11. `./maxItems` - if value is selected/provided this will check for maximum number of files that can be attached
12. `./maxFileSize` - if value is selected/provided this will check for maximum file size allowed
13. `./accept` - defines the type of files accepted to upload
14. `./showComment` - if set to `true`, comments can be added to attachment
15. `./minItemsMessage` - defines the message displayed as tooltip when submitting the form if less than allowed minimum files uploaded
16. `./maxItemsMessage` - defines the message displayed as tooltip when submitting the form if more than allowed maximum files uploaded
17. `./maxFileSizeMessage` - defines the message displayed as tooltip when submitting the form if the uploaded file size is greater than allowed
18. `./acceptMessage` - defines the message displayed as tooltip when submitting the form if the uploaded file type is not allowed

## Client Libraries
The component provides a `core.forms.components.fileinput.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.fileinput.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-fileinput
    ELEMENT cmp-adaptiveform-fileinput__label
    ELEMENT cmp-adaptiveform-fileinput__widget
    ELEMENT cmp-adaptiveform-fileinput__questionmark
    ELEMENT cmp-adaptiveform-fileinput__shortdescription
    ELEMENT cmp-adaptiveform-fileinput__longdescription
    ELEMENT cmp-adaptiveform-fileinput__filelist
    ELEMENT cmp-adaptiveform-fileinput__fileitem
    ELEMENT cmp-adaptiveform-fileinput__filename
    ELEMENT cmp-adaptiveform-fileinput__filedelete
    ELEMENT cmp-adaptiveform-fileinput__widgetlabel
```

## JavaScript Data Attribute Bindings


The following attributes must be added for the initialization of the file-input component in the form view:  
 1. `data-cmp-is="adaptiveFormFileInput"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`
 
 
## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready

