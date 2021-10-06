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
AEM Forms Portal Drafts and Submissions component written in HTL. Allows listing of Drafts and Submitted forms of a logged in user.

## Features

### Use Object
The AEM Forms Portal Drafts and Submissions component uses the `com.adobe.cq.forms.core.components.models.formsportal.DraftsandSubmissions` Sling model as its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for the AEM Forms Portal DraftsandSubmissions component and are expected to be available as `Resource` properties:
1. `./title` - specifies title of the component to be displayed.
2. `./type` - specifies forms portal records type - Drafts / Submissions.
3. `./layout` - specifies layout of the resultant forms portal records to be displayed.
4. `./limit` - specifies the number of resultant forms portal records to be displayed at a time.

## BEM Description
```
BLOCK cmp-drafts-and-submissions
    ELEMENT cmp-drafts-and-submissions__heading
    ELEMENT cmp-drafts-and-submissions__results
    ELEMENT cmp-drafts-and-submissions__more
        MOD cmp-drafts-and-submissions__more--wrapper
```

## JavaScript Data Attribute Bindings
There can be multiple drafts and submissions instances in a page. It is initialized by the clientlib on window state as ready (i.e all dom instances loaded).

A hook attribute from the following should be added to the corresponding element/template so that the JavaScript is able to target it:

```
data-cmp-hook-draftsandsubmissions="results"
data-cmp-hook-draftsandsubmissions="itemTemplate"
data-cmp-hook-draftsandsubmissions="menuTemplate"
data-cmp-hook-draftsandsubmissions="more"
```

Following Hooks should be provided by the layout template:
```
data-cmp-hook-item-template="item"
data-cmp-hook-item-template="thumbnail"
data-cmp-hook-item-template="itemTitle"
data-cmp-hook-item-template="description"
data-cmp-hook-item-template="formLink"
data-cmp-hook-item-template="timeinfo"
data-cmp-hook-item-template="operations"
```

The jQuery event `core-forms-itemapi-onload` is used to register the component instance with item injector.  

The jQuery event `core-forms-register-operation` is used to register available operation handlers with item injector.

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: AEM Forms as a cloud service
* **Status**: production-ready

_If you were involved in the authoring of this component and are not credited above, please reach out to us on [GitHub](https://github.com/adobe/aem-core-forms-components)._
