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
Portal Lister Component  (v1)
====
AEM Forms Portal Lister component written in HTL.

## Features

### Use Object
The AEM Forms Portal Lister component uses the `com.adobe.cq.forms.core.components.models.formsportal.PortalLister` Sling model as its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for the AEM Forms Portal Lister component and are expected to be available as `Resource` properties:
1. `./title` - specifies title of the component to be displayed.
2. `./layout` - specifies layout of the resultant forms portal records to be displayed.
3. `./limit` - specifies the number of resultant forms portal records to be displayed at a time.

The PortalLister Component is not intended to be used directly. It provides basic authoring and pagination and layouting model for other listing elements.
Consider using Search and Lister or Drafts and Submissions component.

## BEM Description
```
BLOCK cmp-portallister
    ELEMENT cmp-portallister__results
    ELEMENT cmp-portallister__item
    ELEMENT cmp-portallister__menu
    ELEMENT cmp-portallister__menu-item
    ELEMENT cmp-portallister__menu-item-label
    ELEMENT cmp-portallister__menu-list
```

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: AEM Forms as a cloud service
* **Status**: production-ready

_If you were involved in the authoring of this component and are not credited above, please reach out to us on [GitHub](https://github.com/adobe/aem-core-forms-components)._
