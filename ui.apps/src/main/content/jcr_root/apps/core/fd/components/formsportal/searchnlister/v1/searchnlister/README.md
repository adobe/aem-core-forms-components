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

<!-- ToDo: Add edit dialog properties -->

Search And Lister Component  (v1)
====
AEM Forms Portal Search and Lister component written in HTL.

## Features

### Use Object
The AEM Forms Portal Search and Lister component uses the `com.adobe.cq.forms.core.components.models.formsportal.SearchAndLister` Sling model as its Use-object.

### Behavior
Pagination is implemented via Load More button, which loads more results lazily.

### Edit Dialog Properties
The following properties are written to JCR for the AEM Forms Portal Link component and are expected to be available as `Resource` properties:

## BEM Description
```
BLOCK cmp-searchnlister
    ELEMENT cmp-searchnlister__heading
    ELEMENT cmp-searchnlister__seperator
    BLOCK cmp-searchnlister-search
        ELEMENT cmp-searchnlister-search__box
            MOD cmp-searchnlister-search__box--text
        ELEMENT cmp-searchnlister-search__sortbutton
            MOD cmp-searchnlister-search__sortbutton--wrapper
            MOD cmp-searchnlister-search__sortbutton--right
    BLOCK cmp-searchnlister__results
        ELEMENT cmp-searchnlister__item
            MOD cmp-searchnlister__item--title
    ELEMENT cmp-searchnlister__more
```
## JavaScript Data Attribute Bindings
There can be only one search and lister component in a page currently. It initializes itself with the `searchnlister-onload` event.

A hook attribute from the following should be added to the corresponding element so that the JavaScript is able to target it:

```
data-cmp-hook-formssearch="input"
data-cmp-hook-formssearch="sort"
data-cmp-hook-formssearch="results"
data-cmp-hook-formssearch="itemTemplate"
data-cmp-hook-formssearch="item"
data-cmp-hook-formssearch="itemTitle"
data-cmp-hook-formssearch="description"
data-cmp-hook-formssearch="formLink"
data-cmp-hook-formssearch="more"
```


## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: AEM Forms as a cloud service
* **Status**: production-ready

_If you were involved in the authoring of this component and are not credited above, please reach out to us on [GitHub](https://github.com/adobe/aem-core-forms-components)._
