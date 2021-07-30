<!--
Copyright 2021 Adobe

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
Form Container (v1)
====
Form Container component written in HTL.

## Features

* Allows embedding form runtime document
* Configurable features for controlling appearance and functionality. 

### Use Object
The Form Container component uses the `com.adobe.cq.forms.core.components.models.FormContainer` Sling model as its Use-object.


### Edit Dialog Properties
The following properties are written to JCR for this Form Container component and are expected to be available as `Resource` properties:

1. `./documentPath` - defines the path of the form runtime document to display

## Client Libraries
The component provides a `core.forms.components.formcontainer.v1` client library category that contains base
CSS styling and JavaScript component. It should be added to a relevant site client library using the `embed` property.

## BEM Description
```
BLOCK cmp-formcontainer
    ELEMENT cmp-formcontainer__content
```

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: AEM 6.4
* **Status**: production-ready

_If you were involved in the authoring of this component and are not credited above, please reach out to us on [GitHub](https://github.com/adobe/aem-core-forms-components)._
