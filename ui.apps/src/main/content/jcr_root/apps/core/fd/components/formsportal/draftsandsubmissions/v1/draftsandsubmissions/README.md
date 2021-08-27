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
Drafts and Submissions Component  (v1)
====
AEM Forms Portal Drafts and Submissions component written in HTL.

## Features

### Use Object
The AEM Forms Portal Link component uses the `com.adobe.cq.forms.core.components.models.formsportal.DraftsandSubmissions` Sling model as its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for the AEM Forms Portal DraftsandSubmissions component and are expected to be available as `Resource` properties:
1. `./title` - specifies title of the component to be displayed.
2. `./type` - specifies forms portal records type - Drafts / Submissions.
3. `./layout` - specifies layout of the resultant forms portal records to be displayed.
4. `./limit` - specifies the number of resultant forms portal records to be displayed at a time.

## BEM Description
```
BLOCK cmp-link
```

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: AEM Forms as a cloud service
* **Status**: production-ready

_If you were involved in the authoring of this component and are not credited above, please reach out to us on [GitHub](https://github.com/adobe/aem-core-forms-components)._
